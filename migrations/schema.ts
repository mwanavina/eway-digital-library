import { pgTable, unique, text, boolean, timestamp, varchar, index, foreignKey, serial, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const uploadStatus = pgEnum("upload_status", ['pending', 'completed', 'failed'])


export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	role: varchar({ length: 32 }).default('user').notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const programs = pgTable("programs", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	departmentId: integer("department_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.departmentId],
			foreignColumns: [departments.id],
			name: "programs_department_id_departments_id_fk"
		}).onDelete("cascade"),
	unique("programs_name_unique").on(table.name),
]);

export const courses = pgTable("courses", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	code: varchar({ length: 100 }).notNull(),
	programId: integer("program_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.programId],
			foreignColumns: [programs.id],
			name: "courses_program_id_programs_id_fk"
		}).onDelete("cascade"),
	unique("courses_code_unique").on(table.code),
]);

export const schools = pgTable("schools", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("schools_name_unique").on(table.name),
]);

export const departments = pgTable("departments", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	schoolId: integer("school_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.schoolId],
			foreignColumns: [schools.id],
			name: "departments_school_id_schools_id_fk"
		}).onDelete("cascade"),
	unique("departments_name_unique").on(table.name),
]);

export const documents = pgTable("documents", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	courseId: integer("course_id").notNull(),
	levelId: integer("level_id"),
	year: integer(),
	semester: integer(),
	examType: varchar("exam_type", { length: 100 }),
	filePath: varchar("file_path", { length: 500 }),
	fileKey: varchar("file_key", { length: 500 }),
	fileSize: integer("file_size"),
	thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
	thumbnailKey: varchar("thumbnail_key", { length: 500 }),
	uploadStatus: uploadStatus("upload_status").default('pending').notNull(),
	uploadedBy: text("uploaded_by"),
	uploadedAt: timestamp("uploaded_at", { mode: 'string' }),
	errorMessage: text("error_message"),
	downloadCount: integer("download_count").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "documents_course_id_courses_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.levelId],
			foreignColumns: [levels.id],
			name: "documents_level_id_levels_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.uploadedBy],
			foreignColumns: [user.id],
			name: "documents_uploaded_by_user_id_fk"
		}).onDelete("set null"),
]);

export const levels = pgTable("levels", {
	id: serial().primaryKey().notNull(),
	levelNumber: integer("level_number").notNull(),
	description: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("levels_level_number_unique").on(table.levelNumber),
]);

export const downloadLogs = pgTable("download_logs", {
	id: serial().primaryKey().notNull(),
	documentId: integer("document_id").notNull(),
	userId: text("user_id").notNull(),
	downloadedAt: timestamp("downloaded_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [documents.id],
			name: "download_logs_document_id_documents_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "download_logs_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const userProfiles = pgTable("user_profiles", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	fullName: varchar("full_name", { length: 255 }),
	role: varchar({ length: 32 }).default('user').notNull(),
	schoolId: integer("school_id"),
	departmentId: integer("department_id"),
	programId: integer("program_id"),
	levelId: integer("level_id"),
	onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_profiles_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.schoolId],
			foreignColumns: [schools.id],
			name: "user_profiles_school_id_schools_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.departmentId],
			foreignColumns: [departments.id],
			name: "user_profiles_department_id_departments_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.programId],
			foreignColumns: [programs.id],
			name: "user_profiles_program_id_programs_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.levelId],
			foreignColumns: [levels.id],
			name: "user_profiles_level_id_levels_id_fk"
		}).onDelete("set null"),
	unique("user_profiles_user_id_unique").on(table.userId),
]);
