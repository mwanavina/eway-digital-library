'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createSchool,
  deleteSchool,
  updateSchool,
  createDepartment,
  deleteDepartment,
  updateDepartment,
  createProgram,
  deleteProgram,
  updateProgram,
  createCourse,
  deleteCourse,
  updateCourse,
  createLevel,
  deleteLevel,
  updateLevel,
  createResourceType,
  deleteResourceType,
  updateResourceType,
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
import { AdminAnalytics } from '@/components/admin/admin-analytics';
import { AdminUsersList } from '@/components/admin/admin-users-list';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Tab, AdminItem, AdminFormData, type AdminActivity } from '@/components/admin/admin-types';
import { toast } from 'sonner';
import { fetchAdminActivities, logAdminActivity } from '@/app/actions/admin-activity';

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    data: session,
    isPending,
    error,
  } = authClient.useSession();

  const [activeTab, setActiveTab] = useState<Tab>('documents');
  const [schools, setSchools] = useState<AdminItem[]>([]);
  const [departments, setDepartments] = useState<AdminItem[]>([]);
  const [programs, setPrograms] = useState<AdminItem[]>([]);
  const [courses, setCourses] = useState<AdminItem[]>([]);
  const [levels, setLevels] = useState<AdminItem[]>([]);
  const [documents, setDocuments] = useState<AdminItem[]>([]);
  const [resourceTypes, setResourceTypes] = useState<AdminItem[]>([]);
  const [activities, setActivities] = useState<AdminActivity[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<AdminItem | null>(null);
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
  const [formData, setFormData] = useState<AdminFormData>({});
  const [loading, setLoading] = useState(false);

  const user = session?.user;

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as Tab | null;
    if (tabFromUrl && ['documents', 'users', 'analytics', 'schools', 'departments', 'programs', 'courses', 'levels', 'resource-types'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;

    void loadAllData();
    void loadDocuments();
    void loadActivities();
  }, [user]);

  if (isPending) {
    return (
      // spinnner
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Loading...</p>
        <div className="ml-2 h-4 w-4 animate-bounce rounded-full bg-slate-700 dark:bg-slate-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold text-red-600 dark:text-red-400">Error: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
          Please sign in to access the admin area.
        </p>
      </div>
    );
  }

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
      console.error('Error loading documents:', error);
    }
  }

  async function loadActivities() {
    try {
      const result = await fetchAdminActivities(8);
      if (result.success) {
        setActivities(result.data || []);
      }
    } catch (error) {
      console.error('Error loading admin activities:', error);
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

  async function addActivity(activity: Omit<AdminActivity, 'id'>) {
    const result = await logAdminActivity({
      action: activity.action,
      entity: activity.entity,
      title: activity.title,
      userName: activity.actorName,
    });

    if (result.success) {
      await loadActivities();
    }
  }

  async function handleCreate(data: AdminFormData) {
    setLoading(true);

    try {
      let itemLabel = 'item';

      if (editingItem) {
        switch (activeTab) {
          case 'schools':
            await updateSchool(editingItem.id, data.name ?? '');
            itemLabel = 'school';
            break;
          case 'departments':
            await updateDepartment(editingItem.id, data.name ?? '', Number.parseInt(data.school_id ?? '0', 10));
            itemLabel = 'department';
            break;
          case 'programs':
            await updateProgram(editingItem.id, data.name ?? '', Number.parseInt(data.department_id ?? '0', 10));
            itemLabel = 'program';
            break;
          case 'courses':
            await updateCourse(editingItem.id, data.code ?? '', data.name ?? '', Number.parseInt(data.program_id ?? '0', 10));
            itemLabel = 'course';
            break;
          case 'levels':
            await updateLevel(editingItem.id, Number.parseInt(data.level_number ?? '0', 10), data.description ?? '');
            itemLabel = 'level';
            break;
          case 'resource-types':
            await updateResourceType(editingItem.id, data.name ?? '', data.description ?? '');
            itemLabel = 'resource type';
            break;
        }
      } else {
        switch (activeTab) {
          case 'schools':
            await createSchool({ name: data.name ?? '' });
            itemLabel = 'school';
            break;
          case 'departments':
            await createDepartment({ name: data.name ?? '', schoolId: Number.parseInt(data.school_id ?? '0', 10) });
            itemLabel = 'department';
            break;
          case 'programs':
            await createProgram({ name: data.name ?? '', departmentId: Number.parseInt(data.department_id ?? '0', 10) });
            itemLabel = 'program';
            break;
          case 'courses':
            await createCourse({ code: data.code ?? '', name: data.name ?? '', programId: Number.parseInt(data.program_id ?? '0', 10) });
            itemLabel = 'course';
            break;
          case 'levels':
            await createLevel({ levelNumber: Number.parseInt(data.level_number ?? '0', 10), description: data.description ?? '' });
            itemLabel = 'level';
            break;
          case 'resource-types':
            await createResourceType({ name: data.name ?? '', description: data.description ?? '' });
            itemLabel = 'resource type';
            break;
        }
      }

      await Promise.all([loadAllData(), loadDocuments()]);
      addActivity({
        action: editingItem ? 'updated' : 'created',
        entity: itemLabel,
        title: `${editingItem ? 'Updated' : 'Created'} ${itemLabel}`,
        timestamp: new Date().toLocaleString(),
      });
      setIsModalOpen(false);
      setFormData({});
      setEditingItem(null);
      toast.success(editingItem ? `Updated ${itemLabel} successfully.` : `Created ${itemLabel} successfully.`);
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error(editingItem ? 'Failed to update the selected item.' : 'Failed to create the selected item.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setLoading(true);

    try {
      let itemLabel = 'item';

      switch (activeTab) {
        case 'schools':
          await deleteSchool(confirmDelete.id);
          itemLabel = 'school';
          break;
        case 'departments':
          await deleteDepartment(confirmDelete.id);
          itemLabel = 'department';
          break;
        case 'programs':
          await deleteProgram(confirmDelete.id);
          itemLabel = 'program';
          break;
        case 'courses':
          await deleteCourse(confirmDelete.id);
          itemLabel = 'course';
          break;
        case 'levels':
          await deleteLevel(confirmDelete.id);
          itemLabel = 'level';
          break;
        case 'resource-types':
          await deleteResourceType(confirmDelete.id);
          itemLabel = 'resource type';
          break;
      }

      await Promise.all([loadAllData(), loadDocuments()]);
      addActivity({
        action: 'deleted',
        entity: itemLabel,
        title: `Deleted ${itemLabel}`,
        timestamp: new Date().toLocaleString(),
      });
      setConfirmDelete(null);
      toast.success(`Deleted ${itemLabel} successfully.`);
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to delete the selected item.');
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
    setFormData(
      activeTab === 'departments'
        ? { name: item.name, school_id: item.schoolId?.toString() ?? item.school_id?.toString() ?? '' }
        : activeTab === 'programs'
          ? { name: item.name, department_id: item.departmentId?.toString() ?? item.department_id?.toString() ?? '' }
          : activeTab === 'courses'
            ? { code: item.code, name: item.name, program_id: item.programId?.toString() ?? item.program_id?.toString() ?? '' }
            : activeTab === 'levels'
              ? { level_number: item.levelNumber?.toString() ?? item.level_number?.toString() ?? '', description: item.description ?? '' }
            : activeTab === 'resource-types'
              ? { name: item.name ?? '', description: item.description ?? '' }
              : { name: item.name }
    );
    setIsModalOpen(true);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'documents', label: 'Manage Documents' },
    { id: 'users', label: 'Users' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'schools', label: 'Schools' },
    { id: 'departments', label: 'Departments' },
    { id: 'programs', label: 'Programs' },
    { id: 'courses', label: 'Courses' },
    { id: 'levels', label: 'Levels' },
    { id: 'resource-types', label: 'Resource Types' },
  ];

  const headerContent = <AdminHeader onSignOut={handleSignOut} userSession={{ user }} />;

  const sidebarContent = (isMinimized: boolean) => (
    <AdminSidebar
      activeTab={activeTab}
      tabs={tabs}
      onTabChange={(tab) => {
        if (tab === 'upload') {
          router.push('/admin/upload');
          return;
        }

        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.push(`/admin?${params.toString()}`);
        setActiveTab(tab);
        if (tab === 'documents') loadDocuments();
      }}
      onCreateClick={openCreateModal}
      onDocumentsTabClick={loadDocuments}
      isMinimized={isMinimized}
    />
  );

  const mainContent = (
    <>
      <div className="space-y-6">
        {activeTab === 'documents' && (
          <AdminOverview
            documentsCount={documents.length}
            coursesCount={courses.length}
            schoolsCount={schools.length}
            programsCount={programs.length}
            academicUnitCount={schools.length + departments.length}
            activities={activities}
          />
        )}

        {activeTab === 'users' ? (
          <AdminUsersList />
        ) : activeTab === 'analytics' ? (
          <AdminAnalytics />
        ) : (
          <AdminContent
            activeTab={activeTab}
            schools={schools}
            departments={departments}
            programs={programs}
            courses={courses}
            levels={levels}
            resources={resourceTypes}
            documents={documents}
            loading={loading}
            onCreateClick={openCreateModal}
            onEdit={openEditModal}
            onDelete={(item) => setConfirmDelete(item)}
            onUploadSuccess={() => {
              setActiveTab('documents');
              loadDocuments();
            }}
            onActivity={addActivity}
          />
        )}
      </div>

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
    </>
  );

  return <AdminLayout sidebar={sidebarContent} header={headerContent} content={mainContent} />;
}
