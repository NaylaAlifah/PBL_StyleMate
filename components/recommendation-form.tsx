"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Thermometer, ExternalLink, Brain } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LocationData {
  city: string
  temperature: number
  weather: string
}

interface RecommendationItem {
  id: string
  productDisplayName: string
  link: string
  season: string
  baseColour: string
  usage: string
  articleType: string
  masterCategory: string
  subCategory: string
  confidence: number
  year: number
}

interface StyleRecommendations {
  Atasan?: RecommendationItem[]
  Bawahan?: RecommendationItem[]
  Sepatu?: RecommendationItem[]
  Aksesoris?: RecommendationItem[]
  Season?: string
  weather_info?: {
    temperature: number
    description: string
    location: string
  }
  total_items?: number
  processing_time?: number
}

interface RecommendationFormProps {
  location: LocationData
  onLocationChange: (location: LocationData) => void
}

// Data pilihan berdasarkan dataset asli
const GENDER_OPTIONS = [
  { value: "Men", label: "Pria", icon: "👨" },
  { value: "Women", label: "Wanita", icon: "👩" },
  { value: "Boys", label: "Anak Laki-laki", icon: "👦" },
  { value: "Girls", label: "Anak Perempuan", icon: "👧" },
  { value: "Unisex", label: "Unisex", icon: "👤" },
]

const COLOR_OPTIONS = [
  { value: "Black", label: "Hitam", hex: "#000000" },
  { value: "White", label: "Putih", hex: "#FFFFFF" },
  { value: "Blue", label: "Biru", hex: "#3B82F6" },
  { value: "Red", label: "Merah", hex: "#EF4444" },
  { value: "Green", label: "Hijau", hex: "#10B981" },
  { value: "Yellow", label: "Kuning", hex: "#F59E0B" },
  { value: "Pink", label: "Pink", hex: "#EC4899" },
  { value: "Purple", label: "Ungu", hex: "#8B5CF6" },
  { value: "Orange", label: "Orange", hex: "#F97316" },
  { value: "Brown", label: "Coklat", hex: "#A3A3A3" },
  { value: "Grey", label: "Abu-abu", hex: "#6B7280" },
  { value: "Navy Blue", label: "Navy", hex: "#1E3A8A" },
  { value: "Maroon", label: "Maroon", hex: "#7F1D1D" },
  { value: "Beige", label: "Beige", hex: "#F5F5DC" },
  { value: "Silver", label: "Silver", hex: "#C0C0C0" },
]

const USAGE_OPTIONS = [
  { value: "Casual", label: "Casual", icon: "👕", desc: "Santai sehari-hari" },
  { value: "Formal", label: "Formal", icon: "👔", desc: "Acara resmi" },
  { value: "Sports", label: "Sporty", icon: "🏃", desc: "Aktivitas olahraga" },
  { value: "Ethnic", label: "Etnik", icon: "🎭", desc: "Tradisional" },
]

export default function RecommendationForm({ location, onLocationChange }: RecommendationFormProps) {
  const [userInput, setUserInput] = useState({
    gender: "",
    tema: "",
    warna: "",
    location: location.city,
  })
  const [recommendations, setRecommendations] = useState<StyleRecommendations | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setUserInput((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Update weather when location changes
    if (field === "location" && value !== location.city && value.trim() !== "") {
      updateWeatherForLocation(value)
    }
  }

  const updateWeatherForLocation = async (cityName: string) => {
    setLoadingWeather(true)
    try {
      const response = await fetch("/api/stylemate/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: cityName,
        }),
      })

      if (response.ok) {
        const weatherData = await response.json()
        const newLocation = {
          city: weatherData.location || cityName,
          temperature: weatherData.temperature || 28,
          weather: weatherData.description || "Cerah",
        }
        onLocationChange(newLocation)
      }
    } catch (error) {
      console.error("Weather update error:", error)
    } finally {
      setLoadingWeather(false)
    }
  }

  const getRecommendations = async () => {
    if (!userInput.gender || !userInput.tema || !userInput.warna || !userInput.location.trim()) {
      setError("Semua field harus diisi!")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/stylemate/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: userInput.location,
          gender: userInput.gender,
          tema: userInput.tema,
          warna: userInput.warna,
        }),
      })

      const data = await response.json()

      if (response.ok && data.recommendations) {
        setRecommendations(data.recommendations)
      } else {
        setError(data.error || "Terjadi kesalahan saat mendapatkan rekomendasi")
      }
    } catch (error) {
      console.error("Error getting recommendations:", error)
      setError("Gagal mendapatkan rekomendasi. Pastikan backend Flask berjalan di port 5001.")
    } finally {
      setLoading(false)
    }
  }

  const CategoryCard = ({ categoryName, items }: { categoryName: string; items: RecommendationItem[] }) => {
    const categoryIcons = {
      Atasan: "👕",
      Bawahan: "👖",
      Sepatu: "👟",
      Aksesoris: "👜",
    }

    // Ensure items is always an array and limit to 5 items
    const safeItems = Array.isArray(items) ? items.slice(0, 5) : []

    return (
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[#333333]">
            <span className="text-2xl">{categoryIcons[categoryName as keyof typeof categoryIcons]}</span>
            <span>Rekomendasi {categoryName}</span>
            <Badge variant="secondary" className="ml-auto">
              {safeItems.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {safeItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Tidak ada rekomendasi untuk kategori ini</p>
              <p className="text-sm mt-2">Coba ubah preferensi warna atau tema</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeItems.map((item, index) => (
                <div
                  key={`${categoryName}-${index}-${item?.id || Math.random()}`}
                  className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Product Image */}
                  <div className="relative h-40 bg-gray-100">
                    {item?.link ? (
                      <img
                        src={item.link || "/placeholder.svg"}
                        alt={item.productDisplayName || "Product"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `/placeholder.svg?height=160&width=240&text=${encodeURIComponent(item.productDisplayName || "Product")}`
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-3xl">{categoryIcons[categoryName as keyof typeof categoryIcons]}</span>
                      </div>
                    )}

                    {/* External Link Button */}
                    {item?.link && (
                      <div className="absolute bottom-2 right-2">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#E67E22] hover:bg-[#D35400] text-white p-1.5 rounded-full shadow-lg transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h4 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                      {item?.productDisplayName || "Product Name"}
                    </h4>

                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800 text-xs">
                        {item?.baseColour || "N/A"}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800 text-xs">
                        {item?.usage || "N/A"}
                      </Badge>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Tipe:</span> {item?.articleType || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Tahun:</span> {item?.year || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const styles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

  return (
    <div className="text-white">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Sistem Rekomendasi Mix & Match Outfit</h2>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Lokasi: {location.city}</span>
            </div>
            <div className="h-6 w-px bg-white/30"></div>
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              <span className="font-medium">Suhu: {location.temperature}°C</span>
            </div>
          </div>
        </div>
      </div>

      {!recommendations ? (
        <Card className="bg-white/95 backdrop-blur-sm max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#333333]">
              <Brain className="h-6 w-6 text-[#E67E22]" />
              Masukkan Preferensi Anda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Masukkan nama kota (contoh: Jakarta, Bandung, Surabaya)"
                  value={userInput.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="pl-10"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                {loadingWeather && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#E67E22]" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Cuaca akan diperbarui otomatis berdasarkan lokasi yang Anda masukkan
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <Select onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      <div className="flex items-center gap-2">
                        <span>{gender.icon}</span>
                        <span>{gender.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tema/Acara</label>
              <Select onValueChange={(value) => handleInputChange("tema", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tema" />
                </SelectTrigger>
                <SelectContent>
                  {USAGE_OPTIONS.map((usage) => (
                    <SelectItem key={usage.value} value={usage.value}>
                      <div className="flex items-center gap-2">
                        <span>{usage.icon}</span>
                        <div>
                          <div className="font-medium">{usage.label}</div>
                          <div className="text-xs text-gray-500">{usage.desc}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warna Favorit</label>
              <Select onValueChange={(value) => handleInputChange("warna", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih warna" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={getRecommendations}
              className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold py-3"
              disabled={loading || loadingWeather}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  sedang menganalisis...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Dapatkan Rekomendasi 
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Weather Info */}
          {recommendations.weather_info && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#333333] mb-2">
                      Rekomendasi untuk {recommendations.weather_info.location}
                    </h3>
                    <p className="text-gray-600">{recommendations.weather_info.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-2xl font-bold text-[#E67E22] mb-2">
                      <Thermometer className="h-6 w-6" />
                      {recommendations.weather_info.temperature}°C
                    </div>
                    <Badge variant="secondary" className="bg-[#E67E22]/10 text-[#E67E22] border-[#E67E22]/20">
                      Season: {recommendations.Season}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Total produk dianalisis:</span> {recommendations.total_items || 0}{" "}
                    items
                  </p>
                  <p>
                    <span className="font-medium">Waktu pemrosesan:</span> {recommendations.processing_time || 0}ms
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <div className="space-y-8">
            <CategoryCard categoryName="Atasan" items={recommendations.Atasan || []} />
            <CategoryCard categoryName="Bawahan" items={recommendations.Bawahan || []} />
            <CategoryCard categoryName="Sepatu" items={recommendations.Sepatu || []} />
            <CategoryCard categoryName="Aksesoris" items={recommendations.Aksesoris || []} />
          </div>

          {/* Reset Button */}
          <div className="text-center">
            <Button
              onClick={() => {
                setRecommendations(null)
                setUserInput({ gender: "", tema: "", warna: "", location: location.city })
              }}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Coba Rekomendasi Lain
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
