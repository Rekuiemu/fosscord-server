import { ChannelPermissionOverwrite } from "../models/Channel";
import { Role } from "../models/Role";
import { BitField } from "./BitField";
export declare type PermissionResolvable = string | number | Permissions | PermissionResolvable[];
export declare class Permissions extends BitField {
    static FLAGS: {
        CREATE_INSTANT_INVITE: bigint;
        KICK_MEMBERS: bigint;
        BAN_MEMBERS: bigint;
        ADMINISTRATOR: bigint;
        MANAGE_CHANNELS: bigint;
        MANAGE_GUILD: bigint;
        ADD_REACTIONS: bigint;
        VIEW_AUDIT_LOG: bigint;
        PRIORITY_SPEAKER: bigint;
        STREAM: bigint;
        VIEW_CHANNEL: bigint;
        SEND_MESSAGES: bigint;
        SEND_TTS_MESSAGES: bigint;
        MANAGE_MESSAGES: bigint;
        EMBED_LINKS: bigint;
        ATTACH_FILES: bigint;
        READ_MESSAGE_HISTORY: bigint;
        MENTION_EVERYONE: bigint;
        USE_EXTERNAL_EMOJIS: bigint;
        VIEW_GUILD_INSIGHTS: bigint;
        CONNECT: bigint;
        SPEAK: bigint;
        MUTE_MEMBERS: bigint;
        DEAFEN_MEMBERS: bigint;
        MOVE_MEMBERS: bigint;
        USE_VAD: bigint;
        CHANGE_NICKNAME: bigint;
        MANAGE_NICKNAMES: bigint;
        MANAGE_ROLES: bigint;
        MANAGE_WEBHOOKS: bigint;
        MANAGE_EMOJIS: bigint;
    };
    any(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
    /**
     * Checks whether the bitfield has a permission, or multiple permissions.
     */
    has(permission: PermissionResolvable, checkAdmin?: boolean): boolean;
    static channelPermission(overwrites: ChannelPermissionOverwrite[], init?: bigint): bigint;
    static rolePermission(roles: Role[]): bigint;
    static finalPermission({ user, guild, channel, }: {
        user: {
            id: bigint;
            roles: bigint[];
        };
        guild: {
            roles: Role[];
        };
        channel?: {
            overwrites?: ChannelPermissionOverwrite[];
        };
    }): bigint;
}
export declare function getPermission(user_id: bigint, guild_id: bigint, channel_id?: bigint): Promise<bigint>;