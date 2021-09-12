import { Request, Response, Router } from "express";
import { getPermission, Guild } from "@fosscord/util";
import { HTTPError } from "lambert-server";
import { check } from "@fosscord/api";
import { WidgetModifySchema } from "../../../schema/Widget";

const router: Router = Router();

// https://discord.com/developers/docs/resources/guild#get-guild-widget-settings
router.get("/", async (req: Request, res: Response) => {
	const { guild_id } = req.params;

	const perms = await getPermission(req.user_id, guild_id);
	perms.hasThrow("MANAGE_GUILD");

	const guild = await Guild.findOneOrFail({ id: guild_id });

	return res.json({ enabled: guild.widget_enabled || false, channel_id: guild.widget_channel_id || null });
});

// https://discord.com/developers/docs/resources/guild#modify-guild-widget
router.patch("/", check(WidgetModifySchema), async (req: Request, res: Response) => {
	const body = req.body as WidgetModifySchema;
	const { guild_id } = req.params;

	const perms = await getPermission(req.user_id, guild_id);
	perms.hasThrow("MANAGE_GUILD");

	await Guild.update({ id: guild_id }, { widget_enabled: body.enabled, widget_channel_id: body.channel_id });
	// Widget invite for the widget_channel_id gets created as part of the /guilds/{guild.id}/widget.json request

	return res.json(body);
});

export default router;
