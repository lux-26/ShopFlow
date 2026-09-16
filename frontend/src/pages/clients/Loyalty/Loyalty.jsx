import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faTruck,
  faTags,
  faHeadset,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../../context/ToastContext";
import apiClient from "../../../utils/apiClient";
import "./Loyalty.css";

const rewards = [
  { amount: "5 000 FCFA", cost: 1000 },
  { amount: "15 000 FCFA", cost: 3000 },
  { amount: "35 000 FCFA", cost: 5000 },
  { amount: "100 000 FCFA", cost: 15000 },
];

export default function Loyalty() {
  const { showToast } = useToast();
  const [loyalty, setLoyalty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadLoyalty = async () => {
    try {
      const data = await apiClient.get("/loyalty");
      setLoyalty(data.loyalty);
    } catch (error) {
      showToast(
        "Erreur",
        error.message || "Impossible de charger vos points.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLoyalty();
    // La fonction utilise le compte authentifié via apiClient.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedeem = async (amount, cost) => {
    try {
      const data = await apiClient.post("/loyalty/redeem", { cost });
      setLoyalty(data.loyalty);
      showToast(
        "Succès",
        `Votre bon de réduction de ${amount} a été généré.`,
        "success",
      );
    } catch (error) {
      showToast("Attention", error.message || "Points insuffisants.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="loyalty-page page-transition">
        Chargement de votre fidélité...
      </div>
    );
  }

  if (!loyalty) return null;

  const progressPercent = Math.min(
    Math.round((loyalty.points / loyalty.targetPoints) * 100),
    100,
  );

  return (
    <div className="loyalty-page page-transition">
      <div className="loyalty-container">
        <div className="loyalty-header-section">
          <h1>Programme de Fidélité</h1>
          <p>
            Gagnez des points à chaque achat et profitez d&apos;avantages
            exclusifs.
          </p>
        </div>

        <div className="loyalty-dashboard-grid">
          <div className="solde-card">
            <div className="solde-top">
              <div>
                <span className="solde-label">Solde Actuel</span>
                <h2>
                  {loyalty.points.toLocaleString()} <small>pts</small>
                </h2>
              </div>
              <div className="badge-or">
                <FontAwesomeIcon icon={faCrown} /> Niveau {loyalty.level}
              </div>
            </div>
            <div className="progress-section">
              <div className="progress-bar-container">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="progress-labels">
                <span>Or (10k pts)</span>
                <span>Platine (20k pts)</span>
              </div>
              <p className="progress-hint">
                {loyalty.pointsRemaining > 0
                  ? `Plus que ${loyalty.pointsRemaining.toLocaleString()} pts pour atteindre le niveau Platine`
                  : "Niveau maximal atteint !"}
              </p>
            </div>
          </div>

          <div className="earn-card">
            <div className="earn-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
            </div>
            <h3>Gagnez plus</h3>
            <p>1 000 FCFA dépensés = 10 points</p>
            <p>Les points sont crédités automatiquement après la livraison.</p>
          </div>
        </div>

        <section className="loyalty-section">
          <h3>Vos Avantages Exclusifs</h3>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="adv-icon">
                <FontAwesomeIcon icon={faTruck} />
              </div>
              <h4>Livraison Gratuite</h4>
              <p>
                Sur toutes vos commandes, sans minimum d&apos;achat pour les
                membres Or.
              </p>
            </div>
            <div className="advantage-card">
              <div className="adv-icon">
                <FontAwesomeIcon icon={faTags} />
              </div>
              <h4>Ventes Privées</h4>
              <p>
                Accès anticipé de 48h à toutes nos promotions et nouvelles
                collections.
              </p>
            </div>
            <div className="advantage-card">
              <div className="adv-icon">
                <FontAwesomeIcon icon={faHeadset} />
              </div>
              <h4>Support Prioritaire</h4>
              <p>
                Ligne directe dédiée pour répondre à toutes vos questions
                instantanément.
              </p>
            </div>
          </div>
        </section>

        <section className="loyalty-section">
          <h3>Historique des points</h3>
          <div className="table-card">
            <table className="loyalty-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th className="text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {loyalty.history.length === 0 ? (
                  <tr>
                    <td colSpan="3">Aucun mouvement de points.</td>
                  </tr>
                ) : (
                  loyalty.history.map((item) => (
                    <tr key={item.id}>
                      <td>{new Date(item.date).toLocaleDateString("fr-FR")}</td>
                      <td>{item.description}</td>
                      <td
                        className={`text-right font-weight-bold ${item.type}`}
                      >
                        {item.points}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="loyalty-section">
          <h3>Convertir vos points</h3>
          <p className="section-subtitle">
            Échangez vos points contre des bons de réduction applicables
            immédiatement sur votre panier.
          </p>
          <div className="rewards-grid">
            {rewards.map((reward) => {
              const canAfford = loyalty.points >= reward.cost;
              return (
                <div
                  key={reward.cost}
                  className={`reward-card ${!canAfford ? "disabled" : ""}`}
                >
                  <div className="reward-top-badge">
                    {reward.amount.split(" ")[0]}
                  </div>
                  <h4>{reward.amount}</h4>
                  <span className="reward-title">Bon de réduction</span>
                  <div className="reward-cost">
                    Coût : {reward.cost.toLocaleString()} pts
                  </div>
                  <button
                    className={`btn-primary-blue ${!canAfford ? "btn-disabled" : ""}`}
                    disabled={!canAfford}
                    onClick={() => handleRedeem(reward.amount, reward.cost)}
                  >
                    {canAfford ? "Obtenir" : "Fonds insuffisants"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
