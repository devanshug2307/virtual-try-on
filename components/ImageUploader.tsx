import React, { useRef } from 'react';

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const CameraIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface ImageUploaderProps {
    clothImage: string | null;
    onImageSelected: (base64Image: string) => void;
    onRemoveImage: () => void;
    onOpenCamera: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ clothImage, onImageSelected, onRemoveImage, onOpenCamera }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageSelected(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
             const file = e.dataTransfer.files[0];
             if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    onImageSelected(ev.target?.result as string);
                };
                reader.readAsDataURL(file);
             }
        }
    };


    return (
        <div className="space-y-4">
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <div
                onClick={!clothImage ? handleUploadClick : undefined}
                onDragOver={handleDragOver}
                onDrop={!clothImage ? handleDrop : undefined}
                className={`relative w-full aspect-square bg-gray-700/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 overflow-hidden transition-colors ${!clothImage ? 'cursor-pointer hover:border-indigo-500' : ''}`}
                role={!clothImage ? "button" : undefined}
                tabIndex={!clothImage ? 0 : undefined}
                onKeyDown={(e) => { if(!clothImage && (e.key === 'Enter' || e.key === ' ')) { handleUploadClick() } }}
                aria-label={clothImage ? "Uploaded cloth texture" : "Click or drag and drop to upload a texture"}
            >
                {clothImage ? (
                    <>
                        <img src={clothImage} alt="Cloth texture" className="object-cover w-full h-full" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveImage();
                            }}
                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
                            aria-label="Remove image"
                        >
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                    </>
                ) : (
                    <div className="text-center text-gray-400 pointer-events-none">
                        <UploadIcon className="w-12 h-12 mx-auto" />
                        <p className="mt-2 font-semibold">Upload a texture</p>
                        <p className="text-sm">Click or drag & drop</p>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 gap-3">
                <button
                    onClick={onOpenCamera}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-500 transition-colors"
                >
                    <CameraIcon className="w-5 h-5" />
                    Open Camera
                </button>
            </div>
        </div>
    );
};