export const _onFailure = (state, action) => {
  return {
    ...state,
    errors: action.errors,
    isPending: false
  }
}

export const _onGenericRequest = (state) => {
  return {
    ...state,
    errors: null,
    isPending: true
  }
}

export const _onGenericSuccess = (state, action) => {
  return {
    ...state,
    errors: null,
    data: action.data,
    isPending: false
  }
}

export const _checkFor = (types, type) => {
  if (!types[type]) {
    throw new Error('Types must have ' + type)
  }
}

export default (Types) => {
  const reducers = {}
  const ExpectedTypes = [
    'GET_DATA',
    'GET_DATA_SUCCESS',
    'GET_DATA_FAILURE',
    'CREATE_DATA',
    'CREATE_DATA_SUCCESS',
    'CREATE_DATA_FAILURE',
    'UPDATE_DATA',
    'UPDATE_DATA_SUCCESS',
    'UPDATE_DATA_FAILURE',
    'DELETE_DATA',
    'DELETE_DATA_SUCCESS',
    'DELETE_DATA_FAILURE'
  ]
  ExpectedTypes.forEach((type) => _checkFor(Types, type))

  // GET
  // TODO For Lists, need to be support JSONAPI.org (filters, includes, etc.)
  reducers[Types.GET_DATA] = _onGenericRequest
  reducers[Types.GET_DATA_FAILURE] = _onFailure
  reducers[Types.GET_DATA_SUCCESS] = _onGenericSuccess

  // CREATE
  reducers[Types.CREATE_DATA] = _onGenericRequest
  reducers[Types.CREATE_DATA_FAILURE] = _onFailure
  reducers[Types.CREATE_DATA_SUCCESS] = _onGenericSuccess

  // UPDATE
  // TODO Directly support PATCH
  reducers[Types.UPDATE_DATA] = _onGenericRequest
  reducers[Types.UPDATE_DATA_FAILURE] = _onFailure
  reducers[Types.UPDATE_DATA_SUCCESS] = _onGenericSuccess

  // DELETE
  reducers[Types.DELETE_DATA] = _onGenericRequest
  reducers[Types.DELETE_DATA_FAILURE] = _onFailure
  reducers[Types.DELETE_DATA_SUCCESS] = (state) => {
    return _onGenericSuccess(state, { data: null })
  }
  return reducers
}
