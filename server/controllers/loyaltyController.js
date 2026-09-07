import { z } from "zod";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";

const rewards = {
  1000: "5 000 FCFA",
  3000: "15 000 FCFA",
  5000: "35 000 FCFA",
  15000: "100 000 FCFA",
};

function getLevel(points) {
  return points >= 20000 ? "Platine" : points >= 10000 ? "Or" : "Bronze";
}

function publicLoyalty(user) {
  const points = user.loyaltyPoints || 0;
  return {
    points,
    level: getLevel(points),
    targetPoints: 20000,
    pointsRemaining: Math.max(20000 - points, 0),
    history: (user.loyaltyHistory || []).map((entry) => ({
      id: entry._id,
      date: entry.createdAt,
      description: entry.description,
      points: `${entry.points > 0 ? "+" : ""}${entry.points}`,
      type: entry.type,
    })),
  };
}

export function getLoyalty(request, response) {
  return response.json({ loyalty: publicLoyalty(request.user) });
}

const redeemSchema = z.object({
  cost: z.coerce
    .number()
    .int()
    .refine((value) => rewards[value], "Récompense invalide."),
});

export async function redeemReward(request, response) {
  const result = redeemSchema.safeParse(request.body);
  if (!result.success) {
    return response.status(400).json({ message: "Récompense invalide." });
  }

  const cost = result.data.cost;
  const user = await User.findOneAndUpdate(
    { _id: request.user._id, loyaltyPoints: { $gte: cost } },
    {
      $inc: { loyaltyPoints: -cost },
      $push: {
        loyaltyHistory: {
          $each: [
            {
              description: `Conversion en bon (${rewards[cost]})`,
              points: -cost,
              type: "negative",
            },
          ],
          $position: 0,
        },
      },
    },
    { new: true },
  );

  if (!user) {
    return response
      .status(409)
      .json({ message: "Points insuffisants pour obtenir cette récompense." });
  }

  await createNotification({
    user: user._id,
    category: "Fidélité",
    title: "Bon de réduction généré",
    text: `Votre bon de ${rewards[cost]} a été généré avec succès.`,
  });

  return response.json({ loyalty: publicLoyalty(user), reward: rewards[cost] });
}
