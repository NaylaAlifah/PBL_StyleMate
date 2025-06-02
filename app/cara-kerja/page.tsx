"use client"

import { MapPin, Brain, Users, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"

export default function CaraKerjaPage() {
  // How it works steps with images
  const howItWorks = [
    {
      step: "01",
      title: "Deteksi Lokasi",
      description: "Sistem otomatis mendeteksi lokasi Anda untuk mendapatkan informasi cuaca terkini",
      icon: <MapPin className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center",
      details: [
        "Menggunakan GPS untuk deteksi lokasi akurat",
        "Integrasi dengan API cuaca real-time",
        "Fallback ke input manual jika diperlukan",
        "Support untuk 17+ kota di Indonesia",
      ],
    },
    {
      step: "02",
      title: "Analisis Preferensi",
      description: "Pilih gender, gaya, dan warna favorit untuk personalisasi rekomendasi",
      icon: <Users className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=300&fit=crop&crop=center",
      details: [
        "5 kategori gender: Men, Women, Boys, Girls, Unisex",
        "8 tema acara: Casual, Formal, Sports, Party, dll",
        "15+ pilihan warna dengan color picker",
        "Preferensi tersimpan untuk penggunaan berikutnya",
      ],
    },
    {
      step: "03",
      title: "AI Processing",
      description: "Algoritma AI menganalisis 5000+ produk untuk menemukan outfit terbaik",
      icon: <Brain className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center",
      details: [
        "TF-IDF (Term Frequency-Inverse Document Frequency)",
        "Cosine Similarity untuk matching akurat",
        "Machine Learning dengan 5000+ dataset",
        "Real-time processing dalam hitungan detik",
      ],
    },
    {
      step: "04",
      title: "Rekomendasi",
      description: "Dapatkan rekomendasi outfit lengkap yang sesuai dengan cuaca dan gaya Anda",
      icon: <TrendingUp className="h-6 w-6" />,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center",
      details: [
        "4 kategori: Atasan, Bawahan, Sepatu, Aksesoris",
        "Top 10 items per kategori dengan confidence score",
        "Link langsung ke produk asli",
        "Evaluasi model dengan Precision & Recall metrics",
      ],
    },
  ]

  const technologies = [
    {
      name: "TF-IDF Algorithm",
      description: "Term Frequency-Inverse Document Frequency untuk analisis teks produk",
      usage: "Menganalisis deskripsi produk dan mencari kesamaan pattern",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=300&h=200&fit=crop&crop=center",
    },
    {
      name: "Cosine Similarity",
      description: "Mengukur kesamaan antara preferensi user dan karakteristik produk",
      usage: "Menghitung confidence score untuk ranking rekomendasi",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop&crop=center",
    },
    {
      name: "Weather API Integration",
      description: "Real-time weather data untuk rekomendasi yang sesuai cuaca",
      usage: "Menyesuaikan season dan material outfit dengan kondisi cuaca",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=300&h=200&fit=crop&crop=center",
    },
    {
      name: "PostgreSQL Database",
      description: "Database untuk menyimpan dataset dan history rekomendasi",
      usage: "Optimasi query dengan indexing untuk performa yang cepat",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=200&fit=crop&crop=center",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFF9E9]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#E67E22] to-[#D35400] py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cara Kerja StyleMate</h1>
          <p className="text-xl text-orange-100 mb-8">
            Proses sederhana untuk mendapatkan rekomendasi fashion yang tepat dengan teknologi AI
          </p>
          <Link href="/rekomendasi">
            <Button
              size="lg"
              className="bg-white text-[#E67E22] hover:bg-gray-100 rounded-full px-8 py-3 text-lg font-semibold"
            >
              Coba Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">4 Langkah Mudah</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Dari deteksi lokasi hingga rekomendasi AI yang akurat</p>
          </div>

          <div className="space-y-12">
            {howItWorks.map((step, index) => (
              <div
                key={step.step}
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#E67E22] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-[#E67E22] to-[#D35400] rounded-full flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[#333333]">{step.title}</h3>
                  <p className="text-gray-600 mb-6 text-lg">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-[#E67E22] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <Card className="overflow-hidden shadow-lg">
                    <div className="relative aspect-[4/3]">
                      <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-[#FFF9E9]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">Teknologi yang Digunakan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kombinasi algoritma AI dan teknologi modern untuk hasil rekomendasi yang akurat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-[3/2]">
                  <Image src={tech.image || "/placeholder.svg"} alt={tech.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#333333]">{tech.name}</h3>
                  <p className="text-gray-600 mb-4">{tech.description}</p>
                  <div className="bg-[#E67E22]/10 p-3 rounded-lg">
                    <p className="text-sm text-[#E67E22] font-medium">Penggunaan:</p>
                    <p className="text-sm text-gray-700">{tech.usage}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#E67E22] to-[#D35400]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Mencoba StyleMate?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Dapatkan rekomendasi fashion yang akurat dengan teknologi AI terdepan
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
            <Link href="/gaya">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 rounded-full px-8 py-3 text-lg font-semibold"
              >
                Lihat Gaya Fashion
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
