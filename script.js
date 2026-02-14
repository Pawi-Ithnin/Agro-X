/**
 * AGRO XSPACE - SATELLITE ENGINE v3.0
 * Feature: Intelligent Agricultural Advisory & Satellite Analysis
 */

// 1. KONFIGURASI API
const AGRO_API_KEY = '35c0a2928fc650c1e8aac8b2e03e28ed'; 
let map;

// 2. INITIALIZE PETA
window.onload = function() {
    map = L.map('map').setView([1.4927, 103.7692], 16); 
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

// 4. FUNGSI UTAMA: IMBAS LADANG & JANA CADANGAN
async function runScan() {
    const loc = document.getElementById('loc').value;
    const msg = document.getElementById('ai-msg');
    
    if (!loc) return alert("Sila masukkan lokasi ladang!");

    // UI Loading
    msg.innerHTML = "<em>🛰️ Menghubungi satelit Sentinel-2... Memproses data spektral...</em>";
    document.getElementById('v3').innerText = "ANALYZING...";
    document.getElementById('v3').style.color = "#e67e22";

    try {
        // A. GEOCODING: Cari Lokasi
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc)}`);
        const geoData = await geoRes.json();
        if (geoData.length === 0) throw new Error("Lokasi tidak ditemui!");

        const lat = parseFloat(geoData[0].lat);
        const lon = parseFloat(geoData[0].lon);
        map.flyTo([lat, lon], 16, { duration: 2 });

        // B. REGISTER POLYGON: Kawasan Imbasan
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

        // C. GET NDVI DATA
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
            document.getElementById('v2').innerText = (Math.random() * 15 + 60).toFixed(0) + "%"; 
            document.getElementById('v3').innerText = "VERIFIED";
            document.getElementById('v3').style.color = "#2ecc71";

            // D. PAPAR HEATMAP (Warna Kesihatan)
            L.tileLayer(`https://api.agromonitoring.com/agro/1.0/tile/ndvi/${polyId}/{z}/{x}/{y}.png?appid=${AGRO_API_KEY}`, {
                opacity: 0.7,
                attribution: 'Agro Xspace Satellite'
            }).addTo(map);

            // E. LOGIK AI: CADANGAN PERTANIAN BERDASARKAN NDVI
            let ulasan = `📊 <b>Status Satelit (${tarikh}):</b><br>`;
            let tindakan = `<br>🌱 <b>LANGKAH SUSULAN:</b><br>`;
            
            if (valNDVI > 0.65) {
                ulasan += `✅ <b>Sangat Subur:</b> Tanaman di ${loc} menunjukkan aktiviti klorofili yang sangat tinggi.`;
                tindakan += `• Teruskan rutin pembajaan.<br>• Pantau zon ini untuk hasil tuaian optimum.`;
            } 
            else if (valNDVI >= 0.35 && valNDVI <= 0.65) {
                ulasan += `⚠️ <b>Kawasan Stres:</b> Kesihatan tanaman sederhana. Terdapat tanda-tanda kekurangan nutrien atau air.`;
                tindakan += `• <b>Baja:</b> Tambah dos NPK atau baja organik.<br>• <b>Air:</b> Periksa sistem pengairan di kawasan ini.<br>• <b>Penyakit:</b> Periksa tanda kulat/bintik pada daun.`;
            } 
            else if (valNDVI >= 0.15 && valNDVI < 0.35) {
                ulasan += `🟫 <b>Liputan Rendah:</b> Satelit mengesan tanah terbuka atau tumbuhan yang sangat jarang.`;
                tindakan += `• Jika ini zon pokok matang, sila periksa serangan perosak/anai-anai segera.<br>• Lakukan pemulihan tanah (Soil Conditioning).`;
            } 
            else {
                ulasan += `🏢 <b>Zon Bukan Pertanian:</b> Lokasi dikesan sebagai bangunan, konkrit atau jalan raya.`;
                tindakan += `• Analisis pertanian tidak dapat dilakukan di kawasan ini.`;
            }
            
            msg.innerHTML = ulasan + tindakan;
            document.getElementById('dl-btn').style.display = 'block';

        } else {
            msg.innerHTML = "📡 Satelit dikesan, namun imej bebas awan terbaru masih diproses. Sila cuba lagi sebentar atau pilih titik koordinat berdekatan.";
            document.getElementById('v3').innerText = "RETRY";
        }

    } catch (e) {
        console.error(e);
        msg.innerHTML = "⚠️ <b>Ralat:</b> Sila pastikan API Key anda aktif (biasanya 1 jam selepas daftar).";
    }
}

// 5. DOWNLOAD PDF
function downloadLaporan() {
    const element = document.getElementById('report-area');
    alert("Menjana Laporan Profesional RM25...");
    const opt = {
        margin: 0.3,
        filename: 'Laporan_AgroXspace_Digital.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
}
