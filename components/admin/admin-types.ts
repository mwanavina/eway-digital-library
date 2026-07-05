'use client';

export type Tab = 'schools' | 'departments' | 'programs' | 'courses' | 'levels' | 'documents' | 'upload';

export interface AdminItem {
  [key: string]: any;
}

export interface AdminTabConfig {
  id: Tab;
  label: string;
}

export interface AdminFormData {
  name?: string;
  school_id?: string;
  department_id?: string;
  program_id?: string;
  code?: string;
  level_number?: string;
  description?: string;
}
