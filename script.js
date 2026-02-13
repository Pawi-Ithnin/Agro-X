// 1. Fungsi Check Password
function checkPass() {
    const input = document.getElementById('pass-input').value;
    if (input === "TANDAX2026") { 
        document.getElementById('payment-overlay').style.display = 'none';
    } else {
        alert("Password salah! Sila hubungi admin.");
    }
}

// 2. Setup Peta (Mula di JB)
const map = L.map('map').setView([1.4927, 103.7692], 16); 
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    crossOrigin: true
}).addTo(map);

// 3. Imbas & Penjelasan AI
async function runScan() {
    const locName = document.getElementById('loc').value;
    const aiMsg = document.getElementById('ai-msg');
    
    if (!locName) return alert("Sila masukkan lokasi!");

    document.getElementById('v3').innerText = "PROSES...";
    aiMsg.innerHTML = `<em>Satelit sedang menganalisis ${locName}...</em>`;

    try {
        // Cari lokasi koordinat
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locName)}`);
        const data = await res.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];
            map.flyTo([lat, lon], 17);

            // Simulasi AI memproses
            setTimeout(() => {
                const ndvi = (Math.random() * (0.85 - 0.45) + 0.45).toFixed(2);
                const moisture = Math.floor(Math.random() * (80 - 40) + 40);
                
                document.getElementById('v1').innerText = ndvi;
                document.getElementById('v2').innerText = moisture + "%";
                document.getElementById('v3').innerText = "AKTIF";

                // --- LOGIK EXPLAINER (ULASAN AI) ---
                let ulasan = "";
                if (ndvi > 0.7) {
                    ulasan = `🌳 <strong>Subur:</strong> Tanaman di ${locName} sangat sihat. Fotosintesis berada pada tahap optimum. `;
                } else if (ndvi > 0.5) {
                    ulasan = `🌱 <strong>Sederhana:</strong> Kesihatan tanaman stabil tetapi perlukan baja tambahan. `;
                } else {
                    ulasan = `⚠️ <strong>Stress:</strong> Tanaman kurang subur. NDVI rendah menunjukkan pokok mungkin sakit. `;
                }

                if (moisture < 50) {
                    ulasan += `<br>💧 <strong>Kering:</strong> Tanah kering (${moisture}%). Perlu siraman segera.`;
                } else {
                    ulasan += `<br>✅ <strong>Lembap:</strong> Kelembapan tanah mencukupi untuk hari ini.`;
                }

                aiMsg.innerHTML = ulasan;
                document.getElementById('dl-btn').style.display = 'block';
            }, 2500);
        }
    } catch (e) { aiMsg.innerText = "Ralat teknikal. Semak internet."; }
}

// 4. Fungsi Simpan PDF (Mesra Telefon & Desktop)
function downloadLaporan() {
    const element = document.querySelector('.app-container');
    const lokasi = document.getElementById('loc').value || "Laporan";
    
    const opt = {
        margin:       0.2,
        filename:     `Laporan_AgroX_${lokasi}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, // Biar peta tak putih dalam PDF
            scrollY: 0 
        },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    
    alert("Laporan sedang dijana. Sila tunggu fail turun secara automatik.");
    
    html2pdf().set(opt).from(element).save().catch(err => {
        // Jika telefon sekat auto-download, buka fungsi Print
        window.print();
    });
}
