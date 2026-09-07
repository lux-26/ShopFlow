import Notification from "../models/Notification.js";

export async function createNotification({ user, category, title, text }) {
  return Notification.create({ user, category, title, text });
}

export async function listNotifications(request, response) {
  const notifications = await Notification.find({ user: request.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return response.json({
    notifications: notifications.map((notification) => ({
      id: notification._id,
      category: notification.category,
      title: notification.title,
      text: notification.text,
      read: notification.read,
      createdAt: notification.createdAt,
    })),
  });
}

export async function markAllNotificationsRead(request, response) {
  await Notification.updateMany(
    { user: request.user._id, read: false },
    { $set: { read: true } },
  );
  return response.status(204).send();
}
