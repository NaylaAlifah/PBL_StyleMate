from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Load the trained model
MODEL_PATH = 'stylemate_recommender.pkl'

try:
    with open(MODEL_PATH, 'rb') as f:
        recommender = pickle.load(f)
    print("Model loaded successfully!")
except FileNotFoundError:
    print(f"Model file {MODEL_PATH} not found!")
    recommender = None
except Exception as e:
    print(f"Error loading model: {e}")
    recommender = None

@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    if not recommender:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['location', 'gender', 'tema', 'warna']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Field {field} is required'}), 400
        
        location = data['location']
        gender = data['gender']
        tema = data['tema']
        warna = data['warna']
        
        # Get recommendations from your model
        recommendations = recommender.recommend_mix_and_match(
            location=location,
            gender=gender,
            tema=tema,
            warna=warna
        )
        
        # If recommendations is a string (error message), return error
        if isinstance(recommendations, str):
            return jsonify({'error': recommendations}), 400
        
        # Convert DataFrame to dict for JSON serialization
        result = {}
        for category in ['Atasan', 'Bawahan', 'Sepatu']:
            if category in recommendations and not recommendations[category].empty:
                result[category] = recommendations[category].to_dict('records')
            else:
                result[category] = []
        
        # Add season info
        result['Season'] = recommendations.get('Season', 'Unknown')
        
        # Add weather info if available
        try:
            temp, weather_desc = recommender.get_weather_by_city(location)
            if temp is not None:
                result['weather_info'] = {
                    'temperature': temp,
                    'description': weather_desc,
                    'location': location
                }
        except:
            pass  # Weather info is optional
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in recommendation: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/weather', methods=['POST'])
def get_weather():
    if not recommender:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.get_json()
        location = data.get('location')
        
        if not location:
            return jsonify({'error': 'Location is required'}), 400
        
        temp, weather_desc = recommender.get_weather_by_city(location)
        
        if temp is None:
            return jsonify({'error': f'Weather data not found for {location}'}), 404
        
        season = recommender.map_weather_to_season(weather_desc, temp)
        
        return jsonify({
            'temperature': temp,
            'description': weather_desc,
            'season': season,
            'location': location
        })
        
    except Exception as e:
        print(f"Error getting weather: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': recommender is not None
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
