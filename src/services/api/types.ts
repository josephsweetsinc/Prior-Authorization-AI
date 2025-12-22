export type ApiErrorDetail = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

export type ValidationError = {
  detail: ApiErrorDetail[];
};

export type ParsedApiError = {
  message: string | null;
  validation?: ValidationError | null;
};

export function parseApiError(err: unknown): ParsedApiError {
  let message: string | null = null;
  let validation: ValidationError | null = null;

  if (typeof err !== 'object' || err === null) {
    return { message, validation };
  }

  const e = err as Record<string, unknown>;

  const candidates: unknown[] = [];
  if ('data' in e) {
    candidates.push((e as { data?: unknown }).data);
  }
  if (
    'response' in e &&
    typeof (e as { response?: unknown }).response === 'object'
  ) {
    const resp = (e as { response?: Record<string, unknown> }).response;
    if (resp && 'data' in resp) {
      candidates.push((resp as Record<string, unknown>).data);
    }
  }
  if ('error' in e) {
    candidates.push((e as { error?: unknown }).error);
  }
  candidates.push(e);

  for (const cand of candidates) {
    if (!cand || typeof cand !== 'object') {
      continue;
    }
    const c = cand as Record<string, unknown>;

    if (Array.isArray(c.detail)) {
      const maybeDetails = c.detail as unknown[];
      if (
        maybeDetails.length > 0 &&
        maybeDetails.every(
          (d) =>
            typeof d === 'object' &&
            d !== null &&
            'msg' in (d as Record<string, unknown>),
        )
      ) {
        validation = { detail: maybeDetails as ApiErrorDetail[] };
        const first = maybeDetails[0] as Record<string, unknown> | undefined;
        if (first && typeof first.msg === 'string') {
          message = first.msg as string;
        }
        break;
      }
    }

    if (typeof c.detail === 'string' && !message) {
      message = c.detail as string;
    }

    if (!message && typeof c.message === 'string') {
      message = c.message;
    }
  }

  return { message, validation };
}
