from flask import Blueprint, jsonify, request
from models import db, Category

categories_bp = Blueprint('categories_bp', __name__)

@categories_bp.route('/', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    result = []
    for c in categories:
        result.append({
            "id": c.id,
            "name": c.name,
            "transactions": [{"id": t.id, "user_id": t.user_id, "amount": t.amount, "type": t.type} 
                             for t in c.transactions]
        })
    return jsonify(result)

@categories_bp.route('/', methods=['POST'])
def create_category():
    data = request.json
    category = Category(name=data["name"])
    db.session.add(category)
    db.session.commit()
    return jsonify({"message": "Nouvelle catégorie créée", "category": {"id": category.id, "name": category.name}}), 201

@categories_bp.route('/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = Category.query.get(category_id)

    if not category:
        return jsonify({"message": "Catégorie introuvable"}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({"message": f"Catégorie '{category.name}' supprimée avec succès"}), 200
