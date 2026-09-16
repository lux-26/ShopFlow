import Order from "../models/Order.js";
import User from "../models/User.js";

function getRange(period) {
  const end = new Date();
  const start = new Date(end);
  if (period === "year") start.setFullYear(start.getFullYear() - 1);
  else if (period === "week") start.setDate(start.getDate() - 7);
  else start.setMonth(start.getMonth() - 1);
  return { start, end };
}

function percentChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export async function getDashboard(request, response) {
  const period = ["week", "year"].includes(request.query.period)
    ? request.query.period
    : "month";
  const { start, end } = getRange(period);
  const duration = end.getTime() - start.getTime();
  const previousStart = new Date(start.getTime() - duration);

  const [currentOrders, previousOrders, currentUsers, previousUsers, chart] =
    await Promise.all([
      Order.find({ createdAt: { $gte: start, $lte: end } })
        .populate("user", "avatar")
        .sort({ createdAt: -1 })
        .lean(),
      Order.find({ createdAt: { $gte: previousStart, $lt: start } })
        .select("total status")
        .lean(),
      User.countDocuments({
        role: "CUSTOMER",
        createdAt: { $gte: start, $lte: end },
      }),
      User.countDocuments({
        role: "CUSTOMER",
        createdAt: { $gte: previousStart, $lt: start },
      }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: { $ne: "Annulé" },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            amount: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

  const revenue = currentOrders
    .filter((order) => order.status !== "Annulé")
    .reduce((sum, order) => sum + order.total, 0);
  const previousRevenue = previousOrders
    .filter((order) => order.status !== "Annulé")
    .reduce((sum, order) => sum + order.total, 0);
  const delivered = currentOrders.filter(
    (order) => order.status === "Livré",
  ).length;
  const conversion = currentOrders.length
    ? Math.round((delivered / currentOrders.length) * 1000) / 10
    : 0;
  const bars = chart.map((entry) => ({
    label: entry._id.slice(5),
    amount: entry.amount,
  }));
  const maxAmount = Math.max(...bars.map((bar) => bar.amount), 1);

  return response.json({
    period,
    kpis: {
      revenue,
      orders: currentOrders.length,
      newUsers: currentUsers,
      conversion,
      revenueChange: percentChange(revenue, previousRevenue),
      ordersChange: percentChange(currentOrders.length, previousOrders.length),
      usersChange: percentChange(currentUsers, previousUsers),
    },
    sales: bars.map((bar) => ({
      ...bar,
      height: Math.max(8, Math.round((bar.amount / maxAmount) * 100)),
    })),
    recentOrders: currentOrders.slice(0, 4).map((order) => ({
      id: order.orderNumber,
      client: order.customerName,
      customerAvatar: order.user?.avatar || null,
      time: order.createdAt,
      amount: order.total,
      status: order.status,
    })),
  });
}
