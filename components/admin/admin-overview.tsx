'use client';

interface AdminOverviewProps {
  documentsCount: number;
  coursesCount: number;
  schoolsCount: number;
  programsCount: number;
  academicUnitCount: number;
}

export function AdminOverview({
  documentsCount,
  coursesCount,
  schoolsCount,
  programsCount,
  academicUnitCount,
}: AdminOverviewProps) {
  return (
    <>
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1782C5] via-[#1F2557] to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
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
              <p className="mt-1 text-2xl font-semibold">{documentsCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Courses</p>
              <p className="mt-1 text-2xl font-semibold">{coursesCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Schools</p>
              <p className="mt-1 text-2xl font-semibold">{schoolsCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total documents</p>
              <p className="mt-2 text-3xl font-semibold">{documentsCount}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
              <span className="sr-only">Documents</span>
              📄
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total courses</p>
              <p className="mt-2 text-3xl font-semibold">{coursesCount}</p>
            </div>
            <div className="rounded-2xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
              <span className="sr-only">Courses</span>
              📚
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Programs</p>
              <p className="mt-2 text-3xl font-semibold">{programsCount}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="sr-only">Programs</span>
              📈
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Academic units</p>
              <p className="mt-2 text-3xl font-semibold">{academicUnitCount}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
              <span className="sr-only">Academic units</span>
              🧑‍🏫
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
