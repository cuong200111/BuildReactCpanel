// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_USERS, API_SOURCE_HRMCONFIG, API_HRM_REPORT, API_TIMEKEEPING_REPORT_HUMAN_RESOURCE, API_INCREASES_OR_DECREASES, API_LATE_AND_LEAVE, API_HRM_BY_MONTH, API_WAGE_BY_MONTH } from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { getApiSuccess, getIncreasesOrDecreasesSuccess, getIncreasesOrDecreasesFailure, getLateSuccess, getLateFailure, getHrmFailure, getHrmSuccess, getWageSuccess, getWageFailure, getHrmSagaDataemployFailure, getHrmSagaDataemploySuccess } from './actions';
import { GET_API, GET_INCREASES_OR_DECREASES, GET_LATE, GET_HRM_BY_MONTH, GET_WAGE_BY_MONTH, SORT_EMPLOY_DATE_SUCCESS, SORT_EMPLOY_DATE } from './constants';
import { serialize } from '../../helper';

export function* getApiSaga() {
  try {
    const headersOptions = {
      method: 'GET',
      headers: {
        'Contetn-Type': 'application/json'
      },

    }
    const personnel = yield call(request, API_HRM_REPORT, headersOptions);
    const category = yield call(request, API_SOURCE_HRMCONFIG, headersOptions);
    yield put(getApiSuccess(personnel, category));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* getIncreasesOrDecreasesSaga(action) {
  const token = localStorage.getItem('token');
  try {
    let url = API_INCREASES_OR_DECREASES
    if (action.payload) {
      url = `${API_INCREASES_OR_DECREASES}?filter%5BorganizationUnit%5D=${action.payload}`
    }
    const res = yield call(request, url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })

    if (res && res.status === 1) {
      yield put(getIncreasesOrDecreasesSuccess(res.data));
    } else {
      yield put(getIncreasesOrDecreasesFailure(res))
    }
  } catch (error) {
    yield put(getIncreasesOrDecreasesFailure(error))
  }
}

export function* getLateSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_LATE_AND_LEAVE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })

    if (res && res.status === 1) {
      console.log(res, 'ress')
      yield put(getLateSuccess(res.data));
    } else {
      yield put(getLateFailure(res))
    }
  } catch (error) {
    yield put(getLateFailure(error))
  }
}

export function* getHrmSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_BY_MONTH}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })

    if (res && res.status === 1) {
      console.log(res, 'ress')
      yield put(getHrmSuccess(res.data));
    } else {
      yield put(getHrmFailure(res))
    }
  } catch (error) {
    yield put(getHrmFailure(error))
  }
}
//get data theo API Tuyen
export function* getHrmSagaDataemploy(action) {
  const token = localStorage.getItem('token');
  console.log(action, "action")
  const { startDate, endDate , organizationUnit} = action && action.data && action.data.payload
  let filter = {
    startDate,
    endDate: startDate
  }
  if(organizationUnit){
    filter={
      ...filter, 
      organizationUnit
    }
  }
  const query = serialize({ filter });
  let url = `${API_TIMEKEEPING_REPORT_HUMAN_RESOURCE}?${query}`
  try {
    const res = yield call(request, url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })

    console.log(res, 'res')
    if (res && res.status === 1) {
      yield put(getHrmSagaDataemploySuccess(res.data));
    } else {
      yield put(getHrmSagaDataemployFailure(res))
    }
  } catch (error) {
    console.log('loi getHrmSagaDataemploy')
    yield put(getHrmSagaDataemployFailure(error))
  }
}


export function* getWageSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_WAGE_BY_MONTH}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })

    if (res && res.status === 1) {
      yield put(getWageSuccess(res.data));
    } else {
      yield put(getWageFailure(res))
    }
  } catch (error) {
    yield put(getWageFailure(error))
  }
}

export default function* reportHrmPageSaga() {
  yield takeLatest(GET_API, getApiSaga);
  yield takeLatest(GET_INCREASES_OR_DECREASES, getIncreasesOrDecreasesSaga);
  yield takeLatest(GET_LATE, getLateSaga);
  yield takeLatest(GET_HRM_BY_MONTH, getHrmSaga);
  yield takeLatest(GET_WAGE_BY_MONTH, getWageSaga);
  yield takeLatest(SORT_EMPLOY_DATE, getHrmSagaDataemploy)
}
