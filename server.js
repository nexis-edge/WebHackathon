const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, 'logs-server.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Accept logs from frontend
app.post('/api/logs', (req, res) => {
  try {
    const entry = req.body || {};
    let list = [];
    if (fs.existsSync(LOG_FILE)) {
      const raw = fs.readFileSync(LOG_FILE, 'utf8');
      list = raw ? JSON.parse(raw) : [];
    }
    list.push(Object.assign({ receivedAt: new Date().toISOString() }, entry));
    fs.writeFileSync(LOG_FILE, JSON.stringify(list, null, 2));
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Failed to write log', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Return saved logs
app.get('/api/logs', (req, res) => {
  if (fs.existsSync(LOG_FILE)) {
    res.sendFile(LOG_FILE);
  } else {
    res.json([]);
  }
});

// Proxy NASA NEO feed server-side so API key stays on server
app.get('/api/nasa', async (req, res) => {
  try {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) return res.status(400).json({ error: 'NASA_API_KEY not configured on server' });
    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) return res.status(400).json({ error: 'start_date and end_date required (YYYY-MM-DD)' });
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}&api_key=${apiKey}`;
    const r = await fetch(url);
    if (!r.ok) return res.status(r.status).send(await r.text());
    const data = await r.json();

    // Flatten and map into the app format
    const results = [];
    const days = data.near_earth_objects || {};
    Object.keys(days).forEach(dateKey => {
      (days[dateKey] || []).forEach(neo => {
        const cad = (neo.close_approach_data && neo.close_approach_data[0]) || {};
        const size = (neo.estimated_diameter && neo.estimated_diameter.meters && neo.estimated_diameter.meters.estimated_diameter_max) ? neo.estimated_diameter.meters.estimated_diameter_max.toFixed(1) : 'N/A';
        const distance = (cad.miss_distance && cad.miss_distance.astronomical) ? Number(cad.miss_distance.astronomical).toFixed(6) : '';
        const speed = (cad.relative_velocity && cad.relative_velocity.kilometers_per_second) ? Number(cad.relative_velocity.kilometers_per_second).toFixed(2) : '';
        const hazard = !!neo.is_potentially_hazardous_asteroid;
        const time = cad.close_approach_date_full || cad.close_approach_date || dateKey;
        results.push({ id: neo.name || neo.id, size, distance, speed, hazard, time, source: 'nasa' });
      });
    });

    res.json(results);
  } catch (err) {
    console.error('NASA proxy error', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
