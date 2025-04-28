from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3, os

app = Flask(__name__)
CORS(app)

# Point to your SQLite DB in the parent db folder
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'db', 'airports.db')

@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to Airport Facilities API',
        'endpoints': {
            'facilities': '/api/airports/<airport_id>/facilities?type=<facility_type>'
        }
    })

@app.route('/api/airports/<int:airport_id>/facilities', methods=['GET'])
def get_facilities(airport_id):
    try:
        facility_type = request.args.get('type')
        if not facility_type:
            return jsonify({'error': 'Facility type is required'}), 400

        print(f"Searching for facilities with airport_id={airport_id} and type={facility_type}")
            
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        # First verify if the facility type exists
        cur.execute('SELECT id FROM FacilityTypes WHERE name = ?', (facility_type,))
        type_result = cur.fetchone()
        if not type_result:
            return jsonify({'error': f'Facility type "{facility_type}" not found'}), 404

        # Get facilities with detailed error handling
        cur.execute('''
            SELECT f.id, f.name, f.location, f.description, f.operating_hours
            FROM Facilities f
            JOIN FacilityTypes ft ON f.facility_type_id = ft.id
            WHERE f.airport_id = ? AND ft.name = ?
        ''', (airport_id, facility_type))

        facilities = [
            {
                'id': r[0],
                'name': r[1],
                'location': r[2],
                'description': r[3],
                'hours': r[4]
            } for r in cur.fetchall()
        ]

        print(f"Found {len(facilities)} facilities")

        if not facilities:
            return jsonify({'message': f'No {facility_type} facilities found for airport {airport_id}'}), 404

        conn.close()
        return jsonify(facilities)

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
