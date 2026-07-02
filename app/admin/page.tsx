'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Plus,
  Users,
  FileText,
  Folder,
  BarChart3,
  LayoutGrid,
  UploadCloud,
  Database,
  Sparkles,
  Home,
  LogOut,
  UserCircle2,
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { authClient } from '@/lib/auth-client';
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
  const router = useRouter();
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

  useEffect(() => {
    let isActive = true;

    async function verifyAccess() {
      try {
        const response = await fetch('/api/admin', { cache: 'no-store' });
        if (!isActive) {
          return;
        }

        if (!response.ok) {
          router.replace('/dashboard');
          return;
        }
      } catch {
        if (isActive) {
          router.replace('/dashboard');
        }
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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200/70 bg-[#1782C5] text-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 p-1.5 shadow-sm">
              <Image
                src="/eway-logo.png"
                alt="Eway Library Logo"
                width={40}
                height={40}
                priority
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <p className="text-base font-semibold">Eway Library</p>
              <p className="text-xs text-blue-100">Admin control center</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 sm:flex"
            >
              <Home size={16} />
              Back to app
            </Link>
            <ThemeSwitcher />
            <Popover>
              <PopoverTrigger
                type="button"
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 p-2 transition-colors hover:bg-white/20"
                aria-label="Admin profile"
              >
                <UserCircle2 size={18} />
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <PopoverHeader className="space-y-1">
                  <PopoverTitle>Admin account</PopoverTitle>
                  <PopoverDescription>Manage your workspace and sign out safely.</PopoverDescription>
                </PopoverHeader>
                <div className="mt-3 flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/account">View account</Link>
                  </Button>
                  <Button onClick={handleSignOut} variant="destructive" className="w-full">
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1782C5] via-[#1F2557] to-slate-900 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                <Sparkles size={16} />
                System overview
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Admin dashboard</h1>
              <p className="mt-3 text-sm text-blue-100 sm:text-base">
                Manage uploads, organize academic structures, and keep the library running smoothly from one place.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Documents</p>
                <p className="mt-1 text-2xl font-semibold">{documents.length}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Courses</p>
                <p className="mt-1 text-2xl font-semibold">{courses.length}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Schools</p>
                <p className="mt-1 text-2xl font-semibold">{schools.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total documents</p>
                <p className="mt-2 text-3xl font-semibold">{documents.length}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                <FileText size={20} />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total courses</p>
                <p className="mt-2 text-3xl font-semibold">{courses.length}</p>
              </div>
              <div className="rounded-2xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
                <Folder size={20} />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Programs</p>
                <p className="mt-2 text-3xl font-semibold">{programs.length}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                <BarChart3 size={20} />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Academic units</p>
                <p className="mt-2 text-3xl font-semibold">{schools.length + departments.length}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
                <Users size={20} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Quick actions</p>
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => setActiveTab('upload')}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:border-[#1782C5] hover:bg-blue-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <UploadCloud size={16} className="text-[#1782C5]" />
                  Upload documents
                </button>
                <button
                  onClick={() => {
                    setActiveTab('schools');
                    openCreateModal();
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:border-[#1782C5] hover:bg-blue-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Database size={16} className="text-[#1782C5]" />
                  Add academic structure
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <LayoutGrid size={16} className="text-[#1782C5]" />
                Workspace modules
              </div>
              <div className="mt-3 flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === 'documents') loadDocuments();
                    }}
                    className={`rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#1782C5] text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Workspace controls</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Move between management areas and keep the library organized.</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Live workspace
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload documents</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add new papers, journals, and other academic resources to the library.</p>
                  </div>
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
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">All documents</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review and manage every uploaded resource in one place.</p>
                  </div>
                  <AdminDocumentList documents={documents} />
                </div>
              )}

              {activeTab === 'schools' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Schools</h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create and manage the schools that power the platform.</p>
                    </div>
                    <button
                      onClick={openCreateModal}
                      className="flex items-center gap-2 rounded-lg bg-[#1782C5] px-4 py-2 text-white transition-colors hover:bg-[#1F2557]"
                    >
                      <Plus size={18} />
                      Add school
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

              {activeTab === 'departments' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Departments</h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Keep departments aligned with the right school.</p>
                    </div>
                    <button
                      onClick={openCreateModal}
                      className="flex items-center gap-2 rounded-lg bg-[#1782C5] px-4 py-2 text-white transition-colors hover:bg-[#1F2557]"
                    >
                      <Plus size={18} />
                      Add department
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

              {activeTab === 'programs' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Programs</h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage the academic programs students can browse.</p>
                    </div>
                    <button
                      onClick={openCreateModal}
                      className="flex items-center gap-2 rounded-lg bg-[#1782C5] px-4 py-2 text-white transition-colors hover:bg-[#1F2557]"
                    >
                      <Plus size={18} />
                      Add program
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

              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Courses</h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Organize the course catalog and their program links.</p>
                    </div>
                    <button
                      onClick={openCreateModal}
                      className="flex items-center gap-2 rounded-lg bg-[#1782C5] px-4 py-2 text-white transition-colors hover:bg-[#1F2557]"
                    >
                      <Plus size={18} />
                      Add course
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

              {activeTab === 'levels' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Levels</h2>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Define the student progression levels used across the platform.</p>
                    </div>
                    <button
                      onClick={openCreateModal}
                      className="flex items-center gap-2 rounded-lg bg-[#1782C5] px-4 py-2 text-white transition-colors hover:bg-[#1F2557]"
                    >
                      <Plus size={18} />
                      Add level
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
          </div>
        </section>
      </main>

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
