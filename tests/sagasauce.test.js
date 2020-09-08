import createRestReducersHandlers from '../src/restReducers'
import createRestActions, { createDispatchersFactory } from '../src/restActions'

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
  describe('createDispatchersFactory', () => {
    test('has GET dispatcher', () => {
      const dispatch = jest.fn()
      const Creators = {
        getData: jest.fn()
      }
      const result = createDispatchersFactory('myBooks', Creators)(dispatch)
      expect(result).toHaveProperty('getMyBooks')
      result.getMyBooks({ 'filter[name]': 'something' })
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(Creators.getData).toHaveBeenCalledTimes(1)
      expect(Creators.getData).toHaveBeenCalledWith({
        'filter[name]': 'something'
      })
    })
    test('has CREATE dispatcher', () => {
      const dispatch = jest.fn()
      const Creators = {
        getData: jest.fn(),
        createData: jest.fn()
      }
      const result = createDispatchersFactory('myBooks', Creators)(dispatch)
      expect(result).toHaveProperty('getMyBooks')
      result.createMyBooks({ name: 'something' })
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(Creators.getData).toHaveBeenCalledTimes(1)
      expect(Creators.createData).toHaveBeenCalledTimes(1)
      expect(Creators.createData).toHaveBeenCalledWith({ name: 'something' })
    })
  })
  describe('createRestActions', () => {
    test('requires namespace / prefix', () => {
      expect(() => createRestActions()).toThrow(
        'createRestActions requires a string as the first argument which is the module prefix'
      )
    })
    test('will not duplicate prefix\'s suffix of "__"', () => {
      const { Types } = createRestActions('MOVIES__')
      expect(Types).toHaveProperty('CREATE_DATA', 'MOVIES__CREATE_DATA')
    })
    describe('Types', () => {
      test('returns with expected types that have the prefix in their values', () => {
        const { Types } = createRestActions('books')
        expect(Types).toHaveProperty('CREATE_DATA', 'BOOKS__CREATE_DATA')
      })
    })
    describe('createDispatchers', () => {
      test('returns createDispatchers method and uses the prefix', () => {
        const Actions = createRestActions('books')
        expect(Actions).toHaveProperty('createDispatchers')
        expect(Actions.createDispatchers(() => {})).toHaveProperty('getBooks')
        expect(Actions.createDispatchers(() => {})).toHaveProperty(
          'createBooks'
        )
      })
    })
  })
  describe('createRestReducersHandlers', () => {
    const EXPECTED_TYPES = makeTypes([
      'GET_DATA',
      'GET_DATA_SUCCESS',
      'GET_DATA_FAILURE',
      'CREATE_DATA',
      'CREATE_DATA_SUCCESS',
      'CREATE_DATA_FAILURE'
    ])
    test('throws errors for missing types', () => {
      expect(() => createRestReducersHandlers({})).toThrow(
        'Types must have GET'
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
  })
})