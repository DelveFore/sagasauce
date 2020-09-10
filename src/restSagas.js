import get from 'lodash/get'
import { call, put, takeLatest } from 'redux-saga/effects'

export default (api, actions) => {
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
  function* updateData(api, action) {
    yield call(api.updateData, action)
    yield put(Creators.updateDataSuccess(action))
  }
  return [
    takeLatest(Types.GET_DATA, getData, api),
    takeLatest(Types.CREATE_DATA, createData, api),
    takeLatest(Types.UPDATE_DATA, updateData, api)
  ]
}
