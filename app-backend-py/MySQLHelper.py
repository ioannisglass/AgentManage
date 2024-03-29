import mysql.connector
from datetime import datetime
import uuid
import secrets
import random
import string
import json

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
        
    # there is timeout, so before function calling, this function has to be called first
    def connectToDB(self):
        self.my_db = mysql.connector.connect(
            host=self.db_host,
            user=self.db_user,
            port=self.db_port,
            passwd=self.db_pass,
            database=self.db_name
        )
        self.my_cursor = self.my_db.cursor()
    
    def getUserByID(self, id):
        self.connectToDB()
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
        self.connectToDB()
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
        self.connectToDB()
        action_at = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
        query = f"INSERT INTO tbl_users (email, password, cusid, created_at, updated_at, name, role) " + \
            f"VALUES ('{email}', '{password}', {company_id}, '{action_at}', '{action_at}', '{name}', {role});"
        self.my_cursor.execute(query)
        self.my_db.commit()

    # checked
    # register company and its domain
    def register_domain(self, name, domain):
        self.connectToDB()
        sel_query = f"SELECT * FROM tbl_companies WHERE `name` = '{name}' OR `domain` = '{domain}';"
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
            customerid = self.generate_customer_id()
            if customerid == '':
                return None
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
    def update_domain(self, id, name, domain):
        self.connectToDB()
        try:
            action_at = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
            update_query = f"UPDATE `tbl_companies` SET `name` = '{name}', `domain` = '{domain}', " +\
                f"`updated_at` = '{action_at}' " + \
                f"WHERE `id` = {id};"
            self.my_cursor.execute(update_query)
            self.my_db.commit()
            return True
        except Exception as ee:
            print(ee)
            return False
    
    # get company from domain
    def get_company_by_domain(self, domain):
        self.connectToDB()
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
        self.connectToDB()
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

    # checked
    # generate unique customer id
    def generate_customer_id(self):
        self.connectToDB()
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
            self.connectToDB()
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
        self.connectToDB()
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
        self.connectToDB()
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
        self.connectToDB()
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
                    "updated_at": row[5],
                    "status" : row[3],                 # enabled 2, disabled 1, deleted 0
                    "agents": row[8],
                    "created_by": row[7]
                })
        return ret

    # checked
    # get Activation Key by Row ID
    def getActkeyByRowId(self, rowid):
        self.connectToDB()
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
            self.connectToDB()
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
            self.connectToDB()
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
        self.connectToDB()
        query = f"SELECT tbl_companies.*, tbl_actkeys.actkey FROM tbl_companies LEFT JOIN tbl_actkeys " + \
            f"ON tbl_actkeys.cusid = tbl_companies.id WHERE tbl_companies.customerid = '{customerid}' " + \
            f"AND tbl_actkeys.actkey = '{actkey}' AND tbl_actkeys.status = 2;"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        if ds != None and len(ds) > 0:
            return "2"
        else:
            sel_cus_query = f"SELECT * FROM `tbl_companies` WHERE `customerid` = '{customerid}';"
            self.my_cursor.execute(sel_cus_query)
            ds_cus = self.my_cursor.fetchall()
            sel_actkey_query = f"SELECT * FROM `tbl_actkeys` WHERE `actkey` = '{actkey}';"
            self.my_cursor.execute(sel_actkey_query)
            ds_actkey = self.my_cursor.fetchall()
            if ds_cus != None and len(ds_cus) > 0 or ds_actkey != None and len(ds_actkey) > 0:
                return "1"
            else:
                return "0"
    
    # Store data of agent to db
    def saveAgentData(self, data):
        self.connectToDB()
        actkey = data["auth"]["actkey"]
        customerid = data["auth"]["customerid"]
        # After login, this function is executed, so do not need to check validation of actkey and cusid
        actkeyrid_sel_query = f"SELECT id FROM tbl_actkeys WHERE actkey = '{actkey}';"
        self.my_cursor.execute(actkeyrid_sel_query)
        ds = self.my_cursor.fetchall()
        if ds == None or len(ds) == 0:
            return False
        actkeyrid = ds[0][0]
        
        action_at = datetime.now().strftime("%m/%d/%Y %H:%M")
        update_actkey_query = f"UPDATE `tbl_actkeys` SET `updated_at` = '{action_at}' " + \
            f"WHERE `id` = {actkeyrid};"
        self.my_cursor.execute(update_actkey_query)
        self.my_db.commit()
        
        os = data["osInfo"]
        version = data["version"]
        host = data["machineName"]
        installedApps = data["installedApps"]
        json_apps = json.dumps(installedApps)
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
        update_query = f"UPDATE `tbl_agents` SET `os` = '{os}', `version` = '{version}', `updated_at` = '{action_at}' " + \
            f"WHERE `host` = '{host}' AND `actkeyid` = {actkeyrid};"
        self.my_cursor.execute(update_query)
        self.my_db.commit()
        # delete all apps to update with new list with agent row id
        select_apps_query = f"SELECT * FROM tbl_installedapps WHERE `agentid` = {agentrid};"
        self.my_cursor.execute(select_apps_query)
        ds_apps = self.my_cursor.fetchall()
        if ds_apps == None or len(ds_apps) == 0:
            ins_apps_query = f"INSERT INTO `tbl_installedapps` (agentid, apps, created_at, updated_at, uninstall) VALUES " + \
                f"({agentrid}, '{json_apps}', '{action_at}', '{action_at}', '');"
            self.my_cursor.execute(ins_apps_query)
            self.my_db.commit()
        else:
            upd_apps_query = f"UPDATE `tbl_installedapps` SET `apps` = '{json_apps}', `updated_at` ='{action_at}', `uninstall` = '' " + \
                f"WHERE `agentid` = {agentrid};"
            self.my_cursor.execute(upd_apps_query)
            self.my_db.commit()
        return True

    # checked
    # Delete Activation Key by its Row ID
    def deleteActkeyByID(self, actkeyrid):
        self.connectToDB()
        delete_query = f"DELETE FROM tbl_actkeys WHERE id = {actkeyrid};"
        self.my_cursor.execute(delete_query)
        self.my_db.commit()
        # select all agents that has this activation key
        sel_agents_query = f"SELECT * FROM tbl_agents WHERE `actkeyid` = {actkeyrid};"
        self.my_cursor.execute(sel_agents_query)
        ds = self.my_cursor.fetchall()
        where_ids = ''
        if ds != None and len(ds) > 0:
            for row in ds:
                where_ids += f"agentid = {row[0]} OR "
            where_ids = where_ids[:len(where_ids) - 4]
        if where_ids != '':
            del_apps_query = f"DELETE FROM `tbl_installedapps` WHERE {where_ids};"
            self.my_cursor.execute(del_apps_query)
            self.my_db.commit()
        
        del_agents_query = f"DELETE FROM tbl_agents WHERE `actkeyid` = {actkeyrid};"
        self.my_cursor.execute(del_agents_query)
        self.my_db.commit()
    
    def getAgents(self, actkeyrowid):
        self.connectToDB()
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
        self.connectToDB()
        query = f"SELECT * FROM tbl_agents WHERE id = {rowid};"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        ret = []
        if ds != None and len(ds) > 0:
            return ds[0]
        else:
            return None
    
    def getAgentApps(self, agentid):
        self.connectToDB()
        query = f"SELECT * FROM `tbl_installedapps` WHERE agentid = {agentid};"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        ret = []
        if ds != None and len(ds) > 0:
            ret = json.loads(ds[0][2])
        return ret
    
    # Get all Applications installed at the all Agents that has the indicated Activation Key
    def getActkeyAllApps(self, actkey_rid):
        self.connectToDB()
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
        if ds1 == None or len(ds1) == 0:
            return ret
        
        dict = {}
        for row in ds1:
            apps = json.loads(row[2])
            for app in apps:
                key = f"{app['name']}_{app['ver']}"
                if not key in dict:
                    dict[key] = app
        return list(dict.values())
    
    def getAgentsToUninstall(self, actkey_rid, app):
        self.connectToDB()
        query = f"SELECT `tbl_installedapps`.`agentid`, `tbl_agents`.`host` FROM `tbl_installedapps` LEFT JOIN `tbl_agents` ON " + \
            f"`tbl_agents`.`id` = `tbl_installedapps`.`agentid` " + \
            f"WHERE `tbl_agents`.`actkeyid` = {actkey_rid} AND " + \
            f"`tbl_installedapps`.`apps` LIKE '%\"name\": \"{app}\",%';"
        ret = []
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        if ds == None or len(ds) == 0:
            return ret
        for row in ds:
            ret.append({
                "id": row[0],
                "host": row[1]
            })
        return ret
    
    def addAppsToUninstall(self, hosts, app, ver):
        self.connectToDB()
        if hosts == None or len(hosts) == 0:
            return
        for host in hosts:
            query = f"SELECT `tbl_installedapps`.`uninstall` FROM `tbl_installedapps` " + \
                f"LEFT JOIN `tbl_agents` ON `tbl_agents`.`id` = `tbl_installedapps`.`agentid` " + \
                f"WHERE `tbl_agents`.`host` = '{host}';"
            self.my_cursor.execute(query)
            ds = self.my_cursor.fetchall()
            apps = []
            if ds != None and len(ds) > 0:
                if ds[0][0] != None and ds[0][0] != '':
                    apps = json.loads(ds[0][0])
            apps.append(f'{app}_{ver}')
            json_apps = json.dumps(apps)
            update_query = f"UPDATE `tbl_installedapps` " + \
                f"LEFT JOIN `tbl_agents` ON `tbl_agents`.`id` = `tbl_installedapps`.`agentid` " + \
                f"SET `tbl_installedapps`.`uninstall` = '{json_apps}' " + \
                f"WHERE `tbl_agents`.`host` = '{host}';"
            self.my_cursor.execute(update_query)
            self.my_db.commit()
            
    def getAppsToUninstall(self, host):
        self.connectToDB()
        apps = []
        if host == None or host == '':
            return apps
        query = f"SELECT `tbl_installedapps`.`uninstall` FROM `tbl_installedapps` " + \
                f"LEFT JOIN `tbl_agents` ON `tbl_agents`.`id` = `tbl_installedapps`.`agentid` " + \
                f"WHERE `tbl_agents`.`host` = '{host}';"
        self.my_cursor.execute(query)
        ds = self.my_cursor.fetchall()
        apps = []
        if ds != None and len(ds) > 0:
            if ds[0][0] != None and ds[0][0] != '':
                apps = json.loads(ds[0][0])
        # after returning the apps to uninstall, the field is cleaned
        update_query = f"UPDATE `tbl_installedapps` " + \
            f"LEFT JOIN `tbl_agents` ON `tbl_agents`.`id` = `tbl_installedapps`.`agentid` " + \
            f"SET `tbl_installedapps`.`uninstall` = '' " + \
            f"WHERE `tbl_agents`.`host` = '{host}';"
        self.my_cursor.execute(update_query)
        self.my_db.commit()
        return apps