"use client"

import { useState, useEffect } from "react"
import { MapPin, Thermometer } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import RecommendationForm from "@/components/recommendation-form"

interface LocationData {
  city: string
  temperature: number
  weather: string
}

export default function RekomendasiPage() {
  const [location, setLocation] = useState<LocationData>({
    city: "Mendeteksi lokasi...",
    temperature: 0,
    weather: "",
  })
  const [isDetecting, setIsDetecting] = useState(true)

  useEffect(() => {
    detectUserLocation()
  }, [])

  const detectUserLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords

            try {
              // Try to get weather data using coordinates
              const response = await fetch("/api/stylemate/weather", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  lat: latitude,
                  lon: longitude,
                }),
              })

              if (response.ok) {
                const weatherData = await response.json()
                setLocation({
                  city: weatherData.location || "Jakarta",
                  temperature: weatherData.temperature || 28,
                  weather: weatherData.description || "Cerah",
                })
              } else {
                // Fallback to default
                setLocation({
                  city: "Jakarta",
                  temperature: 28,
                  weather: "Cerah",
                })
              }
            } catch (error) {
              console.error("Weather API error:", error)
              setLocation({
                city: "Jakarta",
                temperature: 28,
                weather: "Cerah",
              })
            }
            setIsDetecting(false)
          },
          (error) => {
            console.error("Geolocation error:", error)
            // Fallback to default location
            setLocation({
              city: "Jakarta",
              temperature: 28,
              weather: "Cerah",
            })
            setIsDetecting(false)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          },
        )
      } else {
        // Fallback if geolocation is not supported
        setLocation({
          city: "Jakarta",
          temperature: 28,
          weather: "Cerah",
        })
        setIsDetecting(false)
      }
    } catch (error) {
      console.error("Error detecting location:", error)
      setLocation({
        city: "Jakarta",
        temperature: 28,
        weather: "Cerah",
      })
      setIsDetecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9E9]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#E67E22] to-[#D35400] py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rekomendasi Fashion AI</h1>
          <p className="text-xl text-orange-100 mb-6">
            Dapatkan outfit yang sempurna untuk cuaca {location.weather.toLowerCase()} di {location.city} hari ini
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">{isDetecting ? "Mendeteksi..." : location.city}</span>
              </div>
              {!isDetecting && (
                <>
                  <div className="h-6 w-px bg-white/30"></div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    <span className="font-medium">{location.temperature}°C</span>
                  </div>
                  <div className="h-6 w-px bg-white/30"></div>
                  <span className="font-medium">{location.weather}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recommendation Form Section */}
      <section className="py-8 bg-gradient-to-r from-[#E67E22] to-[#D35400]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <RecommendationForm location={location} onLocationChange={setLocation} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
