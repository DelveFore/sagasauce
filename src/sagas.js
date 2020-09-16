import get from 'lodash/get'
import { call, put, takeLatest } from 'redux-saga/effects'
import omit from 'lodash/omit'

/**
 * TODO Support "problem" response from `apisauce` API (https://github.com/infinitered/apisauce#problem-codes)
 * @param api
 * @param Creators
 * @returns {{createData: createData, deleteData: deleteData, updateData: updateData, getData: getData}}
 * @private
 */
export const _createGenerators = (api, Creators) => {
  function* getData(api, action) {
    const response = yield call(
      api.getData,
      action.data,
      omit(action, ['type', 'data'])
    )
    if (response.ok) {
      const data = get(response, 'data.data', null)
      yield put(Creators.getDataSuccess(data))
    } else {
      yield put(
        Creators.getDataFailure(
          get(response, 'data.errors', ['Error getting data'])
        )
      )
    }
  }
  function* createData(api, action) {
    const response = yield call(
      api.createData,
      action.data,
      omit(action, ['type', 'data'])
    )
    if (response.ok) {
      const data = get(response, 'data.data', null)
      yield put(Creators.createDataSuccess(data))
    } else {
      yield put(
        Creators.createDataFailure(
          get(response, 'data.errors', ['Error getting data'])
        )
      )
    }
  }
  function* updateData(api, action) {
    const response = yield call(
      api.updateData,
      action.data,
      omit(action, ['type', 'data'])
    )
    if (response.ok) {
      const data = get(response, 'data.data', null)
      yield put(Creators.updateDataSuccess(data))
    } else {
      yield put(
        Creators.updateDataFailure(
          get(response, 'data.errors', ['Error getting data'])
        )
      )
    }
  }
  function* deleteData(api, action) {
    const response = yield call(
      api.deleteData,
      action.data,
      omit(action, ['type', 'data'])
    )
    if (response.ok) {
      const data = get(response, 'data.data', null)
      yield put(Creators.deleteDataSuccess(data))
    } else {
      yield put(
        Creators.deleteDataFailure(
          get(response, 'data.errors', ['Error getting data'])
        )
      )
    }
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
