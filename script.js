:root { --p: #1a5c2e; }
body { font-family: sans-serif; margin: 0; overflow: hidden; }

#payment-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.9);
  z-index: 9999; display: flex; align-items: center; justify-content: center;
}

.payment-card { 
  background: white; padding: 15px; border-radius: 15px; 
  width: 300px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}

.qr-box { background: #f9f9f9; padding: 10px; border-radius: 10px; margin-bottom: 10px; border: 1px solid #ddd; }
.qr-box img { width: 100%; max-height: 200px; object-fit: contain; }

.btn-wa { 
  display: block; background: #25D366; color: white; padding: 10px; 
  border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 12px;
}

.password-box { margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; }
.pass-row { display: flex; gap: 5px; height: 38px; }
.pass-row input { flex: 1; padding: 0 10px; border: 2px solid #ddd; border-radius: 5px; font-size: 14px; }
.pass-row button { background: var(--p); color: white; border: none; padding: 0 15px; border-radius: 5px; font-weight: bold; cursor: pointer; }

/* Dashboard */
.app-container { display: flex; height: 100vh; }
.sidebar { width: 260px; padding: 20px; background: white; border-right: 1px solid #ddd; z-index: 1000; }
.main-view { flex: 1; position: relative; }
#map { height: 100%; width: 100%; background: #ccc; }
.stats-overlay { position: absolute; bottom: 15px; left: 15px; right: 15px; display: flex; gap: 10px; z-index: 1000; }
.stat-card { background: white; padding: 10px; flex: 1; border-radius: 8px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
#ai-msg { margin: 15px 0; padding: 10px; background: #f0fdf4; border-radius: 8px; font-size: 12px; color: #166534; }
.btn-scan { width: 100%; padding: 12px; background: #dc2626; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; }
.btn-report { width: 100%; padding: 10px; background: white; color: var(--p); border: 2px solid var(--p); border-radius: 5px; margin-top: 10px; cursor: pointer; }
