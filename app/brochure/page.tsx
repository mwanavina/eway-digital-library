'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Clock3, Search, ShieldCheck, Sparkles, Users, CheckCircle2 } from 'lucide-react';

const problems = [
  {
    title: 'Resources are scattered',
    description: 'Students and lecturers often waste time searching across multiple places for past papers, course outlines, and study material.',
  },
  {
    title: 'Important files are hard to find',
    description: 'Without a central library, useful documents are buried in chats, emails, and shared folders.',
  },
  {
    title: 'Low visibility for academic content',
    description: 'Great materials are underused when they are not organized, searchable, or easy to browse.',
  },
];

const features = [
  {
    title: 'Smart discovery',
    description: 'Find resources quickly with search, filters, and topic-based browsing by school, department, course, and level.',
    icon: Search,
  },
  {
    title: 'Structured academic library',
    description: 'Organize documents into a clean, reliable archive for past papers, outlines, and other academic resources.',
    icon: BookOpen,
  },
  {
    title: 'Simple admin controls',
    description: 'Admins can upload, manage, and maintain content with a streamlined dashboard built for everyday use.',
    icon: ShieldCheck,
  },
];

const benefits = [
  {
    title: 'Save time',
    description: 'Students get the right materials faster without endless searching.',
    icon: Clock3,
  },
  {
    title: 'Extend the library beyond the classroom',
    description: 'A digital archive grows beyond physical limits, making more resources available to more learners.',
    icon: BookOpen,
  },
  {
    title: 'Support many students at once',
    description: 'Multiple learners can access the same content simultaneously without delays or bottlenecks.',
    icon: Users,
  },
  {
    title: 'Make sharing easy',
    description: 'Students can quickly pass useful materials to classmates and strengthen collaboration around important content.',
    icon: Search,
  },
  {
    title: 'Access materials 24/7 online',
    description: 'The library is available anytime, anywhere, so studying is not limited by location or opening hours.',
    icon: Sparkles,
  },
  {
    title: 'Keep everything well organised',
    description: 'Clear structure, categories, and search tools help users find what they need with less effort and more confidence.',
    icon: ShieldCheck,
  },
];

export default function BrochurePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full border border-[#1782C5]/20 bg-[#1782C5]/10 px-3 py-1 text-sm font-medium text-[#1782C5] dark:border-[#1782C5]/30 dark:bg-[#1782C5]/20">
              Eway Digital Library
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              A smarter way to access academic resources.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Eway brings learning materials into one organized digital space so students and staff can find what they need quickly and confidently.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 rounded-full bg-[#1782C5] px-5 py-3 font-semibold text-white transition hover:bg-[#1F2557]"
              >
                Get started
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-[#1782C5] hover:text-[#1782C5] dark:border-slate-700 dark:text-slate-200"
              >
                Browse library
              </Link>
            </div>
          </div>

          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-gradient-to-br from-[#1782C5] to-[#1F2557] p-8 text-white shadow-xl dark:border-slate-800">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">What this solves</p>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-100">
              <li className="flex gap-3">
                <CheckCircle2 size={18} className="mt-1 shrink-0" />
                <span>Reduces time spent searching for course content and past papers.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 size={18} className="mt-1 shrink-0" />
                <span>Creates a single trusted place for academic materials.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 size={18} className="mt-1 shrink-0" />
                <span>Improves access for both students and academic staff.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1782C5]">The problem</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Academic resources are often scattered and difficult to manage.</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Students and lecturers often rely on fragmented storage systems, making it harder to find trusted documents when they need them most.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {problems.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1782C5]">Features</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Built to make academic content easier to discover and manage.</h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="inline-flex rounded-xl bg-[#1782C5]/10 p-3 text-[#1782C5] dark:bg-[#1782C5]/20">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1782C5]">Benefits</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A better library experience for everyone involved.</h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-[#1F2557] p-8 text-white shadow-xl dark:border-slate-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold">Ready to make learning resources easier to find?</h2>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Eway helps institutions turn scattered materials into a clear, dependable digital library.
              </p>
            </div>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-[#1F2557] transition hover:bg-slate-100"
            >
              Explore the platform
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
