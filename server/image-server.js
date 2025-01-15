import express from 'express';
import { join } from 'node:path';
import cors from 'cors';

const __dirname = import.meta.dirname;

const imageServer = express();
imageServer.use(cors());
imageServer.use((_req, _res, next) => {
  setTimeout(next, 5_000);
});

const imagesFolderPath = join(__dirname, '../public/images');

imageServer.get('/images/optimised-hero.jpg', (req, res) => {
  const imagePath = join(imagesFolderPath, 'optimised-hero.jpg');
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('Error serving the image:', err);
      res.status(500).send('Error loading the image.');
    }
  });
});

imageServer.listen(3001, () => {
  console.log('Image server running on http://localhost:3001');
});
