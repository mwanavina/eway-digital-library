'use client';

import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { createDocument } from '@/app/actions/documents';
import { genUploader } from 'uploadthing/client';
import * as pdfjsLib from 'pdfjs-dist';

const { uploadFiles } = genUploader();

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
}

interface PendingUpload {
  fileUrl: string;
  fileKey: string;
  fileName: string;
  thumbnailUrl: string | null;
}

interface UploadFormProps {
  schools: any[];
  departments: any[];
  programs: any[];
  courses: any[];
  levels: any[];
  onSuccess?: () => void;
}

export function AdminUploadForm({
  schools,
  departments,
  programs,
  courses,
  levels,
  onSuccess,
}: UploadFormProps) {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [semester, setSemester] = useState('1');
  const [examType, setExamType] = useState('Mid-semester');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<PendingUpload | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getValue = (item: any, keys: string[]) => {
    for (const key of keys) {
      const value = item?.[key];
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return null;
  };

  // Filter departments based on school
  const filteredDepartments = selectedSchool
    ? departments.filter((d) => Number(getValue(d, ['school_id', 'schoolId'])) === Number(selectedSchool))
    : [];

  // Filter programs based on department
  const filteredPrograms = selectedDepartment
    ? programs.filter((p) => Number(getValue(p, ['department_id', 'departmentId'])) === Number(selectedDepartment))
    : [];

  // Filter courses based on program
  const filteredCourses = selectedProgram
    ? courses.filter((c) => Number(getValue(c, ['program_id', 'programId'])) === Number(selectedProgram))
    : [];

  const generatePdfThumbnailBlob = async (pdfUrl: string) => {
    try {
      const pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
      const page = await pdf.getPage(1);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Failed to get canvas context');

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvas, canvasContext: context, viewport }).promise;

      return await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });
    } catch (error) {
      console.error('Failed to generate PDF thumbnail in browser:', error);
      return null;
    }
  };

  const handleUploadComplete = async (res: any) => {
    if (!res || !res[0]) {
      setError('Upload failed');
      return;
    }

    const uploadedFile = res[0];
    const fileUrl = uploadedFile?.serverData?.fileUrl ?? uploadedFile?.url ?? uploadedFile?.ufsUrl;
    const fileKey = uploadedFile?.serverData?.fileKey ?? uploadedFile?.key;
    const fileName = uploadedFile?.name ?? uploadedFile?.fileName ?? 'document.pdf';

    if (!fileUrl) {
      setError('PDF upload completed but no file URL was returned');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const thumbnailBlob = await generatePdfThumbnailBlob(fileUrl);
      let thumbnailUrl: string | null = null;

      if (thumbnailBlob) {
        const thumbnailFile = new File([thumbnailBlob], 'thumbnail.png', { type: 'image/png' });
        const imageUploadResult = await uploadFiles('imageUploader', {
          files: [thumbnailFile],
        });
        thumbnailUrl = imageUploadResult?.[0]?.serverData?.fileUrl ?? imageUploadResult?.[0]?.url ?? imageUploadResult?.[0]?.ufsUrl ?? null;
      }

      setPendingUpload({
        fileUrl,
        fileKey,
        fileName,
        thumbnailUrl,
      });
      setSuccess('PDF uploaded and thumbnail generated. Review below, then click Save to persist to the database.');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to generate thumbnail');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!pendingUpload) {
      setError('Please upload a PDF before saving.');
      return;
    }

    if (!selectedCourse) {
      setError('Please select a course before saving');
      return;
    }

    if (!selectedLevel) {
      setError('Please select a level before saving');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const selectedCourseName = courses.find((c) => c.id === parseInt(selectedCourse))?.name;
      const selectedLevelName = levels.find((l) => l.id === parseInt(selectedLevel))?.name;

      const result = await createDocument({
        title: `${selectedCourseName ?? 'Document'} - ${selectedLevelName ?? ''} ${year} Sem${semester} ${examType}`.trim(),
        courseId: parseInt(selectedCourse),
        levelId: parseInt(selectedLevel),
        year: parseInt(year),
        semester: parseInt(semester),
        examType,
        fileKey: pendingUpload.fileKey,
        fileUrl: pendingUpload.fileUrl,
        fileName: pendingUpload.fileName,
        thumbnailUrl: pendingUpload.thumbnailUrl ?? undefined,
      });

      if (result.success) {
        setSuccess('Document saved successfully.');
        setPendingUpload(null);
        setSelectedSchool('');
        setSelectedDepartment('');
        setSelectedProgram('');
        setSelectedCourse('');
        setSelectedLevel('');
        setYear(new Date().getFullYear().toString());
        setSemester('1');
        setExamType('Mid-semester');

        setTimeout(() => {
          onSuccess?.();
        }, 1000);
      } else {
        setError(result.error ?? 'Failed to save document');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <Upload size={20} />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* School Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">School</label>
          <select
            value={selectedSchool}
            onChange={(e) => {
              setSelectedSchool(e.target.value);
              setSelectedDepartment('');
              setSelectedProgram('');
              setSelectedCourse('');
            }}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
          >
            <option value="">Select a school...</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Department</label>
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedProgram('');
              setSelectedCourse('');
            }}
            disabled={!selectedSchool}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent disabled:bg-muted disabled:text-muted-foreground"
          >
            <option value="">Select a department...</option>
            {filteredDepartments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Program Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Program</label>
          <select
            value={selectedProgram}
            onChange={(e) => {
              setSelectedProgram(e.target.value);
              setSelectedCourse('');
            }}
            disabled={!selectedDepartment}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent disabled:bg-muted disabled:text-muted-foreground"
          >
            <option value="">Select a program...</option>
            {filteredPrograms.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.name}
              </option>
            ))}
          </select>
        </div>

        {/* Course Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            disabled={!selectedProgram}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent disabled:bg-muted disabled:text-muted-foreground"
          >
            <option value="">Select a course...</option>
            {filteredCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>

        {/* Year Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
          >
            {[2022, 2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Level Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Level</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
          >
            <option value="">Select a level...</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
          >
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>
      </div>

      {/* Exam Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Exam Type</label>
        <div className="flex flex-wrap gap-4">
          {['Mid-semester', 'End-semester', 'Supplementary', 'Deferred'].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="examType"
                value={type}
                checked={examType === type}
                onChange={(e) => setExamType(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* PDF Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Upload PDF</label>
        <div className="border-2 border-dashed border-border rounded-lg p-8">
          <UploadDropzone
            endpoint="pdfUploader"
            onClientUploadComplete={async (res) => {
              const uploadedPdf = res?.[0];
              if (!uploadedPdf) return;

              const pdfUrl = uploadedPdf.serverData?.fileUrl ?? uploadedPdf.url ?? uploadedPdf.ufsUrl;
              if (!pdfUrl) {
                setError('PDF upload completed but no file URL was returned');
                return;
              }

              const generatePdfThumbnailBlob = async (pdfUrl: string) => {
                try {
                  const pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
                  const page = await pdf.getPage(1);
                  const scale = 1.5;
                  const viewport = page.getViewport({ scale });

                  const canvas = document.createElement('canvas');
                  const context = canvas.getContext('2d');
                  if (!context) throw new Error('Failed to get canvas context');

                  canvas.width = viewport.width;
                  canvas.height = viewport.height;

                  await page.render({ canvas, canvasContext: context, viewport }).promise;

                  return await new Promise<Blob | null>((resolve) => {
                    canvas.toBlob((blob) => resolve(blob), 'image/png');
                  });
                } catch (error) {
                  console.error('Failed to generate PDF thumbnail in browser:', error);
                  return null;
                }
              };

              const thumbnailBlob = await generatePdfThumbnailBlob(pdfUrl);
              let thumbnailUrl: string | null = null;

              if (thumbnailBlob) {
                const thumbnailFile = new File([thumbnailBlob], 'thumbnail.png', { type: 'image/png' });
                const imageUploadResult = await uploadFiles('imageUploader', {
                  files: [thumbnailFile],
                });
                thumbnailUrl = imageUploadResult?.[0]?.serverData?.fileUrl ?? imageUploadResult?.[0]?.url ?? imageUploadResult?.[0]?.ufsUrl ?? null;
              }

              await handleUploadComplete({
                0: {
                  ...uploadedPdf,
                  serverData: {
                    ...(uploadedPdf.serverData ?? {}),
                    fileUrl: pdfUrl,
                    thumbnailUrl,
                  },
                },
              });
            }}
            onUploadError={(error: Error) => {
              setError(`Upload failed: ${error.message}`);
            }}
            disabled={!selectedCourse || isUploading || Boolean(pendingUpload)}
          />
        </div>
      </div>

      {pendingUpload && (
        <div className="space-y-4 p-4 bg-slate-50 border border-border rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Preview</h3>
              <p className="text-sm text-muted-foreground">Review the uploaded PDF and thumbnail before saving.</p>
            </div>
            <button
              type="button"
              onClick={() => setPendingUpload(null)}
              className="rounded-lg px-3 py-2 border border-border text-sm hover:bg-muted"
            >
              Reset upload
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="border border-border rounded-lg overflow-hidden h-[360px]">
              <iframe
                src={`${pendingUpload.fileUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full"
                title={pendingUpload.fileName}
              />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">Thumbnail</p>
                <div className="mt-2 rounded-lg border border-border bg-white h-64 overflow-hidden flex items-center justify-center">
                  {pendingUpload.thumbnailUrl ? (
                    <img src={pendingUpload.thumbnailUrl} alt="PDF thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-sm text-muted-foreground">Thumbnail generation failed or is unavailable.</div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveDocument}
                disabled={isSaving}
                className="w-full rounded-lg bg-[#1782C5] px-4 py-3 text-white font-semibold hover:bg-[#1464a0] disabled:opacity-50"
              >
                {isSaving ? 'Saving…' : 'Save document to database'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
