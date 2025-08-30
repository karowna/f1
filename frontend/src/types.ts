export interface PageClass {
  loaded?: () => void | Promise<void>;
  unloaded?: () => void;
  getHTML: () => string;
}