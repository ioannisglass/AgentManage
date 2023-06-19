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
import os

SECRET_KEY = "155912E@!FAs"

agentManager = AgentManage(
    "localhost",
    3306,
    "root",
    "",
    "systemagent"
)
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
# ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
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
           current_user = agentManager.getUserByID(data["id"])
        except jwt.ExpiredSignatureError:
           return jsonify({'message': 'Signature expired. Please log in again.'})
        except jwt.InvalidTokenError:
           return jsonify({'message': 'Invalid token. Please log in again.'})
 
        return f(current_user, *args, **kwargs)
   return decorator

# @app.route('/', methods=['GET', 'POST'])
# def upload_file():
    # if request.method == 'POST':
    #     # check if the post request has the file part
    #     if 'file' not in request.files:
    #         flash('No file part')
    #         return redirect(request.url)
    #     file = request.files['file']
    #     # If the user does not select a file, the browser submits an
    #     # empty file without a filename.
    #     if file.filename == '':
    #         flash('No selected file')
    #         return redirect(request.url)
    #     if file and allowed_file(file.filename):
    #         filename = secure_filename(file.filename)
    #         file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    #         return redirect(url_for('download_file', name=filename))

@app.route('/greet')
def greet():
    name = request.args.get('name', 'Guest')
    return f'Hello, {name}!'

# checked
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
            'customerid': ret["customerid"],
            'role': ret["role"],
            'exp' : datetime.utcnow() + timedelta(minutes=30)
        }, app.config['SECRET_KEY'], "HS256")
        response = make_response(jsonify({
            'token' : token,
            'status': '2',
            "message": 'Sign In Success',
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
        domain = email.split('@')[1]
        company = agentManager.get_company_by_domain(domain)
        if company == None:
            return {
                "message": "Your company is not registered. Contact support.",
                "is_success": False
            }
        agentManager.addUser(email, password, name, role, company["id"])
        user = agentManager.getUserByEmail(email)
        return user
    else:
        # returns 202 if user already exists
        return make_response('User already exists. Please Log in.', 202)

# checked
#register domain and its company
@app.route('/api/domain', methods=['POST'])
@token_required
@cross_origin(supports_credentials=True)
def register_domain(current_user):
    if current_user["role"] != 1 and current_user["role"] != "1":
        response = {
            "message": "You have not an admin privilege.",
            "status": False
        }
        return response
    data = request.get_json()
    name = data["name"]
    domain = data["domain"]
    customerid = data["customerid"]
    company = agentManager.register_domain(name, domain, customerid)
    companies = agentManager.get_all_companies()
    if company["is_success"] == False:
        return {
            "is_success": False,
            "message": "Register failed.",
            "domains": companies  
        }
    else:
        return {
            "is_success": True,
            "message": "Registered successfully.",
            "domains": companies
        }

# checked
#register domain and its company
@app.route('/api/domain', methods=['PUT'])
@token_required
@cross_origin(supports_credentials=True)
def update_domain(current_user):
    if current_user["role"] != 1 and current_user["role"] != "1":
        response = {
            "message": "You have not an admin privilege.",
            "status": False
        }
        return response
    data = request.get_json()
    id = data["id"]
    name = data["name"]
    domain = data["domain"]
    customerid = data["customerid"]
    ret = agentManager.update_domain(id, name, domain, customerid)
    if ret == False:
        response = {
            "message": "Update domain failed.",
            "is_success": False
        }
        return response
    else:
        companies = agentManager.get_all_companies()
        return companies
    
#get company from domain
@app.route('/api/domain', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_company_by_domain(current_user):
    if current_user["role"] != 1 and current_user["role"] != "1":
        response = {
            "message": "You have not an admin privilege.",
            "status": False
        }
        return response
    data = request.get_json()
    domain = data["domain"]
    company = agentManager.get_company_by_domain(domain)
    return company      # can be None

# checked
#get company from domain
@app.route('/api/domains', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_all_domains(current_user):
    if current_user["role"] != 1 and current_user["role"] != "1":
        response = {
            "message": "You have not an admin privilege.",
            "is_success": False
        }
        return response
    companies = agentManager.get_all_companies()
    return companies

# checked
#get users with a admin role
@app.route('/api/users', methods=['GET'])
@token_required
# @cross_origin(supports_credentials=True)
def getUsers(current_user):
    if current_user["role"] != 1 and current_user["role"] != "1":
        response = {
            "message": "You have not an admin privilege.",
            "is_success": False
        }
        return response
    company_id = request.args.get('id')
    users = agentManager.getUsersByDomainRid(company_id)
    return users

#edit user with a admin role
@app.route('/api/user', methods=['PUT'])
@token_required
@cross_origin(supports_credentials=True)
def editUser(current_user):
    if current_user["role"] != 1 and current_user["role"] != "1":
        response = {
            "message": "You have not an admin privilege.",
            "is_success": False
        }
        return response
    data = request.get_json()
    name = data["name"]
    userrid = data["id"]
    companyrid = data["did"]
    ret = agentManager.editUserByID(userrid, name)
    if ret == False:
        return {
            "message": "Edit user failed.",
            "is_success": False
        }
    users = agentManager.getUsersByDomainRid(companyrid)
    return users
    
# After successful log in, returns activation keys
# param id means the user row id
@app.route('/api/actkeys', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_act_keys(current_user):
    user_cusid = current_user["cusid"]
    ret = agentManager.getActkeysByCusId(user_cusid)
    print(ret)
    return ret

# By Row ID, get the Activation Key(actkey)
@app.route('/api/actkey', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_act_key_by_id(current_user):
    actkey_rid = request.args.get('id')
    ret = agentManager.getActkeyByRowId(actkey_rid)
    print(ret)
    return ret

# checked
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
            "is_success": False
        }
    cusid = current_user["cusid"]
    actkeys = agentManager.getActkeysByCusId(cusid)
    return actkeys

# checked
# By Row ID, delete Activation Key(Set the status 0)
@app.route('/api/actkey', methods=['DELETE'])
@token_required
@cross_origin(supports_credentials=True)
def deleteActkey(current_user):
    actkey_rid = request.args.get('id')

    ret = agentManager.editActkeyStatus(actkey_rid, 0)
    if ret == False:
        return {
            "message": "Edit Activation Key failed.",
            "is_success": False
        }
    cusid = current_user["cusid"]
    actkeys = agentManager.getActkeysByCusId(cusid)
    return actkeys

# By Row ID, get the Activation Key(actkey)
@app.route('/api/guide', methods=['GET'])
@token_required
@cross_origin(supports_credentials=True)
def get_guide(current_user):
    actkey_rid = request.args.get('id')
    ret = agentManager.getActkeyByRowId(actkey_rid)
    response = {
        "cusid": current_user["cusid"],
        "customerid": current_user["customerid"],
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
    cusid = current_user["cusid"]
    data = request.get_json()
    title = data["title"]
    agentManager.addNewActkey(current_user["id"], title, cusid)
    ret = agentManager.getActkeysByCusId(cusid)
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