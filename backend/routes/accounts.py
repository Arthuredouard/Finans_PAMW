from flask import Blueprint, jsonify
from models import Account

accounts_bp = Blueprint('accounts_bp', __name__)

@accounts_bp.route('/<int:user_id>', methods=['GET'])
def get_account(user_id):
    account = Account.query.filter_by(user_id=user_id).first()
    if account:
        return jsonify({"user_id": account.user_id, "balance": account.balance})
    return jsonify({"message": "Account not found"}), 404
