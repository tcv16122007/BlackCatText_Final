import './style.css'
// @ts-ignore
import SockJS from 'sockjs-client/dist/sockjs.min.js'
import { Client } from '@stomp/stompjs'

const loginForm = document.getElementById('login-form') as HTMLFormElement;
const registerForm = document.getElementById('register-form') as HTMLFormElement;
const toggleBtn = document.getElementById('toggle-auth-btn') as HTMLButtonElement;
const toggleText = document.getElementById('toggle-text') as HTMLElement;
const authSubtitle = document.getElementById('auth-subtitle') as HTMLElement;
const authContainer = document.getElementById('auth-container') as HTMLElement;
const chatContainer = document.getElementById('chat-container') as HTMLElement;

const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
const displayUsername = document.getElementById('display-username') as HTMLElement;
const userAvatar = document.getElementById('user-avatar') as HTMLElement;
const messageForm = document.getElementById('message-form') as HTMLFormElement;
const messageInput = document.getElementById('message-input') as HTMLInputElement;
const messageArea = document.getElementById('message-area') as HTMLElement;

let stompClient: Client | null = null;
let currentUser = "";

// Ẩn/hiện mật khẩu
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const input = (e.currentTarget as HTMLElement).previousElementSibling as HTMLInputElement;
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

// Chuyển đổi form
let isLoginMode = true;
toggleBtn?.addEventListener('click', () => {
  isLoginMode = !isLoginMode;
  loginForm.classList.toggle('hidden', !isLoginMode);
  registerForm.classList.toggle('hidden', isLoginMode);
  toggleText.textContent = isLoginMode ? "Chưa có tài khoản?" : "Đã có tài khoản?";
  toggleBtn.textContent = isLoginMode ? "Đăng ký ngay" : "Đăng nhập";
  authSubtitle.textContent = isLoginMode ? "Đăng nhập để tiếp tục trò chuyện" : "Tạo tài khoản mới";
});

// Toast thông báo
function showToast(msg: string, isError: boolean = false) {
  const toast = document.createElement('div');
  toast.className = `fixed top-5 right-5 px-6 py-3 rounded-xl text-white font-medium shadow-2xl z-[100] transition-all duration-300 transform translate-y-0 opacity-100 ${isError ? 'bg-red-600' : 'bg-emerald-600'}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// API Đăng ký
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = (document.getElementById('reg-username') as HTMLInputElement).value;
  const email = (document.getElementById('reg-email') as HTMLInputElement).value;
  const password = (document.getElementById('reg-password') as HTMLInputElement).value;

  try {
    const res = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      showToast('Đăng ký thành công!');
      toggleBtn.click();
      registerForm.reset();
    } else {
      showToast(data.error || 'Lỗi đăng ký', true);
    }
  } catch (err) {
    showToast('Không thể kết nối Server!', true);
  }
});

// API Đăng nhập
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = (document.getElementById('login-username') as HTMLInputElement).value;
  const password = (document.getElementById('login-password') as HTMLInputElement).value;

  try {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      showToast('Đăng nhập thành công!');
      localStorage.setItem('user', JSON.stringify(data));
      showChatUI(data.username);
    } else {
      showToast(data.error || 'Sai tài khoản/mật khẩu', true);
    }
  } catch (err) {
    showToast('Không thể kết nối Server!', true);
  }
});

// Chuyển sang giao diện Chat
async function showChatUI(username: string) {
  currentUser = username;
  authContainer.classList.add('hidden');

  chatContainer.classList.remove('hidden');
  displayUsername.textContent = username;
  userAvatar.textContent = username.charAt(0).toUpperCase();

  await loadChatHistory();
  connectWebSocket();
}

// Tải lịch sử chat
async function loadChatHistory() {
  try {
    const res = await fetch('http://localhost:8080/api/chat/history');
    if (res.ok) {
      const messages = await res.json();
      messageArea.innerHTML = '';
      messages.forEach((msg: any) => {
        appendMessage(msg.sender, msg.content, msg.sender === currentUser);
      });
    }
  } catch (e) {
    console.error('Lỗi khi tải lịch sử chat:', e);
  }
}

// Kết nối WebSocket
function connectWebSocket() {
  const socket = new SockJS('http://localhost:8080/ws');
  stompClient = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      stompClient?.subscribe('/topic/public', (msg) => {
        const chatMsg = JSON.parse(msg.body);
        appendMessage(chatMsg.sender, chatMsg.content, chatMsg.sender === currentUser);
      });
    }
  });
  stompClient.activate();
}

// Render tin nhắn ra màn hình (Phong cách Kính mờ)
function appendMessage(sender: string, content: string, isMine: boolean) {
  const msgWrapper = document.createElement('div');
  msgWrapper.className = `flex w-full ${isMine ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`;

  let innerHTML = '';

  if (isMine) {
    // Tin nhắn của mình: Gradient phát sáng nhẹ
    innerHTML = `
      <div class="flex flex-col items-end max-w-[75%]">
        <div class="bg-gradient-to-br from-cyan-600/90 to-blue-700/90 backdrop-blur-sm border border-cyan-400/30 px-5 py-3 rounded-2xl rounded-tr-sm text-white text-[15px] shadow-[0_5px_15px_rgba(6,182,212,0.3)] break-words">
          ${content}
        </div>
        <span class="text-[11px] text-gray-400 mt-1.5 mr-1">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    `;
  } else {
    // Tin nhắn người khác: Kính mờ xám, viền sáng
    const initial = sender.charAt(0).toUpperCase();
    innerHTML = `
      <div class="flex items-end gap-2 max-w-[75%]">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center font-bold text-xs text-white shadow-[0_0_10px_rgba(192,38,211,0.4)]">
          ${initial}
        </div>
        <div class="flex flex-col items-start">
          <span class="text-[11px] text-gray-400 mb-1 ml-1">${sender}</span>
          <div class="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl rounded-tl-sm text-gray-100 text-[15px] border border-white/10 shadow-lg break-words">
            ${content}
          </div>
          <span class="text-[11px] text-gray-400 mt-1.5 ml-1">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    `;
  }

  msgWrapper.innerHTML = innerHTML;
  messageArea.appendChild(msgWrapper);

  messageArea.scrollTo({ top: messageArea.scrollHeight, behavior: 'smooth' });
}

// Gửi tin nhắn
messageForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();
  if (content && stompClient) {
    stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ sender: currentUser, content: content, type: 'CHAT' })
    });
    messageInput.value = '';
  }
});

// Đăng xuất
logoutBtn?.addEventListener('click', () => {
  if (stompClient) stompClient.deactivate();
  stompClient = null;
  localStorage.removeItem('user');

  chatContainer.classList.add('hidden');
  authContainer.classList.remove('hidden');

  loginForm.reset();
  messageArea.innerHTML = '';
});

// Tự động đăng nhập
const savedUser = localStorage.getItem('user');
if (savedUser) {
  showChatUI(JSON.parse(savedUser).username);
}