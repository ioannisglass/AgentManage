class User():
    # __tablename__ = "users"
    
    # id = db.Column(db.Integer, primary_key = True)
    # public_id = db.Column(db.String(50), unique = True)
    # name = db.Column(db.String(100))
    # email = db.Column(db.String(70), unique = True)
    # password = db.Column(db.String(80))
    email = ""
    password = ""
    cusid = ""
    
    # def __init__(self, email, password, admin=False):
    #     self.email = email
    #     self.password = bcrypt.generate_password_hash(
    #         password, app.config.get('BCRYPT_LOG_ROUNDS')
    #     ).decode()
    #     self.registered_on = datetime.datetime.now()
    #     self.admin = admin