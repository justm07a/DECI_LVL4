const AppError = require('../../utils/AppError');

describe('AppError', () => {
  it('should create an error with 404 status code and "fail" status', () => {
    const error = new AppError('Not found', 404);
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });

  it('should create an error with 500 status code and "error" status', () => {
    const error = new AppError('Server error', 500);
    expect(error.message).toBe('Server error');
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
    expect(error.isOperational).toBe(true);
  });

  it('should be an instance of Error', () => {
    const error = new AppError('Test error', 400);
    expect(error).toBeInstanceOf(Error);
  });
});
