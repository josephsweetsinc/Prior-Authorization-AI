export const DEBOUNCE_DELAY_MS = 250;

export const isNumericQuery = (value: string) => /^[0-9]+$/.test(value);

export const buildSearchPayload = (query: string) =>
  isNumericQuery(query)
    ? { patient_id: query, patient_name: undefined }
    : { patient_id: undefined, patient_name: query };

export const buildSearchResults = (requestIds?: number[]) =>
  requestIds && requestIds.length > 0
    ? [
        {
          title: 'Requests',
          items: requestIds.map((id) => ({
            id: `request-${id}`,
            requestId: id,
            title: `Request #${id}`,
            subtitle: 'Patient match',
          })),
        },
      ]
    : [];
