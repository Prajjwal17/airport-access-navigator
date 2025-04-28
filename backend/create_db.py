import sqlite3
import os

# Get the absolute path to the database
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'db', 'airports.db')

def init_db():
    # Create the db directory if it doesn't exist
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    # Remove existing database to start fresh
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Create Airports table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS Airports (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        iata_code TEXT NOT NULL UNIQUE,
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        description TEXT
    )
    ''')
    
    # Create FacilityTypes table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS FacilityTypes (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
    )
    ''')
    
    # Create Facilities table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS Facilities (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT,
        operating_hours TEXT,
        facility_type_id INTEGER,
        airport_id INTEGER,
        FOREIGN KEY (facility_type_id) REFERENCES FacilityTypes (id),
        FOREIGN KEY (airport_id) REFERENCES Airports (id)
    )
    ''')
    
    # Insert Indian airports
    airports = [
        (1, 'Indira Gandhi International Airport', 'DEL', 'Delhi', 'India', 'Major international airport in New Delhi'),
        (2, 'Chhatrapati Shivaji Maharaj International Airport', 'BOM', 'Mumbai', 'India', 'Primary international airport in Mumbai'),
        (3, 'Kempegowda International Airport', 'BLR', 'Bengaluru', 'India', 'Major airport serving Bangalore')
    ]
    
    cur.executemany('INSERT INTO Airports VALUES (?, ?, ?, ?, ?, ?)', airports)
    
    # Insert facility types
    facility_types = [
        (1, 'restaurant'),
        (2, 'shop'),
        (3, 'lounge'),
        (4, 'bathroom')
    ]
    
    cur.executemany('INSERT INTO FacilityTypes VALUES (?, ?)', facility_types)
    
    # Insert facilities for each airport
    facilities = [
        # Delhi IGI Airport
        (1, 'Dilli Streat', 'Terminal 3, Level 3', 'Indian street food', '24/7', 1, 1),
        (2, 'Delhi Duty Free', 'Terminal 3 International', 'Duty-free shopping', '24/7', 2, 1),
        (3, 'Plaza Premium Lounge', 'Terminal 3 International', 'Premium lounge services', '24/7', 3, 1),
        
        # Mumbai CSIA
        (4, 'Cafe Mumbai', 'Terminal 2, Level 4', 'Local and international cuisine', '24/7', 1, 2),
        (5, 'Mumbai Shopping', 'Terminal 2 International', 'Duty-free and local goods', '24/7', 2, 2),
        (6, 'GVK Lounge', 'Terminal 2, Level 3', 'Premium lounge', '24/7', 3, 2),
        
        # Bengaluru KIAL
        (7, 'Bangalore Kitchen', 'Terminal 1, Level 2', 'South Indian specialties', '24/7', 1, 3),
        (8, 'Karnataka Retail', 'Terminal 1', 'Local handicrafts and duty-free', '6:00-23:00', 2, 3),
        (9, 'BLR Lounge', 'Terminal 1, Level 3', 'Business lounge', '24/7', 3, 3)
    ]
    
    cur.executemany('INSERT INTO Facilities VALUES (?, ?, ?, ?, ?, ?, ?)', facilities)
    
    conn.commit()
    conn.close()
    print(f"Database initialized successfully at {DB_PATH}")

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully!")