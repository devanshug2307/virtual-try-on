import React from 'react';

const SkeletonCard: React.FC = () => (
    <div className="bg-gray-700/50 rounded-lg animate-pulse aspect-[3/4]"></div>
);

const PhotoIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ShareIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002L15.316 6.684m-6.632 3.316-6.632 3.316m6.632-6.002L2.05 6.684" />
    </svg>
);


interface ImageGridProps {
    images: string[];
    loading: boolean;
    error: string | null;
    numImages: number;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, loading, error, numImages }) => {
    
    const isShareSupported = typeof navigator !== 'undefined' && !!navigator.share;

    const handleDownload = (image: string, index: number) => {
        const link = document.createElement('a');
        link.href = image;
        const mimeType = image.split(';')[0].split(':')[1];
        const extension = mimeType ? mimeType.split('/')[1] : 'jpeg';
        link.download = `virtual-try-on-model-${index + 1}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const dataURIToFile = (dataURI: string, filename: string): File | null => {
        const arr = dataURI.split(',');
        if (arr.length < 2) { return null; }
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) { return null; }
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    const handleShare = async (image: string, index: number) => {
        const mimeType = image.split(';')[0].split(':')[1];
        const extension = mimeType ? mimeType.split('/')[1] : 'jpeg';
        const filename = `virtual-try-on-model-${index + 1}.${extension}`;
        
        const file = dataURIToFile(image, filename);

        if (!file) {
            alert("Could not prepare image for sharing.");
            return;
        }

        const shareData = {
            files: [file],
            title: 'AI Virtual Try-On Model',
            text: 'Check out this design I created with the AI Virtual Try-On app!',
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                 if ((err as Error).name !== 'AbortError') {
                    console.error("Sharing failed:", err);
                    alert("Sharing failed. You can try downloading the image instead.");
                }
            }
        } else {
             alert("This image cannot be shared on your device.");
        }
    };

    const handleDownloadAll = () => {
        images.forEach((image, index) => {
            // Add a small delay between each programmatic click to prevent the browser
            // from blocking subsequent downloads as if they were popups.
            setTimeout(() => {
                handleDownload(image, index);
            }, index * 300);
        });
    };


    if (loading) {
        return (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow`}>
                 {Array.from({ length: numImages }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-grow flex items-center justify-center text-center">
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                    <p className="font-bold">An error occurred</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }
    
    if (images.length === 0) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500">
                <PhotoIcon className="w-24 h-24" />
                <p className="mt-4 text-lg">Your generated models will appear here.</p>
                <p className="text-sm">Upload a texture and click "Generate" to start.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-grow">
            <div className="mb-4 flex justify-end">
                <button
                    onClick={handleDownloadAll}
                    className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition-colors"
                    aria-label="Download all generated images"
                >
                    <DownloadIcon className="w-5 h-5" />
                    <span>Download All</span>
                </button>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
                {images.map((image, index) => (
                    <div key={index} className="relative bg-gray-700/50 rounded-lg overflow-hidden shadow-lg aspect-[3/4] group">
                        <img src={image} alt={`Generated model ${index + 1}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute bottom-2 right-2 flex items-center gap-2">
                            {isShareSupported && (
                                <button
                                    onClick={() => handleShare(image, index)}
                                    className="p-2 bg-black/60 rounded-full text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    aria-label={`Share image ${index + 1}`}
                                >
                                    <ShareIcon className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={() => handleDownload(image, index)}
                                className="p-2 bg-black/60 rounded-full text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                aria-label={`Download image ${index + 1}`}
                            >
                                <DownloadIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};