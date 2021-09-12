import { Channel, emitEvent, getPermission, MessageDeleteEvent, Message, MessageUpdateEvent } from "@fosscord/util";
import { Router, Response, Request } from "express";
import { MessageCreateSchema } from "../../../../../schema/Message";
import { check } from "@fosscord/api";
import { handleMessage, postHandleMessage } from "@fosscord/api";

const router = Router();

router.patch("/", check(MessageCreateSchema), async (req: Request, res: Response) => {
	const { message_id, channel_id } = req.params;
	var body = req.body as MessageCreateSchema;

	const message = await Message.findOneOrFail({ id: message_id, channel_id });

	const permissions = await getPermission(req.user_id, undefined, channel_id);

	if (req.user_id !== message.author_id) {
		permissions.hasThrow("MANAGE_MESSAGES");
		body = { flags: body.flags }; // admins can only suppress embeds of other messages
	}

	const new_message = await handleMessage({
		...message,
		// TODO: should message_reference be overridable?
		// @ts-ignore
		message_reference: message.message_reference,
		...body,
		author_id: message.author_id,
		channel_id,
		id: message_id,
		edited_timestamp: new Date()
	});

	await Promise.all([
		new_message!.save(),
		await emitEvent({
			event: "MESSAGE_UPDATE",
			channel_id,
			data: { ...new_message, nonce: undefined }
		} as MessageUpdateEvent)
	]);

	postHandleMessage(message);

	return res.json(message);
});

// TODO: delete attachments in message

router.delete("/", async (req: Request, res: Response) => {
	const { message_id, channel_id } = req.params;

	const channel = await Channel.findOneOrFail({ id: channel_id });
	const message = await Message.findOneOrFail({ id: message_id });

	const permission = await getPermission(req.user_id, channel.guild_id, channel_id);
	if (message.author_id !== req.user_id) permission.hasThrow("MANAGE_MESSAGES");

	await Message.delete({ id: message_id });

	await emitEvent({
		event: "MESSAGE_DELETE",
		channel_id,
		data: {
			id: message_id,
			channel_id,
			guild_id: channel.guild_id
		}
	} as MessageDeleteEvent);

	res.sendStatus(204);
});

export default router;
