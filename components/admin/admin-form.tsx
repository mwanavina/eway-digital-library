'use client';

import { AdminFormData, AdminItem, Tab } from '@/components/admin/admin-types';

interface AdminFormProps {
  activeTab: Tab;
  formData: AdminFormData;
  setFormData: (data: AdminFormData) => void;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  schools: AdminItem[];
  departments: AdminItem[];
  programs: AdminItem[];
}

export function AdminForm({
  activeTab,
  formData,
  setFormData,
  loading,
  onCancel,
  onSubmit,
  schools,
  departments,
  programs,
}: AdminFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {activeTab === 'schools' && (
        <input
          type="text"
          placeholder="School name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
          required
        />
      )}

      {activeTab === 'departments' && (
        <>
          <select
            value={formData.school_id || ''}
            onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            required
          >
            <option value="">Select School</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Department name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            required
          />
        </>
      )}

      {activeTab === 'programs' && (
        <>
          <select
            value={formData.department_id || ''}
            onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            required
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Program name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            required
          />
        </>
      )}

      {activeTab === 'courses' && (
        <>
          <select
            value={formData.program_id || ''}
            onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            required
          >
            <option value="">Select Program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Course code"
            value={formData.code || ''}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            required
          />
          <input
            type="text"
            placeholder="Course name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            required
          />
        </>
      )}

      {activeTab === 'levels' && (
        <>
          <input
            type="number"
            placeholder="Level number"
            value={formData.level_number || ''}
            onChange={(e) => setFormData({ ...formData, level_number: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            required
          />
        </>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-[#1782C5] text-white rounded-lg hover:bg-[#1F2557] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
