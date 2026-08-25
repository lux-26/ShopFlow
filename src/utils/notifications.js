export const addNotification = (
  category,
  title,
  text,
  time = "À l'instant",
) => {
  const savedNotifs =
    JSON.parse(localStorage.getItem("shopflow_notifications")) || [];

  const newNotif = {
    id: Date.now(),
    category,
    title,
    text,
    time,
  };

  const updatedNotifs = [newNotif, ...savedNotifs];
  localStorage.setItem("shopflow_notifications", JSON.stringify(updatedNotifs));

  // Déclencher un événement pour que le Header se mette à jour instantanément
  window.dispatchEvent(new Event("notificationUpdated"));
};
