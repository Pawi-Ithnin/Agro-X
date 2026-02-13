// Logik Password
function checkPass() {
    const input = document.getElementById('pass-input').value;
    if (input === "TANDAX2026") { 
        document.getElementById('payment-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('payment-overlay').style.display = 'none';
        }, 500);
    } else {
        alert("Password salah!");
    }
}

// Inisialisasi Peta
const map = L.map('map').setView([2.5092, 102.8288], 13); 

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
}).addTo(map);

// Fungsi Scan
function runScan() {
    const loc = document.getElementById('loc').value;
    if (!loc) return alert("Masukkan lokasi!");

    const v3 = document.getElementById('v3');
    v3.innerText = "PROSES...";
    v3.style.color = "#e67e22";

    setTimeout(() => {
        const ndvi = (Math.random() * (0.85 - 0.45) + 0.45).toFixed(2);
        const moisture = Math.floor(Math.random() * (80 - 40) + 40);
        
        document.getElementById('v1').innerText = ndvi;
        document.getElementById('v2').innerText = moisture + "%";
        v3.innerText = "OPTIMAL";
        v3.style.color = "#2ecc71";
        
        document.getElementById('ai-msg').innerHTML = `Analisis selesai untuk <b>${loc}</b>.`;
        document.getElementById('dl-btn').style.display = 'block';
    }, 2000);
}
