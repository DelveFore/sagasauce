import SagaTester from 'redux-saga-tester'
import { all } from 'redux-saga/effects'
import { combineReducers } from 'redux'
import MockApi from '../MockApi'
import ModuleFactory from '../ModuleFactory'

const createHarness = (storeModule, api, INITIAL_STATE) => {
  const options = { onError: () => console.error.bind(console) }
  const sagaTester = new SagaTester({
    initialState: { events: INITIAL_STATE },
    reducers: combineReducers(storeModule.Reducers),
    middlewares: [],
    options
  })
  function* rootSaga() {
    yield all(storeModule.Sagas)
  }
  sagaTester.start(rootSaga)
  sagaTester.dispatchers = storeModule.createDispatchers(sagaTester.dispatch)
  return sagaTester
}

const createMockApi = () => ({
  events: MockApi.create()
})
const createInitState = (state) => ({
  data: [],
  isPending: false,
  errors: null,
  ...state
})

describe('SagaSauce > Sagas', () => {
  describe('saucy GET_DATA', () => {
    test('changes state _SUCCESS on API success', async () => {
      const api = createMockApi()
      const INITIAL_STATE = createInitState()
      const storeModule = ModuleFactory.create(api, INITIAL_STATE)
      const harness = createHarness(storeModule, api, INITIAL_STATE)
      const Types = storeModule.Types
      expect(harness.getState().events).toEqual(INITIAL_STATE)
      harness.dispatch({ type: Types.GET_DATA })
      await harness.waitFor(Types.GET_DATA_SUCCESS)
      expect(api.events.getData).toHaveBeenCalledTimes(1)
    })
    test('changes _FAILURE state with errors', async () => {
      const api = {
        events: {
          getData: jest.fn(() => ({
            ok: false,
            data: {
              errors: ['failed to load']
            }
          }))
        }
      }
      const INITIAL_STATE = createInitState()
      const storeModule = ModuleFactory.create(api, INITIAL_STATE)
      const harness = createHarness(storeModule, api, INITIAL_STATE)
      const Types = storeModule.Types
      harness.dispatch({ type: Types.GET_DATA })
      await harness.waitFor(Types.GET_DATA_FAILURE)
      expect(harness.getState().events).toEqual({
        errors: ['failed to load'],
        isPending: false,
        data: [] // original state does not change
      })
      expect(api.events.getData).toHaveBeenCalledTimes(1)
    })
    test('passes includes, params, and filters to API', async () => {
      const api = createMockApi()
      const INITIAL_STATE = createInitState()
      const storeModule = ModuleFactory.create(api, INITIAL_STATE)
      const harness = createHarness(storeModule, api, INITIAL_STATE)
      const Types = storeModule.Types
      expect(harness.getState().events).toEqual(INITIAL_STATE)
      harness.dispatch({
        type: Types.GET_DATA,
        includes: ['company'],
        params: { id: 2 },
        filters: { type: 4 }
      })
      await harness.waitFor(Types.GET_DATA_SUCCESS)
      expect(api.events.getData).toHaveBeenCalledTimes(1)
      expect(api.events.getData).toHaveBeenCalledWith(undefined, {
        includes: ['company'],
        params: { id: 2 },
        filters: { type: 4 }
      })
    })
  })
  describe('saucy UPDATE_DATA', () => {
    test('changes state _SUCCESS on API success', async () => {
      const api = createMockApi()
      const INITIAL_STATE = createInitState({ data: { name: 'John' } })
      const storeModule = ModuleFactory.create(api, INITIAL_STATE)
      const harness = createHarness(storeModule, api, INITIAL_STATE)
      const Types = storeModule.Types
      expect(harness.getState().events).toEqual(INITIAL_STATE)
      harness.dispatch({ type: Types.UPDATE_DATA, data: { name: 'Rose' } })
      await harness.waitFor(Types.UPDATE_DATA_SUCCESS)
      expect(api.events.getData).toHaveBeenCalledTimes(0)
      expect(api.events.updateData).toHaveBeenCalledTimes(1)
      expect(api.events.updateData).toHaveBeenCalledWith({ name: 'Rose' }, {})
      expect(harness.numCalled(Types.UPDATE_DATA)).toEqual(1)
      expect(harness.numCalled(Types.UPDATE_DATA_SUCCESS)).toEqual(1)
    })
    test('changes _FAILURE state with errors', async () => {
      const api = {
        events: {
          updateData: jest.fn(() => ({
            ok: false,
            data: {
              errors: ['failed to load']
            }
          }))
        }
      }
      const INITIAL_STATE = createInitState()
      const storeModule = ModuleFactory.create(api, INITIAL_STATE)
      const harness = createHarness(storeModule, api, INITIAL_STATE)
      const Types = storeModule.Types
      harness.dispatch({ type: Types.UPDATE_DATA })
      await harness.waitFor(Types.UPDATE_DATA_FAILURE)
      expect(harness.getState().events).toEqual({
        errors: ['failed to load'],
        isPending: false,
        data: [] // original state does not change
      })
      expect(api.events.updateData).toHaveBeenCalledTimes(1)
    })
  })
  describe('saucy CREATE_DATA', () => {
    test('changes state _SUCCESS on API success', async () => {
      const api = createMockApi()
      const INITIAL_STATE = createInitState()
      const storeModule = ModuleFactory.create(api, INITIAL_STATE)
      const harness = createHarness(storeModule, api, INITIAL_STATE)
      const Types = storeModule.Types
      expect(harness.getState().events).toEqual(INITIAL_STATE)
      harness.dispatch({ type: Types.CREATE_DATA, data: { name: 'Rose' } })
      await harness.waitFor(Types.CREATE_DATA_SUCCESS)
      expect(api.events.getData).toHaveBeenCalledTimes(0)
      expect(api.events.createData).toHaveBeenCalledTimes(1)
      expect(api.events.createData).toHaveBeenCalledWith({ name: 'Rose' }, {})
      expect(harness.numCalled(Types.CREATE_DATA)).toEqual(1)
      expect(harness.numCalled(Types.CREATE_DATA_SUCCESS)).toEqual(1)
      expect(harness.numCalled(Types.CREATE_DATA_FAILURE)).toEqual(0)
    })
    test('changes _FAILURE state with errors', async () => {
      const api = {
        events: {
          createData: jest.fn(() => ({
            ok: false,
            data: {
              errors: ['failed to load']
            }
          }))
        }
      }
      const INITIAL_STATE = createInitState()
      const storeModule = ModuleFactory.create(api, INITIAL_STATE)
      const harness = createHarness(storeModule, api, INITIAL_STATE)
      const Types = storeModule.Types
      harness.dispatch({ type: Types.CREATE_DATA })
      await harness.waitFor(Types.CREATE_DATA_FAILURE)
      expect(harness.getState().events).toEqual({
        errors: ['failed to load'],
        isPending: false,
        data: [] // original state does not change
      })
      expect(api.events.createData).toHaveBeenCalledTimes(1)
    })
  })
  describe('saucy DELETE_DATA', () => {
    test('changes state _SUCCESS on API success', async () => {
      const api = createMockApi()
      const INITIAL_STATE = createInitState({
        data: { id: 1, name: 'Injustice' }
      })
      const storeModule = ModuleFactory.create(api, INITIAL_STATE)
      const harness = createHarness(storeModule, api, INITIAL_STATE)
      const Types = storeModule.Types
      expect(harness.getState().events).toEqual(INITIAL_STATE)
      harness.dispatch({ type: Types.DELETE_DATA, data: { id: 1 } })
      await harness.waitFor(Types.DELETE_DATA_SUCCESS)
      expect(api.events.deleteData).toHaveBeenCalledTimes(1)
      expect(api.events.deleteData).toHaveBeenCalledWith({ id: 1 }, {})
      expect(harness.numCalled(Types.DELETE_DATA)).toEqual(1)
      expect(harness.numCalled(Types.DELETE_DATA_SUCCESS)).toEqual(1)
      expect(harness.numCalled(Types.DELETE_DATA_FAILURE)).toEqual(0)
    })
    test('changes _FAILURE state with errors', async () => {
      const api = {
        events: {
          deleteData: jest.fn(() => ({
            ok: false,
            data: {
              errors: ['failed to load']
            }
          }))
        }
      }
      const INITIAL_STATE = createInitState()
      const storeModule = ModuleFactory.create(api, INITIAL_STATE)
      const harness = createHarness(storeModule, api, INITIAL_STATE)
      const Types = storeModule.Types
      harness.dispatch({ type: Types.DELETE_DATA })
      await harness.waitFor(Types.DELETE_DATA_FAILURE)
      expect(harness.getState().events).toEqual({
        errors: ['failed to load'],
        isPending: false,
        data: [] // original state does not change
      })
      expect(api.events.deleteData).toHaveBeenCalledTimes(1)
    })
  })
})
