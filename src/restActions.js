import { createActions } from 'reduxsauce'
import snakeCase from 'lodash/snakeCase'
import toUpper from 'lodash/toUpper'
import endsWith from 'lodash/endsWith'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import trimEnd from 'lodash/trimEnd'

export const createDispatchersFactory = (prefix, Creators) => {
  prefix = endsWith(prefix, '__') ? trimEnd(prefix, '__') : prefix
  prefix = upperFirst(camelCase(prefix))
  return (dispatch) => ({
    ['get' + prefix]: (data) => {
      dispatch(Creators.getData(data))
    },
    ['create' + prefix]: (data) => {
      dispatch(Creators.createData(data))
      dispatch(Creators.getData())
    }
  })
}

export default (prefix) => {
  if (!prefix) {
    throw new Error(
      'createRestActions requires a string as the first argument which is the module prefix'
    )
  }

  // Ensure it is formatted
  prefix = toUpper(snakeCase(prefix)) + '__'

  const actions = createActions(
    {
      getData: ['data'],
      getDataSuccess: ['data'],
      getDataFailure: ['errors'],
      createData: ['data'],
      createDataSuccess: null,
      createDataFailure: ['errors']
    },
    {
      prefix
    }
  )

  return {
    createDispatchers: createDispatchersFactory(prefix, actions.Creators),
    ...actions
  }
}
