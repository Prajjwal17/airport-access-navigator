import sqlite3

conn = sqlite3.connect('db/airports.db')
cur = conn.cursor()

# List all tables
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cur.fetchall()
print("Tables:", tables)

# Count FacilityTypes rows
cur.execute("SELECT COUNT(*) FROM FacilityTypes;")
count = cur.fetchone()[0]
print("FacilityTypes count:", count)

conn.close()
