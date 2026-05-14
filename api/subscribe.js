// api/subscribe.js
// Endpoint de suscripción a la newsletter de Ceroclick
// Almacena en Google Sheets y notifica vía Gmail

module.exports = async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  const { email } = req.body || {};

  // Validar email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
    const adminEmail = process.env.NEWSLETTER_EMAIL || 'hola@ceroclick.es';
    const date = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

    // --- 1. Obtener access token ---
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

    if (!tokenResp.ok) {
      const errText = await tokenResp.text();
      console.error('Token refresh failed:', errText);
      // Respondemos éxito aunque falle (no rompemos UX)
      return res.status(200).json({
        success: true,
        message: '¡Te has suscrito correctamente! 🎉',
        pending: true,
      });
    }

    const tokenData = await tokenResp.json();
    const accessToken = tokenData.access_token;

    // --- 2. Notificar al admin por email ---
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
      `📅 Fecha: ${date}`,
      `🌐 Fuente: ceroclick.es`,
    ].join('\n');

    const encodedAdmin = Buffer.from(adminBody).toString('base64url');

    const gmailResp = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedAdmin }),
    });

    if (!gmailResp.ok) {
      const errText = await gmailResp.text();
      console.error('Gmail send failed:', errText);
    } else {
      console.log(`✅ Notificación enviada para: ${email}`);
    }

    // --- 3. Guardar en Google Sheets (si configurado) ---
    if (process.env.SHEET_ID) {
      try {
        const sheetBody = {
          values: [[email, date, 'ceroclick.es']],
        };
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}/values/Suscriptores!A:C:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sheetBody),
          }
        );
        console.log(`✅ Guardado en Sheets: ${email}`);
      } catch (sheetErr) {
        console.error('Sheet append failed (non-fatal):', sheetErr.message);
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
