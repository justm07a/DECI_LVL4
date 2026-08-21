const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler', () => {
  it('should call the wrapped function with req, res, next', async () => {
    const mockFn = jest.fn();
    const wrapped = asyncHandler(mockFn);
    const req = {};
    const res = {};
    const next = jest.fn();

    await wrapped(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
  });

  it('should call next with error if the wrapped function throws', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Test error'));
    const wrapped = asyncHandler(mockFn);
    const req = {};
    const res = {};
    const next = jest.fn();

    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Test error' }));
  });
});
