function loadPage(page, clickedElement) {
    const content = document.getElementById("content");
    document.querySelectorAll(".nav-item").forEach(i => {
        i.classList.remove("active");
        i.setAttribute('aria-pressed', 'false');
    });
    if (clickedElement) {
        clickedElement.classList.add("active");
        clickedElement.setAttribute('aria-pressed', 'true');
    }

    const pages = {
        home: `
            <div class="overview-grid">
                <div class="overview-left">
                    <h1 class="hero-title">COSMIC <span>WATCH</span></h1>
                    <p class="hero-subtitle">Autonomous asteroid detection and risk assessment through the planetary defense network.</p>

                    <div class="summary-row">
                        <div class="summary-card card">
                            <h3>Active Scans</h3>
                            <div class="summary-value" id="summary-scans">—</div>
                        </div>
                        <div class="summary-card card">
                            <h3>Potential Threats</h3>
                            <div class="summary-value" id="summary-threats">—</div>
                        </div>
                        <div class="summary-card card">
                            <h3>Last Update</h3>
                            <div class="summary-value" id="summary-updated">—</div>
                        </div>
                    </div>

                    <div class="card threats-card">
                        <h2>Incoming Threats (Next 24 hrs)</h2>
                        <ul id="incoming-list" class="last24-list"></ul>
                    </div>
                </div>

                <div class="overview-right card scan-card">
                    <h2>Live Asteroid Scanning</h2>
                    <canvas id="scan-canvas"></canvas>
                    <div class="canvas-legend">
                        <div class="key"><span class="swatch" style="background:#38bdf8"></span><span>Monitored</span></div>
                        <div class="key"><span class="swatch" style="background:#f97316"></span><span>Critical</span></div>
                    </div>
                </div>
            </div>
        `,
        graphical: `
            <h1 class="hero-title">Graphical <span>Data</span></h1>
            <div class="graphical-grid">
                <div class="card issues-card">
                    <h2>Last 24 Hours — Asteroid Issues</h2>
                            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:8px;">
                                <div class="meta">Source: simulated / generated</div>
                                <div style="display:flex;gap:8px;flex-direction:column;align-items:flex-end;">
                                    <div style="display:flex;gap:8px;">
                                        <button id="fetch-nasa-graphical" type="button">Fetch NASA NEOs</button>
                                    </div>
                                    <div id="nasa-note-graphical" class="meta" style="font-size:12px;color:#94a3b8;margin-top:6px;"></div>
                                </div>
                            </div>
                            <ul id="last24-list" class="last24-list"></ul>
                </div>
                        <div class="card sim-card">
                            <h2>Live Tracking Simulation</h2>
                            <p class="meta" style="margin-top:6px;margin-bottom:8px;color:#9fbfdc;font-size:13px">Live simulation runs automatically.</p>
                            <canvas id="sim-canvas" class="sim-canvas"></canvas>
                            <div class="canvas-legend">
                                <div class="key"><span class="swatch" style="background:#38bdf8"></span><span>Monitored</span></div>
                                <div class="key"><span class="swatch" style="background:#f97316"></span><span>Critical</span></div>
                            </div>
                        </div>
            </div>
        `,
        logs: `
            <h1 class="hero-title">Log <span>Data</span></h1>
            <div class="card">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                    <h2>Critical Threat Records</h2>
                    <div style="display:flex;gap:12px;align-items:center;">
                        <label style="display:flex;align-items:center;gap:8px;color:#94a3b8"><input id="remote-logging-toggle" type="checkbox"> Remote Logging</label>
                        <button id="fetch-nasa-logs" type="button">Import NASA to Logs (server)</button>
                        <button id="export-logs" type="button">Export CSV</button>
                        <button id="clear-logs" type="button">Clear Logs</button>
                    </div>
                </div>
                <ul id="logs-list" class="last24-list" style="margin-top:12px;"></ul>
            </div>
        `,
        alerts: `
            <h1 class="hero-title">Critical <span>Alerts</span></h1>
            <div class="graph-card card">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <h2>Critical Alerts — Last 72 hrs</h2>
                    <div style="display:flex;gap:12px;align-items:center;">
                        <div class="meta">Total (72h): <strong id="alerts-count">—</strong></div>
                        <button id="alerts-refresh" type="button">Refresh</button>
                    </div>
                </div>
                <canvas id="alerts-graph" style="width:100%;height:220px;margin-top:12px;border-radius:8px;background:linear-gradient(180deg, rgba(2,6,23,0.6), rgba(0,0,0,0.35));"></canvas>
            </div>
            <div class="card">
                <h2>Critical Scan Images</h2>
                <div id="alerts-gallery" class="alerts-gallery" style="margin-top:12px;display:flex;gap:12px;flex-wrap:wrap;"></div>
            </div>
        `,
        historical: `
            <h1 class="hero-title">Historical <span>Data</span></h1>
            <div class="card">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                    <h2>Last 30 Days — Activity</h2>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <label class="meta">From <input id="hist-from" type="date"></label>
                        <label class="meta">To <input id="hist-to" type="date"></label>
                        <button id="hist-refresh" type="button">Refresh</button>
                        <button id="hist-export" type="button">Export CSV</button>
                    </div>
                </div>
                <canvas id="hist-graph" style="width:100%;height:220px;margin-top:12px;border-radius:8px;background:linear-gradient(180deg, rgba(2,6,23,0.6), rgba(0,0,0,0.35));"></canvas>
            </div>
            <div class="card" style="margin-top:16px;">
                <h2>Records (filtered)</h2>
                <div id="hist-count" class="meta" style="margin-bottom:8px">Showing: 0 records</div>
                <div style="overflow:auto;max-height:420px;"><table id="hist-table" class="history-table"><thead><tr><th>Saved</th><th>ID</th><th>Size (m)</th><th>Speed (km/s)</th><th>Distance (AU)</th><th>Hazard</th><th>Source</th></tr></thead><tbody></tbody></table></div>
            </div>
        `
    };

    content.innerHTML = pages[page] || pages.home;

    // Call page-specific initializer if present
    if (page === 'graphical') initGraphicalPage();
    if (page === 'home') initOverviewPage();
    if (page === 'logs') initLogsPage();
    if (page === 'alerts') initAlertsPage();
    if (page === 'historical') initHistoricalPage();
}

// Attach event listeners and mobile menu behavior
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const page = item.dataset.page;
        item.addEventListener('click', () => loadPage(page, item));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                loadPage(page, item);
            }
        });
    });

    // Ensure initial state
    const initial = document.querySelector('.nav-item.active') || navItems[0];
    if (initial) loadPage(initial.dataset.page || 'home', initial);

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // Observer login chip behavior
    const loginChip = document.querySelector('.login-chip');
    if (loginChip) {
        loginChip.addEventListener('click', openLoginModal);
    }

    // render observer state on load
    renderObserverState();
});

// --- Observer login handling ---
const OBS_KEY = 'cosmic_observer_v1';

function getObserver() {
    try { return JSON.parse(localStorage.getItem(OBS_KEY) || 'null'); } catch(e){return null;}
}

function setObserver(obj) {
    localStorage.setItem(OBS_KEY, JSON.stringify(obj));
}

function clearObserver() {
    localStorage.removeItem(OBS_KEY);
}

function renderObserverState() {
    const obs = getObserver();
    const btn = document.querySelector('.login-chip');
    if (!btn) return;
    if (obs && obs.name) {
        btn.textContent = obs.name;
        btn.setAttribute('aria-label','Observer: ' + obs.name + ' (click to sign out)');
        btn.onclick = () => {
            if (!confirm('Sign out observer ' + obs.name + '?')) return;
            clearObserver(); renderObserverState();
        };
    } else {
        btn.textContent = 'Observer Sign In';
        btn.setAttribute('aria-label','Observer sign in');
        btn.onclick = openLoginModal;
    }
}

function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden','false');
    // clear code-entry UI
    const email = document.getElementById('observer-email');
    const pass = document.getElementById('observer-pass');
    const codesArea = document.getElementById('codes-area');
    if (email) email.value = '';
    if (pass) pass.value = '';
    if (codesArea) codesArea.style.display = 'none';

    // wire generate/verify buttons
    const genBtn = document.getElementById('generate-codes');
    const verifyBtn = document.getElementById('verify-codes');
    const showBtn = document.getElementById('show-codes');
    const googleBtn = document.getElementById('google-signin');

    if (googleBtn) googleBtn.onclick = simulatedGoogleSignIn;

    if (genBtn) genBtn.onclick = async () => {
        const e = (document.getElementById('observer-email').value || '').trim();
        const p = (document.getElementById('observer-pass').value || '').trim();
        if (!e || !p) { alert('Enter email and password to generate codes'); return; }
        const codes = generateCodes(e, p);
        // store temporarily in sessionStorage for verification
        sessionStorage.setItem('cosmic_pending_codes_' + e, JSON.stringify(codes));
        const area = document.getElementById('codes-area');
        if (area) area.style.display = 'block';
        alert('Codes generated and (simulated) sent to email. Use Verify to sign in.');
    };

    if (verifyBtn) verifyBtn.onclick = () => {
        const e = (document.getElementById('observer-email').value || '').trim();
        const enteredUser = (document.getElementById('entry-usercode').value || '').trim();
        const enteredPass = (document.getElementById('entry-passcode').value || '').trim();
        const key = 'cosmic_pending_codes_' + e;
        const stored = sessionStorage.getItem(key);
        if (!stored) { alert('No generated codes found for that email — generate first.'); return; }
        const obj = JSON.parse(stored);
        if (obj.userCode === enteredUser && obj.passCode === enteredPass) {
            // success
            const obs = { name: e, email: e, signedAt: new Date().toISOString(), method: 'code' };
            setObserver(obs);
            sessionStorage.removeItem(key);
            closeLoginModal(); renderObserverState();
            alert('Signed in as ' + e);
        } else {
            alert('Codes do not match.');
        }
    };

    if (showBtn) showBtn.onclick = () => {
        const e = (document.getElementById('observer-email').value || '').trim();
        const key = 'cosmic_pending_codes_' + e;
        const stored = sessionStorage.getItem(key);
        if (!stored) { alert('No codes generated yet.'); return; }
        const obj = JSON.parse(stored);
        // show codes for debug/testing (in production this would be emailed)
        alert('User Code: ' + obj.userCode + '\nPass Code: ' + obj.passCode);
    };
}

function generateCodes(email, pass) {
    // simple random codes: userCode prefixed with U- and alnum, passCode numeric 6 digits
    const userCode = 'U-' + Math.random().toString(36).slice(2,8).toUpperCase();
    const passCode = String(Math.floor(100000 + Math.random()*900000));
    return { email, userCode, passCode, createdAt: new Date().toISOString() };
}

function simulatedGoogleSignIn() {
    // Simulated Google sign-in prompt — real integration requires OAuth client id and redirect
    const name = prompt('Simulated Google Sign-in\nEnter display name to continue:');
    const email = prompt('Enter Google email (for record):');
    if (!name || !email) { alert('Google sign-in cancelled'); return; }
    const obs = { name, email, signedAt: new Date().toISOString(), method: 'google' };
    setObserver(obs); closeLoginModal(); renderObserverState();
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden','true');
}

// close login modal via data-close buttons
document.addEventListener('click', (e) => {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-close')) {
        // if inside login modal, close it
        const modal = e.target.closest && e.target.closest('#login-modal');
        if (modal) closeLoginModal();
    }
});

// --- Graphical page: Last 24 hrs + live simulation ---
let simContext = null;

function initGraphicalPage() {
    // Clean up previous sim if any
    stopSimulation();

    const last24List = document.getElementById('last24-list');
    const canvas = document.getElementById('sim-canvas');
    if (!last24List || !canvas) return;

    // Generate mock asteroid reports for last 24 hours
    const asteroids = generateMockAsteroids(12);
    renderLast24List(asteroids, last24List);

    // Setup simulation context
    simContext = {
        running: false,
        asteroids: generateMockAsteroids(8),
        lastTime: null,
        rafId: null,
        // normalized global speed multiplier (moderate, realistic)
        speed: 0.5,
        canvas,
        ctx: canvas.getContext('2d')
    };

    resizeCanvasToDisplaySize(canvas);

    // Auto-start simulation
    startSimulation();

    // NASA fetch button (via server proxy) — server must be running with NASA_API_KEY set
    const fetchNasaBtn = document.getElementById('fetch-nasa-graphical');
    const nasaNote = document.getElementById('nasa-note-graphical');
    if (nasaNote) {
        nasaNote.textContent = 'Fetches via server proxy at /api/nasa — ensure server is running and NASA_API_KEY configured.';
    }
    if (fetchNasaBtn) {
        fetchNasaBtn.disabled = false;
        fetchNasaBtn.addEventListener('click', async () => {
            fetchNasaBtn.disabled = true; fetchNasaBtn.textContent = 'Fetching...';
            try {
                const now = new Date();
                const yesterday = new Date(now.getTime() - 24*3600*1000);
                const items = await fetchNasaFeed(formatDate(yesterday), formatDate(now));
                // append to the list
                renderLast24List(items.concat(asteroids), last24List);
            } catch (e) {
                alert('Failed to fetch NASA data: ' + e.message + '\nStart the server and set NASA_API_KEY on the server.');
            } finally { fetchNasaBtn.disabled = false; fetchNasaBtn.textContent = 'Fetch NASA NEOs'; }
        });
    }
}

function generateMockAsteroids(n = 8) {
    const list = [];
    for (let i = 0; i < n; i++) {
        const id = 'AST-' + Math.floor(Math.random() * 90000 + 10000);
        const size = (Math.random() * 120 + 10).toFixed(1); // meters
        const distance = (Math.random() * 0.05 + 0.0005).toFixed(5); // AU
        const speed = (Math.random() * 30 + 5).toFixed(1); // km/s
        const hazard = Math.random() > 0.85;
        list.push({ id, size, distance, speed, hazard, time: new Date(Date.now() - Math.random()*24*3600*1000).toISOString() });
    }
    return list;
}

// --- NASA NEO integration ---
function formatDate(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
}

async function fetchNasaFeed(start_date, end_date) {
    // Call the server proxy at /api/nasa which keeps the NASA API key on the server
    const url = `/api/nasa?start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text();
        throw new Error('NASA proxy error: ' + res.status + ' ' + text);
    }
    const data = await res.json();
    // server already returns flattened items in our app format
    return data;
}

// Logs page: save/fetch NASA key and import
// Removed client-side NASA key storage: server proxy handles API key securely.

function renderLast24List(asteroids, container) {
    container.innerHTML = '';
    asteroids.forEach(a => {
        const li = document.createElement('li');
        li.tabIndex = 0;
        li.dataset.id = a.id;
        li.dataset.source = a.source || 'generated';
        li.innerHTML = `
            <div>
                <div><strong>${a.id}</strong> ${a.hazard ? '<span style="color:#f97316">⚠</span>' : ''}</div>
                <div class="meta">Size: ${a.size} m — Speed: ${a.speed} km/s</div>
            </div>
            <div class="meta">Dist: ${a.distance} AU</div>
        `;
        // open details modal on click/enter
        li.addEventListener('click', () => openThreatModal(a, li.dataset.source));
        li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openThreatModal(a, li.dataset.source); });
        container.appendChild(li);
        // Persist all observed items to logs (dedup will prevent repeats)
        saveLog(Object.assign({}, a, {source: li.dataset.source}));
    });
}

// --- Remote logging support ---
const REMOTE_LOGGING_KEY = 'cosmic_remote_logging_enabled';

function isRemoteLoggingEnabled() {
    return localStorage.getItem(REMOTE_LOGGING_KEY) === '1';
}

function setRemoteLoggingEnabled(v) {
    localStorage.setItem(REMOTE_LOGGING_KEY, v ? '1' : '0');
}

async function sendLogToServer(entry) {
    try {
        const resp = await fetch('/api/logs', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });
        if (!resp.ok) console.warn('Server rejected log', await resp.text());
    } catch (e) {
        console.error('Failed to send log to server', e);
    }
}

// patch saveLog to also send to server if enabled
const _origSaveLog = saveLog;
function saveLog(entry) {
    _origSaveLog(entry);
    if (isRemoteLoggingEnabled()) {
        sendLogToServer(Object.assign({ savedAt: new Date().toISOString() }, entry));
    }
}

// --- Modal detail view ---
let _currentModalItem = null;

function openThreatModal(item, sourcePage) {
    _currentModalItem = { item, sourcePage };
    const modal = document.getElementById('detail-modal');
    const body = document.getElementById('modal-body');
    const viewBtn = document.getElementById('modal-view-source');
    if (!modal || !body) return;
    body.innerHTML = `
        <p><strong>ID:</strong> ${item.id}</p>
        <p><strong>Size:</strong> ${item.size} m</p>
        <p><strong>Distance:</strong> ${item.distance} AU</p>
        <p><strong>Speed:</strong> ${item.speed} km/s</p>
        <p><strong>Observed:</strong> ${new Date(item.time).toLocaleString()}</p>
        <p><strong>Hazard:</strong> ${item.hazard ? 'Yes' : 'No'}</p>
    `;
    viewBtn.onclick = () => {
        // navigate to source page and close modal
        if (item && sourcePage === 'generated') {
            // open Graphical page for generated items
            const nav = document.querySelector('.nav-item[data-page="graphical"]');
            if (nav) loadPage('graphical', nav);
        } else if (sourcePage) {
            const nav = document.querySelector(`.nav-item[data-page="${sourcePage}"]`);
            if (nav) loadPage(sourcePage, nav);
        }
        closeModal();
    };
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    const modal = document.getElementById('detail-modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
}

// wire modal close elements
document.addEventListener('click', (e) => {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute('data-close')) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// --- Logs persistence (localStorage) ---
const LOGS_KEY = 'cosmic_logs_v1';

function saveLog(entry) {
    try {
        const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
        const rec = Object.assign({ savedAt: new Date().toISOString() }, entry);
        // dedupe by id + timestamp (savedAt/time/receivedAt)
        const key = (rec.id || '') + '|' + (rec.savedAt || rec.time || rec.receivedAt || '');
        const exists = logs.some(l => ((l.id || '') + '|' + (l.savedAt || l.time || l.receivedAt || '')) === key);
        if (!exists) {
            logs.push(rec);
            localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
        }
    } catch (e) {
        console.error('Failed to save log', e);
    }
}

function loadLogs() {
    try {
        return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

function clearLogs() {
    localStorage.removeItem(LOGS_KEY);
}

function exportLogsCSV() {
    const logs = loadLogs();
    if (!logs.length) return null;
    const headers = ['savedAt','id','size','distance','speed','hazard','time','source'];
    const rows = logs.map(l => headers.map(h => JSON.stringify(l[h] ?? '')).join(','));
    return [headers.join(','), ...rows].join('\n');
}

function initLogsPage() {
    const list = document.getElementById('logs-list');
    const exportBtn = document.getElementById('export-logs');
    const clearBtn = document.getElementById('clear-logs');
    const remoteToggle = document.getElementById('remote-logging-toggle');
    if (!list) return;

    function render() {
        const logs = loadLogs();
        list.innerHTML = '';
        if (!logs.length) {
            const li = document.createElement('li'); li.textContent = 'No records found.'; list.appendChild(li); return;
        }
        // show newest first
        logs.slice().reverse().forEach(l => {
            const li = document.createElement('li');
            li.tabIndex = 0;
            li.innerHTML = `<div><strong>${l.id}</strong> <span class="meta">${l.hazard?'<span style="color:#f97316">CRITICAL</span>':''}</span><div class="meta">Size: ${l.size} m — Speed: ${l.speed} km/s</div></div><div class="meta">Saved: ${new Date(l.savedAt).toLocaleString()}</div>`;
            li.addEventListener('click', () => openThreatModal(l, 'logs'));
            li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openThreatModal(l, 'logs'); });
            list.appendChild(li);
        });
    }

    exportBtn && exportBtn.addEventListener('click', () => {
        const csv = exportLogsCSV();
        if (!csv) { alert('No logs to export'); return; }
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'cosmic-logs.csv'; document.body.appendChild(a); a.click(); a.remove();
    });

    clearBtn && clearBtn.addEventListener('click', () => {
        if (!confirm('Clear all logs?')) return;
        clearLogs(); render();
    });

    if (remoteToggle) {
        remoteToggle.checked = isRemoteLoggingEnabled();
        remoteToggle.addEventListener('change', (e) => {
            setRemoteLoggingEnabled(e.target.checked);
            alert('Remote logging ' + (e.target.checked ? 'enabled' : 'disabled') + '. Ensure server endpoint is available at /api/logs');
        });
    }

    // Import NASA via server proxy
    const importNasaBtn = document.getElementById('fetch-nasa-logs');
    if (importNasaBtn) {
        importNasaBtn.addEventListener('click', async () => {
            importNasaBtn.disabled = true; importNasaBtn.textContent = 'Importing...';
            try {
                const now = new Date();
                const start = new Date(now.getTime() - 2*24*3600*1000); // last 2 days
                const items = await fetchNasaFeed(formatDate(start), formatDate(now));
                items.forEach(i => { if (i.hazard) saveLog(i); });
                alert('Imported ' + items.length + ' NEOs; hazardous ones saved to logs (via server).');
                render();
            } catch (e) { alert('Failed: '+e.message); }
            finally { importNasaBtn.disabled = false; importNasaBtn.textContent = 'Import NASA to Logs'; }
        });
    }

    render();
}

function resizeCanvasToDisplaySize(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    if (simContext && simContext.ctx) simContext.ctx.setTransform(dpr,0,0,dpr,0,0);
}

function startSimulation() {
    if (!simContext) return;
    if (simContext.running) return;
    simContext.running = true;
    simContext.lastTime = performance.now();
    simContext.asteroids.forEach(a => {
        // initialize positions and velocities in screen space
        a.x = Math.random() * simContext.canvas.width;
        a.y = Math.random() * simContext.canvas.height;
        const angle = Math.random() * Math.PI * 2;
        // velocities are pixels per second for realistic motion
        const speed = Math.random() * 40 + 8; // 8 - 48 px/s
        a.vx = Math.cos(angle) * speed;
        a.vy = Math.sin(angle) * speed;
        a.radius = Math.max(2, Math.min(10, Math.round(a.size / 25)));
        // prepare per-asteroid trail buffer sized to asteroid
        a._trail = [];
        a._maxTrail = Math.min(14, Math.max(4, Math.floor(a.radius * 1.5)));
    });
    simContext.rafId = requestAnimationFrame(simTick);
}

function stopSimulation() {
    if (!simContext) return;
    simContext.running = false;
    if (simContext.rafId) cancelAnimationFrame(simContext.rafId);
    simContext.rafId = null;
}

function simTick(now) {
    if (!simContext || !simContext.running) return;
    const ctx = simContext.ctx;
    const canvas = simContext.canvas;
    const dt = Math.min(100, now - simContext.lastTime);
    const dtSeconds = (dt / 1000) * simContext.speed;
    simContext.lastTime = now;

    // fade previous frame slightly to create motion trails (alpha controls trail length)
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // draw stars background
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    for (let i=0;i<30;i++){
        ctx.beginPath(); ctx.arc((i*47)%canvas.width, (i*83)%canvas.height, 0.6,0,Math.PI*2); ctx.fill();
    }

    // update and draw asteroids with per-asteroid trails
    simContext.asteroids.forEach(a => {
        // record previous position for trail
        if (!a._trail) a._trail = [];
        a._trail.push({ x: a.x, y: a.y });
        if (a._trail.length > (a._maxTrail || 6)) a._trail.shift();

        // small random drift for natural motion
        const drift = 6; // px/s drift magnitude
        a.vx += (Math.random() - 0.5) * drift * dtSeconds;
        a.vy += (Math.random() - 0.5) * drift * dtSeconds;
        // cap speed to avoid runaway
        const maxSpeed = 80;
        const spd = Math.hypot(a.vx, a.vy);
        if (spd > maxSpeed) {
            a.vx = (a.vx / spd) * maxSpeed;
            a.vy = (a.vy / spd) * maxSpeed;
        }

        // integrate using seconds (velocities are px/sec)
        a.x += a.vx * dtSeconds;
        a.y += a.vy * dtSeconds;
        // wrap around
        // wrap around with slight padding
        const pad = 8;
        if (a.x < -pad) a.x = canvas.width + pad;
        if (a.x > canvas.width + pad) a.x = -pad;
        if (a.y < -pad) a.y = canvas.height + pad;
        if (a.y > canvas.height + pad) a.y = -pad;

        // draw trail (fading line segments)
        if (a._trail && a._trail.length) {
            for (let t = 0; t < a._trail.length; t++) {
                const p = a._trail[t];
                const next = (t === a._trail.length - 1) ? { x: a.x, y: a.y } : a._trail[t+1];
                const alpha = (t+1) / (a._trail.length + 1);
                ctx.beginPath();
                ctx.strokeStyle = (a.hazard ? 'rgba(249,115,22,'+ (0.7*alpha) +')' : 'rgba(56,189,248,'+ (0.7*alpha) +')');
                ctx.lineWidth = Math.max(1, a.radius/2);
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(next.x, next.y);
                ctx.stroke();
            }
        }

        // draw asteroid core
        ctx.beginPath();
        ctx.fillStyle = a.hazard ? '#f97316' : '#38bdf8';
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI*2);
        ctx.fill();

        // label small
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '10px sans-serif';
        ctx.fillText(a.id, a.x + a.radius + 4, a.y + 3);
    });

    simContext.rafId = requestAnimationFrame(simTick);
}

    

// Resize handling
window.addEventListener('resize', () => {
    if (simContext && simContext.canvas) resizeCanvasToDisplaySize(simContext.canvas);
});

// --- Overview page: incoming threats + radar scan ---
let scanContext = null;

function initOverviewPage() {
    // populate summaries
    const scansEl = document.getElementById('summary-scans');
    const threatsEl = document.getElementById('summary-threats');
    const updatedEl = document.getElementById('summary-updated');
    const incomingList = document.getElementById('incoming-list');

    const canvas = document.getElementById('scan-canvas');
    if (!scansEl || !threatsEl || !updatedEl || !incomingList || !canvas) return;

    const threats = generateMockAsteroids(6);
    scansEl.textContent = Math.floor(Math.random()*6 + 1);
    threatsEl.textContent = threats.filter(t=>t.hazard).length;
    updatedEl.textContent = new Date().toLocaleTimeString();

    renderLast24List(threats, incomingList);

    // setup radar
    scanContext = {
        running: false,
        canvas,
        ctx: canvas.getContext('2d'),
        angle: 0,
        // normalized sweep sensitivity (moderate sweep)
        sensitivity: 0.06
    };
    resizeCanvasToDisplaySize(canvas);
    // Always-on scan: start immediately
    startScan();
}

function startScan() {
    if (!scanContext || scanContext.running) return;
    scanContext.running = true;
    scanContext.angle = 0;
    scanContext.rafId = requestAnimationFrame(scanTick);
}

function stopScan() {
    if (!scanContext) return;
    scanContext.running = false;
    if (scanContext.rafId) cancelAnimationFrame(scanContext.rafId);
    scanContext.rafId = null;
}

function scanTick() {
    if (!scanContext || !scanContext.running) return;
    const ctx = scanContext.ctx;
    const canvas = scanContext.canvas;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0,0,w,h);

    // draw radar background
    const cx = w/2, cy = h/2, r = Math.min(w,h)/2 * 0.9;
    ctx.save();
    // dark background
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0,0,w,h);
    // concentric rings
    ctx.strokeStyle = 'rgba(56,189,248,0.12)'; ctx.lineWidth = 1;
    for (let i=1;i<=4;i++) { ctx.beginPath(); ctx.arc(cx,cy, r*(i/4),0,Math.PI*2); ctx.stroke(); }

    // sweep
    scanContext.angle += 0.02 * scanContext.sensitivity;
    const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    grad.addColorStop(0, 'rgba(56,189,248,0.18)');
    grad.addColorStop(1, 'rgba(56,189,248,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    const sweep = 0.8; // radians span
    ctx.arc(cx,cy,r, scanContext.angle - sweep/2, scanContext.angle + sweep/2);
    ctx.closePath(); ctx.fill();

    // draw some mock blips depending on sensitivity
    const blips = Math.floor(3 * scanContext.sensitivity);
    for (let i=0;i<blips;i++){
        const a = Math.random()*Math.PI*2;
        const dist = (0.2 + Math.random()*0.8) * r;
        const bx = cx + Math.cos(a)*dist;
        const by = cy + Math.sin(a)*dist;
        ctx.beginPath(); ctx.fillStyle = 'rgba(249,115,22,0.9)'; ctx.arc(bx,by,3,0,Math.PI*2); ctx.fill();
    }

    // center marker
    ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fill();
    ctx.restore();
    // draw legend overlay
    drawRadarLegend(ctx, canvas);

    scanContext.rafId = requestAnimationFrame(scanTick);
}

// legend for radar canvas
function drawRadarLegend(ctx, canvas) {
    try {
        ctx.save();
        const legendW = 140, legendH = 56, pad = 12;
        const px = pad; // left side
        const py = pad;
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = 'rgba(2,6,23,0.6)';
        ctx.fillRect(px, py, legendW, legendH);
        ctx.strokeStyle = 'rgba(56,189,248,0.12)'; ctx.strokeRect(px, py, legendW, legendH);
        ctx.fillStyle = '#e6eef8'; ctx.font = '12px sans-serif'; ctx.fillText('Legend', px + 10, py + 16);
        ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(px + 16, py + 36, 6, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#cfeffc'; ctx.fillText('Monitored', px + 30, py + 40);
        ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(px + 84, py + 36, 6, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#cfeffc'; ctx.fillText('Critical', px + 100, py + 40);
        ctx.restore();
    } catch (e) {}
}

// ensure scan canvas resizes
window.addEventListener('resize', () => {
    if (scanContext && scanContext.canvas) resizeCanvasToDisplaySize(scanContext.canvas);
});

// --- Alerts page: 72-hour count, simple bar chart, and scan thumbnails ---
function initAlertsPage() {
    const countEl = document.getElementById('alerts-count');
    const graph = document.getElementById('alerts-graph');
    const gallery = document.getElementById('alerts-gallery');
    const refresh = document.getElementById('alerts-refresh');
    if (!graph || !gallery || !countEl) return;

    function render() {
        const logs = loadLogs();
        const now = Date.now();
        const windowMs = 72 * 3600 * 1000; // 72 hrs
        const cutoff = now - windowMs;
        const critical = logs.filter(l => l.hazard && new Date(l.savedAt).getTime() >= cutoff);
        countEl.textContent = critical.length;

        // create bins (12 bins of 6 hours)
        const bins = new Array(12).fill(0);
        const binMs = windowMs / bins.length;
        critical.forEach(l => {
            const t = new Date(l.savedAt).getTime();
            const idx = Math.floor((t - cutoff) / binMs);
            if (idx >= 0 && idx < bins.length) bins[idx]++;
        });

        drawAlertsGraph(graph, bins);
        renderGallery(critical.slice().reverse(), gallery);
    }

    refresh && refresh.addEventListener('click', render);
    render();
}

function drawAlertsGraph(canvas, bins) {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,rect.width,rect.height);

    const w = rect.width, h = rect.height;
    const pad = 18;
    const max = Math.max(1, ...bins);
    const barW = (w - pad*2) / bins.length * 0.8;

    // grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i=0;i<4;i++){
        const y = pad + (h - pad*2) * (i/3);
        ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(w-pad,y); ctx.stroke();
    }

    // bars
    bins.forEach((b, i) => {
        const x = pad + i * ((w - pad*2)/bins.length) + (((w - pad*2)/bins.length - barW)/2);
        const bh = (h - pad*2) * (b / max);
        const y = h - pad - bh;
        const grad = ctx.createLinearGradient(x,y,x,y+bh);
        grad.addColorStop(0,'#f97316'); grad.addColorStop(1,'#38bdf8');
        ctx.fillStyle = grad;
        roundRect(ctx, x, y, barW, bh, 6, true, false);

        // small label
        ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '12px sans-serif';
        ctx.fillText(String(b), x + barW/2 - ctx.measureText(String(b)).width/2, y - 6);
    });
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    if (typeof r === 'number') r = {tl: r, tr: r, br: r, bl: r};
    ctx.beginPath();
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + w - r.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    ctx.lineTo(x + w, y + h - r.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    ctx.lineTo(x + r.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.quadraticCurveTo(x, y, x + r.tl, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

function renderGallery(items, container) {
    container.innerHTML = '';
    // show up to 8 thumbnails
    items.slice(0,8).forEach(item => {
        const thumb = document.createElement('canvas');
        thumb.width = 320; thumb.height = 220; thumb.style.width='160px'; thumb.style.height='110px'; thumb.style.borderRadius='8px'; thumb.style.cursor='pointer';
        const ctx = thumb.getContext('2d');
        // background
        ctx.fillStyle = 'rgba(2,6,23,0.9)'; ctx.fillRect(0,0,thumb.width,thumb.height);
        // glow
        ctx.fillStyle = item.hazard ? 'rgba(249,115,22,0.12)' : 'rgba(56,189,248,0.08)';
        ctx.fillRect(0,0,thumb.width,thumb.height);
        // draw pseudo-scan circle
        ctx.fillStyle = item.hazard ? '#f97316' : '#38bdf8';
        ctx.beginPath(); ctx.arc(thumb.width*0.6, thumb.height*0.45, 34,0,Math.PI*2); ctx.fill();
        // id text
        ctx.fillStyle = '#e6eef8'; ctx.font = '18px sans-serif'; ctx.fillText(item.id, 12, 28);
        ctx.font = '12px sans-serif'; ctx.fillStyle = '#94a3b8'; ctx.fillText('Size: '+item.size+' m', 12, 48);
        ctx.fillText('Speed: '+item.speed+' km/s', 12, 66);
        // small badge
        ctx.fillStyle = item.hazard ? '#f97316' : '#38bdf8'; roundRect(ctx, 12, thumb.height-36, 90, 24, 6, true, false);
        ctx.fillStyle = '#020617'; ctx.font = '12px sans-serif'; ctx.fillText(item.hazard ? 'CRITICAL' : 'MONITORED', 18, thumb.height-20);

        thumb.addEventListener('click', () => openThreatModal(item, 'alerts'));
        container.appendChild(thumb);
    });
}

// --- Historical page (30 days) ---
async function initHistoricalPage() {
    const fromInput = document.getElementById('hist-from');
    const toInput = document.getElementById('hist-to');
    const refreshBtn = document.getElementById('hist-refresh');
    const exportBtn = document.getElementById('hist-export');
    const graph = document.getElementById('hist-graph');
    const table = document.getElementById('hist-table');
    const countEl = document.getElementById('hist-count');
    if (!graph || !table) return;

    // default range: last 30 days
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
    fromInput.value = formatDate(start);
    toInput.value = formatDate(today);

    async function loadAndRender() {
        const from = new Date(fromInput.value + 'T00:00:00');
        const to = new Date(toInput.value + 'T23:59:59');

        // prefer server logs if available; normalize fields so historical view uses `savedAt`
        let logs = [];
        try {
            const r = await fetch('/api/logs');
            if (r.ok) {
                logs = await r.json();
                // ensure each record has savedAt (server uses receivedAt)
                logs = logs.map(l => {
                    if (!l.savedAt) l.savedAt = l.receivedAt || l.time || new Date().toISOString();
                    return l;
                });

                // merge with localStorage logs to avoid missing entries (dedupe by id+timestamp)
                const local = loadLogs() || [];
                if (local.length) {
                    const seen = new Map();
                    logs.forEach(item => seen.set((item.id||'') + '|' + (item.savedAt||item.receivedAt||item.time||''), item));
                    local.forEach(item => {
                        const key = (item.id||'') + '|' + (item.savedAt||item.receivedAt||item.time||'');
                        if (!seen.has(key)) seen.set(key, item);
                    });
                    logs = Array.from(seen.values()).sort((a,b) => new Date(a.savedAt||a.receivedAt||a.time).getTime() - new Date(b.savedAt||b.receivedAt||b.time).getTime());
                }
            } else {
                logs = loadLogs();
            }
        } catch (e) { logs = loadLogs(); }

        // filter by date range
        const filtered = logs.filter(l => {
            const t = new Date(l.savedAt).getTime();
            return t >= from.getTime() && t <= to.getTime();
        });

        // aggregate per-day
        const dayCount = {};
        for (let d = new Date(from); d <= to; d.setDate(d.getDate()+1)) {
            const key = formatDate(new Date(d));
            dayCount[key] = 0;
        }
        filtered.forEach(l => {
            const key = formatDate(new Date(l.savedAt));
            if (key in dayCount) dayCount[key]++;
        });

        const labels = Object.keys(dayCount);
        const bins = labels.map(k => dayCount[k]);

        drawAlertsGraph(graph, bins);

        // render table
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        filtered.slice().reverse().forEach(l => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${new Date(l.savedAt).toLocaleString()}</td><td>${l.id}</td><td>${l.size}</td><td>${l.speed}</td><td>${l.distance}</td><td>${l.hazard?'<span style="color:#f97316">YES</span>':'no'}</td><td>${l.source||'local'}</td>`;
            tbody.appendChild(tr);
        });
        countEl.textContent = `Showing: ${filtered.length} records`;
    }

    refreshBtn && refreshBtn.addEventListener('click', loadAndRender);
    exportBtn && exportBtn.addEventListener('click', () => {
        // export currently filtered table rows
        const rows = [];
        const headers = ['savedAt','id','size','speed','distance','hazard','source'];
        const trs = table.querySelectorAll('tbody tr');
        trs.forEach(tr => {
            const cells = Array.from(tr.children).map(td => td.textContent.replace(/\n/g,' ').trim());
            rows.push(cells.join(','));
        });
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'historical-export.csv'; document.body.appendChild(a); a.click(); a.remove();
    });

    // initial render
    loadAndRender();
}
