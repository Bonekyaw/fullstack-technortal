export const createError = (status: number, message: string, code?: string) => {
  const error: any = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};
