#!/usr/bin/env python3
"""
StyleMate Application Runner
Menjalankan aplikasi StyleMate dengan Flask backend
"""

import os
import sys
from backend.app import app

if __name__ == '__main__':
    print("🚀 Starting StyleMate Application...")
    print("📊 Loading ML Model...")
    print("🌐 Starting Flask Server...")
    print("📱 Frontend available at: http://localhost:5000")
    print("🔗 API available at: http://localhost:5000/api")
    print("\n" + "="*50)
    
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
        threaded=True
    )
