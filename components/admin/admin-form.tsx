'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminFormData, AdminItem, Tab } from '@/components/admin/admin-types';

interface AdminFormProps {
  activeTab: Tab;
  formData: AdminFormData;
  setFormData: (data: AdminFormData) => void;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (data: AdminFormData) => Promise<void>;
  schools: AdminItem[];
  departments: AdminItem[];
  programs: AdminItem[];
}

const schoolSchema = z.object({
  name: z.string().trim().min(2, 'School name must be at least 2 characters').max(100),
});

const departmentSchema = z.object({
  school_id: z.string().min(1, 'Please select a school'),
  name: z.string().trim().min(2, 'Department name must be at least 2 characters').max(100),
});

const programSchema = z.object({
  department_id: z.string().min(1, 'Please select a department'),
  name: z.string().trim().min(2, 'Program name must be at least 2 characters').max(100),
});

const courseSchema = z.object({
  program_id: z.string().min(1, 'Please select a program'),
  code: z.string().trim().min(2, 'Course code is required').max(20),
  name: z.string().trim().min(2, 'Course name is required').max(100),
});

const levelSchema = z.object({
  level_number: z.string().min(1, 'Level number is required'),
  description: z.string().trim().min(2, 'Description is required').max(200),
});

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
  const schema =
    activeTab === 'schools'
      ? schoolSchema
      : activeTab === 'departments'
        ? departmentSchema
        : activeTab === 'programs'
          ? programSchema
          : activeTab === 'courses'
            ? courseSchema
            : activeTab === 'levels'
              ? levelSchema
              : z.object({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminFormData>({
    resolver: zodResolver(schema as any),
    defaultValues: formData,
  });

  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  const submitForm = async (data: AdminFormData) => {
    setFormData(data);
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      {activeTab === 'schools' && (
        <div>
          <input
            type="text"
            placeholder="School name"
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{String(errors.name.message)}</p>}
        </div>
      )}

      {activeTab === 'departments' && (
        <>
          <select
            {...register('school_id')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
          >
            <option value="">Select School</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <div>
            <input
              type="text"
              placeholder="Department name"
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{String(errors.name.message)}</p>}
          </div>
          {errors.school_id && <p className="mt-1 text-sm text-red-600">{String(errors.school_id.message)}</p>}
        </>
      )}

      {activeTab === 'programs' && (
        <>
          <select
            {...register('department_id')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <div>
            <input
              type="text"
              placeholder="Program name"
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{String(errors.name.message)}</p>}
          </div>
          {errors.department_id && <p className="mt-1 text-sm text-red-600">{String(errors.department_id.message)}</p>}
        </>
      )}

      {activeTab === 'courses' && (
        <>
          <select
            {...register('program_id')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
          >
            <option value="">Select Program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div>
            <input
              type="text"
              placeholder="Course code"
              {...register('code')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            />
            {errors.code && <p className="mt-1 text-sm text-red-600">{String(errors.code.message)}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Course name"
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{String(errors.name.message)}</p>}
          </div>
          {errors.program_id && <p className="mt-1 text-sm text-red-600">{String(errors.program_id.message)}</p>}
        </>
      )}

      {activeTab === 'levels' && (
        <>
          <div>
            <input
              type="number"
              placeholder="Level number"
              {...register('level_number')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            />
            {errors.level_number && <p className="mt-1 text-sm text-red-600">{String(errors.level_number.message)}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Description"
              {...register('description')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1782C5]"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{String(errors.description.message)}</p>}
          </div>
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
