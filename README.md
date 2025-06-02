# StyleMate AI - Fashion Recommendation System

Sistem rekomendasi fashion berbasis AI menggunakan TF-IDF dan Cosine Similarity dengan dataset 5,000+ produk fashion.

## 🎯 Features

- **AI-Powered Recommendations**: Menggunakan TF-IDF + Cosine Similarity
- **Weather Integration**: Rekomendasi berdasarkan cuaca lokasi
- **3 Kategori Utama**: Atasan, Bawahan, Sepatu
- **Real-time Processing**: Analisis cepat dengan confidence scoring
- **Professional UI**: Modern interface dengan animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- pip

### Installation

1. **Clone & Install Dependencies**
\`\`\`bash
git clone <repository>
cd stylemate-ai
npm install
npm run install:backend
\`\`\`

2. **Run Full Application**
\`\`\`bash
npm run dev:full
\`\`\`

3. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

### Manual Setup

**Frontend (Next.js)**
\`\`\`bash
npm run dev
\`\`\`

**Backend (Flask)**
\`\`\`bash
cd backend
python run_flask.py
\`\`\`

## 📁 Project Structure

\`\`\`
stylemate-ai/
├── app/                    # Next.js frontend
│   ├── api/               # API routes
│   └── page.tsx           # Main application
├── backend/               # Flask backend
│   ├── app.py            # Main Flask app
│   ├── stylemate_model.py # Original ML model
│   └── requirements.txt   # Python dependencies
├── data/                  # Dataset
│   └── StyleMate_5000_rows_shuffled.csv
└── components/            # UI components
\`\`\`

## 🤖 Model Details

### StyleMateRecommender Class
- **Algorithm**: TF-IDF + Cosine Similarity
- **Features**: masterCategory, subCategory, articleType, usage, baseColour, season
- **Categories**: Atasan, Bawahan, Sepatu
- **Weather Integration**: OpenWeatherMap API

### API Endpoints
- `POST /api/recommend` - Get style recommendations
- `GET /api/stats` - Dataset statistics
- `GET /api/health` - Health check

## 🎨 Frontend Features

- **Modern UI**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live recommendation display
- **Favorites System**: Save preferred items

## 📊 Dataset

- **Size**: 5,000+ fashion items
- **Columns**: id, gender, masterCategory, subCategory, articleType, baseColour, season, year, usage, productDisplayName, link
- **Source**: Curated fashion dataset

## 🔧 Configuration

### Environment Variables
\`\`\`bash
# Backend
OPENWEATHER_API_KEY=your_api_key_here

# Frontend (optional)
NEXT_PUBLIC_API_URL=http://localhost:5001
\`\`\`

## 🚀 Deployment

### Frontend (Vercel)
\`\`\`bash
npm run build
# Deploy to Vercel
\`\`\`

### Backend (Railway/Heroku)
\`\`\`bash
cd backend
# Deploy Flask app
\`\`\`

## 📈 Performance

- **Processing Time**: ~100-500ms per request
- **Accuracy**: High confidence scoring with TF-IDF
- **Scalability**: Handles 5,000+ items efficiently

## 🛠️ Development

### Adding New Features
1. Model improvements in `backend/stylemate_model.py`
2. API endpoints in `backend/app.py`
3. Frontend components in `app/`

### Testing
\`\`\`bash
# Test backend
cd backend && python -m pytest

# Test frontend
npm run test
\`\`\`

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For issues and questions:
- Create GitHub issue
- Contact: support@stylemate.ai
