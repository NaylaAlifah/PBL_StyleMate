#!/usr/bin/env python3
"""
Script to setup PostgreSQL database and insert StyleMate dataset
Run this after the model has been trained and saved as pkl file
"""

import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from database_setup import setup_database

def main():
    print("=" * 60)
    print("🎯 StyleMate Database Setup")
    print("=" * 60)
    print("This script will:")
    print("1. Create PostgreSQL table 'style_items'")
    print("2. Load the trained StyleMate model")
    print("3. Insert the complete dataset into PostgreSQL")
    print("4. Create indexes for better performance")
    print("5. Show database statistics")
    print("=" * 60)
    
    # Confirm before proceeding
    response = input("\nProceed with database setup? (y/N): ")
    if response.lower() != 'y':
        print("❌ Database setup cancelled")
        return
    
    # Run setup
    success = setup_database()
    
    if success:
        print("\n" + "=" * 60)
        print("✅ Database setup completed successfully!")
        print("📍 Connection: postgresql://postgres:***@localhost:5432/style_mate")
        print("🏷️ Table: style_items")
        print("💡 You can now query the data using SQL")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("❌ Database setup failed!")
        print("Please check the error messages above")
        print("=" * 60)

if __name__ == "__main__":
    main()
