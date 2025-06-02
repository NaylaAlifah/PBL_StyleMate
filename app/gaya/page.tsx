"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"

export default function GayaPage() {
  // Style categories with online images
  const styleCategories = [
    {
      id: 1,
      title: "Kasual Chic",
      description: "Gaya santai namun tetap stylish untuk aktivitas sehari-hari",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center",
      tags: ["Santai", "Stylish", "Sehari-hari"],
      characteristics: [
        "Kombinasi comfort dan style",
        "Warna netral dan earth tone",
        "Material breathable dan fleksibel",
        "Cocok untuk cuaca tropis Indonesia",
      ],
      occasions: ["Hangout dengan teman", "Shopping", "Kuliah", "Kerja santai"],
      items: ["T-shirt premium", "Jeans atau chinos", "Sneakers", "Tas crossbody"],
    },
    {
      id: 2,
      title: "Professional",
      description: "Tampil rapi dan profesional untuk lingkungan kerja",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
      tags: ["Formal", "Rapi", "Kerja"],
      characteristics: [
        "Clean lines dan tailored fit",
        "Warna klasik: navy, hitam, putih",
        "Material berkualitas tinggi",
        "Detail yang rapi dan minimalis",
      ],
      occasions: ["Meeting kantor", "Presentasi", "Interview", "Acara bisnis"],
      items: ["Kemeja formal", "Celana bahan", "Sepatu pantofel", "Blazer"],
    },
    {
      id: 3,
      title: "Urban Street",
      description: "Gaya urban yang trendy untuk jiwa muda",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=300&fit=crop&crop=center",
      tags: ["Urban", "Trendy", "Modern"],
      characteristics: [
        "Bold dan ekspresif",
        "Mix and match pattern",
        "Oversized dan layered",
        "Aksesoris statement pieces",
      ],
      occasions: ["Festival musik", "Nongkrong di kafe", "Photoshoot", "Weekend vibes"],
      items: ["Hoodie oversized", "Cargo pants", "High-top sneakers", "Bucket hat"],
    },
    {
      id: 4,
      title: "Sporty Active",
      description: "Gaya aktif untuk olahraga dan aktivitas fisik",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      tags: ["Sporty", "Active", "Comfortable"],
      characteristics: [
        "Material moisture-wicking",
        "Fleksibilitas maksimal",
        "Breathable dan quick-dry",
        "Ergonomic design",
      ],
      occasions: ["Gym workout", "Jogging", "Yoga", "Outdoor activities"],
      items: ["Athletic wear", "Leggings/shorts", "Running shoes", "Sports bag"],
    },
    {
      id: 5,
      title: "Elegant Evening",
      description: "Gaya elegan untuk acara malam dan formal",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop&crop=center",
      tags: ["Elegant", "Evening", "Formal"],
      characteristics: [
        "Sophisticated dan refined",
        "Rich colors dan textures",
        "Attention to details",
        "Timeless appeal",
      ],
      occasions: ["Dinner date", "Gala night", "Wedding", "Theater"],
      items: ["Dress shirt", "Formal pants", "Dress shoes", "Watch"],
    },
    {
      id: 6,
      title: "Bohemian Free",
      description: "Gaya bebas dan artistik dengan sentuhan bohemian",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop&crop=center",
      tags: ["Bohemian", "Artistic", "Free"],
      characteristics: [
        "Flowy dan relaxed silhouettes",
        "Natural fabrics dan textures",
        "Earthy dan warm tones",
        "Layered accessories",
      ],
      occasions: ["Art exhibition", "Beach vacation", "Music festival", "Creative work"],
      items: ["Flowy tops", "Maxi skirts", "Sandals", "Layered jewelry"],
    },
  ]

  const colorPalettes = [
    {
      name: "Neutral Classic",
      colors: ["#000000", "#FFFFFF", "#8B7355", "#D2B48C"],
      description: "Warna netral yang timeless dan mudah dipadukan",
    },
    {
      name: "Earth Tone",
      colors: ["#8B4513", "#CD853F", "#DEB887", "#F5DEB3"],
      description: "Warna-warna alami yang hangat dan nyaman",
    },
    {
      name: "Ocean Blue",
      colors: ["#000080", "#4169E1", "#87CEEB", "#E0F6FF"],
      description: "Gradasi biru yang fresh dan professional",
    },
    {
      name: "Sunset Warm",
      colors: ["#FF6347", "#FF7F50", "#FFA07A", "#FFE4E1"],
      description: "Warna hangat yang energetic dan cheerful",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFF9E9]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#E67E22] to-[#D35400] py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Eksplorasi <span className="text-orange-100">Gaya Fashion</span>
          </h1>
          <p className="text-xl text-orange-100 mb-8">
            Temukan berbagai gaya fashion yang sesuai dengan kepribadian dan aktivitas Anda
          </p>
          <Link href="/rekomendasi">
            <Button
              size="lg"
              className="bg-white text-[#E67E22] hover:bg-gray-100 rounded-full px-8 py-3 text-lg font-semibold"
            >
              Dapatkan Rekomendasi
            </Button>
          </Link>
        </div>
      </section>

      {/* Style Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">Kategori Gaya Fashion</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilih gaya yang paling sesuai dengan kepribadian dan kebutuhan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {styleCategories.map((style) => (
              <Card key={style.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
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
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-[#333333] mb-2">Karakteristik:</h4>
                      <ul className="space-y-1">
                        {style.characteristics.slice(0, 2).map((char, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-[#E67E22] rounded-full mt-2 flex-shrink-0"></div>
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#333333] mb-2">Cocok untuk:</h4>
                      <div className="flex flex-wrap gap-1">
                        {style.occasions.slice(0, 2).map((occasion, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {occasion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Color Palettes */}
      <section className="py-16 bg-[#FFF9E9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">Palet Warna Populer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Kombinasi warna yang harmonis untuk berbagai gaya fashion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {colorPalettes.map((palette, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <h3 className="font-semibold text-lg mb-3 text-[#333333]">{palette.name}</h3>
                  <div className="flex gap-2 mb-4">
                    {palette.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{palette.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section with Images */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">Tips Mix & Match</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Panduan praktis untuk menciptakan outfit yang stylish dan sesuai cuaca
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <div className="relative aspect-[3/2]">
                <Image
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=250&fit=crop&crop=center"
                  alt="Cuaca Panas"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-4 text-[#333333]">Cuaca Panas (28°C+)</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#E67E22] rounded-full mt-2"></div>
                    <span className="text-gray-600">Pilih material breathable seperti cotton atau linen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#E67E22] rounded-full mt-2"></div>
                    <span className="text-gray-600">Gunakan warna terang untuk reflect heat</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#E67E22] rounded-full mt-2"></div>
                    <span className="text-gray-600">Hindari layering berlebihan</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative aspect-[3/2]">
                <Image
                  src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=250&fit=crop&crop=center"
                  alt="Cuaca Sejuk"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-4 text-[#333333]">Cuaca Sejuk (20-25°C)</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#E67E22] rounded-full mt-2"></div>
                    <span className="text-gray-600">Perfect untuk layering dengan cardigan atau blazer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#E67E22] rounded-full mt-2"></div>
                    <span className="text-gray-600">Mix warna warm dan cool tones</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#E67E22] rounded-full mt-2"></div>
                    <span className="text-gray-600">Eksperimen dengan textures berbeda</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#E67E22] to-[#D35400]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Temukan Gaya Anda dengan AI</h2>
          <p className="text-xl mb-8 text-orange-100">
            Biarkan StyleMate membantu Anda menemukan kombinasi outfit yang perfect
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/rekomendasi">
              <Button
                size="lg"
                className="bg-white text-[#E67E22] hover:bg-gray-100 rounded-full px-8 py-3 text-lg font-semibold"
              >
                Mulai Rekomendasi
              </Button>
            </Link>
            <Link href="/cara-kerja">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 rounded-full px-8 py-3 text-lg font-semibold"
              >
                Pelajari Cara Kerja
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
