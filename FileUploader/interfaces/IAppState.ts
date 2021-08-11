export interface IAppState {
  controlToRefresh: string;
}

export interface IInitialStateFiles {
  files: [];
  responseMessage: "";
  addAttachment: (files: File[]) => void;
  removeAttachment: (file: File) => void;
  createAnnotations: (files: File[]) => void;
  setMessage: (i?: number) => void;
}