import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faBell,
  faMobileScreenButton,
} from "@fortawesome/free-solid-svg-icons";

export default function ProfileNotifs({ notifs, toggleNotif }) {
  return (
    <div className="profile-section-content page-transition">
      <div className="profile-content-header mb-24">
        <h2>Paramètres de Notifications</h2>
        <p>
          Gérez la façon dont vous souhaitez être informé de vos commandes et
          actualités.
        </p>
      </div>

      <div
        className="profile-card"
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        {/* Section 1 : Notifications par Email */}
        <div>
          <h3
            style={{
              fontSize: "1.1rem",
              color: "#1e3a8a",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FontAwesomeIcon icon={faEnvelope} /> Notifications par Email
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div>
                <strong>Mises à jour de commande</strong>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                  Recevez des confirmations de commande et des reçus.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifs.emailOrder}
                onChange={() => toggleNotif("emailOrder")}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#1e3a8a",
                  cursor: "pointer",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div>
                <strong>Offres et Promotions</strong>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                  Soyez informé en avant-première des soldes et réductions.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifs.emailPromo}
                onChange={() => toggleNotif("emailPromo")}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#1e3a8a",
                  cursor: "pointer",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px 0",
              }}
            >
              <div>
                <strong>Programme de Fidélité</strong>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                  Suivez l'évolution de vos points et paliers de récompense.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifs.emailFidelity}
                onChange={() => toggleNotif("emailFidelity")}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#1e3a8a",
                  cursor: "pointer",
                }}
              />
            </label>
          </div>
        </div>

        {/* Section 2 : Notifications Push */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
          <h3
            style={{
              fontSize: "1.1rem",
              color: "#1e3a8a",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FontAwesomeIcon icon={faBell} /> Notifications Push (Appareil)
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div>
                <strong>Alertes en temps réel</strong>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                  Statut de livraison et mouvements de colis en direct.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifs.pushRealtime}
                onChange={() => toggleNotif("pushRealtime")}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#1e3a8a",
                  cursor: "pointer",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div>
                <strong>Récompenses et Badges</strong>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                  Notifications lorsque vous débloquez de nouveaux avantages.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifs.pushRewards}
                onChange={() => toggleNotif("pushRewards")}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#1e3a8a",
                  cursor: "pointer",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px 0",
              }}
            >
              <div>
                <strong>Ventes Flash</strong>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                  Rappels instantanés pour les offres limitées dans le temps.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifs.pushFlash}
                onChange={() => toggleNotif("pushFlash")}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#1e3a8a",
                  cursor: "pointer",
                }}
              />
            </label>
          </div>
        </div>

        {/* Section 3 : Notifications SMS */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
          <h3
            style={{
              fontSize: "1.1rem",
              color: "#1e3a8a",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FontAwesomeIcon icon={faMobileScreenButton} /> Notifications SMS
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                padding: "8px 0",
              }}
            >
              <div>
                <strong>Confirmation de livraison SMS</strong>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                  Recevez un SMS le jour de la livraison de votre colis.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifs.smsDelivery}
                onChange={() => toggleNotif("smsDelivery")}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#1e3a8a",
                  cursor: "pointer",
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
