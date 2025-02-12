// เชื่อมต้อ WebSocket
const socket = new WebSocket('ws://localhost:8080');

// ส่วนของ UI
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('message');
const responseDiv = document.getElementById('response');

// การเชื่อมต่อ
socket.onopen = () => {
    console.log('Connected to server.');
};

// การตอบกลับจากเซิร์ฟเวอร์
socket.onmessage = (event) => {
    responseDiv.innerHTML = `Server says: ${event.data}`;
};

// การส่งข้อความไปยังเซิร์ฟเวอร์เมื่อกดปุ่ม
sendBtn.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim()) {
        socket.send(message); // ส่งข้อความไปยังเซิร์ฟเวอร์
        messageInput.value = ''; // เคลียร์ช่องข้อความ
    }
    else {
        alert('Please enter a message.');
    }
});

// การแจ้งเตือนเมื่อเชื่อมต่อหลุด
socket.onclose = () => {
    console.log('Disconnected from server.');
};

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter a username and password.');
        return;
    }
}

function previewFile(){
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const fileNamePreview = document.getElementById('fileNamePreview');
    const filePreview = document.getElementById('filePreview');
    
    if (file) {
        const reader = new FileReader();
    }

    //Clear Previous Preview
    fileNamePreview.textContent = '';
    filePreview.display = 'none';

    // For image files : show image preview
    if (file.type.startsWith('image/')) {
        reader.onload = function (e) => {
            filePreview.style.display = 'inline'; //Display image element
            filePreview.src = e.target.result; // Displuay image
    };
    reader.readAsDataURL(file); // Read the image file
    } else {
        fileNamePreview.textContent = `File selected: ${file.name}`;
    } else {
        fileNamePreview.textContent = 'No file selected'; // Clear text if no file 
        filePreview.style.display = 'none'; //Hide image if no file selected
    }