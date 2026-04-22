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

    public $timeout = 1500; // 25 minutos exactos para hacer el relevo sin alertar a Hostinger
    public $tries   = 3;    // 3 intentos si Hostinger lo mata

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

            $folderPath = storage_path('app/private/resource_pages/' . $this->resource->id);

            // LÓGICA ANTI-BUCLE: Solo limpiamos desde cero si es el primer intento
            if ($this->attempts() === 1) {
                if (file_exists($folderPath)) {
                    File::cleanDirectory($folderPath);
                } else {
                    mkdir($folderPath, 0775, true);
                }
                $this->resource->pages()->delete();
                Log::info("Iniciando conversión LIMPIA Resource ID: {$this->resource->id}");
            } else {
                Log::info("Reanudando Resource ID: {$this->resource->id}, Intento: " . $this->attempts());
            }

            $uniqueTimestamp = time();
            $i = 0;

            while (true) {
                // Si el job se reinició y la página ya fue guardada en BD, la saltamos
                if ($this->resource->pages()->where('page_number', $i + 1)->exists()) {
                    $i++;
                    continue;
                }

                $imagick = new \Imagick();

                // CALIDAD MÁXIMA
                $imagick->setResolution(400, 400);
                $imagick->setAntiAlias(false);

                // SOLUCIÓN DE COLORES: Forzamos la lectura en RGB para evitar colores chillones
                $imagick->setColorspace(\Imagick::COLORSPACE_SRGB);

                try {
                    $imagick->readImage($pdfPath . '[' . $i . ']');
                } catch (\Exception $e) {
                    $imagick->clear();
                    $imagick->destroy();
                    if ($i > 0) break;
                    else throw $e;
                }

                // Por si el PDF es rebelde y sigue en CMYK, lo transformamos
                if ($imagick->getImageColorspace() == \Imagick::COLORSPACE_CMYK) {
                    $imagick->transformImageColorspace(\Imagick::COLORSPACE_SRGB);
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
            Log::error('Intento fallido procesando Resource ID ' . $this->resource->id . ': ' . $e->getMessage());
            throw $e; // Lanzamos el error para que Laravel cuente el intento y reinicie
        }
    }

    public function failed(\Throwable $exception): void
    {
        // ARREGLO CRÍTICO: Antes decía $this->document, en tu proyecto es $this->resource
        $this->resource->update(['status' => 'failed']);
        Log::error('ERROR DEFINITIVO procesando Resource ID ' . $this->resource->id . ': ' . $exception->getMessage());
    }
}
