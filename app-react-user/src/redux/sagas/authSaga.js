import { put, takeLatest } from 'redux-saga/effects';
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import API from "../../api/api";

function* loginUser(userData) {
    try {
        const json = yield API.loginUser(userData.userData)
            .then(res => {
                const { token } = res.data;
                localStorage.setItem("jwtToken", token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                return (decoded);
            })
            .catch(err => {
                console.log(err.response.data)
                throw err.response.data;
            });
        console.log(json)
        yield put({
            type: "SET_CURRENT_USER",
            json: json
        });
    }
    catch (error) {
        // let errors = error + new Date().getTime().toString()
        yield put({
            type: 'SET_CURRENT_USER_FAILED',
            error
        })
    }

}

function* logOutUser(userData) {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    yield put({
        type: "SET_CURRENT_USER",
        json: {},
    });
}

export default function* actionLoginUser() {
    yield takeLatest('LOGIN_USER', loginUser)
    yield takeLatest('LOGOUT_USER', logOutUser)
}
