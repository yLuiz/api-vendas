class AppError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    this.statusCode = statusCode;
    this.message = message;
  };
};

export default AppError;