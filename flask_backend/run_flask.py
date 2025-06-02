import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import and run the Flask app
from app import app

if __name__ == '__main__':
    print("Starting StyleMate Flask Backend...")
    print("Make sure your stylemate_recommender.pkl file is in this directory")
    app.run(debug=True, host='0.0.0.0', port=5001)
