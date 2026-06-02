import { create } from 'zustand';
import { COUNTRIES } from '../data/countries';
import type { FormSubmission } from '../types/form';

interface FormState {
  countries: string[];
  submissions: FormSubmission[];
  addSubmission: (submission: FormSubmission) => void;
}

export const useFormStore = create<FormState>((set) => ({
  countries: COUNTRIES,
  submissions: [],
  addSubmission: (submission) =>
    set((state) => ({ submissions: [submission, ...state.submissions] })),
}));
