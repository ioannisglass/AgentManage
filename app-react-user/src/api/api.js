import axios from "axios";
// require('dotenv').config()
axios.defaults.baseURL = 'https://api.vulnagent.com';
// axios.defaults.baseURL = 'http://192.168.8.171:5000';
// axios.defaults.baseURL = process.env.REACT_APP_BASE_API_URL;

export default {
    registerUser: function (userData) {
        return axios.post("/api/auth/signup", userData);
    },
    loginUser: function (userData) {
        return axios.post("/api/auth/signin", userData);
    },
    getUserList: function (cusid) {
        return axios.get(`/api/users?id=${cusid}`);
    },
    updateUserData: function(data) {
        return axios.put(`/api/user`, data);
    },
    updateActkeyStatus: function(data) {
        return axios.put(`/api/actkey`, data);
    },
    deleteActkey: function(id) {
        return axios.delete(`/api/actkey?id=${id}`)
    },
    getActkeys: function (cusid) {
        return axios.get(`/api/actkeys?id=${cusid}`);
    },
    addActKeyData: function (val) {
        return axios.post('/api/newactkey', val)
    },
    getDetailData: function (id) {
        return axios.post(`/api/agents`, {
            actrid: id
        })
    },
    getDeviceData: function (id) {
        return axios.get(`/api/device?id=${id}`);
    },
    getAllAppData: function (id) {
        return axios.get(`api/allapps?id=${id}`);
    },
    getGuideData: function (id) {
        return axios.get(`/api/guide?id=${id}`);
    },
    getDomains: function() {
        return axios.get(`/api/domains`);
    },
    addDomain: function(new_domain) {
        return axios.post(`/api/domain`, new_domain)
    },
    updateDomain: function(updated_domain) {
        return axios.put(`/api/domain`, updated_domain)
    },
    getAgentsToRem: function(aid, app, ver) {
        return axios.get(`/api/remdev?id=${aid}&app=${app}&ver=${ver}`)
    },
    uninstallApps: function(data) {
        return axios.post(`/api/uninstall`, data)
    }
}