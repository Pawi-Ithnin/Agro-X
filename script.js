let map = L.map('map').setView([1.4927, 103.7692], 16); 
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Esri', crossOrigin: true
}).addTo(map);

function checkPass() {
  const p = document.getElementById('pass-input').value;
  if(p.toUpperCase() === "TANDAX2026") {
    document.getElementById('payment-overlay').style.display = 'none';
    map.invalidateSize();
  } else {
    alert("Salah!");
  }
}

async function runScan() {
  const loc = document.getElementById('loc').value;
  if(!loc) return alert("Isi lokasi");
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${loc}`);
  const data = await res.json();
  if(data.length > 0) {
    map.flyTo([data[0].lat, data[0].lon], 17);
    document.getElementById('ai-msg').innerHTML = "🌳 <b>Analisis:</b> Kawasan subur.";
  }
}
