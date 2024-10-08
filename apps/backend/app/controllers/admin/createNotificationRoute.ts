import User from "#models/user";
import {
    type NotificationParams,
    createNotificationForUser,
    createNotificationForUsers,
} from "#services/notifications";
import type { HttpContext } from "@adonisjs/core/http";
import { rules, schema } from "@adonisjs/validator";

const createNotificationSchema = schema.create({
    userIds: schema.array().members(schema.number()),
    title: schema.string([rules.minLength(2), rules.maxLength(50)]),
    text: schema.string([rules.minLength(2), rules.maxLength(800)]),
    link: schema.string.optional([rules.minLength(2), rules.maxLength(800)]),
});

export const createNotificationRoute = async ({ request, auth }: HttpContext) => {
    const user = auth.user!;
    const { link, text, title, userIds } = await request.validate({
        schema: createNotificationSchema,
    });
    const users = await User.findMany(userIds);

    const settings: NotificationParams = { text, title, link, type: "SENT_BY_ADMIN" };

    if (users.length === 0) {
        await createNotificationForUsers(settings, user.id);
    }

    await Promise.all(users.map((u) => createNotificationForUser(settings, u)));

    return { notification: "Notification envoyée" };
};
