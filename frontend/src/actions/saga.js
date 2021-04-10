import { put, takeLatest } from 'redux-saga/effects';
import { SEARCH_REPOSITORIES, SEARCH_REPOSITORIES_SUCCESS } from '../constants/repositories';

function* fetchData(payload) {
  try {
    const { data } = payload;
    const { texts, type } = data;

    //TODO: EncodeURIComponent
    const query = `${type}=${texts}`;

    const response = yield fetch(`${process.env.REACT_APP_API_URL}/search?${query}&pageSize=100&pageNo=1`);

    const results = yield response.json();

    yield put({type: SEARCH_REPOSITORIES_SUCCESS, data: results});
  } catch (err) {
    console.log('==> err:', err);
    yield put({type: 'FETCH_FAILED', message: err.message});
  }
}

export function* fetchAllData() {
  yield takeLatest(SEARCH_REPOSITORIES, fetchData);
}