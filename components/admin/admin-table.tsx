'use client';

import { Trash2, Edit2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  loading?: boolean;
}

export function AdminTable({ columns, data, onEdit, onDelete, loading }: AdminTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg border border-border">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg border border-border">
        <p className="text-muted-foreground">No records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full">
        <thead className="bg-muted border-b border-border">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-muted transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-foreground">
                  {item[col.key] || '-'}
                </td>
              ))}
              <td className="px-6 py-4 text-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
