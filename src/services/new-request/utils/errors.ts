interface IError {
  data?: {
    message?: unknown;
  };
  message: unknown;
}

export const getErrorMessage = (err: unknown, fallback: string) => {
  if (err && typeof err === 'object') {
    const e = err as IError;

    if (typeof e?.data?.message === 'string') {
      return e.data.message;
    }

    if (typeof e?.message === 'string') {
      return e.message;
    }
  }

  return fallback;
};
