
export interface ImageState {
  original: string | null;
  edited: string | null;
  analysis: string | null;
  isProcessing: boolean;
  error: string | null;
}

export interface EditPreset {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}
