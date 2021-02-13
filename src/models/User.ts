import { Activity } from "./Activity";
import { ClientStatus, Status } from "./Status";
import { Schema, model, Types, Document } from "mongoose";

export interface User extends Document {
	id: bigint;
	username: string;
	discriminator: string;
	avatar: string | null;
	fingerprints: string[];
	phone?: string;
	desktop: boolean;
	mobile: boolean;
	premium: boolean;
	premium_type: number;
	bot: boolean;
	system: boolean;
	nsfw_allowed: boolean;
	mfa_enabled: boolean;
	created_at: number;
	verified: boolean;
	email: string;
	flags: bigint; // TODO: automatically convert BigInt to BitField of UserFlags
	public_flags: bigint;
	hash: string; // hash of the password, salt is saved in password (bcrypt)
	guilds: bigint[]; // array of guild ids the user is part of
	valid_tokens_since: number; // all tokens with a previous issue date are invalid
	user_settings: UserSettings;
	relationships: Relationship[];
	connected_accounts: ConnectedAccount[];
	presence: {
		status: Status;
		activities: Activity[];
		client_status: ClientStatus;
	};
}

export interface PublicUser {
	id: bigint;
	discriminator: string;
	username: string;
	avatar?: string;
	publicFlags: bigint;
}

export interface ConnectedAccount {
	access_token: string;
	friend_sync: boolean;
	id: string;
	name: string;
	revoked: boolean;
	show_activity: boolean;
	type: string;
	verifie: boolean;
	visibility: number;
}

export interface Relationship {
	id: bigint;
	nickname?: string;
	type: number;
	user_id: bigint;
}

export interface UserSettings {
	afk_timeout: number;
	allow_accessibility_detection: boolean;
	animate_emoji: boolean;
	animate_stickers: number;
	contact_sync_enabled: boolean;
	convert_emoticons: boolean;
	custom_status: {
		emoji_id: bigint | null;
		emoji_name: string | null;
		expires_at: number | null;
		text: string | null;
	};
	default_guilds_restricted: boolean;
	detect_platform_accounts: boolean;
	developer_mode: boolean;
	disable_games_tab: boolean;
	enable_tts_command: boolean;
	explicit_content_filter: number;
	friend_source_flags: { all: boolean };
	gif_auto_play: boolean;
	guild_folders: // every top guild is displayed as a "folder"
	{
		color: number;
		guild_ids: bigint[];
		id: number;
		name: string;
	}[];
	guild_positions: bigint[]; // guild ids ordered by position
	inline_attachment_media: boolean;
	inline_embed_media: boolean;
	locale: string; // en_US
	message_display_compact: boolean;
	native_phone_integration_enabled: boolean;
	render_embeds: boolean;
	render_reactions: boolean;
	restricted_guilds: bigint[];
	show_current_game: boolean;
	status: "online" | "offline" | "dnd" | "idle";
	stream_notifications_enabled: boolean;
	theme: "dark" | "white"; // dark
	timezone_offset: number; // e.g -60
}

export const UserSchema = new Schema({
	id: Types.Long,
	username: String,
	discriminator: String,
	avatar: String,
	fingerprints: [String],
	phone: String,
	desktop: Boolean,
	mobile: Boolean,
	premium: Boolean,
	premium_type: Number,
	bot: Boolean,
	system: Boolean,
	nsfw_allowed: Boolean,
	mfa_enabled: Boolean,
	created_at: Number,
	verified: Boolean,
	email: String,
	flags: Types.Long, // TODO: automatically convert Types.Long to BitField of UserFlags
	public_flags: Types.Long,
	hash: String, // hash of the password, salt is saved in password (bcrypt)
	guilds: [Types.Long], // array of guild ids the user is part of
	valid_tokens_since: Number, // all tokens with a previous issue date are invalid
	user_settings: {
		afk_timeout: Number,
		allow_accessibility_detection: Boolean,
		animate_emoji: Boolean,
		animate_stickers: Number,
		contact_sync_enabled: Boolean,
		convert_emoticons: Boolean,
		custom_status: {
			emoji_id: Types.Long,
			emoji_name: String,
			expires_at: Number,
			text: String,
		},
		default_guilds_restricted: Boolean,
		detect_platform_accounts: Boolean,
		developer_mode: Boolean,
		disable_games_tab: Boolean,
		enable_tts_command: Boolean,
		explicit_content_filter: Number,
		friend_source_flags: { all: Boolean },
		gif_auto_play: Boolean,
		// every top guild is displayed as a "folder"
		guild_folders: [
			{
				color: Number,
				guild_ids: [Types.Long],
				id: Number,
				name: String,
			},
		],
		guild_positions: [Types.Long], // guild ids ordered by position
		inline_attachment_media: Boolean,
		inline_embed_media: Boolean,
		locale: String, // en_US
		message_display_compact: Boolean,
		native_phone_integration_enabled: Boolean,
		render_embeds: Boolean,
		render_reactions: Boolean,
		restricted_guilds: [Types.Long],
		show_current_game: Boolean,
		status: String,
		stream_notifications_enabled: Boolean,
		theme: String, // dark
		timezone_offset: Number, // e.g -60,
	},
	relationships: [
		{
			id: Types.Long,
			nickname: String,
			type: Number,
			user_id: Types.Long,
		},
	],
	connected_accounts: [
		{
			access_token: String,
			friend_sync: Boolean,
			id: String,
			name: String,
			revoked: Boolean,
			show_activity: Boolean,
			type: String,
			verifie: Boolean,
			visibility: Number,
		},
	],
	presence: {
		status: String,
		activities: [Activity],
		client_status: ClientStatus,
	},
});

export const UserModel = model<User>("User", UserSchema, "users");