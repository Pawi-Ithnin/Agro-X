// 1. Logik Kata Laluan
function checkPass() {
    const input = document.getElementById('pass-input').value;
    if (input === "TANDAX2026") { 
        document.getElementById('payment-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('payment-overlay').style.display = 'none';
        }, 500);
    } else {
        alert("Password salah! Sila hubungi admin.");
    }
}

// 2. Inisialisasi Peta (Mula di Malaysia secara am)
const map = L.map('map').setView([4.2105, 101.9758], 6); 

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
}).addTo(map);

// 3. Fungsi Utama: Cari Lokasi + Imbas Data
async function runScan() {
    const locName = document.getElementById('loc').value;
    const aiMsg = document.getElementById('ai-msg');
    const v3 = document.getElementById('v3');

    if (!locName) return alert("Sila masukkan nama lokasi atau daerah!");

    // Set status kepada memproses
    v3.innerText = "MENCARI...";
    v3.style.color = "#e67e22";
    aiMsg.innerText = `Satelit sedang mencari koordinat untuk ${locName}...`;

    try {
        // --- PROSES GEOCODING (Cari Lokasi) ---
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locName)}`);
        const data = await response.json();

        if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;

            // Gerakkan peta ke lokasi tersebut dengan animasi
            map.flyTo([lat, lon], 15, {
                animate: true,
                duration: 2 // saat
            });

            // Tunggu sebentar untuk animasi flyTo selesai sebelum tunjuk result
            setTimeout(() => {
                const ndvi = (Math.random() * (0.85 - 0.45) + 0.45).toFixed(2);
                const moisture = Math.floor(Math.random() * (80 - 40) + 40);
                
                document.getElementById('v1').innerText = ndvi;
                document.getElementById('v2').innerText = moisture + "%";
                v3.innerText = "OPTIMAL";
                v3.style.color = "#2ecc71";
                
                aiMsg.innerHTML = `<strong>Analisis Selesai!</strong><br>Satelit mengesahkan lokasi di: <br><small>${data[0].display_name}</small>`;
                
                // Tambah penanda (marker) atau bulatan di lokasi
                L.circle([lat, lon], {
                    color: '#2ecc71',
                    fillColor: '#2ecc71',
                    fillOpacity: 0.3,
                    radius: 500
                }).addTo(map);

                document.getElementById('dl-btn').style.display = 'block';
            }, 2100);

        } else {
            alert("Lokasi tidak ditemui. Sila cuba nama tempat yang lebih spesifik.");
            v3.innerText = "RALAT";
            v3.style.color = "red";
        }
    } catch (error) {
        console.error("Ralat Geocoding:", error);
        alert("Gangguan sambungan satelit. Sila cuba lagi.");
    }
}
