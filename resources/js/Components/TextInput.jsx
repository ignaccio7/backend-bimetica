import {
    forwardRef,
    Fragment,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

export default forwardRef(function TextInput(
    {
        type = "text",
        className = "",
        isFocused = false,
        children = null,
        ...props
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className={"relative overflow-hidden " + className}>
            <input
                {...props}
                type={type}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ref={localRef}
            />
            <div
                className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                style={{ zIndex: 50 }}
            >
                {children}
            </div>
        </div>
    );
});
