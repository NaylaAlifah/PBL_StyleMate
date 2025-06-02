import pandas as pd
import psycopg2
from sqlalchemy import create_engine, text
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from stylemate_model import load_model

class DatabaseManager:
    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.engine = create_engine(connection_string)
    
    def create_table(self):
        """Create the style_items table if it doesn't exist"""
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS style_items (
            id SERIAL PRIMARY KEY,
            product_id INTEGER,
            gender VARCHAR(50),
            master_category VARCHAR(100),
            sub_category VARCHAR(100),
            article_type VARCHAR(100),
            base_colour VARCHAR(50),
            season VARCHAR(50),
            year INTEGER,
            usage VARCHAR(100),
            product_display_name TEXT,
            link TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        # Create indexes for better query performance
        create_indexes_sql = [
            "CREATE INDEX IF NOT EXISTS idx_gender ON style_items(gender);",
            "CREATE INDEX IF NOT EXISTS idx_master_category ON style_items(master_category);",
            "CREATE INDEX IF NOT EXISTS idx_base_colour ON style_items(base_colour);",
            "CREATE INDEX IF NOT EXISTS idx_season ON style_items(season);",
            "CREATE INDEX IF NOT EXISTS idx_usage ON style_items(usage);",
            "CREATE INDEX IF NOT EXISTS idx_article_type ON style_items(article_type);"
        ]
        
        try:
            with self.engine.connect() as conn:
                # Create table
                conn.execute(text(create_table_sql))
                print("✅ Table 'style_items' created successfully")
                
                # Create indexes
                for index_sql in create_indexes_sql:
                    conn.execute(text(index_sql))
                print("✅ Indexes created successfully")
                
                conn.commit()
                
        except Exception as e:
            print(f"❌ Error creating table: {e}")
            return False
        
        return True
    
    def clear_table(self):
        """Clear existing data from the table"""
        try:
            with self.engine.connect() as conn:
                conn.execute(text("DELETE FROM style_items;"))
                conn.execute(text("ALTER SEQUENCE style_items_id_seq RESTART WITH 1;"))
                conn.commit()
                print("✅ Table cleared successfully")
                return True
        except Exception as e:
            print(f"❌ Error clearing table: {e}")
            return False
    
    def insert_dataset(self, df):
        """Insert dataset into PostgreSQL"""
        try:
            # Prepare dataframe for insertion
            df_clean = df.copy()
            
            # Rename columns to match database schema
            column_mapping = {
                'id': 'product_id',
                'masterCategory': 'master_category',
                'subCategory': 'sub_category',
                'articleType': 'article_type',
                'baseColour': 'base_colour',
                'productDisplayName': 'product_display_name'
            }
            
            df_clean = df_clean.rename(columns=column_mapping)
            
            # Select only the columns we need
            columns_to_insert = [
                'product_id', 'gender', 'master_category', 'sub_category', 
                'article_type', 'base_colour', 'season', 'year', 'usage', 
                'product_display_name', 'link'
            ]
            
            # Filter columns that exist in the dataframe
            existing_columns = [col for col in columns_to_insert if col in df_clean.columns]
            df_insert = df_clean[existing_columns]
            
            # Handle missing columns
            for col in columns_to_insert:
                if col not in df_insert.columns:
                    df_insert[col] = None
            
            # Clean data
            df_insert = df_insert.fillna('')
            
            # Convert data types
            if 'year' in df_insert.columns:
                df_insert['year'] = pd.to_numeric(df_insert['year'], errors='coerce').fillna(0).astype(int)
            
            if 'product_id' in df_insert.columns:
                df_insert['product_id'] = pd.to_numeric(df_insert['product_id'], errors='coerce').fillna(0).astype(int)
            
            # Insert data in batches
            batch_size = 1000
            total_rows = len(df_insert)
            
            print(f"📊 Inserting {total_rows} rows into PostgreSQL...")
            
            for i in range(0, total_rows, batch_size):
                batch = df_insert.iloc[i:i+batch_size]
                batch.to_sql('style_items', self.engine, if_exists='append', index=False, method='multi')
                print(f"✅ Inserted batch {i//batch_size + 1}/{(total_rows-1)//batch_size + 1} ({len(batch)} rows)")
            
            print(f"🎉 Successfully inserted {total_rows} rows into PostgreSQL!")
            return True
            
        except Exception as e:
            print(f"❌ Error inserting data: {e}")
            return False
    
    def get_table_stats(self):
        """Get statistics about the inserted data"""
        try:
            with self.engine.connect() as conn:
                # Total count
                result = conn.execute(text("SELECT COUNT(*) as total FROM style_items;"))
                total = result.fetchone()[0]
                
                # Category distribution
                result = conn.execute(text("""
                    SELECT master_category, COUNT(*) as count 
                    FROM style_items 
                    GROUP BY master_category 
                    ORDER BY count DESC;
                """))
                categories = result.fetchall()
                
                # Gender distribution
                result = conn.execute(text("""
                    SELECT gender, COUNT(*) as count 
                    FROM style_items 
                    GROUP BY gender 
                    ORDER BY count DESC;
                """))
                genders = result.fetchall()
                
                # Color distribution (top 10)
                result = conn.execute(text("""
                    SELECT base_colour, COUNT(*) as count 
                    FROM style_items 
                    GROUP BY base_colour 
                    ORDER BY count DESC 
                    LIMIT 10;
                """))
                colors = result.fetchall()
                
                print(f"\n📊 Database Statistics:")
                print(f"Total items: {total}")
                
                print(f"\n🏷️ Categories:")
                for cat, count in categories:
                    print(f"  - {cat}: {count}")
                
                print(f"\n👥 Gender distribution:")
                for gender, count in genders:
                    print(f"  - {gender}: {count}")
                
                print(f"\n🎨 Top colors:")
                for color, count in colors:
                    print(f"  - {color}: {count}")
                
                return True
                
        except Exception as e:
            print(f"❌ Error getting stats: {e}")
            return False

def setup_database():
    """Main function to setup database and insert dataset"""
    
    # Database connection string
    connection_string = "postgresql://postgres:Mabapens23@localhost:5432/style_mate"
    
    print("🚀 Starting database setup...")
    print(f"📍 Connecting to: {connection_string}")
    
    # Initialize database manager
    db_manager = DatabaseManager(connection_string)
    
    # Create table
    if not db_manager.create_table():
        print("❌ Failed to create table")
        return False
    
    # Load the model to get the dataset
    print("\n📂 Loading StyleMate model and dataset...")
    recommender = load_model()
    
    if not recommender:
        print("❌ Failed to load model")
        return False
    
    print(f"✅ Model loaded with {len(recommender.df)} items")
    
    # Clear existing data
    print("\n🧹 Clearing existing data...")
    if not db_manager.clear_table():
        print("❌ Failed to clear table")
        return False
    
    # Insert dataset
    print("\n💾 Inserting dataset into PostgreSQL...")
    if not db_manager.insert_dataset(recommender.df):
        print("❌ Failed to insert dataset")
        return False
    
    # Show statistics
    print("\n📈 Getting database statistics...")
    db_manager.get_table_stats()
    
    print("\n🎉 Database setup completed successfully!")
    print("💡 You can now query the data using SQL or connect from your application")
    
    return True

if __name__ == "__main__":
    setup_database()
