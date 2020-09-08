import createRestReducerHandlers from './restReducers'
import createRestActions from './restActions'
import { call, put, takeLatest } from 'redux-saga/effects'
import get from 'lodash/get'

const createRestSagas = (api, actions) => {
  const { Creators, Types } = actions
  function* getData(api) {
    const response = yield call(api.getData)
    const items = get(response, 'data.data', [])
    yield put(Creators.getDataSuccess(items))
  }
  function* createData(api, action) {
    yield call(api.createData, action)
    yield put(Creators.createDataSuccess())
  }
  return [
    takeLatest(Types.GET_DATA, getData, api),
    takeLatest(Types.CREATE_DATA, createData, api)
  ]
}

export { createRestActions, createRestReducerHandlers, createRestSagas }
