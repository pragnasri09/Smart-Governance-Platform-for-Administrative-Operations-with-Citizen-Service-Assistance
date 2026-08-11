const forms = { login: document.getElementById('loginForm'), register: document.getElementById('registerForm'), password: document.getElementById('passwordForm') };
const message = document.getElementById('message');
const passwordMessage = document.getElementById('passwordMessage');
const switcher = document.getElementById('formSwitch');
const authScreen = document.getElementById('authScreen');
const homeScreen = document.getElementById('homeScreen');
const mainNav = document.getElementById('mainNav');
const passwordPanel = document.getElementById('passwordPanel');
let token = sessionStorage.getItem('civicpulseToken');

function setMessage(text = '', type = '') { message.textContent = text; message.className = `message ${type}`; }
function setPasswordMessage(text = '', type = '') { passwordMessage.textContent = text; passwordMessage.className = `message ${type}`; }
function setView(view) {
  const authenticated = view === 'home';
  authScreen.classList.toggle('hidden', authenticated); homeScreen.classList.toggle('hidden', !authenticated); mainNav.classList.toggle('hidden', !authenticated);
  forms.login.classList.toggle('hidden', view !== 'login'); forms.register.classList.toggle('hidden', view !== 'register');
  switcher.classList.toggle('hidden', authenticated);
  document.getElementById('form-kicker').textContent = view === 'register' ? 'Join CivicPulse' : 'Welcome back';
  document.getElementById('form-title').textContent = view === 'register' ? 'Create your account' : 'Sign in to CivicPulse'; setMessage();
}
async function request(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }, ...options });
  const data = await response.json().catch(() => ({ message: 'Unexpected server response.' }));
  if (!response.ok) throw new Error(data.message || 'Request failed.'); return data;
}
function passwordIsValid(password) { return password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password); }
function showAccount(user) { document.getElementById('welcomeTitle').textContent = `Welcome, ${user.name}`; document.getElementById('accountDetails').textContent = `Signed in as ${user.email}`; passwordPanel.classList.add('hidden'); setPasswordMessage(); setView('home'); }

forms.login.addEventListener('submit', async (event) => { event.preventDefault(); setMessage(); try { const data = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: loginEmail.value, password: loginPassword.value }) }); token = data.token; sessionStorage.setItem('civicpulseToken', token); forms.login.reset(); showAccount(data.user); } catch (error) { setMessage(error.message, 'error'); } });
forms.register.addEventListener('submit', async (event) => { event.preventDefault(); if (!passwordIsValid(registerPassword.value)) return setMessage('Use a password that meets every requirement.', 'error'); try { const data = await request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name: registerName.value, email: registerEmail.value, password: registerPassword.value }) }); token = data.token; sessionStorage.setItem('civicpulseToken', token); forms.register.reset(); showAccount(data.user); } catch (error) { setMessage(error.message, 'error'); } });
forms.password.addEventListener('submit', async (event) => { event.preventDefault(); if (!passwordIsValid(newPassword.value)) return setPasswordMessage('Use a password that meets every requirement.', 'error'); try { const data = await request('/api/auth/password', { method: 'PATCH', body: JSON.stringify({ currentPassword: currentPassword.value, newPassword: newPassword.value }) }); sessionStorage.removeItem('civicpulseToken'); token = null; forms.password.reset(); passwordPanel.classList.add('hidden'); setView('login'); setMessage(data.message, 'success'); } catch (error) { setPasswordMessage(error.message, 'error'); } });
document.getElementById('showRegister').addEventListener('click', () => setView('register'));
document.getElementById('homeButton').addEventListener('click', () => passwordPanel.classList.add('hidden'));
document.getElementById('navPasswordButton').addEventListener('click', () => { setPasswordMessage(); passwordPanel.classList.remove('hidden'); passwordPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
document.getElementById('logoutButton').addEventListener('click', () => { sessionStorage.removeItem('civicpulseToken'); token = null; setView('login'); });

(async () => { if (!token) return setView('login'); try { showAccount((await request('/api/auth/me')).user); } catch { sessionStorage.removeItem('civicpulseToken'); token = null; setView('login'); } })();
