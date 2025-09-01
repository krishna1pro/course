const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

app.get('/api/courses', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_IDS,
      range: 'Sheet1!A1:F', // exact sheet tab name
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) return res.json([]);

    const courses = rows.slice(1).map(row => ({
      Title: row[0] || '',
      Description: row[1] || '',
      Category: row[2] || '',
      Active: row[3] ? row[3].trim().toLowerCase() : 'no',
      VideoFileId: row[4] || '',
      Price: row[5] || '0',
    }));

    res.json(courses.filter(c => c.Active === 'yes'));
  } catch (err) {
    console.error('Error fetching courses:', err);

    // fallback: hard-coded courses so frontend never breaks
    const fallback = [
      { Title: 'React Basics', Description: 'Learn React', Category: 'Frontend', Active: 'yes', VideoFileId: 'hb-VD9TxL2U', Price: '50' },
      { Title: 'Node API', Description: 'Build REST APIs', Category: 'Backend', Active: 'yes', VideoFileId: '1CNNzqwfgAv', Price: '60' }
    ];
    res.json(fallback);
  }
});

app.get('/api/ping', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
