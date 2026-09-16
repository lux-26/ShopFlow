import Order from "../models/Order.js";
import User from "../models/User.js";

export async function listUsers(request, response) {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  const orderCounts = await Order.aggregate([
    { $group: { _id: "$user", count: { $sum: 1 } } },
  ]);
  const countsByUserId = new Map(
    orderCounts.map((entry) => [String(entry._id), entry.count]),
  );

  return response.json({
    users: users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      role: user.role,
      orders: countsByUserId.get(String(user._id)) || 0,
      status: user.isActive
        ? user.lastSeenAt &&
          Date.now() - new Date(user.lastSeenAt).getTime() < 90_000
          ? "En ligne"
          : "Hors ligne"
        : "Désactivé",
      createdAt: user.createdAt,
    })),
  });
}

export async function deleteUser(request, response) {
  if (String(request.user._id) === request.params.id) {
    return response.status(400).json({
      message:
        "Vous ne pouvez pas supprimer votre propre compte administrateur.",
    });
  }

  const user = await User.findByIdAndDelete(request.params.id);
  if (!user) {
    return response.status(404).json({ message: "Utilisateur introuvable." });
  }

  return response.status(204).send();
}
