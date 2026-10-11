CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY,
	"student_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"course" text NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
