let map;
// Inisialisasi Peta
window.onload = function() {
  map = L.map('map').setView([1.4927, 103.7692], 16); 
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri', crossOrigin: true
  }).addTo(map);
};

// Fungsi Masuk
function checkPass() {
  const input = document.getElementById('pass-input').value;
  if (input.toUpperCase() === "TANDAX2026") {
    document.getElementById('payment-overlay').style.display = 'none';
    if(map) map.invalidateSize(); // Elak skrin hitam
  } else {
    alert("Password Salah!");
  }
}

// Fungsi Scan
async function runScan() {
  const loc = document.getElementById('loc').value;
  if (!loc) return alert("Masukkan lokasi!");
  document.getElementById('v3').innerText = "PROSES...";
  
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(loc)}`);
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      map.flyTo([lat, lon], 17);
      setTimeout(() => {
        const ndvi = (Math.random() * (0.85 - 0.45) + 0.45).toFixed(2);
        document.getElementById('v1').innerText = ndvi;
        document.getElementById('v2').innerText = Math.floor(Math.random() * 40 + 40) + "%";
        document.getElementById('v3').innerText = "AKTIF";
        document.getElementById('ai-msg').innerHTML = "🌳 <b>Analisis:</b> Kesuburan tanaman di kawasan ini berada pada tahap optimum.";
        document.getElementById('dl-btn').style.display = 'block';
      }, 2000);
    }
  } catch (e) { alert("Ralat internet!"); }
}

// Fungsi Simpan PDF
function downloadLaporan() {
  const element = document.querySelector('.app-container');
  html2pdf().set({
    margin: 0.2, filename: 'AgroX.pdf',
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { orientation: 'landscape' }
  }).from(element).save();
}
