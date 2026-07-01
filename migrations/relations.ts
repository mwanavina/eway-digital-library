import { relations } from "drizzle-orm/relations";
import { user, account, departments, programs, courses, schools, documents, levels, downloadLogs, session, userProfiles } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	documents: many(documents),
	downloadLogs: many(downloadLogs),
	sessions: many(session),
	userProfiles: many(userProfiles),
}));

export const programsRelations = relations(programs, ({one, many}) => ({
	department: one(departments, {
		fields: [programs.departmentId],
		references: [departments.id]
	}),
	courses: many(courses),
	userProfiles: many(userProfiles),
}));

export const departmentsRelations = relations(departments, ({one, many}) => ({
	programs: many(programs),
	school: one(schools, {
		fields: [departments.schoolId],
		references: [schools.id]
	}),
	userProfiles: many(userProfiles),
}));

export const coursesRelations = relations(courses, ({one, many}) => ({
	program: one(programs, {
		fields: [courses.programId],
		references: [programs.id]
	}),
	documents: many(documents),
}));

export const schoolsRelations = relations(schools, ({many}) => ({
	departments: many(departments),
	userProfiles: many(userProfiles),
}));

export const documentsRelations = relations(documents, ({one, many}) => ({
	course: one(courses, {
		fields: [documents.courseId],
		references: [courses.id]
	}),
	level: one(levels, {
		fields: [documents.levelId],
		references: [levels.id]
	}),
	user: one(user, {
		fields: [documents.uploadedBy],
		references: [user.id]
	}),
	downloadLogs: many(downloadLogs),
}));

export const levelsRelations = relations(levels, ({many}) => ({
	documents: many(documents),
	userProfiles: many(userProfiles),
}));

export const downloadLogsRelations = relations(downloadLogs, ({one}) => ({
	document: one(documents, {
		fields: [downloadLogs.documentId],
		references: [documents.id]
	}),
	user: one(user, {
		fields: [downloadLogs.userId],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userProfilesRelations = relations(userProfiles, ({one}) => ({
	user: one(user, {
		fields: [userProfiles.userId],
		references: [user.id]
	}),
	school: one(schools, {
		fields: [userProfiles.schoolId],
		references: [schools.id]
	}),
	department: one(departments, {
		fields: [userProfiles.departmentId],
		references: [departments.id]
	}),
	program: one(programs, {
		fields: [userProfiles.programId],
		references: [programs.id]
	}),
	level: one(levels, {
		fields: [userProfiles.levelId],
		references: [levels.id]
	}),
}));