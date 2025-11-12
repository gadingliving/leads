document.addEventListener('DOMContentLoaded', function() {
    
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8cOzk1u1HyEzKA56TDJq_uLNrRMha4SwjO3NWHSyUKoPk-5hXV32FcSMLDJs6ARCA/exec";

    const dynamicOptions = {
        'apartemen': ['Studio', '1 Kamar Tidur', '2 Kamar Tidur', '3+ Kamar Tidur'],
        'rumah': ['1 Lantai', '2 Lantai', '3 Lantai'],
        'ruko': ['2 Lantai', '3 Lantai', '4 Lantai'],
        'rukan': ['2 Lantai', '3 Lantai', '4 Lantai']
    };

    const tipePropertiSelect = document.getElementById('tipeProperti');
    const detailTipeWrapper = document.getElementById('detailTipeWrapper');
    const detailTipeSelect = document.getElementById('detailTipe');
    const propertyForm = document.getElementById('propertyForm');
    const submitButton = document.getElementById('submitButton');

    tipePropertiSelect.addEventListener('change', function() {
        const selectedTipe = this.value;
        const options = dynamicOptions[selectedTipe];

        detailTipeSelect.innerHTML = '';
        detailTipeWrapper.style.display = 'none';

        if (options) {
            options.forEach(function(option) {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                detailTipeSelect.appendChild(opt);
            });
            detailTipeWrapper.style.display = 'block';
        }
    });

    propertyForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Stop form dari refresh halaman
        

        submitButton.disabled = true;
        submitButton.textContent = "Mengirim data...";

        const formData = {
            tipe: document.getElementById('tipeProperti').value,
            detail: detailTipeSelect.value || 'N/A',
            nama: document.getElementById('nama').value,
            whatsapp: document.getElementById('whatsapp').value,
            email: document.getElementById('email').value,
            lokasi: document.getElementById('lokasi').value,
            uraian: document.getElementById('uraian').value,
            timestamp: new Date().toISOString()
        };

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            console.log("Data berhasil dikirim ke Google Sheet.");

        } catch (error) {
            console.error("Gagal kirim ke Google Sheet:", error);
        }

        const targetWhatsApp = '6287861753898'; 
        const salamPembuka = "Halo GadingLiving, saya tertarik dengan properti.\n\n";
        
        let detailPesan = `Berikut data saya:\n`;
        detailPesan += `*Tipe Properti:* ${formData.tipe}\n`;
        if (formData.detail !== 'N/A') {
            detailPesan += `*Detail Tipe:* ${formData.detail}\n`;
        }
        detailPesan += `*Lokasi:* ${formData.lokasi}\n`;
        detailPesan += `*Nama:* ${formData.nama}\n`;
        detailPesan += `*WhatsApp:* ${formData.whatsapp}\n`;
        detailPesan += `*Email:* ${formData.email}\n\n`;
        detailPesan += `*Keterangan Tambahan:*\n${formData.uraian}\n\n`;

        const salamPenutup = "Mohon informasi lebih lanjut. Terima kasih.";
        const fullMessage = salamPembuka + detailPesan + salamPenutup;
        const encodedMessage = encodeURIComponent(fullMessage);
        const waURL = `https://api.whatsapp.com/send?phone=${targetWhatsApp}&text=${encodedMessage}`;
        
        window.open(waURL, '_blank');

        submitButton.disabled = false;
        submitButton.textContent = "Kirim & Lanjut ke WhatsApp";
        propertyForm.reset();
        detailTipeWrapper.style.display = 'none';
    });
});
