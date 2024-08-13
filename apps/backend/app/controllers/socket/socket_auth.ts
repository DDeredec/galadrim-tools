import User from "#models/user";
import { schema, validator } from "@adonisjs/validator";
import type { Socket } from "socket.io";
import { joinAuthRestrictedEvents } from "./auth_restricted_events.js";
import { CONNECTED_SOCKETS } from "./socket_constants.js";

const BAD_AUTH_REQUEST = `Mauvaises données d'authentification`;

const authSchema = schema.create({
    userId: schema.number(),
    socketToken: schema.string(),
});

const checkDto = async (dto: unknown) => {
    try {
        const params = await validator.validate({
            schema: authSchema,
            data: dto,
        });
        return { isValid: true, params } as const;
    } catch (error) {
        return { isValid: false } as const;
    }
};

export async function socketAuth(socket: Socket, dto: unknown) {
    const res = await checkDto(dto);
    if (!res.isValid) {
        return socket.emit("error", BAD_AUTH_REQUEST);
    }
    const { socketToken, userId } = res.params;
    const user = await User.find(userId);
    if (!user || user.socketToken !== socketToken) {
        return socket.emit("error", BAD_AUTH_REQUEST);
    }
    joinAuthRestrictedEvents(socket);
    socket.data.user = user.toJSON();
    socket.join(CONNECTED_SOCKETS);
    socket.join(user.personalSocket);
    socket.emit("fetchAll");

    socket.emit("getId", socket.id, user.username);
}
