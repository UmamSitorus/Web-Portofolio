import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from project root and built public/ directory
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for page routes only (never mask missing assets with HTML)
app.get('*', (req, res) => {
  if (req.path.startsWith('/assets/') || /\.[a-z0-9]+$/i.test(req.path)) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
