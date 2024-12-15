export interface ResponseMessage<T> {
  type: 'success' | 'error';
  message: string;
  data?: T;
}

export function createResponse<T>(type: 'success' | 'error', message: string, data?: T): ResponseMessage<T> {
  return {
    type,
    message,
    data,
  };
}
