import {
  createRestActions,
  createRestReducerHandlers,
  createRestSagas
} from '../src'
import { createReducer } from 'reduxsauce'

const create = (api, INITIAL_STATE) => {
  const namespace = 'events'
  /** ------------ Actions: Types and Creators --------- */
  const Actions = createRestActions(namespace)
  const Types = Actions.Types
  const Creators = Actions.Creators
  const createDispatchers = Actions.createDispatchers

  /** ------------ Map Reducers  --------- */
  const Reducers = createReducer(INITIAL_STATE, {
    ...createRestReducerHandlers(Types)
  })

  const Sagas = createRestSagas(api[namespace], Actions)

  return {
    Reducers: {
      [namespace]: Reducers
    },
    Actions,
    Types,
    Creators,
    createDispatchers,
    Sagas
  }
}

export { create }
export default { create }
