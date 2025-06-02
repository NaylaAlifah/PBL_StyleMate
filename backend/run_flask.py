import os
import sys
import subprocess
import pandas as pd
import requests
from pathlib import Path

def check_dependencies():
    """Check if all required packages are installed"""
    try:
        import flask
        import flask_cors
        import pandas
        import sklearn
        import requests
        import numpy
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Installing dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        return True

def download_dataset():
    """Download dataset if not exists"""
    dataset_path = Path("../data/StyleMate_5000_rows_shuffled.csv")
    
    if not dataset_path.exists():
        print("📥 Downloading dataset...")
        dataset_path.parent.mkdir(exist_ok=True)
        
        url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/StyleMate_5000_rows_shuffled-vXM8hzHwwfkpQPRmhI9PxT7eM9PyZc.csv"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            
            with open(dataset_path, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Dataset downloaded to {dataset_path}")
        except Exception as e:
            print(f"❌ Error downloading dataset: {e}")
            return False
    else:
        print(f"✅ Dataset already exists at {dataset_path}")
    
    return True

def main():
    print("🚀 Starting StyleMate Flask Backend with Original Model...")
    print("=" * 60)
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Download dataset
    if not download_dataset():
        return
    
    print("\n🎯 All checks passed! Starting Flask server...")
    print("📍 Server will run on: http://localhost:5001")
    print("🔗 Frontend will connect to this backend")
    print("🤖 Using original StyleMateRecommender model")
    print("\n" + "=" * 60)
    
    # Start Flask app
    try:
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5001)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

if __name__ == "__main__":
    main()
