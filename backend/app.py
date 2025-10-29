from flask import Flask, jsonify,request,make_response
import jwt,datetime
from flask_migrate import Migrate
from flask_cors import CORS,cross_origin
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

@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    data = request.get_json()

    # Vérifier les champs obligatoires
    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Nom, email et mot de passe requis !'}), 400

    name = data['name']
    email = data['email']
    password = data['password']

    # Vérifier si l'utilisateur existe déjà
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Un utilisateur avec cet email existe déjà !'}), 409

    # Créer un nouvel utilisateur avec mot de passe hashé
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)
    new_user = User(name=name, email=email, password=hashed_password)

    # Ajouter à la base
    db.session.add(new_user)
    db.session.commit()

    # Générer un token
    token = jwt.encode({
        'user': new_user.email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'message': 'Utilisateur créé avec succès !',
        'token': token
    }), 201




if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

