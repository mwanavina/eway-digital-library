"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

type School = { id: number; name: string };
type Department = { id: number; name: string };
type Program = { id: number; name: string };
type Level = { id: number; levelNumber: number; description: string | null };

export function OnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [programId, setProgramId] = useState("");
  const [levelId, setLevelId] = useState("");

  const [schools, setSchools] = useState<School[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    async function loadInitial() {
      const response = await fetch("/api/onboarding");
      if (response.status === 401) {
        router.replace("/sign-in");
        return;
      }

      const data = await response.json();
      if (data.profile?.onboardingCompleted) {
        router.replace("/");
        return;
      }

      setSchools(data.schools ?? []);
      setLevels(data.levels ?? []);
      if (data.profile?.fullName) setFullName(data.profile.fullName);
      setLoading(false);
    }

    void loadInitial();
  }, [router]);

  useEffect(() => {
    if (!schoolId) {
      setDepartments([]);
      setDepartmentId("");
      return;
    }

    async function loadDepartments() {
      const response = await fetch(`/api/onboarding/options?schoolId=${schoolId}`);
      const data = await response.json();
      setDepartments(data.departments ?? []);
      setDepartmentId("");
      setProgramId("");
    }

    void loadDepartments();
  }, [schoolId]);

  useEffect(() => {
    if (!departmentId) {
      setPrograms([]);
      setProgramId("");
      return;
    }

    async function loadPrograms() {
      const response = await fetch(
        `/api/onboarding/options?departmentId=${departmentId}`,
      );
      const data = await response.json();
      setPrograms(data.programs ?? []);
      setProgramId("");
    }

    void loadPrograms();
  }, [departmentId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        schoolId: Number(schoolId),
        departmentId: Number(departmentId),
        programId: Number(programId),
        levelId: Number(levelId),
      }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Could not save your profile.");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  if (loading) {
    return (
      <AuthShell>
        <p className="text-center text-sm text-muted-foreground">Loading…</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Complete your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us your school details so we can show the right resources for your
          level and program.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName" className="text-xs uppercase tracking-wider">
            Full name
          </Label>
          <Input
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="h-11 bg-muted"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs uppercase tracking-wider">School / Faculty</Label>
          <Select value={schoolId} onValueChange={setSchoolId} required>
            <SelectTrigger className="h-11 w-full bg-muted">
              <SelectValue placeholder="Select school" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem key={school.id} value={String(school.id)}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs uppercase tracking-wider">Department</Label>
          <Select
            value={departmentId}
            onValueChange={setDepartmentId}
            required
            disabled={!schoolId}
          >
            <SelectTrigger className="h-11 w-full bg-muted">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department.id} value={String(department.id)}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs uppercase tracking-wider">Program</Label>
          <Select
            value={programId}
            onValueChange={setProgramId}
            required
            disabled={!departmentId}
          >
            <SelectTrigger className="h-11 w-full bg-muted">
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              {programs.map((program) => (
                <SelectItem key={program.id} value={String(program.id)}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs uppercase tracking-wider">Level / Year</Label>
          <Select value={levelId} onValueChange={setLevelId} required>
            <SelectTrigger className="h-11 w-full bg-muted">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level.id} value={String(level.id)}>
                  Level {level.levelNumber}
                  {level.description ? ` — ${level.description}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="h-11 font-bold" disabled={submitting}>
          {submitting ? "Saving…" : "Continue to library"}
        </Button>
      </form>
    </AuthShell>
  );
}
