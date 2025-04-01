import { NextApiRequest, NextApiResponse } from 'next';

// Function to call Hugging Face API
async function callHuggingFaceAPI(base64Image: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: base64Image,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to call Hugging Face API');
  }

  const result = await response.json();
  return result;
}

// Function to get nutrition info from food name
async function getNutritionInfo(foodName: string) {
  try {
    // You can integrate with a free food database API here
    // For now, we'll use mock data based on common foods
    const commonFoods: Record<string, any> = {
      apple: {
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        servingSize: '1 medium apple (182g)'
      },
      banana: {
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
        servingSize: '1 medium banana (118g)'
      },
      chicken: {
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        servingSize: '100g cooked'
      },
      rice: {
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        servingSize: '100g cooked'
      },
      // Add more common foods...
    };

    // Find the closest matching food
    const foodKey = Object.keys(commonFoods).find(key => 
      foodName.toLowerCase().includes(key)
    );

    if (foodKey) {
      return commonFoods[foodKey];
    }

    // Return default values if no match found
    return {
      calories: Math.floor(Math.random() * 300) + 100,
      protein: Math.floor(Math.random() * 20) + 5,
      carbs: Math.floor(Math.random() * 30) + 10,
      fat: Math.floor(Math.random() * 15) + 2,
      servingSize: '100g'
    };
  } catch (error) {
    console.error('Error getting nutrition info:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // Get food recognition from Hugging Face
    const predictions = await callHuggingFaceAPI(base64Image);
    
    // Get the most likely food item
    const topPrediction = predictions[0];
    if (!topPrediction) {
      return res.status(400).json({ error: 'Could not identify food in image' });
    }

    const foodName = topPrediction.label;
    const confidence = topPrediction.score;

    // Get nutritional information
    const nutritionInfo = await getNutritionInfo(foodName);

    return res.status(200).json({
      name: foodName,
      ...nutritionInfo,
      confidence
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return res.status(500).json({ error: 'Failed to process image' });
  }
} 