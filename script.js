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