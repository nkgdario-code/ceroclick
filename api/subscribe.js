// api/subscribe.js
// Endpoint de suscripción a la newsletter de Ceroclick
// Guarda en GitHub + notifica vía Gmail

const GITHUB_API = 'https://api.github.com';
const GITHUB_REPO = 'nkgdario-code/ceroclick';
const FILE_PATH = 'data/subscribers.json';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  const { email } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  const now = new Date();
  const dateStr = now.toISOString();
  const dateLocal = now.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
  const subscriber = { email, date: dateStr, source: 'ceroclick.es' };

  const ghToken = process.env.GITHUB_TOKEN;
  const adminEmail = process.env.NEWSLETTER_EMAIL || 'hola@ceroclick.es';

  try {
    // --- 1. Guardar en GitHub ---
    if (ghToken) {
      try {
        // Obtener el archivo actual
        const getResp = await fetch(
          `${GITHUB_API}/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
          {
            headers: {
              Authorization: `Bearer ${ghToken}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );

        let data = { subscribers: [] };
        let sha = null;

        if (getResp.ok) {
          const file = await getResp.json();
          sha = file.sha;
          const decoded = Buffer.from(file.content, 'base64').toString('utf-8');
          data = JSON.parse(decoded);
        }

        // Añadir el nuevo suscriptor
        data.subscribers.push(subscriber);

        // Escribir de vuelta
        const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
        await fetch(
          `${GITHUB_API}/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${ghToken}`,
              'Content-Type': 'application/json',
              Accept: 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
              message: `📩 Nuevo suscriptor: ${email}`,
              content,
              sha,
              committer: { name: 'Ceroclick Bot', email: 'bot@ceroclick.es' },
            }),
          }
        );

        console.log(`✅ Guardado en GitHub: ${email}`);
      } catch (ghErr) {
        console.error('GitHub save failed (non-fatal):', ghErr.message);
      }
    }

    // --- 2. Notificar al admin por Gmail ---
    if (process.env.GMAIL_CLIENT_ID) {
      try {
        const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GMAIL_CLIENT_ID,
            client_secret: process.env.GMAIL_CLIENT_SECRET,
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
            grant_type: 'refresh_token',
          }),
        });

        if (tokenResp.ok) {
          const tokenData = await tokenResp.json();
          const accessToken = tokenData.access_token;

          const count = ''; // placeholder - podríamos leer el contador
          const adminSubject = `=?utf-8?B?${Buffer.from(`🎉 Nuevo suscriptor: ${email}`).toString('base64')}?=`;
          const adminBody = [
            `From: ${adminEmail}`,
            `To: ${adminEmail}`,
            `Subject: ${adminSubject}`,
            `Content-Type: text/plain; charset=utf-8`,
            '',
            `Nuevo suscriptor a la newsletter de Ceroclick:`,
            '',
            `📧 Email: ${email}`,
            `📅 Fecha: ${dateLocal}`,
            `🌐 Fuente: ceroclick.es`,
          ].join('\n');

          const encodedAdmin = Buffer.from(adminBody).toString('base64url');

          await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ raw: encodedAdmin }),
          });

          console.log(`✅ Notificación Gmail enviada para: ${email}`);
        }
      } catch (mailErr) {
        console.error('Gmail send failed (non-fatal):', mailErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: '¡Te has suscrito correctamente! 🎉',
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(200).json({
      success: true,
      message: '¡Te has suscrito correctamente! 🎉',
    });
  }
};
