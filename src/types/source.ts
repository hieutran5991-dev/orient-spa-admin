export interface Source {
  id: number;
  name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SourceOption {
  value: number;
  label: string;
}

