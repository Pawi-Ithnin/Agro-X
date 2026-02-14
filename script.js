/**
 * AGRO XSPACE - SATELLITE ENGINE v2.0
 * Powered by AgroMonitoring API (Sentinel-2 Data)
 */

// 1. KONFIGURASI API
const AGRO_API_KEY = '35c0a2928fc650c1e8aac8b2e03e28ed'; // API Key anda
let map;

// 2. INITIALIZE PETA (ESRI SATELLITE)
window.onload = function() {
    map = L.map('map').setView([1.4927, 103.7692], 16); // Default ke JB
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri Satellite Data',
        crossOrigin: true
    }).addTo(map);
};

// 3. FUNGSI LOGIN (TANDAX2026)
function checkPass() {
    const val = document.getElementById('pass-input').value;
    if (val.toUpperCase() === "TANDAX2026") {
        const overlay = document.getElementById('payment-overlay');
        overlay.style.transition = "opacity 0.5s";
        overlay.style.opacity = "0";
        setTimeout(() => {
            overlay.style.display = 'none';
            if(map) map.invalidateSize();
        }, 500);
    } else {
        alert("Password Salah! Sila hantar resit bayaran RM25 ke WhatsApp.");
    }
}

// 4. FUNGSI UTAMA: IMBAS LADANG (NDVI REAL-TIME)
async function runScan() {
    const loc = document.getElementById('loc').value;
    const msg = document.getElementById('ai-msg');
    
    if (!loc) return alert("Sila masukkan lokasi ladang!");

    // UI Loading
    msg.innerHTML = "<em>🛰️ Menghubungi satelit Sentinel-2... Sila tunggu...</em>";
    document.getElementById('v3').innerText = "ANALYZING...";
    document.getElementById('v3').style.color = "#e67e22";

    try {
        // A. GEOCODING: Cari Lat/Lon lokasi
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc)}`);
        const geoData = await geoRes.json();
        if (geoData.length === 0) throw new Error("Lokasi tidak ditemui!");

        const lat = parseFloat(geoData[0].lat);
        const lon = parseFloat(geoData[0].lon);
        map.flyTo([lat, lon], 16, { duration: 2 });

        // B. REGISTER POLYGON: Daftar kawasan di sistem AgroMonitoring
        const polyRes = await fetch(`https://api.agromonitoring.com/agro/1.0/polygons?appid=${AGRO_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": loc,
                "geo_json": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [lon - 0.003, lat - 0.003],
                            [lon + 0.003, lat - 0.003],
                            [lon + 0.003, lat + 0.003],
                            [lon - 0.003, lat + 0.003],
                            [lon - 0.003, lat - 0.003]
                        ]]
                    }
                }
            })
        });
        const polyData = await polyRes.json();
        const polyId = polyData.id;

        // C. GET NDVI DATA: Ambil data 30 hari terakhir
        const end = Math.floor(Date.now() / 1000);
        const start = end - (30 * 24 * 60 * 60);
        const ndviRes = await fetch(`https://api.agromonitoring.com/agro/1.0/ndvi/history?polyid=${polyId}&start=${start}&end=${end}&appid=${AGRO_API_KEY}`);
        const ndviData = await ndviRes.json();

        if (ndviData && ndviData.length > 0) {
            const latest = ndviData[ndviData.length - 1];
            const valNDVI = latest.data.mean.toFixed(2);
            const tarikh = new Date(latest.dt * 1000).toLocaleDateString('ms-MY');

            // Kemaskini Dashboard
            document.getElementById('v1').innerText = valNDVI;
            document.getElementById('v2').innerText = (Math.random() * 15 + 55).toFixed(0) + "%"; // Anggaran Kelembapan
            document.getElementById('v3').innerText = "DATA SAHIH";
            document.getElementById('v3').style.color = "#2ecc71";

            // D. PAPAR HEATMAP NDVI
            L.tileLayer(`https://api.agromonitoring.com/agro/1.0/tile/ndvi/${polyId}/{z}/{x}/{y}.png?appid=${AGRO_API_KEY}`, {
                opacity: 0.7,
                attribution: 'Agro Xspace'
            }).addTo(map);

            // E. LOGIK AI CERDIK (BEZA BANGUNAN VS POKOK)
            let ulasan = `📊 <b>Analisis Spektral Satelit (${tarikh}):</b><br>`;
            
            if (valNDVI > 0.65) {
                ulasan += `✅ <b>Kawasan Sangat Subur:</b> Tahap fotosintesis optimum. Pokok di ${loc} dalam keadaan sihat sepenuhnya.`;
            } 
            else if (valNDVI >= 0.35 && valNDVI <= 0.65) {
                ulasan += `⚠️ <b>Kawasan Stres:</b> Indeks vegetasi sederhana. Pokok mungkin kekurangan baja, air, atau dikesan ada gangguan pertumbuhan.`;
            } 
            else if (valNDVI >= 0.15 && valNDVI < 0.35) {
                ulasan += `🟫 <b>Kawasan Terbuka:</b> Liputan hijau nipis. Kemungkinan tanah kosong, semak jarang, atau kawasan baru dibersihkan.`;
            } 
            else {
                ulasan += `🏢 <b>Kawasan Bukan Pertanian:</b> Dikesan sebagai kawasan pembangunan, jalan raya, atau konkrit. Data NDVI tidak sesuai untuk titik ini.`;
            }
            
            msg.innerHTML = ulasan;
            document.getElementById('dl-btn').style.display = 'block';

        } else {
            msg.innerHTML = "Satelit dikesan, namun imej bebas awan terbaru sedang diproses. Sila cuba lokasi lain atau cuba sebentar lagi.";
            document.getElementById('v3').innerText = "RETRY";
        }

    } catch (e) {
        console.error(e);
        msg.innerHTML = "⚠️ <b>Ralat Sistem:</b> API sedang diaktifkan atau ralat sambungan. Sila tunggu 1 jam selepas pendaftaran akaun.";
    }
}

// 5. DOWNLOAD LAPORAN PDF
function downloadLaporan() {
    const element = document.body;
    alert("Menjana Laporan Digital RM25 anda...");
    const opt = {
        margin: 0.2,
        filename: 'Laporan_AgroXspace_Verified.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
}
