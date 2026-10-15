**SyncKart - Product Information Management (PIM) & eCommerce Synchronizer**

An intuitive Product Information Management (PIM) platform that allows shop owners to manage inventory locally and synchronize products to a live WooCommerce store with a single click. 🚀🚀

🚀 **Features**

• Centralized Dashboard: View real-time inventory statistics including total products, synced items, and pending sync statuses.
• Local PIM Registry: Add and manage products locally with details like Name, SKU, Price, and Stock before pushing them live.
• One-Click Live Sync: Instantly publish pending local products directly to a live, production WooCommerce store using real-time API integrations.
• Instant Customer Availability: Synchronized products instantly reflect on the front-end customer shop page, ready to be added to carts and purchased.
• Automated Data Protection: Built-in safeguards handle duplicate SKU updates dynamically to prevent inventory overwriting.

📋 **Prerequisites**

Before running this application, make sure you have the following installed:
• Python 3.10+ - Download Python
• Node.js 18+ - Download Node.js
• npm (comes with Node.js)
• Google API Key - Get API Key

**Project Structure**
credit-memo-gen/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx       # Main application component
│   │   └── main.jsx      # Application entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/          # Flask backend API
    ├── app.py              # Main Flask application
    ├── ai_config.py        # Gemini AI wrapper
    ├── auth.py             # Authentication endpoints
    ├── models.py           # Database models
    ├── requirements.txt    # Python dependencies
    └── .env               # Environment variables (create this)


🔧 **Installation & Setup**


1️⃣ # Clone the Repository

bash
git clone <repository-url>
cd Kilowott-hackathon-gayatri-main


2️⃣ # Backend Setup (Python/Flask)

Navigate to Server Directory
Navigate to Server Directory
cd credit-memo-gen/server

# Stay in the root directory where app.py and venv are located

Create Virtual Environment (Recommended)
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

Install Python Dependencies
Ensure your python dependencies are installed:

pip install flask flask-cors woocommerce python-dotenv

Create Environment File
Create a .env file in this root directory with the following content:
env
# WooCommerce API Configuration
WOOCOMMERCE_STORE_URL=https://your-real-shop-url.com
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here

# Flask Settings
FLASK_ENV=development
FLASK_DEBUG=True

Important: Replace your_google_api_key_here with your actual Google API key from Google AI Studio

Initialize Database
The database will be created automatically when you first run the server. A demo user will be created with:

Username: demo
Password: demo

3️⃣ Frontend Setup (React/Vite)

Open a new terminal window and navigate to your frontend directory inside credit-memo-gen:

cd credit-memo-gen
Install Node Dependencies
npm install


📖 How to Use

• Open Application: Navigate to http://localhost:5173 in your web browser to open the SyncKart inventory dashboard.
• Add a New Product:
	• Enter the product details into the PIM management panel form fields.
	• Fields include: Product Name (e.g., Leather Ball), SKU (e.g., LB-205), Price (e.g., 899), and Stock (e.g., 10).
	• Click the Add to PIM button.
• Review Local Registry:
	• Find your newly created item listed in the local product log table below the entry form.
	• The synchronization status column will initially read as Pending.
• One-Click Live Sync:
	• Click the Sync button next to your pending item entry.
	• The tracking label will transition into Syncing during processing, changing straight to Synced once completed successfully.
• Verify on Live WooCommerce Shop:
	• Open your live WordPress administration dashboard and browse to the official product catalog area.
	• Confirm that your live storefront catalog displays the exactly synchronized item with matching stock, naming, and configuration levels.

  🔑 API Endpoints
Analysis Endpoint
POST /analyze
Content-Type: multipart/form-data

Request Body:
- file: PDF file (multipart upload)

Response:
{
  "executive_summary": "...",
  "risks": [
    {
      "title": "Risk Name",
      "description": "...",
      "severity": "High/Medium/Low",
      "source_page": 1,
      "confidence": "High"
    }
  ],
  "metrics": [
    {
      "label": "Metric Name",
      "value": "$10M",
      "source_page": 1,
      "confidence": "High"
    }
  ]
}
Authentication Endpoints (Optional)
POST /api/auth/register
POST /api/auth/login
GET  /api/analysis/history
🐛 Troubleshooting
Backend Issues
Problem: ModuleNotFoundError: No module named 'flask'

# Solution: Install dependencies
pip install -r requirements.txt
Problem: NameError: name 'genai' is not defined

# Solution: This has been fixed. Make sure you have the latest version of app.py


Problem: GOOGLE_API_KEY not found

# Solution: Make sure .env file exists in server directory with valid API key
Frontend Issues
Problem: Failed to load resource: 401 (UNAUTHORIZED)

# Solution: This has been fixed. Authentication is disabled for demo mode
Problem: Failed to load resource: 500 (INTERNAL SERVER ERROR)

# Solution: Check the Python terminal for error details
# Make sure backend server is running
# Verify GOOGLE_API_KEY is set correctly in .env
Problem: Cannot connect to backend

# Solution: Verify backend is running on http://127.0.0.1:5000
# Check that CORS is enabled in app.py
Port Conflicts
If ports 5000 or 5173 are already in use:

Backend - Edit app.py:

app.run(debug=True, port=5001)  # Change to different port
Frontend - Edit vite.config.js:

export default defineConfig({
  server: {
    port: 5174  // Change to different port
  }
})
📦 Dependencies
Backend (Python)
Flask - Web framework
Flask-CORS - Cross-origin resource sharing
Flask-JWT-Extended - JWT authentication
Flask-Limiter - Rate limiting
Flask-Bcrypt - Password hashing
Flask-SQLAlchemy - Database ORM
Flask-Migrate - Database migrations
pdfplumber - PDF text extraction
python-dotenv - Environment variable management
requests - HTTP library for API calls
Frontend (React)
React 18 - UI library
Vite - Build tool and dev server
Axios (if used) - HTTP client
🔒 Security Notes
Authentication: Currently disabled for demo purposes
To enable: Uncomment @jwt_required() decorators in app.py
Use /api/auth/login endpoint to get JWT token
Rate Limiting: 5 requests per minute per IP
API Keys: Never commit .env file to version control
Production: Use a proper WSGI server (gunicorn, waitress) instead of Flask dev server
🚀 Production Deployment
For production deployment:

Backend:

Use a production WSGI server (gunicorn/waitress)
Set FLASK_ENV=production
Use PostgreSQL instead of SQLite
Enable authentication
Set strong JWT_SECRET_KEY
Frontend:

Build production bundle: npm run build
Serve with nginx or similar
Update API endpoint URLs
Environment Variables:

Use proper secret management
Enable HTTPS
Configure proper CORS settings
