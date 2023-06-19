import mysql.connector
from datetime import datetime
import uuid
import secrets
import random
import string

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'testdb',
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}

class AgentManage():
    def __init__(self, db_host, db_port, db_user, db_pass, db_name):
        self.db_host = db_host
        self.db_port = db_port
        self.db_user = db_user
        self.db_pass = db_pass
        self.db_name = db_name
        
        self.my_db = mysql.connector.connect(
            host=self.db_host,
            user=self.db_user,
            port=self.db_port,
            passwd=self.db_pass,
            database=self.db_name
        )
        self.my_cursor = self.my_db.cursor()
        
    def getUserByID(self, id):
        query = f"SELECT * FROM tbl_users WHERE id = {id};"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        if ds == None or len(ds) == 0:
            return None
        else:
            return {
                "id": ds[0][0],
                "email": ds[0][1],
                "password": ds[0][2],
                "cusid": ds[0][3],
                "created_at": ds[0][4],
                "updated_at": ds[0][5],
                "name": ds[0][6],
                "role": ds[0][7]
            }
        
    def getUserByEmail(self, email):
        query = f"SELECT * FROM tbl_users WHERE email = '{email}';"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        if ds == None or len(ds) == 0:
            return None
        else:
            return {
                "id": ds[0][0],
                "email": ds[0][1],
                "password": ds[0][2],
                "cusid": ds[0][3],
                "created_at": ds[0][4],
                "updated_at": ds[0][5],
                "name": ds[0][6],
                "role": ds[0][7]
            }
    
    def addUser(self, email, password, name, role, company_id):
        action_at = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
        query = f"INSERT INTO tbl_users (email, password, cusid, created_at, updated_at, name, role) " + \
            f"VALUES ('{email}', '{password}', {company_id}, '{action_at}', '{action_at}', '{name}', {role});"
        self.my_cursor.execute(query)
        self.my_db.commit()

    # checked
    # register company and its domain
    def register_domain(self, name, domain, customerid):
        sel_query = f"SELECT * FROM tbl_companies WHERE `name` = '{name}' OR `domain` = '{domain}' OR `customerid` = '{customerid}';"
        self.my_cursor.execute(sel_query)
        ds = self.my_cursor.fetchall()
        action_at = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
        if ds != None and len(ds) > 0:
            return {
                "id": ds[0][0],
                "name": ds[0][1],
                "domain": ds[0][2],
                "customerid": ds[0][3],
                "created_at": ds[0][4],
                "updated_at": ds[0][5],
                "is_success": False
            }
        else:
            query = f"INSERT INTO tbl_companies (`name`, `domain`, `customerid`, `created_at`, `updated_at`) " + \
                f"VALUES ('{name}', '{domain}', '{customerid}', '{action_at}', '{action_at}');"
            self.my_cursor.execute(query)
            self.my_db.commit()
            
            self.my_cursor.execute(sel_query)
            ds = self.my_cursor.fetchall()
            return {
                "id": ds[0][0],
                "name": ds[0][1],
                "domain": ds[0][2],
                "customerid": ds[0][3],
                "created_at": ds[0][4],
                "updated_at": ds[0][5],
                "is_success": True
            }
            
    # checked
    # update domain
    def update_domain(self, id, name, domain, customerid):
        try:
            action_at = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
            update_query = f"UPDATE `tbl_companies` SET `name` = '{name}', `domain` = '{domain}', " +\
                f"`customerid` = '{customerid}', `updated_at` = '{action_at}' " + \
                f"WHERE `id` = {id};"
            self.my_cursor.execute(update_query)
            self.my_db.commit()
            return True
        except Exception as ee:
            print(ee)
            return False
    
    # get company from domain
    def get_company_by_domain(self, domain):
        sel_query = f"SELECT * FROM tbl_companies WHERE `domain` = '{domain}';"
        self.my_cursor.execute(sel_query)
        ds = self.my_cursor.fetchall()
        if ds != None and len(ds) > 0:
            return {
                "id": ds[0][0],
                "name": ds[0][1],
                "domain": ds[0][2],
                "customerid": ds[0][3],
                "created_at": ds[0][4],
                "updated_at": ds[0][5],
            }
        else:
            return None
        
    # checked
    # get all domains
    def get_all_companies(self):
        sel_query = f"SELECT * FROM tbl_companies;"
        self.my_cursor.execute(sel_query)
        ds = self.my_cursor.fetchall()
        ret = []
        if ds != None and len(ds) > 0:
            for row in ds:
                ret.append({
                    "id": row[0],
                    "name": row[1],
                    "domain": row[2],
                    "customerid": row[3],
                    "created_at": row[4],
                    "updated_at": row[5],
                })
        return ret
    
    # generate unique customer id
    def generate_customer_id(self):
        # new_cusid = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
        # customer_id = str(uuid.uuid1())
        new_cusid = ''.join(random.choices(string.digits, k=16))
        total_retry = 0
        while True:
            query = f"SELECT * FROM tbl_companies WHERE `customerid` = '{new_cusid}';"
            self.my_cursor.execute(query)
            ds = self.my_cursor.fetchall()
            if ds != None and len(ds) > 0:
                total_retry += 1
                if total_retry > 10000:
                    return ''
                new_cusid = ''.join(random.choices(string.digits, k=16))
                continue
            else:
                break
        return new_cusid
    
    def editUserByID(self, userrid, name):
        try:
            action_at = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
            update_query = f"UPDATE `tbl_users` SET `name` = '{name}', `updated_at` = '{action_at}' " + \
                f"WHERE `id` = {userrid};"
            self.my_cursor.execute(update_query)
            self.my_db.commit()
            return True
        except Exception as ee:
            print(ee)
            return False
    
    # checked
    # get All users by company id
    def getUsersByDomainRid(self, company_id):
        # query = f"SELECT * FROM tbl_users WHERE `role` = 0 AND `cusid` = {company_id};"
        query = f"SELECT * FROM tbl_users WHERE `cusid` = {company_id};"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        ret = []
        if ds != None and len(ds) > 0:
            for row in ds:
                ret.append({
                    "id": row[0],
                    "email": row[1],
                    "password": row[2],
                    "cusid": row[3],
                    "created_at": row[4],
                    "updated_at": row[5],
                    "name": row[6],
                    "role": row[7]
                })
        return ret
    
    # checked
    def signIn(self, email, password):
        query = f"SELECT tbl_users.id, tbl_users.cusid, tbl_users.role, " +\
            f"tbl_companies.name, tbl_companies.customerid FROM tbl_users " +\
            f"LEFT JOIN tbl_companies " +\
            f"ON tbl_companies.id = tbl_users.cusid " +\
            f"WHERE tbl_users.email = '{email}' AND tbl_users.password = '{password}';"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        ret = {}
        if ds == None or len(ds) == 0:
            ret["cusid"] = ""
            ret["status"] = "0"
            ret["companyname"] = ""
            ret["customerid"] = ""
            ret["message"] = "Invalid credential."
            ret["role"] = 0
        else:
            ret["id"] = ds[0][0]
            ret["cusid"] = ds[0][1]
            ret["role"] = ds[0][2]
            ret["companyname"] = str(ds[0][3])
            ret["customerid"] = str(ds[0][4])
            ret["status"] = "2"
            ret["message"] = "Sign In Success"
        return ret

    # checked
    # get All Activation Keys by cusid
    def getActkeysByCusId(self, cusid):
        query = f"SELECT tbl_actkeys.*, COUNT(tbl_agents.id) as actkeycount FROM tbl_actkeys LEFT JOIN tbl_agents ON tbl_actkeys.id = tbl_agents.actkeyid WHERE tbl_actkeys.cusid = {cusid} GROUP BY tbl_actkeys.id;"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        ret = []
        if ds != None and len(ds) > 0:
            for row in ds:
                ret.append({
                    "id": row[0],
                    "title": row[6],
                    "actkey" : row[2],
                    "created" : row[4],
                    "status" : row[3],                 # enabled 2, disabled 1, deleted 0
                    "agents": row[8],
                    "created_by": row[7]
                })
        return ret

    # checked
    # get Activation Key by Row ID
    def getActkeyByRowId(self, rowid):
        query = f"SELECT tbl_actkeys.*, tbl_companies.customerid FROM tbl_actkeys " +\
            f"LEFT JOIN tbl_companies ON tbl_companies.id = tbl_actkeys.cusid WHERE tbl_actkeys.id = {rowid};"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        if ds != None and len(ds) > 0:
            return {
                "id": ds[0][0],
                "cusid": ds[0][1],
                "actkey": ds[0][2],
                "status": ds[0][3],
                "created_at": ds[0][4],
                "updated_at": ds[0][5],
                "title": ds[0][6],
                "created_by": ds[0][7],
                "customerid": ds[0][8]
            }
        else:
            return None

    # edit the status of Activation Key with Row ID    
    def editActkeyStatus(self, rowid, status):
        try:
            action_at = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
            update_query = f"UPDATE `tbl_actkeys` SET `status` = {status}, `updated_at` = '{action_at}' " + \
                f"WHERE `id` = {rowid};"
            self.my_cursor.execute(update_query)
            self.my_db.commit()
            return True
        except Exception as ee:
            print(ee)
            return False
        
    def addNewActkey(self, userid, title, cusid):
        try:
            action_at = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
            # actkey = secrets.token_hex(16)
            actkey = str(uuid.uuid4())
            query = f"INSERT INTO tbl_actkeys (cusid, actkey, status, created_at, updated_at, title, created_by) " + \
                f"VALUES ({cusid}, '{actkey}', 2, '{action_at}', '{action_at}', '{title}', {userid});"
            self.my_cursor.execute(query)
            self.my_db.commit()
            return True
        except Exception as ee:
            print(ee)
            return False

    # checked
    def isActivated(self, customerid, actkey):
        query = f"SELECT tbl_companies.*, tbl_actkeys.actkey FROM tbl_companies LEFT JOIN tbl_actkeys " + \
            f"ON tbl_actkeys.cusid = tbl_companies.id WHERE tbl_companies.customerid = '{customerid}' " + \
            f"AND tbl_actkeys.actkey = '{actkey}';"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        if ds != None and len(ds) > 0:
            return "2"
        else:
            query = f"SELECT tbl_companies.*, tbl_actkeys.actkey FROM tbl_companies LEFT JOIN tbl_actkeys " + \
                f"ON tbl_actkeys.cusid = tbl_companies.id WHERE tbl_companies.customerid = '{customerid}' " + \
                f"AND tbl_actkeys.actkey != '{actkey}';"
            self.my_cursor.execute(query)
            ds = self.my_cursor.fetchall()
            if ds != None and len(ds) > 0:
                return "1"
            else:
                return "0"
    
    # Store data of agent to db
    def saveAgentData(self, data):
        actkey = data["auth"]["actkey"]
        cusid = data["auth"]["cusid"]
        # After login, this function is executed, so do not need to check validation of actkey and cusid
        actkeyrid_sel_query = f"SELECT id FROM tbl_actkeys WHERE actkey = '{actkey}';"
        self.my_cursor.execute(actkeyrid_sel_query)
        ds = self.my_cursor.fetchall()
        if ds == None or len(ds) == 0:
            return False
        actkeyrid = ds[0][0]
        
        os = data["osInfo"]
        version = data["version"]
        host = data["machineName"]
        installedApps = data["installedApps"]
        action_at = datetime.now().strftime("%m/%d/%Y %H:%M")
        # check if the host is already existed
        query = f"SELECT * FROM tbl_agents WHERE `host` = '{host}' AND `actkeyid` = {actkeyrid};"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        if ds == None or len(ds) == 0:
            # host is no existed, so it has to be added
            insert_query = f"INSERT INTO tbl_agents (actkeyid, host, os, version, created_at, updated_at) " + \
                f"VALUES ({actkeyrid}, '{host}', '{os}', '{version}', '{action_at}', '{action_at}');"
            self.my_cursor.execute(insert_query)
            self.my_db.commit()
            query = f"SELECT * FROM tbl_agents WHERE `host` = '{host}' AND `actkeyid` = {actkeyrid};"
            self.my_cursor.execute(query)
            ds = self.my_cursor.fetchall()
        # get agent row id with actkeyid and host
        agentrid = ds[0][0]
        # update the os and version with actkeyid and host
        update_query = f"UPDATE `tbl_agents` SET `os` = '{os}', `version` = '{version}' " + \
            f"WHERE `host` = '{host}' AND `actkeyid` = {actkeyrid};"
        self.my_cursor.execute(update_query)
        self.my_db.commit()
        # delete all apps to update with new list with agent row id
        delete_query = f"DELETE FROM tbl_installedapps WHERE `agentid` = {agentrid}"
        self.my_cursor.execute(delete_query)
        self.my_db.commit()
        # add the installed apps to tbl_installedapps
        if installedApps != None and len(installedApps) > 0:
            query = f"INSERT INTO tbl_installedapps (name, version, agentid) VALUES "
            first_line = True
            for installed_app in installedApps:
                name = installed_app["displayName"]
                version = installed_app["displayVersion"]
                sub_query = f"('{name}', '{version}', '{agentrid}')"
                if first_line == False:
                    query = query + ', '
                query = query + sub_query
                first_line = False
            query += ';'
            self.my_cursor.execute(query)
            self.my_db.commit()
        return True
    
    def getAgents(self, actkeyrowid):
        # query = f"SELECT tbl_agents.* FROM tbl_agents LEFT JOIN tbl_actkeys " + \
        #     f"ON tbl_agents.actkeyid = tbl_actkeys.id LEFT JOIN tbl_users ON tbl_users.id = tbl_actkeys.userid " + \
        #     f"WHERE tbl_actkeys.id = {actkeyrowid} AND tbl_users.id = {cusrowid};"
        query = f"SELECT * FROM tbl_agents " + \
            f"WHERE actkeyid = {actkeyrowid};"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        ret = []
        if ds != None and len(ds) > 0:
            for row in ds:
                ret.append({
                    "id": row[0],
                    "os_info": row[3],
                    "com_name": row[2],
                    "version": row[4],
                    "updated_at": row[6]
                })
        return ret
    
    # By Row ID, get the Agent from database
    def getAgentByID(self, rowid):
        query = f"SELECT * FROM tbl_agents WHERE id = {rowid};"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        ret = []
        if ds != None and len(ds) > 0:
            return ds[0]
        else:
            return None
    
    def getAgentApps(self, agentid):
        query = f"SELECT * FROM `tbl_installedapps` WHERE agentid = {agentid};"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        ret = []
        if ds != None and len(ds) > 0:
            for row in ds:
                ret.append({
                    "name": row[2],
                    "version": row[3],
                })
        return ret
    
    # Get all Applications installed at the all Agents that has the indicated Activation Key
    def getActkeyAllApps(self, actkey_rid):
        query = f"SELECT id FROM `tbl_agents` WHERE actkeyid = {actkey_rid};"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        ret = []
        where_ids = ''
        if ds != None and len(ds) > 0:
            for row in ds:
                where_ids += f"agentid = {row[0]} OR "
            where_ids = where_ids[:len(where_ids) - 4]
        if where_ids == '':
            return ret
        query = f"SELECT * FROM `tbl_installedapps` WHERE {where_ids};"
        self.my_cursor.execute(query)
        ds1 = self.my_cursor.fetchall()
        if ds1 != None and len(ds1) > 0:
            for row in ds1:
                ret.append({
                    "name": row[2],
                    "version": row[3],
                })
        return ret
        