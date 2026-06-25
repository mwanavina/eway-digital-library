CREATE TABLE IF NOT EXISTS "user_profiles" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL UNIQUE,
  "full_name" varchar(255),
  "school_id" integer,
  "department_id" integer,
  "program_id" integer,
  "level_id" integer,
  "onboarding_completed" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_school_id_schools_id_fk"
  FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_department_id_departments_id_fk"
  FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_program_id_programs_id_fk"
  FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_level_id_levels_id_fk"
  FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE set null ON UPDATE no action;
