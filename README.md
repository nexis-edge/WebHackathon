<<<<<<< HEAD
# WebHackathon
=======
Cosmic Watch — Local Server

This project includes a minimal Express server to accept remote logs from the frontend (for development).

To run the server:

```bash
cd dashboard-frontend
npm install
npm start
```

- The server serves the static frontend from the same directory.
- POST `/api/logs` accepts JSON log entries and appends them to `logs-server.json`.
- GET `/api/logs` returns the stored logs.

Server-side NASA proxy (recommended)

To avoid putting the NASA API key in the frontend, the server provides a proxy endpoint at `/api/nasa` which uses the server-side environment variable `NASA_API_KEY` to fetch the NEO feed. The frontend calls `/api/nasa` so the key never appears in browser code or localStorage.

Set the API key (PowerShell example):

```powershell
$env:NASA_API_KEY = "YOUR_KEY_HERE"
npm start
```

Or on Linux / macOS:

```bash
export NASA_API_KEY="YOUR_KEY_HERE"
npm start
```


Starting server and setting key on Windows (PowerShell)

```powershell
$env:NASA_API_KEY = "YOUR_KEY_HERE"
npm install
npm start
```

On macOS / Linux use:

```bash
export NASA_API_KEY="YOUR_KEY_HERE"
npm install
npm start
```

The frontend now calls `/api/nasa` and never stores the key client-side.

Enable remote logging in the app by visiting `Log Data` and toggling `Remote Logging`.
>>>>>>> 4c86d38 (Initial commit)
