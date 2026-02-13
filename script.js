// 1. Inisialisasi Peta (Mula di Johor Bahru seperti dalam gambar anda)
const map = L.map('map').setView([1.4927, 103.7692], 16); 

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
}).addTo(map);

// 2. Fungsi Utama: Imbas & Beri Penjelasan
async function runScan() {
    const locName = document.getElementById('loc').value;
    const aiMsg = document.getElementById('ai-msg');
    
    if (!locName) return alert("Sila masukkan koordinat atau nama ladang!");

    // Set status kepada memproses
    document.getElementById('v3').innerText = "MEMPROSES...";
    aiMsg.innerHTML = `<em>Satelit sedang menganalisis lapisan data spektral di ${locName}...</em>`;

    try {
        // Carian Lokasi (Geocoding)
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locName)}`);
        const data = await response.json();

        if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            map.flyTo([lat, lon], 17);

            // Simulasi kelewatan analisis AI (2 saat)
            setTimeout(() => {
                // Jana data rawak yang realistik
                const ndvi = (Math.random() * (0.85 - 0.45) + 0.45).toFixed(2);
                const moisture = Math.floor(Math.random() * (80 - 40) + 40);
                
                // Papar data pada kad statistik
                document.getElementById('v1').innerText = ndvi;
                document.getElementById('v2').innerText = moisture + "%";
                document.getElementById('v3').innerText = "AKTIF";

                // --- FUNGSI EXPLAINER (AI ULASAN) ---
                let ulasan = "";
                
                // Logik Penjelasan NDVI (Kesuburan)
                if (ndvi > 0.7) {
                    ulasan += `🌳 <strong>Kesuburan Sangat Tinggi:</strong> Tanaman di ${locName} menunjukkan kepadatan klorofil yang sangat baik. Pertumbuhan berada pada tahap puncak. `;
                } else if (ndvi > 0.5) {
                    ulasan += `🌱 <strong>Kesuburan Sederhana:</strong> Tanaman sihat namun terdapat ruang untuk pengoptimuman baja. `;
                } else {
                    ulasan += `⚠️ <strong>Amaran Kesuburan:</strong> Indeks NDVI rendah. Tanaman mungkin mengalami tekanan (stress) atau kepadatan pokok terlalu jarang. `;
                }

                // Logik Penjelasan Kelembapan
                if (moisture < 50) {
                    ulasan += `<br>💧 <strong>Status Air:</strong> Tahap kelembapan rendah (${moisture}%). Sistem pengairan perlu diaktifkan untuk mengelakkan layu.`;
                } else {
                    ulasan += `<br>✅ <strong>Status Air:</strong> Kelembapan tanah mencukupi (${moisture}%) untuk fotosintesis optimum.`;
                }

                // Masukkan ulasan ke dalam kotak AI Message
                aiMsg.innerHTML = ulasan;
                
                // Tunjukkan butang download
                document.getElementById('dl-btn').style.display = 'block';

            }, 2000);
        } else {
            aiMsg.innerText = "Lokasi tidak ditemui. Sila cuba kata kunci lain.";
        }
    } catch (error) {
        aiMsg.innerText = "Ralat teknikal. Sila semak sambungan internet.";
    }
}

// 3. Fungsi Download PDF
function downloadLaporan() {
    const element = document.querySelector('.app-container');
    const opt = {
        margin: 0.5,
        filename: 'Laporan_Planet_Insights.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
}
