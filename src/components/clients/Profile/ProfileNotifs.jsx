import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function ProfileNotifs({ notifs, toggleNotif }) {
  return (
    <div className="profile-section-content">
      <div className="profile-content-header mb-24">
        <h2>Paramètres de Notifications</h2>
        <p>Gérez la façon dont vous souhaitez être informé.</p>
      </div>

      <div className="profile-card">
        <div className="card-section-title">
          <FontAwesomeIcon icon={faEnvelope} />
          <h3>Notifications par Email</h3>
        </div>
        <div className="notif-toggle-item">
          <div>
            <strong>Mises à jour de commande</strong>
            <p>Recevez des confirmations de commande et des reçus.</p>
          </div>
          <input
            type="checkbox"
            checked={notifs.emailOrder}
            onChange={() => toggleNotif("emailOrder")}
            className="toggle-switch"
          />
        </div>
      </div>
    </div>
  );
}
