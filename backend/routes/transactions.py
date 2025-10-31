from flask import Blueprint, jsonify, request,current_app
from models import db, Transaction, Category,User
from functools import wraps
from flask_cors import cross_origin 
import jwt
import datetime


transactions_bp = Blueprint('transactions_bp', __name__)

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



@transactions_bp.route('/', methods=['GET'])
@token_required
def get_transactions(current_user):
    # Récupérer seulement les transactions de l’utilisateur connecté
    transactions = Transaction.query.filter_by(user_id=current_user.id).all()

    result = []
    for t in transactions:
        result.append({
            "id": t.id,
            "user_id": t.user_id,
            "amount": t.amount,
            "type": t.type,
            "description": t.description,
            "date": t.date.isoformat(),  # renvoie la date en format ISO
            "categories": [{"id": c.id, "name": c.name} for c in t.categories]
        })

    return jsonify({"transactions": result})


@transactions_bp.route('/<int:transaction_id>', methods=['DELETE'])
@token_required
def delete_transaction(current_user, transaction_id):
    # 🔍 Récupérer la transaction à supprimer
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=current_user.id).first()

    if not transaction:
        return jsonify({"message": "Transaction introuvable ou non autorisée."}), 404

    # 🗑️ Supprimer la transaction
    db.session.delete(transaction)
    db.session.commit()

    return jsonify({
        "message": "Transaction supprimée avec succès.",
        "transaction_id": transaction_id
    }), 200

@transactions_bp.route('/', methods=['POST'])
@token_required
def create_transaction(current_user):
    data = request.json

    # Récupérer les catégories si envoyées
    category_ids = data.pop("category_ids", [])
    categories = Category.query.filter(Category.id.in_(category_ids)).all()

    # Convertir la date string en datetime si fournie
    date_str = data.get("date")
    if date_str:
        try:
            # attend format "YYYY-MM-DD"
            data["date"] = datetime.datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"message": "Format de date invalide, utilisez YYYY-MM-DD"}), 400

    # Créer la transaction
    transaction = Transaction(
        user_id=current_user.id,
        amount=data["amount"],
        type=data["type"],
        description=data.get("description"),
        date=data.get("date"),
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
            "description": transaction.description,
            "date": transaction.date.isoformat(),
            "categories": [{"id": c.id, "name": c.name} for c in transaction.categories]
        }
    }), 201