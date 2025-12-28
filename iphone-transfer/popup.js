// Initialize PeerJS
const peer = new Peer(); // Auto-generates an ID
let conn = null;

const statusDiv = document.getElementById("status");
const uploadSection = document.getElementById("upload-section");
const qrcodeDiv = document.getElementById("qrcode");
const fileInput = document.getElementById("fileInput");

// 1. When Extension Opens: Generate ID & QR Code
peer.on('open', (id) => {
    // HOSTING REQUIRED: You must host Phase 2 code somewhere (GitHub Pages/Netlify)
    // Replace the URL below with your actual hosted URL
    const baseUrl = "https://lordyash113.github.io/transfer-project/transfer-receiver.html";
    const transferUrl = `${baseUrl}?id=${id}`;

    statusDiv.innerText = "Scan with iPhone Camera:";

    // Generate QR Code
    new QRCode(qrcodeDiv, {
        text: transferUrl,
        width: 180,
        height: 180
    });
});

// 2. Wait for iPhone to Connect
peer.on('connection', (c) => {
    conn = c;
    conn.on('open', () => {
        statusDiv.innerText = "✅ iPhone Connected!";
        qrcodeDiv.style.display = "none";
        uploadSection.style.display = "block";
    });
});

// 3. Send File Logic
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && conn) {
        statusDiv.innerText = `Sending ${file.name}...`;

        // PeerJS handles the binary chunking automatically
        conn.send({
            file: file,
            filename: file.name,
            filetype: file.type
        });

        // Simulating "Sent" after a brief delay (PeerJS send is async but lacks a simple promise)
        setTimeout(() => {
            statusDiv.innerText = "✅ File Sent! Check iPhone.";
        }, 1000);
    }
});