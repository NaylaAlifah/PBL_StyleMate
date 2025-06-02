import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Send request to Flask backend
    const flaskResponse = await fetch("http://localhost:5001/api/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json()
      return NextResponse.json(
        { error: errorData.error || "Gagal mendapatkan statistik dari backend" },
        { status: flaskResponse.status },
      )
    }

    const stats = await flaskResponse.json()

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error in stats API:", error)

    // Check if it's a connection error to Flask backend
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          error: "Flask backend tidak tersedia",
          details: "Jalankan: cd backend && python app.py",
        },
        { status: 503 },
      )
    }

    return NextResponse.json({ error: "Terjadi kesalahan internal server" }, { status: 500 })
  }
}
