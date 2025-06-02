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

        # Persiapan data dan model TF-IDF untuk 3 kategori
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
        tops = self.df[
            (self.df['masterCategory'].str.lower().isin(['apparel', 'accessories'])) &
            (self.df['articleType'].str.lower().str.contains('top|shirt|kurta|blouse|t-shirt|tee|tank', na=False))
        ].copy()

        bottoms = self.df[
            (self.df['masterCategory'].str.lower().isin(['apparel'])) &
            (self.df['articleType'].str.lower().str.contains('pant|jean|trouser|skirt|short', na=False))
        ].copy()

        shoes = self.df[self.df['masterCategory'].str.lower() == 'footwear'].copy()

        return tops, bottoms, shoes

    def prepare_models(self):
        # Filter kategori
        tops, bottoms, shoes = self.filter_categories()
        cats = {'Atasan': tops, 'Bawahan': bottoms, 'Sepatu': shoes}

        for cat_name, df_cat in cats.items():
            if not df_cat.empty:
                df_cat['feature_text'] = df_cat.apply(self.create_feature_text, axis=1)
                tfidf = TfidfVectorizer()
                tfidf_matrix = tfidf.fit_transform(df_cat['feature_text'])

                self.tfidf_models[cat_name] = tfidf
                self.tfidf_matrices[cat_name] = tfidf_matrix
                self.category_dfs[cat_name] = df_cat

    def get_weather_by_city(self, city):
        try:
            params = {
                'q': city,
                'appid': self.api_key,
                'units': 'metric'
            }
            response = requests.get(self.weather_url, params=params)
            if response.status_code == 200:
                data = response.json()
                temp = data['main']['temp']
                weather_desc = data['weather'][0]['description']
                return temp, weather_desc
            else:
                return None, None
        except Exception as e:
            print(f"Error getting weather: {e}")
            return None, None

    def map_weather_to_season(self, weather_desc, temp):
        if temp < 15:
            return 'Winter'
        elif temp > 30:
            return 'Summer'
        elif 'rain' in weather_desc.lower():
            return 'Monsoon'
        else:
            return 'Spring'

    def recommend_items(self, category, user_feature, top_n=5):
        if category not in self.tfidf_models:
            return pd.DataFrame()
            
        tfidf = self.tfidf_models.get(category)
        tfidf_matrix = self.tfidf_matrices.get(category)
        df_cat = self.category_dfs.get(category)

        user_vec = tfidf.transform([user_feature])
        cosine_sim = cosine_similarity(user_vec, tfidf_matrix).flatten()
        top_indices = cosine_sim.argsort()[-top_n:][::-1]
        
        result = df_cat.iloc[top_indices][['productDisplayName', 'link', 'season', 'baseColour', 'usage']].copy()
        result['similarity_score'] = cosine_sim[top_indices]
        return result

    def recommend_mix_and_match(self, location, gender, tema, warna):
        temp, weather_desc = self.get_weather_by_city(location)
        if temp is None:
            return {"error": f"Cuaca untuk lokasi '{location}' tidak ditemukan."}

        season = self.map_weather_to_season(weather_desc, temp)

        def filter_df(df_cat):
            filtered = df_cat[
                (df_cat['gender'].str.lower() == gender.lower()) &
                (df_cat['usage'].str.lower() == tema.lower()) &
                (df_cat['baseColour'].str.lower() == warna.lower()) &
                (df_cat['season'] == season)
            ]
            return filtered

        user_feature = f"{gender} {tema} {warna} {season}".lower()

        recommendations = {}
        for cat in ['Atasan', 'Bawahan', 'Sepatu']:
            if cat not in self.category_dfs:
                recommendations[cat] = []
                continue
                
            df_filtered = filter_df(self.category_dfs[cat])
            if df_filtered.empty:
                # Fallback: cari tanpa filter season
                df_filtered = self.category_dfs[cat][
                    (self.category_dfs[cat]['gender'].str.lower() == gender.lower()) &
                    (self.category_dfs[cat]['usage'].str.lower() == tema.lower()) &
                    (self.category_dfs[cat]['baseColour'].str.lower() == warna.lower())
                ]
            
            if df_filtered.empty:
                recommendations[cat] = []
                continue

            # Gunakan TF-IDF untuk rekomendasi
            tfidf = self.tfidf_models[cat]
            tfidf_matrix = tfidf.transform(df_filtered['feature_text'])
            user_vec = tfidf.transform([user_feature])
            cosine_sim = cosine_similarity(user_vec, tfidf_matrix).flatten()
            
            top_n = 5 if cat != 'Sepatu' else 3
            top_indices = cosine_sim.argsort()[-top_n:][::-1]
            
            result_df = df_filtered.iloc[top_indices]
            recommendations[cat] = result_df[['productDisplayName', 'link', 'season', 'baseColour', 'usage']].to_dict('records')

        recommendations['weather_info'] = {
            'temperature': temp,
            'description': weather_desc,
            'season': season,
            'location': location
        }
        
        return recommendations

# Fungsi untuk load model
def load_model(model_path='model/stylemate_recommender.pkl'):
    try:
        with open(model_path, 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        print("Model file not found. Creating new model...")
        # Fallback: create new model if pickle doesn't exist
        recommender = StyleMateRecommender('StyleMate_5000_rows_shuffled.csv', '27a28aff65ed16685babdd0a9d91d8ad')
        
        # Save the model
        with open(model_path, 'wb') as f:
            pickle.dump(recommender, f)
        
        return recommender
