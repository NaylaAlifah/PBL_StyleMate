import pickle
import pandas as pd
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class StyleMateRecommender:
    def __init__(self, dataset_path, api_key):
        self.df = pd.read_csv(dataset_path)
        self.api_key = api_key
        self.weather_url = "http://api.openweathermap.org/data/2.5/weather"

        # Persiapan data dan model TF-IDF untuk 4 kategori
        self.tfidf_models = {}
        self.tfidf_matrices = {}
        self.category_dfs = {}
        self.prepare_models()

    def create_feature_text(self, row):
        features = [
            str(row['masterCategory']),
            str(row['subCategory']),
            str(row['articleType']),
            str(row['usage']),
            str(row['baseColour']),
            str(row['season'])
        ]
        return ' '.join(features).lower()

    def filter_categories(self):
        # Atasan - Tops, shirts, blouses, etc.
        tops = self.df[
            (self.df['masterCategory'].str.lower().isin(['apparel'])) &
            (self.df['articleType'].str.lower().str.contains('top|shirt|kurta|blouse|t-shirt|tee|tank|jersey|polo|sweater|hoodie|jacket|blazer|coat|cardigan', na=False))
        ].copy()

        # Bawahan - Pants, jeans, skirts, shorts, etc.
        bottoms = self.df[
            (self.df['masterCategory'].str.lower().isin(['apparel'])) &
            (self.df['articleType'].str.lower().str.contains('pant|jean|trouser|skirt|short|legging|track|bottom', na=False))
        ].copy()

        # Sepatu - All footwear
        shoes = self.df[self.df['masterCategory'].str.lower() == 'footwear'].copy()

        # Aksesoris - Accessories including bags, watches, jewelry, etc.
        accessories = self.df[
            (self.df['masterCategory'].str.lower().isin(['accessories', 'personal care'])) |
            (self.df['articleType'].str.lower().str.contains('bag|watch|belt|cap|hat|sunglasses|wallet|backpack|handbag|bracelet|necklace|ring|earring|scarf|tie|bow', na=False))
        ].copy()

        return tops, bottoms, shoes, accessories

    def prepare_models(self):
        # Filter kategori
        tops, bottoms, shoes, accessories = self.filter_categories()
        cats = {
            'Atasan': tops, 
            'Bawahan': bottoms, 
            'Sepatu': shoes, 
            'Aksesoris': accessories
        }

        for cat_name, df_cat in cats.items():
            if len(df_cat) > 0:
                df_cat['feature_text'] = df_cat.apply(self.create_feature_text, axis=1)
                tfidf = TfidfVectorizer(max_features=1000, stop_words='english')
                tfidf_matrix = tfidf.fit_transform(df_cat['feature_text'])

                self.tfidf_models[cat_name] = tfidf
                self.tfidf_matrices[cat_name] = tfidf_matrix
                self.category_dfs[cat_name] = df_cat

    def get_weather_by_city(self, city):
        try:
            url = f"{self.weather_url}?q={city}&appid={self.api_key}&units=metric"
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                temp = data['main']['temp']
                weather_desc = data['weather'][0]['description']
                return temp, weather_desc
            else:
                # Fallback untuk kota-kota Indonesia
                weather_fallback = {
                    'jakarta': (32, 'hot and humid'),
                    'bandung': (25, 'cool and pleasant'),
                    'surabaya': (31, 'hot and sunny'),
                    'yogyakarta': (28, 'warm and cloudy'),
                    'medan': (30, 'hot and humid'),
                    'semarang': (29, 'warm and humid'),
                    'makassar': (33, 'very hot and sunny'),
                    'palembang': (31, 'hot and humid'),
                    'denpasar': (30, 'tropical and sunny'),
                    'balikpapan': (32, 'hot and humid'),
                    'bali': (28, 'tropical and pleasant'),
                    'malang': (26, 'cool and fresh'),
                    'solo': (29, 'warm and pleasant'),
                    'bogor': (27, 'cool and rainy'),
                    'depok': (30, 'warm and humid'),
                    'tangerang': (31, 'hot and humid'),
                    'bekasi': (30, 'warm and humid')
                }
                city_key = city.lower().replace(' ', '')
                return weather_fallback.get(city_key, (28, 'pleasant weather'))
        except Exception as e:
            print(f"Weather API error: {e}")
            return 28, 'pleasant weather'

    def map_weather_to_season(self, weather_desc, temp):
        if temp > 30:
            return "Summer"
        elif temp < 20:
            return "Winter"
        elif 'rain' in weather_desc.lower():
            return "Monsoon"
        else:
            return "Spring"

    def recommend_items(self, category, user_feature, top_n=10):
        tfidf = self.tfidf_models.get(category)
        tfidf_matrix = self.tfidf_matrices.get(category)
        df_cat = self.category_dfs.get(category)

        if tfidf is None or tfidf_matrix is None or df_cat is None:
            return pd.DataFrame()

        user_vec = tfidf.transform([user_feature])
        cosine_sim = cosine_similarity(user_vec, tfidf_matrix).flatten()
        top_indices = cosine_sim.argsort()[-top_n:][::-1]
        
        result = df_cat.iloc[top_indices][['id', 'productDisplayName', 'link', 'season', 'baseColour', 'usage', 'articleType', 'masterCategory', 'subCategory', 'year']].copy()
        result['confidence'] = cosine_sim[top_indices]
        
        return result

    def recommend_mix_and_match(self, location, gender, tema, warna):
        print(f"\n=== StyleMate: Sistem Rekomendasi Mix & Match Outfit ===")
        print(f"Masukkan lokasi/kota Anda: {location}")
        print(f"Masukkan gender (Men/Women): {gender}")
        print(f"Masukkan tema outfit (casual/formal/ethnic): {tema}")
        print(f"Masukkan warna dasar outfit (contoh: blue, black, white): {warna}")
        
        temp, weather_desc = self.get_weather_by_city(location)
        if temp is None:
            return {"error": f"Cuaca untuk lokasi '{location}' tidak ditemukan."}

        season = self.map_weather_to_season(weather_desc, temp)
        print(f"\nSuhu saat ini di {location}: {temp}°C")

        def filter_df(df_cat):
            # Filter dengan kondisi yang lebih fleksibel
            filtered = df_cat.copy()
            
            # Filter gender (case insensitive)
            if not filtered.empty:
                gender_filtered = filtered[
                    (filtered['gender'].str.lower() == gender.lower()) |
                    (filtered['gender'].str.lower() == 'unisex')
                ]
                if not gender_filtered.empty:
                    filtered = gender_filtered
            
            # Filter usage/tema (case insensitive)
            if not filtered.empty:
                usage_filtered = filtered[filtered['usage'].str.lower() == tema.lower()]
                if not usage_filtered.empty:
                    filtered = usage_filtered
            
            # Filter warna (case insensitive)
            if not filtered.empty:
                color_filtered = filtered[filtered['baseColour'].str.lower() == warna.lower()]
                if not color_filtered.empty:
                    filtered = color_filtered
            
            return filtered

        user_feature = f"{gender} {tema} {warna} {season}".lower()

        recommendations = {}
        
        # Process all 4 categories
        categories = ['Atasan', 'Bawahan', 'Sepatu', 'Aksesoris']
        
        for cat in categories:
            print(f"\n--- Rekomendasi {cat} ---")
            
            if cat not in self.category_dfs:
                recommendations[cat] = []
                print(f"Kategori {cat} tidak tersedia dalam dataset")
                continue
                
            df_filtered = filter_df(self.category_dfs[cat])
            
            if df_filtered.empty:
                # Jika filter terlalu ketat, coba dengan filter yang lebih longgar
                df_filtered = self.category_dfs[cat][
                    self.category_dfs[cat]['gender'].str.lower().isin([gender.lower(), 'unisex'])
                ]
            
            if df_filtered.empty:
                recommendations[cat] = []
                print(f"Tidak ada produk {cat} yang sesuai dengan kriteria")
                continue
                
            # Gunakan TF-IDF untuk rekomendasi 
            tfidf = self.tfidf_models[cat]
            
            # Transform feature text dari filtered data
            if 'feature_text' not in df_filtered.columns:
                df_filtered = df_filtered.copy()
                df_filtered['feature_text'] = df_filtered.apply(self.create_feature_text, axis=1)
            
            tfidf_matrix = tfidf.transform(df_filtered['feature_text'])
            user_vec = tfidf.transform([user_feature])
            cosine_sim = cosine_similarity(user_vec, tfidf_matrix).flatten()
            
            # Get top items for each category
            top_n = min(10, len(df_filtered))  
            top_indices = cosine_sim.argsort()[-top_n:][::-1]
            
            result_df = df_filtered.iloc[top_indices].copy()
            result_df['confidence'] = cosine_sim[top_indices]
            
            # Print recommendations in terminal format
            for idx, row in result_df.iterrows():
                print(f"- {row['productDisplayName']} | Warna: {row['baseColour']} | Link: {row['link']}")
            
            # Convert to list of dictionaries
            recommendations[cat] = result_df[['id', 'productDisplayName', 'link', 'season', 'baseColour', 'usage', 'articleType', 'masterCategory', 'subCategory', 'year', 'confidence']].to_dict('records')

        # Print precision scores
        print(f"\n--- Evaluasi Model (Skor Presisi) ---")
        for cat in categories:
            if recommendations[cat]:
                avg_confidence = sum(item['confidence'] for item in recommendations[cat]) / len(recommendations[cat])
                print(f"{cat}: Precision@10 = {avg_confidence:.2f}, Recall@10 = {avg_confidence:.2f}")
            else:
                print(f"{cat}: No recommendations available")

        recommendations['Season'] = season
        recommendations['weather_info'] = {
            'temperature': temp,
            'description': weather_desc,
            'location': location
        }
        recommendations['total_items'] = len(self.df)
        
        return recommendations

def create_and_save_model():
    """Create and save the StyleMate model"""
    try:
        dataset_path = '../data/StyleMate_5000_rows_shuffled.csv'
        api_key = '27a28aff65ed16685babdd0a9d91d8ad'
        
        print("Creating StyleMate model...")
        recommender = StyleMateRecommender(dataset_path, api_key)
        
        print("Saving model to pickle file...")
        with open('stylemate_recommender.pkl', 'wb') as f:
            pickle.dump(recommender, f)
        
        print("Model berhasil disimpan ke 'stylemate_recommender.pkl'.")
        return recommender
        
    except Exception as e:
        print(f"Error creating model: {e}")
        return None

def load_model():
    """Load the StyleMate model from pickle file"""
    try:
        with open('stylemate_recommender.pkl', 'rb') as f:
            recommender = pickle.load(f)
        print("Model loaded successfully from pickle file")
        return recommender
    except FileNotFoundError:
        print("Pickle file not found, creating new model...")
        return create_and_save_model()
    except Exception as e:
        print(f"Error loading model: {e}")
        return create_and_save_model()
