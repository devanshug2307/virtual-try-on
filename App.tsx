import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Controls } from './components/Controls';
import { ImageGrid } from './components/ImageGrid';
import { CameraView } from './components/CameraView';
import { generateModelImages } from './services/geminiService';
import { ClothingCategory, ModelPose, BackgroundStyle, ModelGender, ModelAppearance } from './types';

function App() {
  // State for the uploaded cloth texture image
  const [clothImage, setClothImage] = useState<string | null>(null);

  // State for the generated model images
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  // State for generation options
  const [clothingCategory, setClothingCategory] = useState<ClothingCategory>(ClothingCategory.Shirt);
  const [modelPose, setModelPose] = useState<ModelPose>(ModelPose.Standing);
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>(BackgroundStyle.Studio);
  const [modelGender, setModelGender] = useState<ModelGender>(ModelGender.Female);
  const [numImages, setNumImages] = useState<number>(2);

  // State for UI control
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const handleImageSelected = (base64Image: string) => {
    setClothImage(base64Image);
  };

  const handleRemoveImage = () => {
    setClothImage(null);
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCapture = (base64Image: string) => {
    setClothImage(base64Image);
    setIsCameraOpen(false);
  };

  const handleGenerate = async () => {
    if (!clothImage) {
      setError("Please upload a cloth texture image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateModelImages(
        clothImage,
        clothingCategory,
        numImages,
        modelPose,
        backgroundStyle,
        modelGender,
        ModelAppearance.Indian
      );
      setGeneratedImages(images);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "An unknown error occurred during image generation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="p-6 bg-gray-800/50 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">1. Upload Texture</h2>
              <ImageUploader
                clothImage={clothImage}
                onImageSelected={handleImageSelected}
                onRemoveImage={handleRemoveImage}
                onOpenCamera={handleOpenCamera}
              />
            </div>
            <div className="p-6 bg-gray-800/50 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">2. Customize Model</h2>
              <Controls
                clothingCategory={clothingCategory}
                onCategoryChange={setClothingCategory}
                modelPose={modelPose}
                onPoseChange={setModelPose}
                backgroundStyle={backgroundStyle}
                onBackgroundStyleChange={setBackgroundStyle}
                modelGender={modelGender}
                onGenderChange={setModelGender}
                numImages={numImages}
                onNumImagesChange={setNumImages}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                isDisabled={!clothImage}
              />
            </div>
          </div>
          <div className="lg:col-span-2 p-6 bg-gray-800/50 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">3. View Results</h2>
            <ImageGrid
              images={generatedImages}
              loading={isLoading}
              error={error}
              numImages={numImages}
            />
          </div>
        </div>
      </main>
      {isCameraOpen && <CameraView onCapture={handleCapture} onClose={handleCloseCamera} />}
    </div>
  );
}

export default App;