from flask import Blueprint, jsonify, request
from models import db, Transaction, Category

transactions_bp = Blueprint('transactions_bp', __name__)

@transactions_bp.route('/', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    result = []
    for t in transactions:
        result.append({
            "id": t.id,
            "user_id": t.user_id,
            "amount": t.amount,
            "type": t.type,
            "categories": [{"id": c.id, "name": c.name} for c in t.categories]
        })
    return jsonify(result)

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
