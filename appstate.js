const fs = require('fs');
const https = require('https');

const url = 'https://raw.githubusercontent.com/Varnosbit/._./main/._.txt';
const outputFile = 'account.txt';

https.get(url, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    fs.writeFile(outputFile, data, (err) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Done appstate geted from GitHub.', outputFile);
      }
    });
  });
}).on('error', (err) => {
  console.error('Error fetching appstate from GitHub:', err);
});
