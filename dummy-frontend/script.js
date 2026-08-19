// Point this at your running Spring Boot backend
const API_BASE = "http://localhost:8082/api/notifications";

const typeSelect = document.getElementById('type');
const emailField = document.getElementById('emailField');
const phoneField = document.getElementById('phoneField');

function toggleFields(){
  emailField.style.display = typeSelect.value === 'EMAIL' ? 'block' : 'none';
  phoneField.style.display = typeSelect.value === 'SMS' ? 'block' : 'none';
}
typeSelect.addEventListener('change', toggleFields);
toggleFields();

document.getElementById('sendForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById('sendStatus');
  const payload = {
    recipientId: Number(document.getElementById('recipientId').value),
    recipientRole: document.getElementById('recipientRole').value,
    recipientEmail: document.getElementById('recipientEmail').value || null,
    recipientPhone: document.getElementById('recipientPhone').value || null,
    title: document.getElementById('title').value,
    message: document.getElementById('message').value,
    type: typeSelect.value,
    referenceType: document.getElementById('referenceType').value || null,
    referenceId: document.getElementById('referenceId').value ? Number(document.getElementById('referenceId').value) : null
  };

  try {
    const res = await fetch(`${API_BASE}/send`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Failed to send');
    statusEl.className = 'status ok';
    statusEl.textContent = `Sent! Notification #${data.id} created with status ${data.status}.`;
  } catch(err) {
    statusEl.className = 'status err';
    statusEl.textContent = `Error: ${err.message}. (Is the backend running on ${API_BASE}?)`;
  }
});

function badge(status){
  return `<span class="badge ${status}">${status}</span>`;
}
function fmtDate(d){
  return d ? new Date(d).toLocaleString() : '—';
}

async function loadInbox(){
  const userId = document.getElementById('lookupUserId').value;
  const body = document.getElementById('inboxBody');
  const unreadLine = document.getElementById('unreadLine');
  body.innerHTML = `<tr><td colspan="5" class="small">Loading...</td></tr>`;
  try {
    const [listRes, countRes] = await Promise.all([
      fetch(`${API_BASE}/user/${userId}`),
      fetch(`${API_BASE}/user/${userId}/unread-count`)
    ]);
    const list = await listRes.json();
    const count = await countRes.json();
    unreadLine.textContent = `Unread: ${count.unread}`;

    if(!list.length){
      body.innerHTML = `<tr><td colspan="5" class="small">No notifications for this user yet.</td></tr>`;
      return;
    }
    body.innerHTML = list.map(n => `
      <tr>
        <td>${n.title}</td>
        <td>${n.type}</td>
        <td>${badge(n.status)}</td>
        <td>${fmtDate(n.createdAt)}</td>
        <td>${n.status !== 'READ' ? `<button class="actionBtn" onclick="markRead(${n.id})">Mark read</button>` : ''}</td>
      </tr>
    `).join('');
  } catch(err) {
    body.innerHTML = `<tr><td colspan="5" class="small">Error loading inbox: ${err.message}</td></tr>`;
  }
}

async function markRead(id){
  await fetch(`${API_BASE}/${id}/read`, { method: 'PUT' });
  loadInbox();
}

async function loadAll(){
  const body = document.getElementById('allBody');
  body.innerHTML = `<tr><td colspan="7" class="small">Loading...</td></tr>`;
  try {
    const res = await fetch(`${API_BASE}?size=50&sort=createdAt,desc`);
    const page = await res.json();
    const items = page.content || [];
    if(!items.length){
      body.innerHTML = `<tr><td colspan="7" class="small">No notifications yet.</td></tr>`;
      return;
    }
    body.innerHTML = items.map(n => `
      <tr>
        <td>${n.id}</td>
        <td>${n.recipientId}</td>
        <td>${n.title}</td>
        <td>${n.type}</td>
        <td>${badge(n.status)}</td>
        <td>${fmtDate(n.createdAt)}</td>
        <td class="small">${n.failureReason || ''}</td>
      </tr>
    `).join('');
  } catch(err) {
    body.innerHTML = `<tr><td colspan="7" class="small">Error: ${err.message}</td></tr>`;
  }
}

document.getElementById('loadInboxBtn').addEventListener('click', loadInbox);
document.getElementById('loadAllBtn').addEventListener('click', loadAll);

