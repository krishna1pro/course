const { google } = require('googleapis');

async function testSheet() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './service-account.json', // correct path
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1SIq4Mgq9xbn7bHlGbUH2y_hkd6mxz2WQRGOtwTBkBn4',
      range: 'Sheet1!A1:F', // your sheet tab + columns
    });
    console.log(response.data);
  } catch (err) {
    console.error('Error:', err.errors || err);
  }
}

testSheet();
