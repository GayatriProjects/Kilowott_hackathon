from flask import Flask, request, jsonify
from flask_cors import CORS
from woocommerce import API
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# In-memory store
products = []

WC_URL = os.getenv("WC_URL")
WC_KEY = os.getenv("WC_KEY")
WC_SECRET = os.getenv("WC_SECRET")

print(f"PIM Server REAL MODE - Connected to {WC_URL}")

wcapi = API(
    url=WC_URL,
    consumer_key=WC_KEY,
    consumer_secret=WC_SECRET,
    version="wc/v3",
    timeout=20
)

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/api/products', methods=['POST'])
def add_products():
    data = request.json
    new_product = {
        "id": str(uuid.uuid4()),
        "name": data.get('name'),
        "sku": data.get('sku'),
        "price": data.get('price'),
        "stock": data.get('stock', '10'),
        "syncStatus": "pending",
        "wooId": None
    }
    products.append(new_product)
    return jsonify(new_product), 201

@app.route('/api/sync/<id>', methods=['POST'])
def sync_product(id):
    product = next((p for p in products if p['id'] == id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    try:
        # Check if SKU already exists
        existing = wcapi.get("products", params={"sku": product['sku']}).json()
        if existing and len(existing) > 0 and 'id' in existing[0]:
            woo_id = existing[0]['id']
            data = {
                "name": product['name'],
                "regular_price": str(product['price']),
                "stock_quantity": int(product.get('stock', 10)),
                "manage_stock": True
            }
            result = wcapi.put(f"products/{woo_id}", data).json()
            product['syncStatus'] = 'synced'
            product['wooId'] = woo_id
            return jsonify({"message": "Updated!", "wooId": woo_id, "data": result})
        else:
            data = {
                "name": product['name'],
                "type": "simple",
                "sku": product['sku'],
                "regular_price": str(product['price']),
                "description": f"PIM Synced product - SKU {product['sku']}",
                "stock_quantity": int(product.get('stock', 10)),
                "manage_stock": True,
                "status": "publish"
            }
            result = wcapi.post("products", data).json()
            if 'id' not in result:
                return jsonify({"error": "Woo Error", "details": result}), 400
            product['syncStatus'] = 'synced'
            product['wooId'] = result['id']
            return jsonify({"message": "Created!", "wooId": result['id'], "data": result})
    except Exception as e:
        print("Sync error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return jsonify({"status": "PIM Server REAL MODE", "url": WC_URL, "products": len(products)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)