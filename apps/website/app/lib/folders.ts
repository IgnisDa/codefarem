export interface Folder {
  id: string;
  label: string;
  children: Folder[];
  questions: string[];
}
