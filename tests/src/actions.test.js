import createRestActions, { createDispatchersFactory } from '../../src/actions'

describe('SagaSauce > Actions', () => {
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
      expect(result).toHaveProperty('createMyBooks')
      result.createMyBooks({ name: 'something' })
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(Creators.getData).toHaveBeenCalledTimes(1)
      expect(Creators.createData).toHaveBeenCalledTimes(1)
      expect(Creators.createData).toHaveBeenCalledWith({ name: 'something' })
    })
    test('has UPDATE dispatcher', () => {
      const dispatch = jest.fn()
      const Creators = {
        getData: jest.fn(),
        createData: jest.fn(),
        updateData: jest.fn(),
        deleteData: jest.fn()
      }
      const result = createDispatchersFactory('myBook', Creators)(dispatch)
      expect(result).toHaveProperty('updateMyBook')
      result.updateMyBook({ name: 'John' })
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(Creators.getData).toHaveBeenCalledTimes(0)
      expect(Creators.createData).toHaveBeenCalledTimes(0)
      expect(Creators.deleteData).toHaveBeenCalledTimes(0)
      expect(Creators.updateData).toHaveBeenCalledWith({ name: 'John' })
    })
    test('has DELETE dispatcher', () => {
      const dispatch = jest.fn()
      const Creators = {
        getData: jest.fn(),
        createData: jest.fn(),
        updateData: jest.fn(),
        deleteData: jest.fn()
      }
      const result = createDispatchersFactory('myBook', Creators)(dispatch)
      expect(result).toHaveProperty('deleteMyBook')
      result.deleteMyBook({ id: 1 })
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(Creators.getData).toHaveBeenCalledTimes(0)
      expect(Creators.createData).toHaveBeenCalledTimes(0)
      expect(Creators.updateData).toHaveBeenCalledTimes(0)
      expect(Creators.deleteData).toHaveBeenCalledWith({ id: 1 })
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
        expect(Types).toHaveProperty('GET_DATA', 'BOOKS__GET_DATA')
        expect(Types).toHaveProperty('UPDATE_DATA', 'BOOKS__UPDATE_DATA')
        expect(Types).toHaveProperty('DELETE_DATA', 'BOOKS__DELETE_DATA')
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
})
