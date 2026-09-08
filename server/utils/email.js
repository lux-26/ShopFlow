const RESEND_API_URL = "https://api.resend.com/emails";

/**
 * Envoie un email via l'API Resend (aucune dépendance npm nécessaire : un
 * simple appel HTTP). Si RESEND_API_KEY n'est pas configurée, on ne bloque
 * pas le développement : on journalise l'email en console et on signale
 * l'absence d'envoi réel à l'appelant (utile pour tester sans compte email).
 *
 * @returns {Promise<{sent: boolean}>}
 */
export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "ShopFlow <onboarding@resend.dev>";

  if (!apiKey) {
    console.log("\n📧 [Email simulé — aucune RESEND_API_KEY configurée]");
    console.log(`   À : ${to}`);
    console.log(`   Sujet : ${subject}`);
    console.log(`   Contenu : ${html.replace(/<[^>]+>/g, " ").trim()}\n`);
    return { sent: false };
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    console.error(
      "Échec de l'envoi d'email via Resend :",
      response.status,
      errorBody,
    );
    return { sent: false };
  }

  return { sent: true };
}

export function buildResetPasswordEmail(resetLink) {
  return {
    subject: "Réinitialisation de votre mot de passe ShopFlow",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe ShopFlow.</p>
        <p>
          <a href="${resetLink}" style="display: inline-block; background: #1e3a8a; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p style="color: #64748b; font-size: 0.85rem;">
          Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
        </p>
      </div>
    `,
  };
}
