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
  resourceTypes: any[];
  onSuccess?: () => void;
}

export function AdminUploadFormEnhanced({
  schools,
  departments,
  programs,
  courses,
  resourceTypes,
  onSuccess,
}: UploadFormProps) {
  const [selectedResourceType, setSelectedResourceType] = useState('1');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [semester, setSemester] = useState('1');
  const [examType, setExamType] = useState('Mid-semester');
  const [author, setAuthor] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [abstract, setAbstract] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resourceType = resourceTypes.find(rt => rt.id === parseInt(selectedResourceType));

  const filteredDepartments = selectedSchool
    ? departments.filter((d) => d.school_id === parseInt(selectedSchool))
    : [];

  const filteredPrograms = selectedDepartment
    ? programs.filter((p) => p.department_id === parseInt(selectedDepartment))
    : [];

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
        resourceTypeId: parseInt(selectedResourceType),
        author: author || null,
        publicationDate: publicationDate || null,
        abstract: abstract || null,
      });

      if (result.success) {
        setSuccess(`Document uploaded successfully! Processing thumbnail...`);
        setSelectedSchool('');
        setSelectedDepartment('');
        setSelectedProgram('');
        setSelectedCourse('');
        setYear(new Date().getFullYear().toString());
        setSemester('1');
        setExamType('Mid-semester');
        setAuthor('');
        setPublicationDate('');
        setAbstract('');
        
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
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <Upload size={20} />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Resource Type Selection - Always Visible */}
      <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <label className="block text-sm font-bold text-blue-900">Resource Type *</label>
        <select
          value={selectedResourceType}
          onChange={(e) => setSelectedResourceType(e.target.value)}
          className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
        >
          {resourceTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name} - {rt.description}
            </option>
          ))}
        </select>
      </div>

      {/* Course-Based Fields (Common to all types) */}
      <div className="space-y-4 p-4 bg-muted rounded-lg border border-border">
        <h3 className="font-semibold text-foreground">Course Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">School *</label>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Department *</label>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Program *</label>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Course *</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              disabled={!selectedProgram}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent disabled:bg-muted disabled:text-muted-foreground"
            >
              <option value="">Select a course...</option>
              {filteredCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Type-Specific Fields */}
      {['Past Papers', 'Course Outlines'].includes(resourceType?.name) && (
        <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-foreground">Exam/Course Details</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
              />
            </div>

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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Exam Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
              >
                <option value="Mid-semester">Mid-semester</option>
                <option value="End-semester">End-semester</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {['Journals', 'Research Papers'].includes(resourceType?.name) && (
        <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-foreground">Publication Details</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Author/Authors</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., Dr. John Doe, Dr. Jane Smith"
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Publication Date</label>
            <input
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Abstract</label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Brief summary of the paper..."
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
            />
          </div>
        </div>
      )}

      {resourceType?.name === 'Dissertations' && (
        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-foreground">Dissertation Details</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Author/Student Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Student name"
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Submission Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2000"
              max={new Date().getFullYear()}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-[#1782C5] focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="p-4 bg-muted rounded-lg border-2 border-dashed border-border">
        <UploadButton<OurFileRouter>
          endpoint="pdfUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error: Error) => {
            setError(`Upload error: ${error.message}`);
          }}
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
