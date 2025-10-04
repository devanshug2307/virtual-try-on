import React from 'react';
import { ClothingCategory, ModelPose, BackgroundStyle, ModelGender } from '../types';

interface ControlsProps {
    clothingCategory: ClothingCategory;
    onCategoryChange: (category: ClothingCategory) => void;
    modelPose: ModelPose;
    onPoseChange: (pose: ModelPose) => void;
    backgroundStyle: BackgroundStyle;
    onBackgroundStyleChange: (style: BackgroundStyle) => void;
    modelGender: ModelGender;
    onGenderChange: (gender: ModelGender) => void;
    numImages: number;
    onNumImagesChange: (num: number) => void;
    onGenerate: () => void;
    isLoading: boolean;
    isDisabled: boolean;
}

const ControlItem: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
        {children}
    </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
        {props.children}
    </select>
);

const GenerateIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.504 1.132a1.5 1.5 0 01.992 0l1.75 1.01a1.5 1.5 0 001.5.002l1.75-1.01a1.5 1.5 0 011.986 1.725l-1.01 1.75a1.5 1.5 0 00.001 1.5l1.01 1.75a1.5 1.5 0 01-1.725 1.986l-1.75-1.01a1.5 1.5 0 00-1.5.001l-1.75 1.01a1.5 1.5 0 01-1.986-1.725l1.01-1.75a1.5 1.5 0 00-.001-1.5l-1.01-1.75a1.5 1.5 0 011.725-1.986l1.75 1.01a1.5 1.5 0 001.5-.001l1.75-1.01zM10 6a4 4 0 100 8 4 4 0 000-8zM5.5 10a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" clipRule="evenodd" />
    </svg>
);


export const Controls: React.FC<ControlsProps> = (props) => {
    const {
        clothingCategory, onCategoryChange,
        modelPose, onPoseChange,
        backgroundStyle, onBackgroundStyleChange,
        modelGender, onGenderChange,
        numImages, onNumImagesChange,
        onGenerate, isLoading, isDisabled
    } = props;
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ControlItem label="Clothing Type">
                    <Select value={clothingCategory} onChange={(e) => onCategoryChange(e.target.value as ClothingCategory)}>
                        {Object.values(ClothingCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </Select>
                </ControlItem>
                 <ControlItem label="Model Pose">
                    <Select value={modelPose} onChange={(e) => onPoseChange(e.target.value as ModelPose)}>
                        {Object.values(ModelPose).map(pose => <option key={pose} value={pose}>{pose}</option>)}
                    </Select>
                </ControlItem>
                <ControlItem label="Background Style">
                    <Select value={backgroundStyle} onChange={(e) => onBackgroundStyleChange(e.target.value as BackgroundStyle)}>
                        {Object.values(BackgroundStyle).map(style => <option key={style} value={style}>{style}</option>)}
                    </Select>
                </ControlItem>
                <ControlItem label="Model Gender">
                    <Select value={modelGender} onChange={(e) => onGenderChange(e.target.value as ModelGender)}>
                        {Object.values(ModelGender).map(gender => <option key={gender} value={gender}>{gender}</option>)}
                    </Select>
                </ControlItem>
            </div>
            <ControlItem label={`Number of Images: ${numImages}`}>
                <input
                    type="range"
                    min="1"
                    max="4"
                    value={numImages}
                    onChange={(e) => onNumImagesChange(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </ControlItem>
             <button
                onClick={onGenerate}
                disabled={isDisabled || isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <GenerateIcon className="w-5 h-5" />
                )}
                <span>{isLoading ? 'Generating...' : 'Generate'}</span>
            </button>
        </div>
    );
};