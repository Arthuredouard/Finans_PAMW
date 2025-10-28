from app import app
from models import db, User, Account, Category, Transaction
from werkzeug.security import generate_password_hash
import datetime

with app.app_context():
    # 🔄 Réinitialiser la base
    db.drop_all()
    db.create_all()
 
    hashed_pw = generate_password_hash('password', method='pbkdf2:sha256')

    # 👤 Utilisateurs
    user1 = User(name="Gaëtan", email="gaetan@example.com", password=hashed_pw)
    user2 = User(name="Marie", email="marie@example.com", password=hashed_pw)
    db.session.add_all([user1, user2])
    db.session.commit()

    # 🏦 Comptes
    account1 = Account(user_id=user1.id, balance=1500.0)
    account2 = Account(user_id=user2.id, balance=2500.0)
    db.session.add_all([account1, account2])
    db.session.commit()

    # 🏷️ Catégories
    cat1 = Category(name="Revenus")
    cat2 = Category(name="Dépenses")
    cat3 = Category(name="Investissements")
    db.session.add_all([cat1, cat2, cat3])
    db.session.commit()

    # 💸 Transactions (avec description et date)
    trans1 = Transaction(
        user_id=user1.id,
        amount=200.0,
        type="revenu",
        description="Paiement client A",
        date=datetime.datetime(2025, 10, 1),
        categories=[cat1, cat3]
    )
    trans2 = Transaction(
        user_id=user1.id,
        amount=50.0,
        type="dépense",
        description="Achat fournitures bureau",
        date=datetime.datetime(2025, 10, 5),
        categories=[cat2]
    )
    trans3 = Transaction(
        user_id=user2.id,
        amount=500.0,
        type="revenu",
        description="Consultation freelance",
        date=datetime.datetime(2025, 10, 10),
        categories=[cat1]
    )

    db.session.add_all([trans1, trans2, trans3])
    db.session.commit()

    print("✅ Base de données réinitialisée et remplie avec succès (many-to-many + descriptions + dates) !")
