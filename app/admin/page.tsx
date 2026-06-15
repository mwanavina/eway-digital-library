'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, FileText, Folder, BarChart3 } from 'lucide-react';
import { AdminTable } from '@/components/admin/admin-table';
import { AdminModal } from '@/components/admin/admin-modal';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { AdminUploadFormEnhanced } from '@/components/admin/upload-form-enhanced';
import { AdminDocumentList } from '@/components/admin/document-list';
import {
  createSchool,
  updateSchool,
  deleteSchool,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  createProgram,
  updateProgram,
  deleteProgram,
  createCourse,
  updateCourse,
  deleteCourse,
  createLevel,
  updateLevel,
  deleteLevel,
  fetchAllSchools,
  fetchAllDepartments,
  fetchAllPrograms,
  fetchAllCourses,
  fetchAllLevels,
  fetchAllDocuments,
  fetchAllResourceTypes,
} from '@/app/actions/admin';

type Tab = 'schools' | 'departments' | 'programs' | 'courses' | 'levels' | 'documents' | 'upload';

interface FormData {
  [key: string]: any;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [schools, setSchools] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [resourceTypes, setResourceTypes] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);

  // Load data
  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    const [schoolsRes, depsRes, progsRes, coursesRes, levelsRes, resourceTypesRes] = await Promise.all([
      fetchAllSchools(),
      fetchAllDepartments(),
      fetchAllPrograms(),
      fetchAllCourses(),
      fetchAllLevels(),
      fetchAllResourceTypes(),
    ]);

    setSchools(schoolsRes.data || []);
    setDepartments(depsRes.data || []);
    setPrograms(progsRes.data || []);
    setCourses(coursesRes.data || []);
    setLevels(levelsRes.data || []);
    setResourceTypes(resourceTypesRes.data || []);
  }

  async function loadDocuments() {
    try {
      const result = await fetchAllDocuments();
      setDocuments(result.data || []);
    } catch (error) {
      console.error('[v0] Error loading documents:', error);
    }
  }

  // Handle CRUD operations
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      switch (activeTab) {
        case 'schools': {
          await createSchool(formData.name);
          await loadAllData();
          break;
        }
        case 'departments': {
          await createDepartment(formData.name, parseInt(formData.school_id));
          await loadAllData();
          break;
        }
        case 'programs': {
          await createProgram(formData.name, parseInt(formData.department_id));
          await loadAllData();
          break;
        }
        case 'courses': {
          await createCourse(formData.code, formData.name, parseInt(formData.program_id));
          await loadAllData();
          break;
        }
        case 'levels': {
          await createLevel(parseInt(formData.level_number), formData.description);
          await loadAllData();
          break;
        }
      }

      setIsModalOpen(false);
      setFormData({});
      setEditingItem(null);
    } catch (error) {
      console.error('[v0] Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;

    setLoading(true);
    try {
      switch (activeTab) {
        case 'schools': {
          await deleteSchool(confirmDelete.id);
          await loadAllData();
          break;
        }
        case 'departments': {
          await deleteDepartment(confirmDelete.id);
          await loadAllData();
          break;
        }
        case 'programs': {
          await deleteProgram(confirmDelete.id);
          await loadAllData();
          break;
        }
        case 'courses': {
          await deleteCourse(confirmDelete.id);
          await loadAllData();
          break;
        }
        case 'levels': {
          await deleteLevel(confirmDelete.id);
          await loadAllData();
          break;
        }
      }

      setConfirmDelete(null);
    } catch (error) {
      console.error('[v0] Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingItem(null);
    setFormData({});
    setIsModalOpen(true);
  }

  function openEditModal(item: any) {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'upload', label: 'Upload Documents' },
    { id: 'documents', label: 'Manage Documents' },
    { id: 'schools', label: 'Schools' },
    { id: 'departments', label: 'Departments' },
    { id: 'programs', label: 'Programs' },
    { id: 'courses', label: 'Courses' },
    { id: 'levels', label: 'Levels' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-[#1782C5] dark:bg-slate-900 text-white py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-blue-100 dark:text-blue-300 mt-1">Manage system resources and monitor platform analytics</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Documents */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{documents.length}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <FileText size={24} className="text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          {/* Total Courses */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{courses.length}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <Folder size={24} className="text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>

          {/* Total Programs */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Programs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{programs.length}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <BarChart3 size={24} className="text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          {/* Total Schools */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Schools</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{schools.length}</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                <Users size={24} className="text-orange-600 dark:text-orange-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex overflow-x-auto gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'documents') loadDocuments();
                }}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#1782C5] text-[#1782C5] dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-6">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Upload Documents</h2>
              <AdminUploadFormEnhanced
                schools={schools}
                departments={departments}
                programs={programs}
                courses={courses}
                resourceTypes={resourceTypes}
                onSuccess={() => {
                  setActiveTab('documents');
                  loadDocuments();
                }}
              />
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">All Documents</h2>
            <AdminDocumentList documents={documents} />
          </div>
        )}

        {/* Schools Tab */}
        {activeTab === 'schools' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Schools</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-[#1782C5] text-white px-4 py-2 rounded-lg hover:bg-[#1F2557] transition-colors"
              >
                <Plus size={20} />
                Add School
              </button>
            </div>
            <AdminTable
              columns={[{ key: 'name', label: 'Name' }]}
              data={schools}
              onEdit={openEditModal}
              onDelete={(item) => setConfirmDelete(item)}
            />
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Departments</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-[#1782C5] text-white px-4 py-2 rounded-lg hover:bg-[#1F2557] transition-colors"
              >
                <Plus size={20} />
                Add Department
              </button>
            </div>
            <AdminTable
              columns={[
                { key: 'name', label: 'Department' },
                { key: 'school_name', label: 'School' },
              ]}
              data={departments}
              onEdit={openEditModal}
              onDelete={(item) => setConfirmDelete(item)}
            />
          </div>
        )}

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Programs</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-[#1782C5] text-white px-4 py-2 rounded-lg hover:bg-[#1F2557] transition-colors"
              >
                <Plus size={20} />
                Add Program
              </button>
            </div>
            <AdminTable
              columns={[
                { key: 'name', label: 'Program' },
                { key: 'department_name', label: 'Department' },
                { key: 'school_name', label: 'School' },
              ]}
              data={programs}
              onEdit={openEditModal}
              onDelete={(item) => setConfirmDelete(item)}
            />
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Courses</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-[#1782C5] text-white px-4 py-2 rounded-lg hover:bg-[#1F2557] transition-colors"
              >
                <Plus size={20} />
                Add Course
              </button>
            </div>
            <AdminTable
              columns={[
                { key: 'code', label: 'Code' },
                { key: 'name', label: 'Course' },
                { key: 'program_name', label: 'Program' },
              ]}
              data={courses}
              onEdit={openEditModal}
              onDelete={(item) => setConfirmDelete(item)}
            />
          </div>
        )}

        {/* Levels Tab */}
        {activeTab === 'levels' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Levels</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-[#1782C5] text-white px-4 py-2 rounded-lg hover:bg-[#1F2557] transition-colors"
              >
                <Plus size={20} />
                Add Level
              </button>
            </div>
            <AdminTable
              columns={[
                { key: 'level_number', label: 'Level' },
                { key: 'description', label: 'Description' },
              ]}
              data={levels}
              onEdit={openEditModal}
              onDelete={(item) => setConfirmDelete(item)}
            />
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        title={editingItem ? `Edit ${activeTab}` : `Add new ${activeTab}`}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          setFormData({});
        }}
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Schools */}
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

          {/* Departments */}
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

          {/* Programs */}
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

          {/* Courses */}
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

          {/* Levels */}
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
              onClick={() => {
                setIsModalOpen(false);
                setEditingItem(null);
                setFormData({});
              }}
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
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Item"
        message={`Are you sure you want to delete this ${activeTab} item? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
        loading={loading}
      />
    </div>
  );
}
