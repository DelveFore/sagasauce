# SagaSauce

Providing utilities to accelerate Saga Redux integration with RESTful services.

Few things to know before getting started

- It is based on the fantastic tool [ReduxSauce](https://github.com/jkeam/reduxsauce) by [Jonathan Keam](https://github.com/jkeam)
- Intended to be used with the Hydrogen (coming soon..)
- Only tested with the API for [ApiSauce](https://github.com/infinitered/apisauce)
- We are working on the other verbs (TODO issues coming soon)

## Typical Usage

`src/redux/modules/events`
```
import {
  createRestSagas,
  createRestReducerHandlers,
  createRestActions
} from '@delvefore/hydrogen/sagasauce'
import API from '../../services/API'
import { createReducer } from 'reduxsauce'
import Immutable from 'seamless-immutable'

const INITIAL_STATE = Immutable({
  data: [],
  isPending: false,
  errors: null
})

/** ------------ Actions: Types and Creators --------- */
const Actions = createRestActions('events')
const Types = Actions.Types
const Creators = Actions.Creators
const createDispatchers = Actions.createDispatchers

/** ------------ Map Reducers  --------- */
const Reducers = createReducer(INITIAL_STATE, {
  ...createRestReducerHandlers(Types)
  // add or override reducers here
})
const Sagas = createRestSagas(API.events, Actions)

export default {
  Types,
  Reducers,
  Sagas,
  Creators,
  createDispatchers
}

```

## Changelog
Please see Github releases

Generally speaking version 1.x.x is focused on jsonapi.org with the intention to expand into supporting both jsonapi.org and GraphQL specifications.
