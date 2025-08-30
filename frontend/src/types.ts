export interface PageClass {
  loaded?: () => void;
  unloaded?: () => void;
  getHTML: () => string;
}