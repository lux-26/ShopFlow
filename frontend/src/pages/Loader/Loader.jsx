import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-container page-transition">
      <div className="loader-card">
        <img
          src="/ShopFlow Logo.svg"
          alt="Logo ShopFlow"
          className="loader-logo"
        />
      </div>
      <h2>Préparation de votre expérience...</h2>
      <p>Nous affinons la sélection juste pour vous.</p>
      <div className="loader-progress-bar">
        <div className="loader-progress-fill"></div>
      </div>
    </div>
  );
}
