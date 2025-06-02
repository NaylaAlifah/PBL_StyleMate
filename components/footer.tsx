"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/stylemate-logo.png"
                alt="StyleMate Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-bold text-lg">StyleMate</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Platform rekomendasi fashion berbasis AI yang membantu Anda tampil stylish sesuai cuaca dan preferensi
              dengan teknologi machine learning terdepan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Menu</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/cara-kerja" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="/gaya" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Gaya
                </Link>
              </li>
              <li>
                <Link href="/rekomendasi" className="text-gray-300 hover:text-[#E67E22] transition-colors">
                  Mulai Rekomendasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 StyleMate. All rights reserved. Powered by AI Machine Learning.
          </p>
        </div>
      </div>
    </footer>
  )
}
