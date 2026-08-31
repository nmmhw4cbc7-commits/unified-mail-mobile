CREATE TABLE `mail_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`providerMessageId` varchar(512) NOT NULL,
	`threadId` varchar(512),
	`senderName` varchar(255),
	`senderEmail` varchar(320) NOT NULL,
	`recipientsJson` text NOT NULL,
	`subject` varchar(998) NOT NULL,
	`preview` text NOT NULL,
	`body` text NOT NULL,
	`receivedAt` timestamp NOT NULL,
	`unread` boolean NOT NULL DEFAULT true,
	`starred` boolean NOT NULL DEFAULT false,
	`hasAttachment` boolean NOT NULL DEFAULT false,
	`labelsJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mail_messages_id` PRIMARY KEY(`id`),
	CONSTRAINT `mail_messages_account_provider_message_idx` UNIQUE(`accountId`,`providerMessageId`)
);
--> statement-breakpoint
CREATE INDEX `mail_messages_account_received_idx` ON `mail_messages` (`accountId`,`receivedAt`);