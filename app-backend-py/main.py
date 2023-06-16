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
from Model.User import User

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
            print(request.headers['x-access-tokens'])
            token = request.headers['x-access-tokens']
        elif "Authorization" in request.headers:
            print(request.headers["Authorization"])
            # token = request.headers["Authorization"].split(" ")[1]
            token = request.headers["Authorization"]
 
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
    # auth = request.authorization
    # if not auth or not data["email"] or not data["password"]: 
    if not data["email"] or not data["password"]: 
       return make_response('could not verify', 401, {'Authentication': 'login required"'})
    email = data["email"]
    password = data["password"]
    print(email + ':' + password)
    
    ret = agentManager.signIn(email, password)
    response = {}
    if ret["status"] == "2":
        token = jwt.encode({
            'id': ret["id"],
            'cusid': ret["cusid"],
            'role': ret["role"],
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

# register user
@app.route('/api/auth/signup', methods=['POST'])
@cross_origin(supports_credentials=True)
def signUp():
    # data = request.form  
    # email = data.get('email')
    # password = data.get('password')
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    password = data["password"]
    role = 0
    # checking for existing user
    # user = User.query\
    #     .filter_by(email = email)\
    #     .first()
    user = agentManager.getUserByEmail(email)
    if not user:
        # database ORM object
        # user = User(
        #     public_id = str(uuid.uuid4()),
        #     name = name,
        #     email = email,
        #     password = generate_password_hash(password)
        # )
        # db.session.add(user)
        # db.session.commit()
        agentManager.addUser(email, password, name, role)
        user = agentManager.getUserByEmail(email)
        return make_response('Successfully registered.', 201)
    else:
        # returns 202 if user already exists
        return make_response('User already exists. Please Log in.', 202)

#get users with a admin role
@app.route('/api/users', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def getUsers(current_user):
    if current_user["role"] != 1 and current_user["role"] != "1":
        response = {
            "message": "You have not an admin privilege.",
            "status": False
        }
        return response
    users = agentManager.getUsers()
    return users

#edit user with a admin role
@app.route('/api/user', methods=['PUT'])
@token_required
@cross_origin(supports_credentials=True)
def editUser(current_user):
    if current_user["role"] != 1 and current_user["role"] != "1":
        response = {
            "message": "You have not an admin privilege.",
            "status": False
        }
        return response
    data = request.get_json()
    name = data["name"]
    userrid = data["id"]
    ret = agentManager.editUserByID(userrid, name)
    if ret == False:
        return {
            "message": "Edit user failed.",
            "status": False
        }
    users = agentManager.getUsers()
    return users
    
# After successful log in, returns activation keys
# param id means the user row id
@app.route('/api/actkeys', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_act_keys(current_user):
    print(current_user)
    user_rowid = current_user["id"]
    ret = agentManager.getActkeysByUserRowId(user_rowid)
    print(ret)
    return ret

# By Row ID, get the Activation Key(actkey)
@app.route('/api/actkey', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_act_key_by_id(current_user):
    print(current_user)
    actkey_rid = request.args.get('id')
    ret = agentManager.getActkeyByRowId(actkey_rid)
    print(ret)
    return ret

# By Row ID, change the status of Activation Key
@app.route('/api/actkey', methods=['PUT'])
@token_required
@cross_origin(supports_credentials=True)
def editActkey(current_user):
    print(current_user)
    data = request.get_json()
    status = data["status"]
    actkey_rid = data["id"]

    ret = agentManager.editActkeyStatus(actkey_rid, status)
    if ret == False:
        return {
            "message": "Edit Activation Key failed.",
            "status": False
        }
    user_rowid = current_user["id"]
    actkeys = agentManager.getActkeysByUserRowId(user_rowid)
    return actkeys

# By Row ID, get the Activation Key(actkey)
@app.route('/api/guide', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_guide(current_user):
    print(current_user)
    actkey_rid = request.args.get('id')
    ret = agentManager.getActkeyByRowId(actkey_rid)
    response = {
        "cusid": current_user["cusid"],
        "actkey": ret["actkey"]
    }
    print(response)
    return response

@app.route('/api/newactkey', methods=['POST'])
@token_required
@cross_origin(supports_credentials=True)
def create_act_key(current_user):
    # data = request.form
    # title = data.get('title')
    data = request.get_json()
    title = data["title"]
    agentManager.addNewActkey(current_user["id"], title)
    ret = agentManager.getActkeysByUserRowId(current_user["id"])
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
    print(data)
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

@app.route('/api/agents', methods=['POST'])
@token_required
def get_agents(current_user):
    # cusidrowid = request.args.get('cusrid')
    # actkeyrowid = request.args.get('actrid')
    data = request.get_json()
    actkeyrowid = data['actrid']
    # machines = agentManager.getAgents(actkeyrowid, cusidrowid)
    machines = agentManager.getAgents(actkeyrowid)
    print(machines)
    return machines

# By Row ID, get the Agent
@app.route('/api/agent', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_agent_by_id(current_user):
    rid = request.args.get('id')
    ret = agentManager.getAgentByID(rid)
    print(ret)
    return ret

@app.route('/api/device', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_machine(current_user):
    agentid = request.args.get('id')
    installed_apps = agentManager.getAgentApps(agentid)
    return installed_apps

@app.route('/api/allapps', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_all_apps_by_actkey(current_user):
    actkey_rid = request.args.get('id')
    all_apps = agentManager.getActkeyAllApps(actkey_rid)
    return all_apps

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
    app.run(host="192.168.8.171", port=5000, debug=True)