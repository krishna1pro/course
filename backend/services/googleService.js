// backend/services/googleService.js
const { google } = require('googleapis');

let sheetsClient = null;
let driveClient = null;

function initGoogleClients(serviceAccountObj) {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountObj,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/drive.readonly'
    ]
  });
  sheetsClient = google.sheets({ version: 'v4', auth });
  driveClient = google.drive({ version: 'v3', auth });
}

async function getSheetValues(spreadsheetId, range = 'Sheet1!A1:Z1000') {
  if (!sheetsClient) throw new Error('Google clients not initialized');
  const res = await sheetsClient.spreadsheets.values.get({
    spreadsheetId,
    range
  });
  return res.data.values || [];
}

async function getDriveFileMetadata(fileId) {
  if (!driveClient) throw new Error('Google clients not initialized');
  const res = await driveClient.files.get({
    fileId,
    fields: 'id,name,mimeType, size'
  });
  return res.data;
}

async function streamDriveFile(fileId, destStream, rangeHeader = null) {
  if (!driveClient) throw new Error('Google clients not initialized');
  const opts = {
    fileId,
    alt: 'media'
  };
  const res = await driveClient.files.get(opts, {
    responseType: 'stream',
    headers: rangeHeader ? { Range: rangeHeader } : undefined
  });
  return new Promise((resolve, reject) => {
    res.data
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .pipe(destStream);
  });
}

module.exports = { initGoogleClients, getSheetValues, getDriveFileMetadata, streamDriveFile };
