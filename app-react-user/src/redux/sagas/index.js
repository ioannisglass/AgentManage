import { all } from 'redux-saga/effects';
import actionLoginUser from './authSaga';

export default function* rootSaga() {
    yield all([
        actionLoginUser(),
    ]);
}