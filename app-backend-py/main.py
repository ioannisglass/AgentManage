from collections.abc import Mapping
from flask import Flask, render_template, request, make_response, jsonify
# from flask_jwt import JWT, jwt_required, current_identity
import json
from flask_cors import CORS, cross_origin
from MySQLHelper import AgentManage
import jwt
from datetime import datetime, timedelta
from functools import wraps
import uuid
from  werkzeug.security import generate_password_hash, check_password_hash
# from flask_mysqldb import MySQL
# from flaskext.mysql import MySQL

SECRET_KEY = "155912E@!FAs"

agentManager = AgentManage(
    "localhost",
    3306,
    "root",
    "",
    "systemagent"
)
app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@server/db'
# db = SQLAlchemy(app)
CORS(app, support_credentials=True)

def token_required(f):
   @wraps(f)
   def decorator(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']
        if "Authorization" in request.headers:
             token = request.headers["Authorization"].split(" ")[1]
 
        if not token:
            return jsonify({'message': 'a valid token is missing'})
        try:
           data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
           # current_user = Users.query.filter_by(public_id=data['public_id']).first()
           current_user = agentManager.getUserByCusID(data["cusid"])
        except jwt.ExpiredSignatureError:
           return jsonify({'message': 'Signature expired. Please log in again.'})
        except jwt.InvalidTokenError:
           return jsonify({'message': 'Invalid token. Please log in again.'})
 
        return f(current_user, *args, **kwargs)
   return decorator

@app.route('/greet')
def greet():
    name = request.args.get('name', 'Guest')
    return f'Hello, {name}!'

# API to login with credentials and to get customer id and activation key
@app.route('/api/auth/signin', methods=['POST'])
@cross_origin(supports_credentials=True)
def signIn():
    data = request.get_json()
    auth = request.authorization
    if not auth or not data["email"] or not data["password"]: 
       return make_response('could not verify', 401, {'Authentication': 'login required"'})
    email = data["email"]
    password = data["password"]
    print(email + ':' + password)
    
    ret = agentManager.signIn(email, password)
    response = {}
    if ret["status"] == "2":
        token = jwt.encode({
            'cusid': ret["cusid"],
            'exp' : datetime.utcnow() + timedelta(minutes=30)
        }, app.config['SECRET_KEY'], "HS256")
        response = make_response(jsonify({
            'token' : token,
            'status': '2',
            "message": 'Sign In Success',
            'cusid': ret["cusid"]
            }), 201)
    else:
        response = make_response('could not verify',  401, {'Authentication': '"login required"'})
    print(response)
    return response


@app.route('/api/auth/signup', methods=['POST'])
@cross_origin(supports_credentials=True)
def signUp():
    data = request.form
  
    # gets name, email and password
    name, email = data.get('name'), data.get('email')
    password = data.get('password')
  
    # checking for existing user
    user = User.query\
        .filter_by(email = email)\
        .first()
    if not user:
        # database ORM object
        user = User(
            public_id = str(uuid.uuid4()),
            name = name,
            email = email,
            password = generate_password_hash(password)
        )
        # insert user
        db.session.add(user)
        db.session.commit()
  
        return make_response('Successfully registered.', 201)
    else:
        # returns 202 if user already exists
        return make_response('User already exists. Please Log in.', 202)

# After successful log in, returns activation keys
@app.route('/api/actkeys', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_act_keys(current_user):
    print(current_user)
    user_rowid = request.args.get('id')
    print(f'User row id: {user_rowid}')
    ret = agentManager.getActkeysByUserRowId(user_rowid)
    print(ret)
    return ret

# API to check activation with activation key and customer id
@app.route('/api/activate', methods=['POST'])
def activate():
    data = request.get_json()
    cusid = data["cusid"]
    actkey = data["actkey"]
    ret = agentManager.isActivated(cusid, actkey)
    print(ret)
    return ret

# API to submit device data(OS info, Machine Name, Third-Party applications, ...)
@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.get_json()
    # Process the submitted data
    ret = agentManager.saveAgentData(data)
        
    response = {}
    if ret:
        response["status"] = "success"
        response["msg"] = 'Data submitted successfully'
    else:
        response["status"] = "failed"
        response["msg"] = 'Data submit failed'
    return response

@app.route('/api/agents')
def get_agents():
    cusidrowid = request.args.get('cusrid')
    actkeyrowid = request.args.get('actrid')
    machines = agentManager.getAgents(actkeyrowid, cusidrowid)
    print(machines)
    return machines

@app.route('/api/device')
def get_machine():
    agentid = request.args.get('id')
    installed_apps = agentManager.getAgentApps(agentid)
    return installed_apps

@app.errorhandler(403)
def forbidden(e):
    return jsonify({
        "message": "Forbidden",
        "error": str(e),
        "data": None
    }), 403

@app.errorhandler(404)
def forbidden(e):
    return jsonify({
        "message": "Endpoint Not Found",
        "error": str(e),
        "data": None
    }), 404

if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)