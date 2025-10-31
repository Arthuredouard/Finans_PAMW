from flask import Blueprint, jsonify
from models import User

users_bp = Blueprint('users_bp', __name__)

@users_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name, "email": u.email} for u in users])
