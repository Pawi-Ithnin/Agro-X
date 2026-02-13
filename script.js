// Masukkan library leaflet secara programmatik di CodePen
const script = document.createElement('script');
script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
document.head.appendChild(script);

script.onload = () => {
    // 1. Setup Peta
    const map = L.map('map').setView([1.4927, 103.7692], 16); 
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri', crossOrigin: true
    }).addTo(map);

    // 2. Fungsi Password
    window.checkPass = function() {
        if (document.getElementById('pass-input').value === "TANDAX2026") {
            document.getElementById('payment-overlay').style.display = 'none';
        } else { alert("Password Salah!"); }
    };

    // 3. Imbas & Explain AI
    window.runScan = async function() {
        const loc = document.getElementById('loc').value;
        if (!loc) return alert("Isi lokasi!");

        document.getElementById('v3').innerText = "PROSES...";
        
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc)}`);
            const data = await res.json();
            if (data.length > 0) {
                const { lat, lon } = data[0];
                map.flyTo([lat, lon], 17);

                setTimeout(() => {
                    const ndvi = (Math.random() * (0.85 - 0.45) + 0.45).toFixed(2);
                    const moisture = Math.floor(Math.random() * 40 + 40);
                    
                    document.getElementById('v1').innerText = ndvi;
                    document.getElementById('v2').innerText = moisture + "%";
                    document.getElementById('v3').innerText = "AKTIF";

                    // LOGIK EXPLAIN AI
                    let ulasan = ndvi > 0.7 ? "🌳 <strong>Sangat Subur:</strong> Tanaman optimum." : "⚠️ <strong>Stress:</strong> Perlu perhatian baja.";
                    ulasan += moisture < 50 ? "<br>💧 <strong>Kering:</strong> Perlu air." : "<br>✅ <strong>Lembap:</strong> Air cukup.";
                    
                    document.getElementById('ai-msg').innerHTML = ulasan;
                    document.getElementById('dl-btn').style.display = 'block';
                }, 2000);
            }
        } catch (e) { alert("Ralat internet!"); }
    };

    // 4. Save PDF (Phone & Desktop)
    window.downloadLaporan = function() {
        const element = document.querySelector('.app-container');
        alert("Laporan sedang dijana...");
        html2pdf().set({
            margin: 0.2, filename: 'Laporan_AgroX.pdf',
            html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF: { orientation: 'landscape' }
        }).from(element).save().catch(() => { window.print(); });
    };
};
