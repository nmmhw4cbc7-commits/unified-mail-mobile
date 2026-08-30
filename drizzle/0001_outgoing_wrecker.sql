CREATE TABLE `mail_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('gmail','outlook','icloud','imap') NOT NULL,
	`email` varchar(320) NOT NULL,
	`displayName` varchar(255),
	`encryptedAccessToken` text,
	`encryptedRefreshToken` text,
	`tokenExpiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mail_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `mail_accounts_user_provider_email_idx` UNIQUE(`userId`,`provider`,`email`)
);
