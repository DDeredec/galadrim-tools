import Notification from "#models/notification";
import type { HttpContext } from "@adonisjs/core/http";

export const readNotifications = async ({ auth }: HttpContext) => {
    const user = auth.user!;

    const [notificationsUpdated] = await Notification.query()
        .where("userId", user.id)
        .update("read", true);

    const maxNotification = 20;

    if (notificationsUpdated > maxNotification) {
        const notifications = await Notification.query().where("userId", user.id);
        const numberOfNotificationsToDelete = notificationsUpdated - maxNotification;
        const lastNotificationToDelete = notifications[numberOfNotificationsToDelete - 1];

        await Notification.query()
            .where("userId", user.id)
            .andWhere("id", "<=", lastNotificationToDelete.id)
            .del();
    }

    return { message: "Notifications marquées comme lues" };
};
