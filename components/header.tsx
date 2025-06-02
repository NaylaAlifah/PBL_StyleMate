"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/stylemate-logo.png"
              alt="StyleMate Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-bold text-lg">StyleMate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium hover:text-[#E67E22] transition-colors ${
                isActive("/") ? "text-[#E67E22]" : "text-gray-600"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/cara-kerja"
              className={`hover:text-[#E67E22] transition-colors ${
                isActive("/cara-kerja") ? "text-[#E67E22]" : "text-gray-600"
              }`}
            >
              Cara Kerja
            </Link>
            <Link
              href="/gaya"
              className={`hover:text-[#E67E22] transition-colors ${
                isActive("/gaya") ? "text-[#E67E22]" : "text-gray-600"
              }`}
            >
              Gaya
            </Link>
            <Link href="/rekomendasi">
              <Button className="bg-[#E67E22] hover:bg-[#D35400] rounded-full px-6">Mulai Rekomendasi</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`font-medium hover:text-[#E67E22] transition-colors text-left ${
                  isActive("/") ? "text-[#E67E22]" : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/cara-kerja"
                className={`hover:text-[#E67E22] transition-colors text-left ${
                  isActive("/cara-kerja") ? "text-[#E67E22]" : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Cara Kerja
              </Link>
              <Link
                href="/gaya"
                className={`hover:text-[#E67E22] transition-colors text-left ${
                  isActive("/gaya") ? "text-[#E67E22]" : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Gaya
              </Link>
              <Link href="/rekomendasi" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-[#E67E22] hover:bg-[#D35400] w-full">Mulai Rekomendasi</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
