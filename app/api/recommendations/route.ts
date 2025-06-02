import { type NextRequest, NextResponse } from "next/server"

interface UserPreferences {
  age: string
  gender: string
  bodyType: string
  preferredColors: string
  occasion: string
  budget: string
}

interface StyleRecommendation {
  id: string
  category: string
  style: string
  color: string
  occasion: string
  confidence: number
  description: string
}

// Simulated style database - in a real app, this would come from your CSV data
const styleDatabase = [
  {
    category: "Tops",
    style: "Classic White Button-Down",
    colors: ["white", "light blue", "cream"],
    occasions: ["business", "casual", "formal"],
    bodyTypes: ["slim", "athletic", "average"],
    budgetRanges: ["medium", "high"],
    description: "A timeless piece that works for any occasion. Versatile and professional.",
  },
  {
    category: "Bottoms",
    style: "Dark Wash Jeans",
    colors: ["dark blue", "black"],
    occasions: ["casual", "date"],
    bodyTypes: ["slim", "athletic", "average", "curvy"],
    budgetRanges: ["low", "medium"],
    description: "Perfect for casual outings and can be dressed up or down.",
  },
  {
    category: "Dresses",
    style: "Little Black Dress",
    colors: ["black"],
    occasions: ["formal", "party", "date"],
    bodyTypes: ["slim", "athletic", "curvy"],
    budgetRanges: ["medium", "high", "luxury"],
    description: "The ultimate versatile piece for any formal occasion.",
  },
  {
    category: "Outerwear",
    style: "Blazer",
    colors: ["navy", "black", "gray"],
    occasions: ["business", "formal"],
    bodyTypes: ["slim", "athletic", "average"],
    budgetRanges: ["medium", "high"],
    description: "Adds structure and professionalism to any outfit.",
  },
  {
    category: "Activewear",
    style: "Athletic Leggings",
    colors: ["black", "gray", "navy"],
    occasions: ["workout", "casual"],
    bodyTypes: ["slim", "athletic", "average", "curvy", "plus-size"],
    budgetRanges: ["low", "medium"],
    description: "Comfortable and functional for workouts and casual wear.",
  },
  {
    category: "Tops",
    style: "Cashmere Sweater",
    colors: ["beige", "gray", "navy", "cream"],
    occasions: ["casual", "business"],
    bodyTypes: ["slim", "athletic", "average"],
    budgetRanges: ["high", "luxury"],
    description: "Luxurious and warm, perfect for cooler weather.",
  },
  {
    category: "Bottoms",
    style: "Tailored Trousers",
    colors: ["black", "navy", "gray"],
    occasions: ["business", "formal"],
    bodyTypes: ["slim", "athletic", "average", "curvy"],
    budgetRanges: ["medium", "high"],
    description: "Professional and polished for business settings.",
  },
  {
    category: "Dresses",
    style: "Midi Wrap Dress",
    colors: ["floral", "solid colors"],
    occasions: ["casual", "date", "party"],
    bodyTypes: ["curvy", "average", "plus-size"],
    budgetRanges: ["medium", "high"],
    description: "Flattering silhouette that works for many body types.",
  },
]

function calculateStyleMatch(item: any, preferences: UserPreferences): number {
  let score = 0
  let factors = 0

  // Occasion match (high weight)
  if (preferences.occasion && item.occasions.includes(preferences.occasion)) {
    score += 0.4
  }
  factors += 0.4

  // Body type match (high weight)
  if (preferences.bodyType && item.bodyTypes.includes(preferences.bodyType)) {
    score += 0.3
  }
  factors += 0.3

  // Budget match (medium weight)
  if (preferences.budget && item.budgetRanges.includes(preferences.budget)) {
    score += 0.2
  }
  factors += 0.2

  // Color preference match (low weight)
  if (preferences.preferredColors) {
    const userColors = preferences.preferredColors
      .toLowerCase()
      .split(",")
      .map((c) => c.trim())
    const hasColorMatch = userColors.some((color) =>
      item.colors.some((itemColor: string) => itemColor.toLowerCase().includes(color)),
    )
    if (hasColorMatch) {
      score += 0.1
    }
  }
  factors += 0.1

  return factors > 0 ? score / factors : 0
}

export async function POST(request: NextRequest) {
  try {
    const preferences: UserPreferences = await request.json()

    // Generate recommendations based on user preferences
    const recommendations: StyleRecommendation[] = styleDatabase
      .map((item) => {
        const confidence = calculateStyleMatch(item, preferences)
        const primaryColor = item.colors[0]

        return {
          id: Math.random().toString(36).substr(2, 9),
          category: item.category,
          style: item.style,
          color: primaryColor,
          occasion: preferences.occasion || item.occasions[0],
          confidence,
          description: item.description,
        }
      })
      .filter((rec) => rec.confidence > 0.1) // Only show items with some relevance
      .sort((a, b) => b.confidence - a.confidence) // Sort by confidence
      .slice(0, 5) // Top 5 recommendations

    // If no good matches, provide some default recommendations
    if (recommendations.length === 0) {
      recommendations.push({
        id: "default-1",
        category: "Tops",
        style: "Classic White Button-Down",
        color: "white",
        occasion: preferences.occasion || "casual",
        confidence: 0.7,
        description: "A versatile wardrobe staple that works for any occasion.",
      })
    }

    return NextResponse.json({
      success: true,
      recommendations,
      message: `Found ${recommendations.length} style recommendations for you!`,
    })
  } catch (error) {
    console.error("Error processing recommendations:", error)
    return NextResponse.json({ success: false, error: "Failed to process recommendations" }, { status: 500 })
  }
}
