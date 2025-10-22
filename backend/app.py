from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from models import db
from routes.users import users_bp
from routes.accounts import accounts_bp
from routes.transactions import transactions_bp
from routes.categories import categories_bp

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

app.register_blueprint(users_bp, url_prefix='/users')
app.register_blueprint(accounts_bp, url_prefix='/accounts')
app.register_blueprint(transactions_bp, url_prefix='/transactions')
app.register_blueprint(categories_bp, url_prefix='/categories')

@app.route('/')
def home():
    return jsonify({"message": "Byenvini zanmi mw sou sit nou"})

if __name__ == '__main__':
    app.run(debug=True)
