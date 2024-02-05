-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "pronouns" TEXT
);

-- CreateTable
CREATE TABLE "user_links" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT,
    CONSTRAINT "user_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "resume_titles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "resume_titles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "resume_objectives" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "objective" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "resume_objectives_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "companies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "industry" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "job_titles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "is_current_position" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "job_titles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "job_titles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "responsibilites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "job_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "responsibilites_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_titles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "professional_achievements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "job_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "professional_achievements_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_titles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "schools" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "school_enrollment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "degree" TEXT NOT NULL,
    "gpa" REAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "is_currently_enrolled" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "school_enrollment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "school_enrollment_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scholastic_achievements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enrollment_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "scholastic_achievements_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "school_enrollment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "skills" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 3,
    CONSTRAINT "skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "job_titles_start_date_idx" ON "job_titles"("start_date");

-- CreateIndex
CREATE INDEX "job_titles_end_date_idx" ON "job_titles"("end_date");

-- CreateIndex
CREATE INDEX "job_titles_is_current_position_idx" ON "job_titles"("is_current_position");

-- CreateIndex
CREATE INDEX "school_enrollment_start_date_idx" ON "school_enrollment"("start_date");

-- CreateIndex
CREATE INDEX "school_enrollment_end_date_idx" ON "school_enrollment"("end_date");

-- CreateIndex
CREATE INDEX "school_enrollment_is_currently_enrolled_idx" ON "school_enrollment"("is_currently_enrolled");
