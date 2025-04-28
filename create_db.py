import sqlite3
import os

# Ensure the db folder exists
os.makedirs('db', exist_ok=True)

# Connect (this will create airports.db if it doesn't exist)
conn = sqlite3.connect('db/airports.db')
cur = conn.cursor()

# Load and execute your schema.sql
with open('db/schema.sql', 'r', encoding='utf-8') as f:
    cur.executescript(f.read())

# Populate FacilityTypes
facility_types = [
    'Lounge', 'Parking', 'Transport',
    'Restroom', 'Eatery', 'Retail',
    'Medical/First Aid', 'ATM/Banking', 'Wi-Fi Zone'
]
cur.executemany(
    "INSERT INTO FacilityTypes (name) VALUES (?)",
    [(ft,) for ft in facility_types]
)

conn.commit()
conn.close()
print("✅ Database created at db/airports.db with schema and FacilityTypes loaded.")
