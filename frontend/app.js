// app.js

const fileInput = document.getElementById("file-input");
const browseBtn = document.getElementById("browse-btn");
const dropZone = document.getElementById("drop-zone");
const uploadStatus = document.getElementById("upload-status");
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Debug (remove later if you want)
console.log("API_BASE_URL:", API_BASE_URL);

/* =======================
   File Upload Logic
======================= */

browseBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "var(--primary)";
});

dropZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "var(--border)";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "var(--border)";
  handleFiles(e.dataTransfer.files);
});

async function handleFiles(files) {
  if (!files || files.length === 0) return;

  const file = files[0];
  uploadStatus.textContent = `Uploading ${file.name}...`;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/ingest`, {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      uploadStatus.textContent = "Ingestion complete! You can now chat.";
    } else {
      uploadStatus.textContent = "Upload failed.";
    }
  } catch (error) {
    console.error(error);
    uploadStatus.textContent = "Error uploading file.";
  }
}

/* =======================
   Chat Logic
======================= */

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  const loadingId = addMessage("Thinking...", "bot");

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    removeMessage(loadingId);

    if (data.answer) {
      addMessage(data.answer, "bot");
    } else {
      addMessage("I couldn't generate an answer.", "bot");
    }
  } catch (error) {
    console.error(error);
    removeMessage(loadingId);
    addMessage("Error connecting to server.", "bot");
  }
}

/* =======================
   Helpers
======================= */

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);

  const id = "msg-" + Date.now();
  div.id = id;

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = text;

  div.appendChild(bubble);
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return id;
}

function removeMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}


// const fileInput = document.getElementById('file-input');
// const browseBtn = document.getElementById('browse-btn');
// const dropZone = document.getElementById('drop-zone');
// const uploadStatus = document.getElementById('upload-status');
// const chatWindow = document.getElementById('chat-window');
// const userInput = document.getElementById('user-input');
// const sendBtn = document.getElementById('send-btn');

// // File Upload Logic
// browseBtn.addEventListener('click', () => fileInput.click());

// fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

// dropZone.addEventListener('dragover', (e) => {
//     e.preventDefault();
//     dropZone.style.borderColor = 'var(--primary)';
// });

// dropZone.addEventListener('dragleave', (e) => {
//     e.preventDefault();
//     dropZone.style.borderColor = 'var(--border)';
// });

// dropZone.addEventListener('drop', (e) => {
//     e.preventDefault();
//     dropZone.style.borderColor = 'var(--border)';
//     handleFiles(e.dataTransfer.files);
// });

// async function handleFiles(files) {
//     if (files.length === 0) return;

//     const file = files[0];
//     uploadStatus.textContent = `Uploading ${file.name}...`;

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
// // <<<<<<< HEAD
//         const response = await fetch(`${API_BASE_URL}/ingest`, {
// // =======
//         // const response = await fetch('https://chatbot-backend1-4qy2.onrender.com/api/ingest', {
// // >>>>>>> 6f1b43025ba28b3d6205482916f911fb5903b9dc
//             method: 'POST',
//             body: formData
//         });

//         if (response.ok) {
//             uploadStatus.textContent = 'Ingestion complete! You can now chat.';
//         } else {
//             uploadStatus.textContent = 'Upload failed.';
//         }
//     } catch (error) {
//         console.error(error);
//         uploadStatus.textContent = 'Error uploading file.';
//     }
// }

// // Chat Logic
// sendBtn.addEventListener('click', sendMessage);
// userInput.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') sendMessage();
// });

// async function sendMessage() {
//     const text = userInput.value.trim();
//     if (!text) return;

//     addMessage(text, 'user');
//     userInput.value = '';

//     const loadingId = addMessage('Thinking...', 'bot');

//     try {
// // <<<<<<< HEAD
//         const response = await fetch(`${API_BASE_URL}/chat`, {
// // =======
//         // const response = await fetch('https://chatbot-backend1-4qy2.onrender.com/api/chat', {
// // >>>>>>> 6f1b43025ba28b3d6205482916f911fb5903b9dc
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ message: text })
//         });

//         const data = await response.json();

//         // Remove loading message
//         const loadingMsg = document.getElementById(loadingId);
//         if (loadingMsg) loadingMsg.remove();

//         if (data.answer) {
//             addMessage(data.answer, 'bot');
//         } else {
//             addMessage("I couldn't generate an answer.", 'bot');
//         }
//     } catch (error) {
//         // Remove loading message
//         const loadingMsg = document.getElementById(loadingId);
//         if (loadingMsg) loadingMsg.remove();

//         addMessage("Error connecting to server.", 'bot');
//     }
// }

// function addMessage(text, sender) {
//     const div = document.createElement('div');
//     div.classList.add('message', sender);
//     const id = 'msg-' + Date.now();
//     div.id = id;

//     const bubble = document.createElement('div');
//     bubble.classList.add('bubble');
//     bubble.textContent = text;

//     div.appendChild(bubble);
//     chatWindow.appendChild(div);
//     chatWindow.scrollTop = chatWindow.scrollHeight;
//     return id;
// }
