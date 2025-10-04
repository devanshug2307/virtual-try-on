import { GoogleGenAI, Modality } from "@google/genai";
import { ClothingCategory, ModelPose, BackgroundStyle, ModelGender, ModelAppearance } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function getMimeType(base64: string): string {
    const signatures: { [key: string]: string } = {
      'R0lGOD': 'image/gif',
      'iVBORw0KGgo': 'image/png',
      '/9j/': 'image/jpeg'
    };
    for (let s in signatures) {
      if (base64.indexOf(s) === 0) {
        return signatures[s];
      }
    }
    return 'image/jpeg'; // Default
}

function getPoseDescription(pose: ModelPose): string {
    switch(pose) {
        case ModelPose.Sitting:
            return "The model is in a natural sitting pose on a minimalist chair or stool.";
        case ModelPose.Action:
            return "The model is captured mid-motion in a dynamic, energetic pose, as if jumping or dancing lightly.";
        case ModelPose.Walking:
            return "The model is walking towards the camera with a confident stride.";
        case ModelPose.Leaning:
            return "The model is casually leaning against a simple wall or surface, creating a relaxed feel.";
        case ModelPose.LookingAway:
            return "The model is looking away from the camera, creating a candid and thoughtful mood.";
        case ModelPose.HandsOnHips:
            return "The model is standing with hands confidently on hips, showcasing the garment's fit and form.";
        case ModelPose.Standing:
        default:
            return "The model is in a classic, confident standing pose.";
    }
}

function getBackgroundDescription(style: BackgroundStyle): string {
    switch(style) {
        case BackgroundStyle.Outdoor:
            return "The photo is set in a serene outdoor location, like a modern city street or a beautiful park, with soft, natural lighting.";
        case BackgroundStyle.Abstract:
            return "The model is set against an abstract, artistic background with subtle color gradients or soft geometric shapes that complement the outfit.";
        case BackgroundStyle.Studio:
        default:
            return "The photo is set against a clean, minimalist studio background (light gray or white).";
    }
}


function constructPrompt(category: ClothingCategory, pose: ModelPose, background: BackgroundStyle, gender: ModelGender, appearance: ModelAppearance): string {
    const commonPrompt = "A high-fashion, photorealistic image. The photo should be full-body or upper-body, well-lit. The clothing should fit perfectly and look stylish.";
    const poseDescription = getPoseDescription(pose);
    const backgroundDescription = getBackgroundDescription(background);
    
    let modelDescription = "A professional";
    modelDescription += ` ${appearance}`;
    if (gender !== ModelGender.Unspecified) {
        modelDescription += ` ${gender.toLowerCase()}`;
    }
    modelDescription += " model";

    let categoryDescription: string;
    switch(category) {
        case ClothingCategory.Kurta:
            categoryDescription = `${modelDescription} wearing a stylish, modern long-sleeve Kurta made entirely of this texture.`;
            break;
        case ClothingCategory.Shirt:
            categoryDescription = `${modelDescription} wearing a crisp, long-sleeve button-up shirt made of this texture.`;
            break;
        case ClothingCategory.TShirt:
            categoryDescription = `${modelDescription} wearing a high-quality, well-fitting crew neck t-shirt made of this texture.`;
            break;
        case ClothingCategory.Dress:
             // A dress is typically female, but we respect the user's choice.
            categoryDescription = `${modelDescription} wearing an elegant, knee-length A-line dress made of this texture.`;
            break;
        case ClothingCategory.Jacket:
            categoryDescription = `${modelDescription} wearing a fashionable bomber jacket made of this texture, worn over a plain white t-shirt.`;
            break;
        case ClothingCategory.Saree:
            categoryDescription = `${modelDescription} wearing an elegant, traditional Saree made entirely from this texture, draped gracefully.`;
            break;
        default:
            categoryDescription = `${modelDescription} wearing an outfit made of this texture.`;
            break;
    }

    return `${categoryDescription} ${poseDescription} ${commonPrompt} ${backgroundDescription}`;
}

export async function generateModelImages(base64Image: string, category: ClothingCategory, numImages: number, pose: ModelPose, background: BackgroundStyle, gender: ModelGender, appearance: ModelAppearance): Promise<string[]> {
    const model = 'gemini-2.5-flash-image';
    const imageDataPart = {
        inlineData: {
            data: base64Image.split(',')[1],
            mimeType: getMimeType(base64Image.split(',')[1])
        }
    };
    
    const textPart = { text: constructPrompt(category, pose, background, gender, appearance) };

    const generationPromises = Array(numImages).fill(0).map(() => 
        ai.models.generateContent({
            model,
            contents: { parts: [imageDataPart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        })
    );

    const responses = await Promise.all(generationPromises);

    const generatedImages: string[] = [];
    for (const response of responses) {
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64 = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType;
                    generatedImages.push(`data:${mimeType};base64,${base64}`);
                }
            }
        }
    }

    if (generatedImages.length < numImages) {
        // This might happen if some API calls fail or return no image.
        // We can throw an error or just return what we have.
        console.warn(`Requested ${numImages} images, but only generated ${generatedImages.length}`);
    }
    
    if (generatedImages.length === 0) {
      throw new Error("Model did not return any images.");
    }

    return generatedImages;
}