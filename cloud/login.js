document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.querySelector('.login-container');
  const registerContainer = document.querySelector('.register-container');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginMsg = document.getElementById('login-message');
  const registerMsg = document.getElementById('register-message');

  // 切换登录/注册
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'flex';
    loginMsg.textContent = '';
    registerMsg.textContent = '';
  });
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'flex';
    registerContainer.style.display = 'none';
    loginMsg.textContent = '';
    registerMsg.textContent = '';
  });

  // 注册表单提交
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const password2 = document.getElementById('register-password2').value;
    registerMsg.classList.remove('success');
    if (password !== password2) {
      registerMsg.textContent = '密码不匹配！';
      return;
    }
    if (username.length < 3 || password.length < 3) {
      registerMsg.textContent = '用户名和密码必须至少为 3 个字符。';
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      registerMsg.textContent = data.message;
      if (res.ok) {
        registerMsg.classList.add('success');
        setTimeout(() => showLogin.click(), 1200);
      }
    } catch (err) {
      registerMsg.textContent = '网络错误。';
    }
  });

  // 登录表单提交
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    loginMsg.classList.remove('success');
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      loginMsg.textContent = data.message;
      if (res.ok) {
        loginMsg.classList.add('success');
        setTimeout(() => window.location.href = 'cloud.html', 1200);
      }
    } catch (err) {
      loginMsg.textContent = '网络错误。';
    }
  });
});