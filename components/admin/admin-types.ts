'use client';

export type Tab = 'schools' | 'departments' | 'programs' | 'courses' | 'levels' | 'documents' | 'upload';

export interface AdminItem {
  [key: string]: any;
}

export interface AdminTabConfig {
  id: Tab;
  label: string;
}

export type AdminFormData = Record<string, any>;
