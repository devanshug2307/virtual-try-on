
import React from 'react';

const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C11.45 2 11 2.45 11 3V5C11 5.55 11.45 6 12 6C12.55 6 13 5.55 13 5V3C13 2.45 12.55 2 12 2ZM6.34 6.34C5.95 5.95 5.32 5.95 4.93 6.34L3.51 7.76C3.12 8.15 3.12 8.78 3.51 9.17C3.9 9.56 4.53 9.56 4.92 9.17L6.34 7.76C6.73 7.37 6.73 6.73 6.34 6.34ZM12 18C11.45 18 11 18.45 11 19V21C11 21.55 11.45 22 12 22C12.55 22 13 21.55 13 21V19C13 18.45 12.55 18 12 18ZM20.49 9.17C20.88 8.78 20.88 8.15 20.49 7.76L19.07 6.34C18.68 5.95 18.05 5.95 17.66 6.34C17.27 6.73 17.27 7.37 17.66 7.76L19.08 9.17C19.47 9.56 20.1 9.56 20.49 9.17ZM17.66 16.24C18.05 15.85 18.68 15.85 19.07 16.24L20.49 17.66C20.88 18.05 20.88 18.68 20.49 19.07C20.1 19.46 19.47 19.46 19.08 19.07L17.66 17.66C17.27 17.27 17.27 16.63 17.66 16.24ZM3 11H5C5.55 11 6 11.45 6 12C6 12.55 5.55 13 5 13H3C2.45 13 2 12.55 2 12C2 11.45 2.45 11 3 11ZM19 11H21C21.55 11 22 11.45 22 12C22 12.55 21.55 13 21 13H19C18.45 13 18 12.55 18 12C18 11.45 18.45 11 19 11ZM4.93 17.66C4.54 18.05 4.54 18.68 4.93 19.07L6.34 20.49C6.73 20.88 7.37 20.88 7.76 20.49C8.15 20.1 8.15 19.47 7.76 19.08L6.34 17.66C5.95 17.27 5.32 17.27 4.93 17.66Z" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
            <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-center">
                <div className="flex items-center space-x-3">
                     <SparklesIcon className="w-8 h-8 text-indigo-400" />
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                        AI Virtual Try-On
                    </h1>
                </div>
            </div>
        </header>
    );
};
