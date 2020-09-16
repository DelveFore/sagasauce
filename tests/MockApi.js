const create = () => {
  return {
    getData: jest.fn(() => ({ ok: true })),
    updateData: jest.fn(() => ({ ok: true })),
    createData: jest.fn(() => ({ ok: true })),
    deleteData: jest.fn(() => ({ ok: true }))
  }
}

export { create }
export default { create }
