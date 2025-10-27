from flask import Blueprint, jsonify, request
from models import db, Transaction, Category
from functools import wraps
from flask_cors import cross_origin 

transactions_bp = Blueprint('transactions_bp', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # ✅ Récupération du token depuis le header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_email = data['user']
            current_user = User.query.filter_by(email=current_user_email).first()
        except Exception as e:
            print("Erreur token :", e)
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated


@transactions_bp.route('/', methods=['GET'])
@token_required
def get_transactions(current_user):
    # ✅ Afficher seulement les transactions de l’utilisateur connecté
    transactions = Transaction.query.filter_by(user_id=current_user.id).all()

    result = []
    for t in transactions:
        result.append({
            "id": t.id,
            "user_id": t.user_id,
            "amount": t.amount,
            "type": t.type,
            "categories": [{"id": c.id, "name": c.name} for c in t.categories]
        })
    return jsonify({"transactions": result})

@transactions_bp.route('/', methods=['POST'])
def create_transaction():
    data = request.json
    category_ids = data.pop("category_ids", [])
    categories = Category.query.filter(Category.id.in_(category_ids)).all()
    transaction = Transaction(
        user_id=data["user_id"],
        amount=data["amount"],
        type=data["type"],
        categories=categories
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({
        "message": "Nouvelle transaction créée",
        "transaction": {
            "id": transaction.id,
            "user_id": transaction.user_id,
            "amount": transaction.amount,
            "type": transaction.type,
            "categories": [{"id": c.id, "name": c.name} for c in transaction.categories]
        }
    }), 201
