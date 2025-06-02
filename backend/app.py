from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import time

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from stylemate_model import load_model

app = Flask(__name__)
CORS(app)

# Load the StyleMate model
print("Loading StyleMate model...")
recommender = load_model()

if recommender:
    print(f"✅ Model loaded successfully!")
    print(f"📊 Dataset size: {len(recommender.df)} items")
    print(f"🏷️ Categories: {list(recommender.category_dfs.keys())}")
    
    # Print category statistics
    for cat, df in recommender.category_dfs.items():
        print(f"   - {cat}: {len(df)} items")
else:
    print("❌ Failed to load model")

@app.route('/')
def home():
    return jsonify({
        "message": "StyleMate API is running",
        "model_loaded": recommender is not None,
        "dataset_size": len(recommender.df) if recommender else 0,
        "categories": {cat: len(df) for cat, df in recommender.category_dfs.items()} if recommender else {},
        "endpoints": {
            "/api/recommend": "POST - Get style recommendations",
            "/api/stats": "GET - Get dataset statistics", 
            "/api/health": "GET - Health check"
        }
    })

@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    start_time = time.time()
    
    try:
        if not recommender:
            return jsonify({"error": "Model not loaded"}), 500
            
        data = request.get_json()
        
        # Validate input
        required_fields = ['location', 'gender', 'tema', 'warna']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Field '{field}' is required"}), 400
        
        print(f"Getting recommendations for: {data}")
        
        # Get recommendations using your original model
        recommendations = recommender.recommend_mix_and_match(
            data['location'],
            data['gender'], 
            data['tema'],
            data['warna']
        )
        
        # Add processing time
        processing_time = round((time.time() - start_time) * 1000)
        recommendations['processing_time'] = processing_time
        
        print(f"✅ Recommendations generated in {processing_time}ms")
        print(f"📊 Results: Atasan={len(recommendations.get('Atasan', []))}, Bawahan={len(recommendations.get('Bawahan', []))}, Sepatu={len(recommendations.get('Sepatu', []))}, Aksesoris={len(recommendations.get('Aksesoris', []))}")
        
        return jsonify({
            "success": True,
            "recommendations": recommendations
        })
        
    except Exception as e:
        print(f"❌ Error in recommendations: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        if not recommender:
            return jsonify({"error": "Model not loaded"}), 500
            
        df = recommender.df
        
        stats = {
            "total_items": len(df),
            "categories": df['masterCategory'].value_counts().to_dict(),
            "colors": df['baseColour'].value_counts().to_dict(),
            "seasons": df['season'].value_counts().to_dict(),
            "genders": df['gender'].value_counts().to_dict(),
            "usage": df['usage'].value_counts().to_dict(),
            "article_types": df['articleType'].value_counts().to_dict(),
            "model_categories": {cat: len(df) for cat, df in recommender.category_dfs.items()}
        }
        
        return jsonify(stats)
        
    except Exception as e:
        print(f"Error getting stats: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": recommender is not None,
        "dataset_size": len(recommender.df) if recommender else 0,
        "categories_available": list(recommender.category_dfs.keys()) if recommender else [],
        "category_sizes": {cat: len(df) for cat, df in recommender.category_dfs.items()} if recommender else {}
    })

if __name__ == '__main__':
    print("\n🚀 Starting StyleMate Flask Backend...")
    print("📍 Server running on: http://localhost:5001")
    print("🔗 Frontend should connect to this backend")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5001)
