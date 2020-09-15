import createRestReducersHandlers from '../../src/reducers'

import R from 'ramda'

const makeTypes = (keys) =>
  R.reduce(
    (acc, value) => {
      acc[value] = value
      return acc
    },
    {},
    keys
  )

describe('SagaSauce', () => {
  describe('createRestReducersHandlers', () => {
    const EXPECTED_TYPES = makeTypes([
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
    ])
    test('throws errors for missing types', () => {
      expect(() => createRestReducersHandlers({})).toThrow(
        'Types must have GET_DATA'
      )
      Object.keys(EXPECTED_TYPES).forEach((value) => {
        const types = R.omit([value], EXPECTED_TYPES)
        expect(() => createRestReducersHandlers(types)).toThrow(
          'Types must have ' + value
        )
      })
    })
    describe('GET reducer handlers', () => {
      test('has GET_DATA', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('GET_DATA')
        expect(reducer.GET_DATA({})).toEqual({ errors: null, isPending: true })
      })
      test('has GET_DATA_SUCCESS', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('GET_DATA_SUCCESS')
        expect(reducer.GET_DATA_SUCCESS({}, { data: ['yes'] })).toEqual({
          isPending: false,
          errors: null,
          data: ['yes']
        })

        expect(reducer.GET_DATA_SUCCESS({}, { data: { name: 'yes' } })).toEqual(
          {
            isPending: false,
            errors: null,
            data: { name: 'yes' }
          }
        )
      })
      test('has GET_DATA_FAILURE', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('GET_DATA_FAILURE')
        expect(reducer.GET_DATA_FAILURE({}, { errors: ['no'] })).toEqual({
          isPending: false,
          errors: ['no']
        })
      })
    })
    describe('CREATE reducer handlers', () => {
      test('has CREATE_DATA', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('CREATE_DATA')
        expect(reducer.CREATE_DATA({})).toEqual({
          errors: null,
          isPending: true
        })
      })
      test('has CREATE_DATA_SUCCESS', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('CREATE_DATA_SUCCESS')
        expect(reducer.CREATE_DATA_SUCCESS({}, { data: null })).toEqual({
          isPending: false,
          errors: null,
          data: null
        })
      })
      test('has CREATE_DATA_FAILURE', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('CREATE_DATA_FAILURE')
        expect(reducer.CREATE_DATA_FAILURE({}, { errors: ['no'] })).toEqual({
          isPending: false,
          errors: ['no']
        })
      })
    })
    describe('UPDATE reducer handlers', () => {
      const stateBeforeUpdate = {
        data: { name: 'Yamanu' },
        errors: null,
        isPending: false
      }
      test('has UPDATE_DATA', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('UPDATE_DATA')
        expect(
          reducer.UPDATE_DATA(stateBeforeUpdate, { data: { name: 'John' } })
        ).toEqual({
          // Do not change the data during UPDATE request
          data: { name: 'Yamanu' },
          errors: null,
          isPending: true
        })
      })
      test('has UPDATE_DATA_SUCCESS', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('UPDATE_DATA_SUCCESS')
        expect(
          reducer.UPDATE_DATA_SUCCESS(stateBeforeUpdate, {
            data: { name: 'John' }
          })
        ).toEqual({
          isPending: false,
          errors: null,
          data: { name: 'John' }
        })
      })
      test('has UPDATE_DATA_FAILURE', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('UPDATE_DATA_FAILURE')
        expect(
          reducer.UPDATE_DATA_FAILURE(stateBeforeUpdate, { errors: ['no'] })
        ).toEqual({
          isPending: false,
          data: { name: 'Yamanu' },
          errors: ['no']
        })
      })
    })
    describe('DELETE reducer handlers', () => {
      const stateBeforeUpdate = {
        data: { id: 1 },
        errors: null,
        isPending: false
      }
      test('has DELETE_DATA', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('DELETE_DATA')
        expect(reducer.DELETE_DATA(stateBeforeUpdate, { data: 1 })).toEqual({
          // Do not change the data during UPDATE request
          data: { id: 1 },
          errors: null,
          isPending: true
        })
      })
      test('has DELETE_DATA_SUCCESS', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('DELETE_DATA_SUCCESS')
        expect(
          reducer.DELETE_DATA_SUCCESS(stateBeforeUpdate, {
            data: null
          })
        ).toEqual({
          isPending: false,
          errors: null,
          data: null
        })
      })
      test('has DELETE_DATA_FAILURE', () => {
        const reducer = createRestReducersHandlers(EXPECTED_TYPES)
        expect(reducer).toHaveProperty('DELETE_DATA_FAILURE')
        expect(
          reducer.DELETE_DATA_FAILURE(stateBeforeUpdate, { errors: ['no'] })
        ).toEqual({
          isPending: false,
          data: { id: 1 },
          errors: ['no']
        })
      })
    })
  })
})
