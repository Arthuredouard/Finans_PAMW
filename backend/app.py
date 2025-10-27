from flask import Flask, jsonify,request,make_response
import jwt,datetime
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config
from models import db
from routes.users import users_bp
from routes.accounts import accounts_bp
from routes.transactions import transactions_bp
from routes.categories import categories_bp
from functools import wraps 
from werkzeug.security import generate_password_hash,check_password_hash
from models import User

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

CORS(app, 
     resources={r"/*": {"origins": "http://localhost:3000"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])


app.register_blueprint(users_bp, url_prefix='/users')
app.register_blueprint(accounts_bp, url_prefix='/accounts')
app.register_blueprint(transactions_bp, url_prefix='/transactions')
app.register_blueprint(categories_bp, url_prefix='/categories')


# Stockage temporaire des tokens invalidés
blacklist = set()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['user']
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/')
def home():
    return jsonify({"message": "Byenvini zanmi mw sou sit nou"})


@app.route('/login',methods=['POST'])
def login():
    # Récupérer les données JSON envoyées par le client
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return make_response('Missing credentials!', 400)  # 400 Bad Request

    email = data['email']
    password = data['password']

    # Récupération de l’utilisateur dans la base
    user = User.query.filter_by(email=email).first()
    if not user:
        return make_response('User not found!', 401)

    # Vérification du mot de passe hashé
    if check_password_hash(user.password, password):
        token = jwt.encode({
            'user': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({'token': token})

    return make_response('Invalid credentials!', 401)

@app.route('/logout', methods=['POST'])
def logout():
    # Le token doit être envoyé dans le header Authorization: Bearer <token>
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'message': 'Token missing!'}), 400

    # Extraire le token sans le mot "Bearer "
    token = auth_header.replace('Bearer ', '')

    # Ajouter le token à la blacklist
    blacklist.add(token)
    return jsonify({'message': 'Successfully logged out!'}), 200

@app.route('/unprotected')
def unprotected():
    return jsonify({'message': 'Anyone can view this!'})

@app.route('/protected')
@token_required
def protected(current_user):
    return jsonify({'message': 'This is only available for people with valid tokens.'})



if __name__ == '__main__':
    app.run(debug=True)
