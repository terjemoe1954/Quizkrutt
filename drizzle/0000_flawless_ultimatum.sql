CREATE TABLE `network_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `network_limits_expires` ON `network_limits` (`expires_at`);--> statement-breakpoint
CREATE TABLE `network_rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`host_key` text NOT NULL,
	`guest_key` text,
	`payload` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`invite_until` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `network_rooms_code_unique` ON `network_rooms` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `network_rooms_host_unique` ON `network_rooms` (`host_key`);--> statement-breakpoint
CREATE INDEX `network_rooms_expires` ON `network_rooms` (`expires_at`);