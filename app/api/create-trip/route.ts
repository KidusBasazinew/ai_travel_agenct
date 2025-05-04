import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMarkdownToJson } from "@/lib/utils";
import { appwriteConfig, database } from "@/appwrite/client";
import { ID } from "appwrite";

interface UnsplashResponse {
  results: Array<{
    urls: {
      regular: string;
    };
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const {
      country,
      numberOfDays,
      travelStyle,
      interests,
      budget,
      groupType,
      userId,
    } = await req.json();

    // Validate required fields
    if (
      !country ||
      !numberOfDays ||
      !travelStyle ||
      !interests ||
      !budget ||
      !groupType ||
      !userId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing required environment variables" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    );

    // Generate itinerary with Gemini
    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
      Budget: '${budget}'
      Interests: '${interests}'
      TravelStyle: '${travelStyle}'
      GroupType: '${groupType}'
      Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
      {
      "name": "A descriptive title for the trip",
      "description": "A brief description of the trip and its highlights not exceeding 100 words",
      "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
      "duration": ${numberOfDays},
      "budget": "${budget}",
      "travelStyle": "${travelStyle}",
      "country": "${country}",
      "interests": ${interests},
      "groupType": "${groupType}",
      "bestTimeToVisit": [
        '🌸 Season (from month to month): reason to visit',
        '☀️ Season (from month to month): reason to visit',
        '🍁 Season (from month to month): reason to visit',
        '❄️ Season (from month to month): reason to visit'
      ],
      "weatherInfo": [
        '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
      ],
      "location": {
        "city": "name of the city or region",
        "coordinates": [latitude, longitude],
        "openStreetMap": "link to open street map"
      },
      "itinerary": [
      {
        "day": 1,
        "location": "City/Region Name",
        "activities": [
          {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
          {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
          {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
        ]
      },
      ...
      ]
  }`;

    const textResult = await genAI
      .getGenerativeModel({ model: "gemini-2.0-flash" })
      .generateContent([prompt]);

    if (!textResult.response.text()) {
      throw new Error("Failed to generate trip content");
    }

    const trip = parseMarkdownToJson(textResult.response.text());
    if (!trip) {
      throw new Error("Failed to parse trip data");
    }

    // Try to fetch images from Unsplash, but don't fail if it doesn't work
    let imageUrls: string[] = [];
    if (process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
      try {
        const imageResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        );

        if (imageResponse.ok) {
          const imageData: UnsplashResponse = await imageResponse.json();
          imageUrls = imageData.results
            .slice(0, 3)
            .map((result) => result.urls.regular)
            .filter(Boolean);
        }
      } catch (error) {
        console.warn("Failed to fetch images from Unsplash:", error);
        // Continue without images
      }
    }

    // Create Appwrite document
    const result = await database.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.tripCollectionId!,
      ID.unique(),
      {
        tripDetails: JSON.stringify(trip),
        createdAt: new Date().toISOString(),
        imageUrls,
        userId,
      }
    );

    if (!result.$id) {
      throw new Error("Failed to create trip document");
    }

    return NextResponse.json({ id: result.$id }, { status: 200 });
  } catch (error) {
    console.error("Error generating travel plan:", error);
    return NextResponse.json(
      { error: "Failed to generate trip" },
      { status: 500 }
    );
  }
}
