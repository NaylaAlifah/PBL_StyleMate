import { type NextRequest, NextResponse } from "next/server"

interface RecommendRequest {
  location: string
  gender: string
  tema: string
  warna: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendRequest = await request.json()

    // Validate input
    if (!body.location || !body.gender || !body.tema || !body.warna) {
      return NextResponse.json(
        {
          error: "Semua field (location, gender, tema, warna) harus diisi",
        },
        { status: 400 },
      )
    }

    console.log("Sending request to Flask backend:", body)

    // Send request to Flask backend
    const flaskResponse = await fetch("http://localhost:5001/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: body.location,
        gender: body.gender,
        tema: body.tema,
        warna: body.warna,
      }),
    })

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json()
      console.error("Flask backend error:", errorData)
      return NextResponse.json(
        { error: errorData.error || "Gagal mendapatkan rekomendasi dari model" },
        { status: flaskResponse.status },
      )
    }

    const data = await flaskResponse.json()
    console.log("Received response from Flask backend")

    return NextResponse.json({
      success: true,
      recommendations: data.recommendations,
    })
  } catch (error) {
    console.error("Error in recommendation API:", error)

    // Check if it's a connection error to Flask backend
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          error: "Flask backend tidak tersedia. Pastikan server Flask berjalan di port 5001.",
          details: "Jalankan: cd backend && python app.py",
        },
        { status: 503 },
      )
    }

    return NextResponse.json({ error: "Terjadi kesalahan internal server" }, { status: 500 })
  }
}
