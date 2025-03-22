CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"start_location" text NOT NULL,
	"destination" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
