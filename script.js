// ==============================================================
let ws;
let loggedIn = false;
fetchFiles();

// Login เสร็จแล้ว
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter a username and password.');
        return;
    }

    // ส่งข้อมูลล็อคอินไปทางด้านของ Backend
    const response = await fetch('http://localhost:8080/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        mode: "cors"
    });

    const data = await response.json();
    if(data.success){
        loggedIn - true;
        document.getElementById('login').style.display = 'none';
        document.getElementById('fileSection').style.display = 'block';
        connectWebSocket(username);
    } else {
        alert(data.message); // Display login failure message
    }
}

function connectWebSocket() {
    ws = new WebSocket('ws://localhost:8080')
    ws.onopen = () => {
        console.log('Connect to Websocker Server!')
        ws.send(JSON.stringify({type: 'login', username}))
    }
    ws.onmessage = (msg) => {
        console.log('Connected to Server.')
    }
}

// การแจ้งเตือนเมื่อเชื่อมต่อหลุด
socket.onclose = () => {
    console.log('Disconnected from server.');
};

// Preview File เสร็จแล้ว
function previewFile(){
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const fileNamePreview = document.getElementById('fileNamePreview');
    const filePreview = document.getElementById('filePreview');
    
    if (file) {
        const reader = new FileReader();

    //Clear Previous Preview
    fileNamePreview.textContent = '';
    filePreview.style.display = 'none';

    // For image files : show image preview
    if (file.type.startsWith('image/')) {
        reader.onload = function (e) {
            filePreview.style.display = 'inline'; //Display image element
            filePreview.src = e.target.result; // Displuay image
    };
    reader.readAsDataURL(file); // Read the image file
    } else {
        fileNamePreview.textContent = `File selected: ${file.name}`;
    };
 } else {
        fileNamePreview.textContent = 'No file selected'; // Clear text if no file 
        filePreview.style.display = 'none'; //Hide image if no file selected
    }
}

// Upload File เสร็จแล้ว
async function uploadFile() {
    const fileNamePreview = document.getElementById('fileNamePreview');
    const filePreview = document.getElementById('filePreview');
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8080/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        alert(data.message);
        fileNamePreview.textContent = '';
        filePreview.style.display = 'none';
        fileInput.value = '';
        fetchFiles();
    } else {
        alert('please select a file');
    }
}

// Fetch Files เสร็จ
async function fetchFiles () {
    const fileListContainer = document.getElementById('fileList');
    fileListContainer.innerHTML = 'Loading...';
    
    try{
        const response = await fetch('http://localhost:8080/files');
        const files = await response.json();
        
        if(files.length === 0){
            fileListContainer.innerHTML = 'No files found';
            return;
        }

        fileListContainer.innerHTML = '';

        files.forEach((filename) => {
            const fileItem = document.createElement('div');

            const fileNameSpan = document.createElement('span');
            fileNameSpan.textContent = filename;
            fileItem.appendChild(fileNameSpan);

            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download';
            downloadButton.classList.add('download');
            downloadButton.onclick = () => downloadFile(filename);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete');
            deleteButton.onclick = () => deleteFile(filename);

            fileItem.appendChild(downloadButton);
            fileItem.appendChild(deleteButton);
            fileListContainer.appendChild(fileItem);
            });
    } catch (error) {
        console.error('Error fetching files:', error);
        fileListContainer.innerHTML = 'Fail to fetching files';
    }

        
}

// Download File เสร็จแล้ว
async function downloadFile(filename) {
        const response = await fetch(`http://localhost:8080/download/${filename}`);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
}

// Delete File เสร็จแล้ว
async function deleteFile(filename) {
    const confirmation = confirm(`Are you sure you want to delete ${filename}?`);
    if (!confirmation) {
       return
    }
    
    const response = await fetch(`http://localhost:8080/delete/${filename}`, {
        method: 'DELETE',
    });
    
    const data = await response.json();
    if(data.success){
        alert(data.message);
        fetchFiles();
    }else {
        alert(data.message || "Failed to delete file.");
    }
}