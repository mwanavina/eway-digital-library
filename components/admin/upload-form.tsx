'use client';

import { useState, useEffect } from 'react';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import { UploadButton } from '@uploadthing/react';
import { OurFileRouter } from '@/lib/uploadthing';
import { createDocument } from '@/app/actions/documents';

interface UploadFormProps {
  schools: any[];
  departments: any[];
  programs: any[];
  courses: any[];
  onSuccess?: () => void;
}

export function AdminUploadForm({
  schools,
  departments,
  programs,
  courses,
  onSuccess,
}: UploadFormProps) {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [semester, setSemester] = useState('1');
  const [examType, setExamType] = useState('Mid-semester');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter departments based on school
  const filteredDepartments = selectedSchool
    ? departments.filter((d) => d.school_id === parseInt(selectedSchool))
    : [];

  // Filter programs based on department
  const filteredPrograms = selectedDepartment
    ? programs.filter((p) => p.department_id === parseInt(selectedDepartment))
    : [];

  // Filter courses based on program
  const filteredCourses = selectedProgram
    ? courses.filter((c) => c.program_id === parseInt(selectedProgram))
    : [];

  const handleUploadComplete = async (res: any) => {
    if (!res || !res[0]) {
      setError('Upload failed');
      return;
    }

    const file = res[0];
    
    if (!selectedCourse) {
      setError('Please select a course before uploading');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const result = await createDocument({
        title: `${courses.find((c) => c.id === parseInt(selectedCourse))?.name} - ${year} Sem${semester} ${examType}`,
        courseId: parseInt(selectedCourse),
        year: parseInt(year),
        semester: parseInt(semester),
        examType,
        fileKey: file.key,
        fileUrl: file.url,
      });

      if (result.success) {
        setSuccess(`Document uploaded successfully! Processing thumbnail...`);
        // Reset form
        setSelectedSchool('');
        setSelectedDepartment('');
        setSelectedProgram('');
        setSelectedCourse('');
        setYear(new Date().getFullYear().toString());
        setSemester('1');
        setExamType('Mid-semester');
        
        // Notify parent component
        setTimeout(() => {
          onSuccess?.();
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document');
    } finally {
      setIsUploading(false);
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
        <div className="flex gap-4">
          {['Mid-semester', 'End-semester'].map((type) => (
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
          <UploadButton<OurFileRouter>
            endpoint="documentPdf"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={(error: Error) => {
              setError(`Upload error: ${error.message}`);
            }}
            disabled={!selectedCourse || isUploading}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Maximum file size: 100MB. Select a course first before uploading.
        </p>
      </div>
    </div>
  );
}
