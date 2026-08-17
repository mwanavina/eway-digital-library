'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAllDocuments, fetchAllSchools, fetchAllDepartments, fetchAllPrograms, fetchAllCourses, fetchAllLevels, fetchAllResourceTypes } from '@/app/actions/admin';
import { authClient } from '@/lib/auth-client';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminDocumentList } from '@/components/admin/document-list';
import type { AdminItem, Tab } from '@/components/admin/admin-types';

export default function AdminDocumentsPage() {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();

  const [documents, setDocuments] = useState<AdminItem[]>([]);
  const [schools, setSchools] = useState<AdminItem[]>([]);
  const [departments, setDepartments] = useState<AdminItem[]>([]);
  const [programs, setPrograms] = useState<AdminItem[]>([]);
  const [courses, setCourses] = useState<AdminItem[]>([]);
  const [levels, setLevels] = useState<AdminItem[]>([]);
  const [resourceTypes, setResourceTypes] = useState<AdminItem[]>([]);

  const user = session?.user;

  useEffect(() => {
    if (!user) return;
    void loadPageData();
  }, [user]);

  async function loadPageData() {
    const [documentsRes, schoolsRes, departmentsRes, programsRes, coursesRes, levelsRes, resourceTypesRes] = await Promise.all([
      fetchAllDocuments(),
      fetchAllSchools(),
      fetchAllDepartments(),
      fetchAllPrograms(),
      fetchAllCourses(),
      fetchAllLevels(),
      fetchAllResourceTypes(),
    ]);

    setDocuments(documentsRes.data || []);
    setSchools(schoolsRes.data || []);
    setDepartments(departmentsRes.data || []);
    setPrograms(programsRes.data || []);
    setCourses(coursesRes.data || []);
    setLevels(levelsRes.data || []);
    setResourceTypes(resourceTypesRes.data || []);
  }

  if (isPending) {
    return (
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
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Please sign in to access the admin area.</p>
      </div>
    );
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

  const headerContent = <AdminHeader onSignOut={async () => { await authClient.signOut({ fetchOptions: { onSuccess: () => router.push('/sign-in') } }); }} userSession={{ user }} />;

  const sidebarContent = (isMinimized: boolean) => (
    <AdminSidebar
      activeTab="documents"
      tabs={tabs}
      onTabChange={(tab) => {
        if (tab === 'upload') {
          router.push('/admin/upload');
          return;
        }
        if (tab === 'documents') {
          router.push('/admin/documents');
          return;
        }
        router.push(`/admin?tab=${tab}`);
      }}
      onCreateClick={() => router.push('/admin?tab=schools')}
      onDocumentsTabClick={() => router.push('/admin/documents')}
      isMinimized={isMinimized}
    />
  );

  const mainContent = (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">All documents</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review and manage every uploaded resource in one place.</p>
          </div>

          <AdminDocumentList
            documents={documents}
            onDelete={() => void loadPageData()}
          />
        </div>
      </div>
    </div>
  );

  return <AdminLayout sidebar={sidebarContent} header={headerContent} content={mainContent} />;
}
