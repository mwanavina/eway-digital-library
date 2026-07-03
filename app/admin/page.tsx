'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createSchool,
  deleteSchool,
  createDepartment,
  deleteDepartment,
  createProgram,
  deleteProgram,
  createCourse,
  deleteCourse,
  createLevel,
  deleteLevel,
  fetchAllSchools,
  fetchAllDepartments,
  fetchAllPrograms,
  fetchAllCourses,
  fetchAllLevels,
  fetchAllDocuments,
  fetchAllResourceTypes,
} from '@/app/actions/admin';
import { authClient } from '@/lib/auth-client';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminOverview } from '@/components/admin/admin-overview';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminModal } from '@/components/admin/admin-modal';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { AdminForm } from '@/components/admin/admin-form';
import { Tab, AdminItem, AdminFormData } from '@/components/admin/admin-types';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [schools, setSchools] = useState<AdminItem[]>([]);
  const [departments, setDepartments] = useState<AdminItem[]>([]);
  const [programs, setPrograms] = useState<AdminItem[]>([]);
  const [courses, setCourses] = useState<AdminItem[]>([]);
  const [levels, setLevels] = useState<AdminItem[]>([]);
  const [documents, setDocuments] = useState<AdminItem[]>([]);
  const [resourceTypes, setResourceTypes] = useState<AdminItem[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<AdminItem | null>(null);
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
  const [formData, setFormData] = useState<AdminFormData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function verifyAccess() {
      try {
        const response = await fetch('/api/admin', { cache: 'no-store' });
        if (!isActive) return;

        if (!response.ok) {
          router.replace('/dashboard');
        }
      } catch {
        if (isActive) router.replace('/dashboard');
      }
    }

    void verifyAccess();
    void loadAllData();

    return () => {
      isActive = false;
    };
  }, [router]);

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

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        },
      },
    });
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      switch (activeTab) {
        case 'schools':
          await createSchool(formData.name);
          break;
        case 'departments':
          await createDepartment(formData.name, parseInt(formData.school_id, 10));
          break;
        case 'programs':
          await createProgram(formData.name, parseInt(formData.department_id, 10));
          break;
        case 'courses':
          await createCourse(formData.code, formData.name, parseInt(formData.program_id, 10));
          break;
        case 'levels':
          await createLevel(parseInt(formData.level_number, 10), formData.description);
          break;
      }

      await loadAllData();
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
        case 'schools':
          await deleteSchool(confirmDelete.id);
          break;
        case 'departments':
          await deleteDepartment(confirmDelete.id);
          break;
        case 'programs':
          await deleteProgram(confirmDelete.id);
          break;
        case 'courses':
          await deleteCourse(confirmDelete.id);
          break;
        case 'levels':
          await deleteLevel(confirmDelete.id);
          break;
      }

      await loadAllData();
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

  function openEditModal(item: AdminItem) {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AdminHeader onSignOut={handleSignOut} />

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <AdminOverview
          documentsCount={documents.length}
          coursesCount={courses.length}
          schoolsCount={schools.length}
          programsCount={programs.length}
          academicUnitCount={schools.length + departments.length}
        />

        <section className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <AdminSidebar
            activeTab={activeTab}
            tabs={tabs}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab === 'documents') loadDocuments();
            }}
            onCreateClick={openCreateModal}
            onDocumentsTabClick={loadDocuments}
          />

          <AdminContent
            activeTab={activeTab}
            schools={schools}
            departments={departments}
            programs={programs}
            courses={courses}
            levels={levels}
            documents={documents}
            loading={loading}
            onCreateClick={openCreateModal}
            onEdit={openEditModal}
            onDelete={(item) => setConfirmDelete(item)}
            onUploadSuccess={() => {
              setActiveTab('documents');
              loadDocuments();
            }}
          />
        </section>
      </main>

      <AdminModal
        isOpen={isModalOpen}
        title={editingItem ? `Edit ${activeTab}` : `Add new ${activeTab}`}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          setFormData({});
        }}
      >
        <AdminForm
          activeTab={activeTab}
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingItem(null);
            setFormData({});
          }}
          onSubmit={handleCreate}
          schools={schools}
          departments={departments}
          programs={programs}
        />
      </AdminModal>

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
