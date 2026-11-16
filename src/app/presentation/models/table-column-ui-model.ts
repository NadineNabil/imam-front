export interface TableColumn {
  key: string;         // Property name in the data object
  label: string;       // Display label (can be translated)
  sortable?: boolean;  // Can this column be sorted?
  type?: 'text' | 'number' | 'date' | 'status'; // Optional type for formatting
  width?: string;      // Optional width, e.g., '150px' or '10%'
  align?: 'left' | 'center' | 'right'; // Optional text alignment
}