import { CLOSECODES, Payload } from "@fosscord/gateway/util/Constants";

import WebSocket from "@fosscord/gateway/util/WebSocket";

export function onRequestGuildMembers(this: WebSocket, data: Payload) {
	// return this.close(CLOSECODES.Unknown_error);
}
