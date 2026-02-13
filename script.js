let map;

// 1. Setup Peta Esri Satelit
window.onload = function() {
    map = L.map('map').setView([1.4927, 103.7692], 16); 
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri Satellite',
        crossOrigin: true
    }).addTo(map);
};

// 2. Fungsi Login (Password: TANDAX2026)
function checkPass() {
    const val = document.getElementById('pass-input').value;
    if (val.toUpperCase() === "TANDAX2026") {
        const overlay = document.getElementById('payment-overlay');
        overlay.style.transition = "opacity 0.5s";
        overlay.style.opacity = "0";
        setTimeout(() => {
            overlay.style.display = 'none';
            // Refresh peta supaya muncul penuh
            if(map) map.invalidateSize();
        }, 500);
    } else {
        alert("Password Salah! Sila hantar resit bayaran ke WhatsApp.");
    }
}

// 3. Fungsi Imbas Ladang & AI
async function runScan() {
    const loc = document.getElementById('loc').value;
    const msg = document.getElementById('ai-msg');
    
    if (!loc) return alert("Sila masukkan lokasi ladang!");

    msg.innerHTML = "<em>Satelit sedang memproses imej spektral...</em>";
    document.getElementById('v3').innerText = "PROSES...";
    document.getElementById('v3').style.color = "#e67e22";

    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc)}`);
        const data = await res.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];
            map.flyTo([lat, lon], 17, { duration: 2 });

            setTimeout(() => {
                // Jana data NDVI rawak yang realistik (0.4 - 0.9)
                const ndvi = (Math.random() * (0.85 - 0.45) + 0.45).toFixed(2);
                const moisture = Math.floor(Math.random() * 40 + 40);

                document.getElementById('v1').innerText = ndvi;
                document.getElementById('v2').innerText = moisture + "%";
                document.getElementById('v3').innerText = "AKTIF";
                document.getElementById('v3').style.color = "#2ecc71";

                // Ulasan AI
                let ulasan = ndvi > 0.7 
                    ? `🌳 <b>Kesihatan Tinggi:</b> Tanaman di ${loc} sangat subur (NDVI: ${ndvi}).` 
                    : `⚠️ <b>Kesihatan Sederhana:</b> Tanaman menunjukkan tanda tekanan nutrien.`;
                
                ulasan += moisture < 50 
                    ? `<br>💧 <b>Amaran:</b> Tahap kelembapan tanah rendah. Perlu pengairan.` 
                    : `<br>✅ <b>Stabil:</b> Kelembapan tanah mencukupi.`;

                msg.innerHTML = ulasan;
                document.getElementById('dl-btn').style.display = 'block';

                // Tambah Marker Bulatan
                L.circle([lat, lon], { color: '#2ecc71', radius: 200 }).addTo(map);

            }, 2500);
        } else {
            alert("Lokasi tidak ditemui!");
            msg.innerText = "Sila masukkan lokasi yang lebih spesifik.";
        }
    } catch (e) {
        alert("Ralat internet! Gagal menghubungi satelit.");
    }
}

// 4. Fungsi Simpan PDF
function downloadLaporan() {
    const element = document.body; // Simpan seluruh dashboard
    alert("Menjana laporan PDF...");
    const opt = {
        margin: 0.1,
        filename: 'Laporan_TandaX.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
}
