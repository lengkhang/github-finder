import { put, takeLatest, select } from 'redux-saga/effects';
import { SEARCH_REPOSITORIES, SEARCH_REPOSITORIES_SUCCESS, SEARCH_REPOSITORIES_FAILED } from '../constants/repositories';
import { LOAD_SEARCH_HISTORY, LOAD_SEARCH_HISTORY_SUCCESS, LOAD_SEARCH_HISTORY_FAIL } from '../constants/searchHistory';
import { getCurrentUser } from '../selector/currentUser';
import { getAuthHeader } from '../lib/authHeader';

function* searchRepositories(payload) {
  try {
    const { data } = payload;
    const { texts, type, pageNo = 1, pageSize } = data;
    const currentUser = yield select(getCurrentUser);
    const authHeader = yield getAuthHeader(currentUser);

    const query = `${type}=${encodeURIComponent(texts)}`;

    const response = yield fetch(`${process.env.REACT_APP_API_URL}/search?${query}&pageSize=${pageSize}&pageNo=${pageNo}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader
      }
    });

    const results = yield response.json();

    if (response.ok) {
      yield put({type: SEARCH_REPOSITORIES_SUCCESS, data: results});
    } else {
      throw new Error(results.error?.message);
    }
  } catch (err) {
    console.log(err);
    yield put({type: SEARCH_REPOSITORIES_FAILED, message: err.message || 'Something wrong!' });
  }
}

function* loadSearchHistory(payload = {}) {
  try {
    const { data } = payload;
    const { pageNo = 1, pageSize = 20 } = data;
    const currentUser = yield select(getCurrentUser);
    const authHeader = yield getAuthHeader(currentUser);

    const response = yield fetch(`${process.env.REACT_APP_API_URL}/search/history?pageSize=${pageSize}&pageNo=${pageNo}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authHeader
      }
    });

    const results = yield response.json();

    if (response.ok) {
      yield put({type: LOAD_SEARCH_HISTORY_SUCCESS, data: results});
    } else {
      throw new Error(results.error?.message);
    }
  } catch (err) {
    console.log(err);
    yield put({type: LOAD_SEARCH_HISTORY_FAIL, message: err.message || 'Something wrong!' });
  }
}

export function* fetchAllData() {
  yield takeLatest(SEARCH_REPOSITORIES, searchRepositories);
  yield takeLatest(LOAD_SEARCH_HISTORY, loadSearchHistory);
}