<?php

namespace App\Jobs;

use App\Models\Resource;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

class ProcessResourcePdfToImages implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 3600;
    public $tries   = 1;

    public Resource $resource;

    public function __construct(Resource $resource)
    {
        $this->resource = $resource;
    }

    public function handle(): void
    {
        try {
            // El PDF está en storage/app/private/resources/archivo.pdf
            $pdfPath = storage_path('app/private/' . $this->resource->pdf);

            if (!file_exists($pdfPath)) {
                throw new \Exception("PDF no encontrado en: " . $pdfPath);
            }

            \Imagick::setResourceLimit(\Imagick::RESOURCETYPE_THREAD, 1);
            \Imagick::setResourceLimit(\Imagick::RESOURCETYPE_MEMORY, 128 * 1024 * 1024);
            \Imagick::setResourceLimit(\Imagick::RESOURCETYPE_MAP,    128 * 1024 * 1024);

            // IMPORTANTE: Las imágenes van a storage/app/private/resource_pages/{id}/
            // NO a storage/app/public/ porque deben ser privadas
            $folderPath = storage_path('app/private/resource_pages/' . $this->resource->id);

            if (file_exists($folderPath)) {
                File::cleanDirectory($folderPath);
            } else {
                mkdir($folderPath, 0775, true);
            }

            $this->resource->pages()->delete();

            Log::info("Iniciando conversión Resource ID: {$this->resource->id}");

            $i = 0;
            $uniqueTimestamp = time();

            while (true) {
                $imagick = new \Imagick();
                $imagick->setResolution(400, 400);
                $imagick->setAntiAlias(false);

                try {
                    $imagick->readImage($pdfPath . '[' . $i . ']');
                } catch (\Exception $e) {
                    $imagick->clear();
                    $imagick->destroy();
                    if ($i > 0) break;
                    else throw $e;
                }

                $width  = $imagick->getImageWidth();
                $height = $imagick->getImageHeight();

                if ($width > 6000 || $height > 6000) {
                    $imagick->scaleImage(6000, 6000, true);
                }

                $imagick->setImageBackgroundColor('white');
                $imagick->setImageAlphaChannel(\Imagick::ALPHACHANNEL_REMOVE);
                $imagick->mergeImageLayers(\Imagick::LAYERMETHOD_FLATTEN);
                $imagick->setImageFormat('webp');
                $imagick->setImageCompressionQuality(95);

                $fileName     = 'page_' . ($i + 1) . '_' . $uniqueTimestamp . '.webp';
                $absolutePath = $folderPath . '/' . $fileName;

                $imagick->writeImage($absolutePath);

                // La ruta que guardamos es RELATIVA a storage/app/private/
                // Nunca una URL pública
                $this->resource->pages()->create([
                    'page_number' => $i + 1,
                    'image_path'  => 'resource_pages/' . $this->resource->id . '/' . $fileName,
                ]);

                $imagick->clear();
                $imagick->destroy();
                gc_collect_cycles();

                Log::info("Resource ID {$this->resource->id} -> Página " . ($i + 1) . " ok.");

                $i++;
                sleep(1);
            }

            $this->resource->update(['status' => 'completed']);
            Log::info("Resource ID {$this->resource->id} completado. Páginas: {$i}");
        } catch (\Throwable $e) {
            $this->resource->update(['status' => 'failed']);
            Log::error('ERROR procesando Resource ID ' . $this->resource->id . ': ' . $e->getMessage());
        }
    }
}
