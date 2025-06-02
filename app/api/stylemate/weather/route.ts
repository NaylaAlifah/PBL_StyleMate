import { type NextRequest, NextResponse } from "next/server"

interface WeatherRequest {
  location?: string
  lat?: number
  lon?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: WeatherRequest = await request.json()

    // Weather data untuk kota-kota Indonesia
    const weatherData: Record<string, { temp: number; description: string }> = {
      jakarta: { temp: 32, description: "Panas dan lembab" },
      bandung: { temp: 25, description: "Sejuk dan nyaman" },
      surabaya: { temp: 31, description: "Panas dan cerah" },
      yogyakarta: { temp: 28, description: "Hangat dan berawan" },
      medan: { temp: 30, description: "Panas dan lembab" },
      semarang: { temp: 29, description: "Hangat dan lembab" },
      makassar: { temp: 33, description: "Sangat panas dan cerah" },
      palembang: { temp: 31, description: "Panas dan lembab" },
      denpasar: { temp: 30, description: "Tropis dan cerah" },
      balikpapan: { temp: 32, description: "Panas dan lembab" },
      bali: { temp: 28, description: "Tropis dan nyaman" },
      malang: { temp: 24, description: "Sejuk dan segar" },
      solo: { temp: 29, description: "Hangat dan cerah" },
      bogor: { temp: 26, description: "Sejuk dan lembab" },
      depok: { temp: 30, description: "Hangat dan lembab" },
      tangerang: { temp: 31, description: "Panas dan lembab" },
      bekasi: { temp: 30, description: "Hangat dan lembab" },
    }

    let weather
    let locationName

    if (body.location) {
      // Manual location input
      const cityKey = body.location.toLowerCase().replace(/\s+/g, "")
      weather = weatherData[cityKey] || { temp: 28, description: "Cuaca nyaman" }
      locationName = body.location
    } else if (body.lat && body.lon) {
      // Coordinate-based detection (simplified)
      const { lat, lon } = body

      // Simple coordinate-based city detection for Indonesia
      if (lat >= -6.5 && lat <= -6.0 && lon >= 106.5 && lon <= 107.0) {
        locationName = "Jakarta"
        weather = weatherData.jakarta
      } else if (lat >= -7.0 && lat <= -6.5 && lon >= 107.0 && lon <= 108.0) {
        locationName = "Bandung"
        weather = weatherData.bandung
      } else if (lat >= -8.5 && lat <= -8.0 && lon >= 114.0 && lon <= 115.5) {
        locationName = "Bali"
        weather = weatherData.bali
      } else if (lat >= -7.5 && lat <= -7.0 && lon >= 110.0 && lon <= 111.0) {
        locationName = "Yogyakarta"
        weather = weatherData.yogyakarta
      } else if (lat >= -7.5 && lat <= -7.0 && lon >= 112.0 && lon <= 113.0) {
        locationName = "Surabaya"
        weather = weatherData.surabaya
      } else {
        // Default fallback
        locationName = "Jakarta"
        weather = weatherData.jakarta
      }
    } else {
      return NextResponse.json({ error: "Location or coordinates required" }, { status: 400 })
    }

    // Map weather to season
    let season = "Spring"
    if (weather.temp > 30) season = "Summer"
    else if (weather.temp < 20) season = "Winter"
    else if (weather.description.toLowerCase().includes("lembab")) season = "Monsoon"

    return NextResponse.json({
      temperature: weather.temp,
      description: weather.description,
      season: season,
      location: locationName,
    })
  } catch (error) {
    console.error("Error getting weather:", error)
    return NextResponse.json({ error: "Failed to get weather data" }, { status: 500 })
  }
}
