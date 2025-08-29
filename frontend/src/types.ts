export interface Page {
  loaded: () => void;
  unloaded: () => void;
  html: string;
}