const { google } = require('googleapis');

/**
 * Vercel Serverless Function — GET /api/modules
 * Đọc danh sách modules từ Google Sheets và trả về JSON.
 *
 * Env vars cần set trên Vercel:
 *   GOOGLE_SHEET_ID            — ID của Google Sheet
 *   GOOGLE_SERVICE_ACCOUNT_KEY — Nội dung file JSON service account (toàn bộ, stringify)
 */
export default async function handler(req, res) {
  // CORS headers (nếu cần gọi từ domain khác)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Kiểm tra env vars
  if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.error('Missing env vars: GOOGLE_SHEET_ID or GOOGLE_SERVICE_ACCOUNT_KEY');
    return res.status(500).json({ error: 'Server misconfigured — missing env vars' });
  }

  try {
    // Xác thực bằng Service Account
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Đọc sheet "Courses" từ cột A đến J (bỏ dòng header — bắt đầu từ A2)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Courses!A2:J',
    });

    const rows = response.data.values || [];

    const modules = rows
      .filter(r => r[0])   // bỏ dòng trống (không có ID)
      .map(r => ({
        id:        r[0] || '',
        name:      r[1] || '',
        owner:     r[2] || '',
        duration:  r[3] || '',
        category:  r[4] || '',
        level:     r[5] || '',
        subtitle:  r[6] || '',
        thumbnail: r[7] || '',
        status:    r[8] || '',
        updated:   r[9] || '',
        // steps, images, videoUrl, resources vẫn lấy từ SAMPLE_MODULES trong script.js
        // (vì quá phức tạp để lưu trong Sheets flat — dùng sheet phụ nếu cần sau)
      }));

    // Cache 5 phút trên Vercel Edge
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(modules);

  } catch (err) {
    console.error('Sheets API error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch from Google Sheets', detail: err.message });
  }
}
