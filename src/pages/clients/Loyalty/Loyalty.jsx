import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faTruck,
  faTags,
  faHeadset,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { addNotification } from "../../../utils/notifications";
import { useToast } from "../../../context/ToastContext";
import "./Loyalty.css";

export default function Loyalty() {
  const { showToast } = useToast();

  // 1. Gestion dynamique du solde et des données via localStorage
  const [currentPoints, setCurrentPoints] = useState(() => {
    const saved = localStorage.getItem("shopflow_loyalty_points");
    return saved !== null ? parseInt(saved, 10) : 12450;
  });

  const [historyItems, setHistoryItems] = useState(() => {
    const saved = localStorage.getItem("shopflow_loyalty_history");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            date: "12 Mai 2024",
            description: "Achat #1042",
            points: "+500",
            type: "positive",
          },
          {
            id: 2,
            date: "10 Mai 2024",
            description: "Conversion en bon (5 000 FCFA)",
            points: "-1000",
            type: "negative",
          },
          {
            id: 3,
            date: "05 Mai 2024",
            description: "Bonus de bienvenue",
            points: "+100",
            type: "positive",
          },
          {
            id: 4,
            date: "01 Mai 2024",
            description: "Achat #1038",
            points: "+1250",
            type: "positive",
          },
        ];
  });

  // Sauvegarder automatiquement dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("shopflow_loyalty_points", currentPoints);
    localStorage.setItem(
      "shopflow_loyalty_history",
      JSON.stringify(historyItems),
    );
  }, [currentPoints, historyItems]);

  // Calcul dynamique de la progression vers le niveau Platine (Objectif : 20 000 pts)
  const targetPoints = 20000;
  const progressPercent = Math.min(
    Math.round((currentPoints / targetPoints) * 100),
    100,
  );
  const pointsRemaining = Math.max(targetPoints - currentPoints, 0);

  // Fonction dynamique pour convertir des points en récompense
  const handleRedeem = (amount, cost) => {
    if (currentPoints >= cost) {
      const newPoints = currentPoints - cost;
      setCurrentPoints(newPoints);

      const newEntry = {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        description: `Conversion en bon (${amount})`,
        points: `-${cost}`,
        type: "negative",
      };

      setHistoryItems([newEntry, ...historyItems]);

      showToast(
        "Succès",
        `Félicitations ! Votre bon de réduction de ${amount} a été généré avec succès.`,
        "success",
      );
    } else {
      showToast(
        "Attention",
        "Points insuffisants pour obtenir cette récompense.",
        "error",
      );
    }

    addNotification(
      "Fidélité",
      "Bon de réduction généré",
      `Félicitations ! Vous avez converti ${cost} points en un bon de ${amount}.`,
    );
  };

  // Fonction pour simuler un achat et gagner des points dynamiquement
  const handleSimulatePurchase = () => {
    const addedPoints = 500;
    setCurrentPoints((prev) => prev + addedPoints);

    const newEntry = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      description: "Achat récent (Simulation)",
      points: `+${addedPoints}`,
      type: "positive",
    };

    setHistoryItems([newEntry, ...historyItems]);

    showToast(
      "Points ajoutés",
      "Simulation réussie : +500 points ajoutés à votre solde.",
      "success",
    );
  };

  return (
    <div className="loyalty-page page-transition">
      <div className="loyalty-container">
        {/* En-tête */}
        <div className="loyalty-header-section">
          <h1>Programme de Fidélité</h1>
          <p>
            Gagnez des points à chaque achat et profitez d'avantages exclusifs.
          </p>
        </div>

        {/* Grille Dashboard (Solde & Progression) */}
        <div className="loyalty-dashboard-grid">
          <div className="solde-card">
            <div className="solde-top">
              <div>
                <span className="solde-label">Solde Actuel</span>
                <h2>
                  {currentPoints.toLocaleString()} <small>pts</small>
                </h2>
              </div>
              <div className="badge-or">
                <FontAwesomeIcon icon={faCrown} />
                {currentPoints >= 20000 ? "Niveau Platine" : "Niveau Or"}
              </div>
            </div>

            {/* Barre de progression dynamique */}
            <div className="progress-section">
              <div className="progress-bar-container">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="progress-labels">
                <span>Or (10k pts)</span>
                <span>Platine (20k pts)</span>
              </div>
              <p className="progress-hint">
                {pointsRemaining > 0
                  ? `Plus que ${pointsRemaining.toLocaleString()} pts pour atteindre le niveau Platine`
                  : "Niveau maximal atteint ! 🎉"}
              </p>
            </div>
          </div>

          <div className="earn-card">
            <div className="earn-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
            </div>
            <h3>Gagnez plus</h3>
            <p>1 000 FCFA dépensés = 10 points</p>
            <button
              className="btn-outline-white"
              onClick={handleSimulatePurchase}
            >
              Simuler un achat (+500 pts)
            </button>
          </div>
        </div>

        {/* Avantages Exclusifs */}
        <section className="loyalty-section">
          <h3>Vos Avantages Exclusifs</h3>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="adv-icon">
                <FontAwesomeIcon icon={faTruck} />
              </div>
              <h4>Livraison Gratuite</h4>
              <p>
                Sur toutes vos commandes, sans minimum d'achat pour les membres
                Or.
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

        {/* Historique des points dynamique */}
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
                {historyItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.description}</td>
                    <td className={`text-right font-weight-bold ${item.type}`}>
                      {item.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Convertir vos points (Dynamique selon le solde) */}
        <section className="loyalty-section">
          <h3>Convertir vos points</h3>
          <p className="section-subtitle">
            Échangez vos points contre des bons de réduction applicables
            immédiatement sur votre panier.
          </p>

          <div className="rewards-grid">
            {[
              { amount: "5 000 FCFA", cost: 1000 },
              { amount: "15 000 FCFA", cost: 3000 },
              { amount: "35 000 FCFA", cost: 5000 },
              { amount: "100 000 FCFA", cost: 15000 },
            ].map((reward, index) => {
              const canAfford = currentPoints >= reward.cost;
              return (
                <div
                  key={index}
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
                    className={`btn-primary-blue ${
                      !canAfford ? "btn-disabled" : ""
                    }`}
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
