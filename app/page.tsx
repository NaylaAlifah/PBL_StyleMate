"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Brain, Target, Zap, Thermometer } from "lucide-react"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"

interface LocationData {
  city: string
  temperature: number
  weather: string
}

export default function HomePage() {
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

  // Style categories with online images
  const styleCategories = [
    {
      id: 1,
      title: "Kasual Chic",
      description: "Gaya santai namun tetap stylish untuk aktivitas sehari-hari",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop&crop=center",
      tags: ["Santai", "Stylish", "Sehari-hari"],
    },
    {
      id: 2,
      title: "Professional",
      description: "Tampil rapi dan profesional untuk lingkungan kerja",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center",
      tags: ["Formal", "Rapi", "Kerja"],
    },
    {
      id: 3,
      title: "Urban Street",
      description: "Gaya urban yang trendy untuk jiwa muda",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=250&fit=crop&crop=center",
      tags: ["Urban", "Trendy", "Modern"],
    },
  ]

  // Features
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Machine Learning",
      description: "Menggunakan algoritma TF-IDF dan Cosine Similarity untuk analisis yang akurat",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Personalisasi",
      description: "Rekomendasi yang disesuaikan dengan preferensi dan cuaca lokasi Anda",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-time Weather",
      description: "Deteksi lokasi otomatis dan rekomendasi berdasarkan cuaca terkini",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFF9E9]">
      <Header />

      {/* Hero Section - Beranda */}
      <section id="beranda" className="bg-[#FFF9E9] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-sm text-[#E67E22] font-medium mb-3"># Fashion recommendation</div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
                Fashion Cerdas <br />
                untuk Setiap Cuaca
              </h1>
              <p className="text-gray-600 mb-6 max-w-md">
                StyleMate hadir untuk membantu Anda tampil stylish dan nyaman dengan rekomendasi outfit yang sesuai
                dengan cuaca dan preferensi gaya Anda.
              </p>

              <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm mb-6 max-w-xs">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{isDetecting ? "Mendeteksi..." : location.city}</span>
                </div>
                {!isDetecting && (
                  <>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-[#E67E22]" />
                      <span className="font-semibold">{location.temperature}°C</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/rekomendasi">
                  <Button className="bg-[#E67E22] hover:bg-[#D35400] text-white rounded-full px-6">
                    Mulai Rekomendasi
                  </Button>
                </Link>
                <Link href="/cara-kerja">
                  <Button variant="outline" className="rounded-full border-[#E67E22] text-[#E67E22]">
                    Cara Kerja
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=400&fit=crop&crop=center"
                  alt="Fashion recommendation"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gaya Section */}
      <section id="gaya" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">
              Eksplorasi <span className="text-[#E67E22]">Gaya Anda</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan berbagai gaya fashion yang sesuai dengan kepribadian dan aktivitas Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {styleCategories.map((style) => (
              <Card key={style.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={style.image || "/placeholder.svg"}
                    alt={style.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                    <h3 className="text-xl font-bold mb-2">{style.title}</h3>
                    <p className="text-sm text-white/90 mb-3">{style.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {style.tags.map((tag) => (
                        <span key={tag} className="bg-white/20 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fitur Section */}
      <section id="fitur" className="py-12 bg-[#FFF9E9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">Fitur Unggulan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Teknologi AI terdepan untuk memberikan rekomendasi fashion yang akurat dan personal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#E67E22] to-[#D35400] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#E67E22] to-[#D35400]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Mendapatkan Rekomendasi Fashion?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Dapatkan outfit yang sempurna untuk cuaca {location.weather.toLowerCase()} di {location.city} hari ini
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">{location.city}</span>
              </div>
              <div className="h-6 w-px bg-white/30"></div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                <span className="font-medium">{location.temperature}°C</span>
              </div>
              <div className="h-6 w-px bg-white/30"></div>
              <span className="font-medium">{location.weather}</span>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/rekomendasi">
              <Button
                size="lg"
                className="bg-white text-[#E67E22] hover:bg-gray-100 rounded-full px-8 py-3 text-lg font-semibold"
              >
                Mulai Rekomendasi Sekarang
              </Button>
            </Link>
            <p className="text-sm text-orange-100">Gratis • Tanpa registrasi • Hasil instan dengan AI</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
