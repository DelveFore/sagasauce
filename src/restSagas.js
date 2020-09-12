import get from 'lodash/get'
import { call, put, takeLatest } from 'redux-saga/effects'

export const _createGenerators = (api, Creators) => {
  function* getData(api) {
    const response = yield call(api.getData)
    const items = get(response, 'data.data', [])
    yield put(Creators.getDataSuccess(items))
  }
  function* createData(api, action) {
    yield call(api.createData, action.data)
    yield put(Creators.createDataSuccess())
  }
  function* updateData(api, action) {
    yield call(api.updateData, action.data)
    yield put(Creators.updateDataSuccess())
  }
  function* deleteData(api, action) {
    yield call(api.deleteData, action.data)
    yield put(Creators.deleteDataSuccess())
  }
  return {
    getData,
    createData,
    updateData,
    deleteData
  }
}

export default (api, actions) => {
  const { Creators, Types } = actions
  const { getData, createData, updateData, deleteData } = _createGenerators(
    api,
    Creators
  )
  return [
    takeLatest(Types.GET_DATA, getData, api),
    takeLatest(Types.CREATE_DATA, createData, api),
    takeLatest(Types.UPDATE_DATA, updateData, api),
    takeLatest(Types.DELETE_DATA, deleteData, api)
  ]
}
