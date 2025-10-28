from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Many-to-many table
import datetime

# --- Table d'association Many-to-Many ---
transaction_categories = db.Table(
    'transaction_categories',
    db.Column('transaction_id', db.Integer, db.ForeignKey('transaction.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('category.id'), primary_key=True)
)

# --- Modèle Category ---
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    transactions = db.relationship(
        'Transaction',
        secondary=transaction_categories,
        back_populates='categories'
    )

# --- Modèle Transaction ---
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)
    
    # ✅ Champs supplémentaires
    description = db.Column(db.String(255))
    date = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    categories = db.relationship(
        'Category',
        secondary=transaction_categories,
        back_populates='transactions'
    )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    accounts = db.relationship('Account', backref='user', lazy=True)
    transactions = db.relationship('Transaction', backref='user', lazy=True)

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    balance = db.Column(db.Float, default=0.0)


