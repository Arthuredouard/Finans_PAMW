from flask import Blueprint, jsonify,request,current_app
from models import Account,User
from functools import wraps
from flask_cors import cross_origin 
import jwt


accounts_bp = Blueprint('accounts_bp', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Récupération du token depuis le header Authorization
        auth_header = request.headers.get('Authorization', None)
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # ✅ Utiliser current_app au lieu de app
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_email = data['user']
            current_user = User.query.filter_by(email=current_user_email).first()
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired!'}), 401
        except Exception as e:
            print("Erreur token :", e)
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated



@accounts_bp.route('/', methods=['GET'])
@token_required
def get_account(current_user):
    """
    Retourne le compte (budget) de l'utilisateur connecté
    """
    account = Account.query.filter_by(user_id=current_user.id).first()
    if account:
        return jsonify({
            "user_id": account.user_id,
            "balance": account.balance
        })
    return jsonify({"message": "Account not found"}), 404
