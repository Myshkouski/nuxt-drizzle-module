CREATE TABLE `posts` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `content` text NOT NULL,
  `author_id` text NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comments` (
  `id` text PRIMARY KEY NOT NULL,
  `post_id` text NOT NULL,
  `author_id` text NOT NULL,
  `content` text NOT NULL,
  `created_at` integer NOT NULL
);
