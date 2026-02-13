// 1. Logik Kata Laluan
function checkPass() {
    const input = document.getElementById('pass-input').value;
    // Kata laluan anda: TANDAX2026
    if (input === "TANDAX2026") { 
        const overlay = document.getElementById('payment-overlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    } else {
        alert("Password salah! Sila hubungi admin untuk mendapatkan kod akses.");
    }
}

// 2. Inisialisasi Peta (Mula di koordinat Malaysia)
const map = L.map('map').setView([4.2105, 101.9758], 6); 

// Menggunakan satelit Esri yang lebih stabil untuk laporan
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    crossOrigin: true // Penting untuk fungsi simpan PDF
}).addTo(map);

// 3. Fungsi Imbas Ladang & Carian Lokasi
async function runScan() {
    const locName = document.getElementById('loc').value;
    const aiMsg = document.getElementById('ai-msg');
    const v3 = document.getElementById('v3');

    if (!locName) {
        alert("Sila masukkan lokasi atau daerah ladang anda.");
        return;
    }

    // Kemaskini UI status
    v3.innerText = "MENCARI...";
    v3.style.color = "#e67e22";
    aiMsg.innerText = `Satelit sedang mencari koordinat bagi ${locName}...`;

    try {
        // Mencari koordinat lokasi menggunakan API Nominatim
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locName)}`);
        const data = await response.json();

        if (data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;

            // Peta "terbang" ke lokasi
            map.flyTo([lat, lon], 15, { animate: true, duration: 2 });

            // Simulasi pemprosesan AI selepas sampai ke lokasi
            setTimeout(() => {
                // Jana data NDVI & Kelembapan secara rawak (simulasi)
                const ndvi = (Math.random() * (0.85 - 0.45) + 0.45).toFixed(2);
                const moisture = Math.floor(Math.random() * (80 - 40) + 40);
                
                document.getElementById('v1').innerText = ndvi;
                document.getElementById('v2').innerText = moisture + "%";
                v3.innerText = "OPTIMAL";
                v3.style.color = "#2ecc71";
                
                aiMsg.innerHTML = `<strong>Analisis Selesai!</strong><br>Satelit mengesahkan kawasan di ${locName}. Tahap kesihatan tanaman berada pada skala <strong>${ndvi}</strong>.`;
                
                // Tambah bulatan hijau pada kawasan ladang
                L.circle([lat, lon], {
                    color: '#2ecc71',
                    fillColor: '#2ecc71',
                    fillOpacity: 0.3,
                    radius: 500
                }).addTo(map);

                // Tunjukkan butang simpan laporan
                document.getElementById('dl-btn').style.display = 'block';
            }, 2500);

        } else {
            alert("Lokasi tidak ditemui. Sila taip nama bandar atau koordinat yang lebih tepat.");
            v3.innerText = "RALAT";
            v3.style.color = "red";
        }
    } catch (error) {
        console.error("Ralat:", error);
        alert("Gangguan sambungan satelit. Sila cuba lagi.");
    }
}

// 4. Fungsi Auto-Download PDF (Sesuai untuk Desktop & Mobile)
function downloadLaporan() {
    const element = document.querySelector('.app-container');
    const lokasi = document.getElementById('loc').value || "Ladang";
    const statusAI = document.getElementById('v3').innerText;

    if (statusAI === "SEDIA" || statusAI === "MENCARI...") {
        alert("Sila lengkapkan imbasan ladang sebelum memuat turun laporan.");
        return;
    }

    // Tetapan PDF
    const opt = {
        margin:       0.2,
        filename:     `Laporan_AgroX_${lokasi}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, // Benarkan ambil gambar peta dari server luar
            scrollY: 0,
            letterRendering: true
        },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    // Jalankan proses download
    // Untuk Mobile, jika fail tidak turun, ia akan cuba buka tetingkap print sebagai sandaran
    html2pdf().set(opt).from(element).save().then(() => {
        console.log("PDF Berjaya dimuat turun.");
    }).catch(err => {
        console.warn("Direct download gagal, mencuba fungsi Print...");
        window.print();
    });
}
