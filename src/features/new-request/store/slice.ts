import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  type IUploadAndExtractionResult,
  type IExtractedData,
} from '@/services';

import { type FormState } from '../info-form';
import { type INewRequestState } from '../types/types';

const STORAGE_KEY = 'iNewRequestState_v1';

const load = (): INewRequestState => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { extractedData: null, extractionResult: null, form: null };
    }

    return JSON.parse(raw);
  } catch {
    return { extractedData: null, extractionResult: null, form: null };
  }
};

const save = (state: INewRequestState) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const initialState: INewRequestState = load();

const slice = createSlice({
  name: 'newRequest',
  initialState,
  reducers: {
    setExtractionResult(
      state,
      action: PayloadAction<IUploadAndExtractionResult | null>,
    ) {
      state.extractionResult = action.payload;
      state.extractedData =
        (action.payload?.extracted_data as Record<string, unknown>) ?? null;
      save(state);
    },
    setExtractedData(
      state,
      action: PayloadAction<IExtractedData['extracted_data'] | null>,
    ) {
      state.extractedData = action.payload;
      save(state);
    },
    setForm(state, action: PayloadAction<FormState | null>) {
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
