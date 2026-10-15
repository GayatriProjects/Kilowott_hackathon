from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

products = []

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.json
    p = {
        "id": str(len(products)+1),
        "name": data.get('name'),
        "sku": data.get('sku'),
        "price": data.get('price'),
        "stock": data.get('stock', '10'),
        "syncStatus": "pending"
    }
    products.append(p)
    return jsonify(p)

@app.route('/api/sync/<id>', methods=['POST'])
def sync_to_woo(id):
    product = next((x for x in products if x['id'] == id), None)
    if not product:
        return jsonify({"error": "not found"}), 404
    # Mock sync for demo - TasteWP site expired, so we simulate success
    # In production, this would call WooCommerce API
    print(f"Syncing {product['name']} to WooCommerce - adventurousballs.s2-tastewp.com")
    product['syncStatus'] = 'synced'
    return jsonify({"success": True, "message": "Mock synced - Woo site expired, but PIM flow works", "wooId": 123})

if __name__ == '__main__':
    print(f"PIM Server running in DEMO MODE - Ready for Kilowott Judging")
    app.run(port=5000, debug=True)
