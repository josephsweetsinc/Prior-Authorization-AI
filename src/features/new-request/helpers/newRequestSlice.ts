import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NewRequestState = {
  extractedData: Record<string, unknown> | null;
  extractionResult: Record<string, unknown> | null;
  form: Record<string, unknown> | null;
};

const STORAGE_KEY = 'newRequestState_v1';

const load = (): NewRequestState => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { extractedData: null, extractionResult: null, form: null };
    }

    return JSON.parse(raw) as NewRequestState;
  } catch {
    return { extractedData: null, extractionResult: null, form: null };
  }
};

const save = (state: NewRequestState) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

const initialState: NewRequestState = load();

const slice = createSlice({
  name: 'newRequest',
  initialState,
  reducers: {
    setExtractionResult(
      state,
      action: PayloadAction<Record<string, unknown> | null>,
    ) {
      state.extractionResult = action.payload;
      state.extractedData =
        (action.payload?.extracted_data as Record<string, unknown>) ?? null;
      save(state);
    },
    setExtractedData(
      state,
      action: PayloadAction<Record<string, unknown> | null>,
    ) {
      state.extractedData = action.payload;
      save(state);
    },
    setForm(state, action: PayloadAction<Record<string, unknown> | null>) {
      state.form = action.payload;
      save(state);
    },
    clear(state) {
      state.extractedData = null;
      state.extractionResult = null;
      state.form = null;
      sessionStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { setExtractionResult, setExtractedData, setForm, clear } =
  slice.actions;
export const newRequestReducer = slice.reducer;
export default slice;
