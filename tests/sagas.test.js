import { createReducer } from 'reduxsauce'
import SagaTester from 'redux-saga-tester'
import { all } from 'redux-saga/effects'
import { combineReducers } from 'redux'
import {
  createRestSagas,
  createRestReducerHandlers,
  createRestActions
} from '../src/index'

const makeModule = (api, INITIAL_STATE) => {
  /** ------------ Actions: Types and Creators --------- */
  const Actions = createRestActions('events')
  const Types = Actions.Types
  const Creators = Actions.Creators
  const createDispatchers = Actions.createDispatchers

  /** ------------ Map Reducers  --------- */
  const Reducers = createReducer(INITIAL_STATE, {
    ...createRestReducerHandlers(Types)
  })

  const Sagas = createRestSagas(api.events, Actions)

  return {
    Reducers: {
      events: Reducers
    },
    Actions,
    Types,
    Creators,
    createDispatchers,
    Sagas
  }
}

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
  events: {
    getData: jest.fn(),
    updateData: jest.fn(),
    createData: jest.fn(),
    deleteData: jest.fn()
  }
})
const createInitState = (state) => ({
  data: [],
  isPending: false,
  errors: null,
  ...state
})

describe('SagaSauce > Sagas', () => {
  test('saucy GET_DATA', async () => {
    const api = createMockApi()
    const INITIAL_STATE = createInitState()
    const storeModule = makeModule(api, INITIAL_STATE)
    const harness = createHarness(storeModule, api, INITIAL_STATE)
    const Types = storeModule.Types
    expect(harness.getState().events).toEqual(INITIAL_STATE)
    harness.dispatch({ type: Types.GET_DATA })
    await harness.waitFor(Types.GET_DATA_SUCCESS)
    expect(api.events.getData).toHaveBeenCalledTimes(1)
  })
  test('saucy UPDATE_DATA', async () => {
    const api = createMockApi()
    const INITIAL_STATE = createInitState({ data: { name: 'John' } })
    const storeModule = makeModule(api, INITIAL_STATE)
    const harness = createHarness(storeModule, api, INITIAL_STATE)
    const Types = storeModule.Types
    expect(harness.getState().events).toEqual(INITIAL_STATE)
    harness.dispatch({ type: Types.UPDATE_DATA, data: { name: 'Rose' } })
    await harness.waitFor(Types.UPDATE_DATA_SUCCESS)
    expect(api.events.getData).toHaveBeenCalledTimes(0)
    expect(api.events.updateData).toHaveBeenCalledTimes(1)
    expect(api.events.updateData).toHaveBeenCalledWith({ name: 'Rose' })
    expect(harness.numCalled(Types.UPDATE_DATA)).toEqual(1)
    expect(harness.numCalled(Types.UPDATE_DATA_SUCCESS)).toEqual(1)
  })
  test('saucy CREATE_DATA', async () => {
    const api = createMockApi()
    const INITIAL_STATE = createInitState()
    const storeModule = makeModule(api, INITIAL_STATE)
    const harness = createHarness(storeModule, api, INITIAL_STATE)
    const Types = storeModule.Types
    expect(harness.getState().events).toEqual(INITIAL_STATE)
    harness.dispatch({ type: Types.CREATE_DATA, data: { name: 'Rose' } })
    await harness.waitFor(Types.CREATE_DATA_SUCCESS)
    expect(api.events.getData).toHaveBeenCalledTimes(0)
    expect(api.events.createData).toHaveBeenCalledTimes(1)
    expect(api.events.createData).toHaveBeenCalledWith({ name: 'Rose' })
    expect(harness.numCalled(Types.CREATE_DATA)).toEqual(1)
    expect(harness.numCalled(Types.CREATE_DATA_SUCCESS)).toEqual(1)
    expect(harness.numCalled(Types.CREATE_DATA_FAILURE)).toEqual(0)
  })
  test('saucy DELETE_DATA', async () => {
    const api = createMockApi()
    const INITIAL_STATE = createInitState({
      data: { id: 1, name: 'Injustice' }
    })
    const storeModule = makeModule(api, INITIAL_STATE)
    const harness = createHarness(storeModule, api, INITIAL_STATE)
    const Types = storeModule.Types
    expect(harness.getState().events).toEqual(INITIAL_STATE)
    harness.dispatch({ type: Types.DELETE_DATA, data: { id: 1 } })
    await harness.waitFor(Types.DELETE_DATA_SUCCESS)
    expect(api.events.deleteData).toHaveBeenCalledTimes(1)
    expect(api.events.deleteData).toHaveBeenCalledWith({ id: 1 })
    expect(harness.numCalled(Types.DELETE_DATA)).toEqual(1)
    expect(harness.numCalled(Types.DELETE_DATA_SUCCESS)).toEqual(1)
    expect(harness.numCalled(Types.DELETE_DATA_FAILURE)).toEqual(0)
  })
})
