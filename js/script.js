'use strict';
const STORAGE_KEYS = {
  PATIENTS:     'mediflow_patients',
  APPOINTMENTS: 'mediflow_appointments',
};

let state = {
  patients:     [],
  appointments: [],
  currentPage: {
    patients:     1,
    appointments: 1,
  },
  pageSize: {
    patients:     8,
    appointments: 8,
  },
  sort: {
    field: 'name',
    dir:   'asc',
  },
  editingPatientId:     null,
  editingApptId:        null,
  deleteCallback:       null,
  viewingPatientId:     null,
};

function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { console.error('Storage error', e); }
}

function load(key) {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : null;
  } catch(e) { return null; }
}


function genPatientId() {
  const max = state.patients.reduce((m, p) => {
    const n = parseInt((p.id || '').replace('PT-',''));
    return isNaN(n) ? m : Math.max(m, n);
  }, 8490);
  return `PT-${max + 1}`;
}

function genApptId() {
  const max = state.appointments.reduce((m, a) => {
    const n = parseInt((a.id || '').replace('#APT-',''));
    return isNaN(n) ? m : Math.max(m, n);
  }, 4020);
  return `#APT-${max + 1}`;
}


function seedData() {
  const patientsData = [
    { id:'PT-8492', 
      firstName:'Eleanor', 
      lastName:'Roosevelt', 
      dob:'1981-03-15', 
      gender:'Female', 
      phone:'(555) 123-4567', 
      email:'e.roosevelt@email.com', 
      address:'42 Maple St, New York, NY 10001', 
      status:'Active', 
      notes:'No known allergies.', 
      createdAt:'2023-10-24' 
    },
    {
     id:'PT-8493', 
     firstName:'Marcus', 
     lastName:'Chen',    
     dob:'1995-07-22', 
     gender:'Male', 
     phone:'(555) 987-6543', 
     email:'m.chen@email.com', 
     address:'17 Oak Ave, Los Angeles, CA 90001', 
     status:'Inactive', 
     notes:'Peanut allergy.', 
     createdAt:'2023-09-12' 
    },
    {
     id:'PT-8494', 
     firstName:'Sarah', 
     lastName:'Jenkins',   
     dob:'1958-11-02', 
     gender:'Female', 
     phone:'(555) 456-7890', 
     email:'s.jenkins@email.com', 
     address:'88 Pine Rd, Chicago, IL 60601', 
     status:'Active', 
     notes:'Hypertension, on medication.', 
     createdAt:'2023-11-02' 
    },
    {
     id:'PT-8495', 
     firstName:'David', 
     lastName:'Kim',       
     dob:'1990-04-30', 
     gender:'Male', 
     phone:'(555) 321-0987', 
     email:'d.kim@email.com', 
     address:'5 River Blvd, Houston, TX 77001', 
     status:'Active', 
     notes:'Diabetic (Type 2).', 
     createdAt:'2023-10-20' 
    },
    {
     id:'PT-8496', 
     firstName:'Amelia',  
     lastName:'Thompson',  
     dob:'2002-01-18', 
     gender:'Female', 
     phone:'(555) 654-3210', 
     email:'a.thompson@email.com', 
     address:'22 Sunset Dr, Phoenix, AZ 85001', 
     status:'Active', 
     notes:'', 
     createdAt:'2023-10-28' 
    },
    {
     id:'PT-8497', 
     firstName:'James', 
     lastName:'Williams',  
     dob:'1975-08-05', 
     gender:'Male', 
     phone:'(555) 789-0123', 
     email:'j.williams@email.com', 
     address:'9 Birch Lane, San Diego, CA 92101', 
     status:'Active', 
     notes:'Asthmatic.', 
     createdAt:'2023-10-18' 
    },
    {
     id:'PT-8498', 
     firstName:'Fatima',  
     lastName:'Al-Hassan', 
     dob:'1988-12-25', 
     gender:'Female', 
     phone:'(555) 234-5678', 
     email:'f.alhassan@email.com', 
     address:'100 Cedar St, Dallas, TX 75201', 
     status:'Active', 
     notes:'', 
     createdAt:'2023-10-15' 
    },
    {
     id:'PT-8499', 
     firstName:'Robert',  
     lastName:'Taylor',    
     dob:'1955-03-10', 
     gender:'Male',   
     phone:'(555) 876-5432', 
     email:'r.taylor@email.com',     
     address:'33 Elm St, San Jose, CA 95101', 
     status:'Inactive', 
     notes:'Heart condition – consult cardiologist.', 
     createdAt:'2023-09-30' 
    },
    {
     id:'PT-8500', 
     firstName:'Olivia',  
     lastName:'Brown',     
     dob:'2000-06-14', 
     gender:'Female', 
     phone:'(555) 345-6789', 
     email:'o.brown@email.com',      
     address:'77 Walnut Ave, Austin, TX 78701', 
     status:'Active', 
     notes:'', 
     createdAt:'2023-10-22' 
    },
    {
     id:'PT-8501', 
     firstName:'Michael', 
     lastName:'Johnson',   
     dob:'1983-09-08', 
     gender:'Male',   
     phone:'(555) 567-8901', 
     email:'m.johnson@email.com',    
     address:'14 Palm St, Jacksonville, FL 32099', 
     status:'Active', 
     notes:'Back pain, physiotherapy ongoing.', 
     createdAt:'2023-10-10' 
    },
  ];

  const today = new Date().toISOString().slice(0,10);
  const todayTime = (h, m) => `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;

  const appointmentsData = [
    { 
      id:'#APT-4028', 
      patientId:'PT-8492', 
      doctor:'Dr. Smith',   
      date: today, 
      time:todayTime(9,0),  
      type:'General Checkup',      
      status:'Completed', 
      notes:'' 
    },
    { 
      id:'#APT-4029', 
      patientId:'PT-8493', 
      doctor:'Dr. Adams',   
      date: today, 
      time:todayTime(10,30),type:'Follow-up',             
      status:'Scheduled', 
      notes:'' 
    },
    { 
      id:'#APT-4030', 
      patientId:'PT-8494', 
      doctor:'Dr. Smith',   
      date: today, 
      time:todayTime(11,15),type:'Consultation',          
      status:'Scheduled', 
      notes:'' 
    },
    { 
      id:'#APT-4031', 
      patientId:'PT-8495', 
      doctor:'Dr. Lee',     
      date: today, 
      time:todayTime(13,0), 
      type:'Routine Check',        
      status:'Cancelled', 
      notes:'Patient did not show up.' 
    },
    { 
      id:'#APT-4032', 
      patientId:'PT-8496', 
      doctor:'Dr. Johnson', 
      date: today, 
      time:todayTime(14,30),
      type:'Consultation',          
      status:'Scheduled', 
      notes:'' 
    },
    { 
      id:'#APT-4027', 
      patientId:'PT-8499', 
      doctor:'Dr. Chen',    
      date:'2023-10-23', 
      time:todayTime(15,0), 
      type:'Lab Results Review', 
      status:'Completed', 
      notes:'Normal results.' 
    },
    { 
      id:'#APT-4026', 
      patientId:'PT-8497', 
      doctor:'Dr. Smith',   
      date:'2023-10-22', 
      time:todayTime(9,30), 
      type:'Follow-up',          
      status:'Completed', 
      notes:'' 
    },
    { 
      id:'#APT-4025', 
      patientId:'PT-8498', 
      doctor:'Dr. Adams',   
      date:'2023-10-21', 
      time:todayTime(11,0), 
      type:'General Checkup',    
      status:'Cancelled', 
      notes:'' 
    },
    { 
      id:'#APT-4024', 
      patientId:'PT-8500', 
      doctor:'Dr. Lee',     
      date:'2023-10-20', 
      time:todayTime(14,0), 
      type:'Consultation',        
      status:'Scheduled', 
      notes:'' 
    },
    { 
      id:'#APT-4023', 
      patientId:'PT-8501', 
      doctor:'Dr. Johnson', 
      date:'2023-10-19', 
      time:todayTime(10,0), 
      type:'Routine Check',      
      status:'Completed', 
      notes:'' 
    },
  ];

  save(STORAGE_KEYS.PATIENTS, patientsData);
  save(STORAGE_KEYS.APPOINTMENTS, appointmentsData);
  state.patients     = patientsData;
  state.appointments = appointmentsData;
}

function initData() {
  const patients     = load(STORAGE_KEYS.PATIENTS);
  const appointments = load(STORAGE_KEYS.APPOINTMENTS);

  if (!patients || patients.length === 0) {
    seedData();
  } else {
    state.patients     = patients;
    state.appointments = appointments || [];
  }
}

function getPatient(id) {
  return state.patients.find(p => p.id === id) || null;
}


function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'2-digit', year:'numeric' });
  } catch { return dateStr; }
}

function formatTime(timeStr) {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2,'0')} ${ampm}`;
}

function calcAge(dob) {
  if (!dob) return '—';
  const b = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
}

function getInitials(firstName, lastName) {
  return ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase();
}
function avatarColor(id) {
  const n = parseInt((id || '').replace(/\D/g,'')) || 0;
  return `av-${n % 8}`;
}

function fullName(p) {
  return `${p.firstName} ${p.lastName}`;
}
function todayStr() {
  return new Date().toISOString().slice(0,10);
}

function statusBadge(status) {
  const cls = {
    'Scheduled': 'badge-scheduled',
    'Completed': 'badge-completed',
    'Cancelled': 'badge-cancelled',
    'Active':    'badge-active',
    'Inactive':  'badge-inactive',
  }[status] || 'badge-inactive';
  return `<span class="status-badge ${cls}">${status}</span>`;
}


function showToast(message, type = 'success') {
  const icons = { 
    success:'check_circle', 
    error:'error', 
    info:'info', 
    warning:'warning' 
  };
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon"><span class="material-symbols-outlined">${icons[type] || 'info'}</span></span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 3200);
}


function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-link[data-page]').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });
  const titles = { dashboard:'Dashboard', patients:'Patients Directory', appointments:'Appointments Directory' };
  const titleEl = document.querySelector('#pageTitle h2');
  if (titleEl) titleEl.textContent = titles[page] || 'Dashboard';

  /* Close mobile sidebar */
  closeMobileSidebar();

  /* Render the correct page */
  if (page === 'dashboard')    renderDashboard();
  if (page === 'patients')     renderPatients();
  if (page === 'appointments') renderAppointments();
}

function openMobileSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  if (sidebar)  sidebar.classList.add('mobile-open');
  if (overlay)  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  if (sidebar)  sidebar.classList.remove('mobile-open');
  if (overlay)  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

function renderDashboard() {
  const today       = todayStr();
  const todayAppts  = state.appointments.filter(a => a.date === today);
  animateNumber('statTotalPatients', state.patients.length);

  /* Today's appointments count */
  animateNumber('statTodayAppts', todayAppts.length);

  /* Completed — ALL-TIME completed appointments */
  const allCompleted = state.appointments.filter(a => a.status === 'Completed').length;
  animateNumber('statCompleted', allCompleted);

  const allCancelled = state.appointments.filter(a => a.status === 'Cancelled').length;
  animateNumber('statCancelled', allCancelled);

  renderDashTable(todayAppts.slice(0, 5));
  const totalAll    = state.appointments.length;
  const scheduled   = state.appointments.filter(a => a.status === 'Scheduled').length;
  drawDonut(scheduled, allCompleted, allCancelled, totalAll);

  const donutTotalEl = document.getElementById('donutTotal');
  if (donutTotalEl) donutTotalEl.textContent = totalAll;

  renderBarChart();

  renderRecentPatients();
}

/* Animated counter */
function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start    = parseInt(el.textContent.replace(/,/g, '')) || 0;
  const duration = 600;
  const diff     = target - start;
  if (diff === 0) { 
    el.textContent = target.toLocaleString(); 
    return; 
  }
  const step     = Math.ceil(Math.abs(diff) / (duration / 16)) || 1;
  let current    = start;
  const interval = setInterval(() => {
    current = target > start
      ? Math.min(current + step, target)
      : Math.max(current - step, target);
    el.textContent = current.toLocaleString();
    if (current === target) clearInterval(interval);
  }, 16);
}

/* Today's appointments mini-table */
function renderDashTable(appts) {
  const tbody = document.getElementById('dashApptBody');
  if (!tbody) return;

  if (!appts || appts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">
      <div class="empty-state">
        <span class="material-symbols-outlined">event_busy</span>
        <p>No appointments today</p>
        <span>Book a new appointment to get started.</span>
      </div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = appts.map(a => {
    const patient = getPatient(a.patientId);
    const name    = patient ? fullName(patient) : a.patientId;
    return `<tr>
      <td><div class="patient-cell">
        <div class="patient-avatar ${patient ? avatarColor(patient.id) : 'av-0'}">${patient ? getInitials(patient.firstName, patient.lastName) : '?'}</div>
        <span>${name}</span>
      </div></td>
      <td style="color:var(--secondary)">${a.doctor}</td>
      <td>${formatTime(a.time)}</td>
      <td>${a.type}</td>
      <td>${statusBadge(a.status)}</td>
    </tr>`;
  }).join('');
}

/* ---- Donut Chart (Canvas) ---- */
function drawDonut(scheduled, completed, cancelled, total) {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 80, cy = 80, r = 62, lineW = 20;

  ctx.clearRect(0, 0, 160, 160);

  const segments = [
    { value: scheduled, color: '#0050cb' },
    { value: completed, color: '#10B981' },
    { value: cancelled, color: '#ba1a1a' },
  ];

  if (total === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth  = lineW;
    ctx.strokeStyle = '#e1e2ee';
    ctx.stroke();
    return;
  }

  let startAngle = -Math.PI / 2;
  const gap      = 0.03;

  segments.forEach(seg => {
    if (seg.value === 0) return;
    const sliceAngle = (seg.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle + gap, startAngle + sliceAngle - gap);
    ctx.lineWidth   = lineW;
    ctx.lineCap     = 'round';
    ctx.strokeStyle = seg.color;
    ctx.stroke();
    startAngle += sliceAngle;
  });
}

/* ---- Bar Chart — last 7 days ---- */
function renderBarChart() {
  const today  = new Date();
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const data   = [];

  for (let i = 6; i >= 0; i--) {
    const d  = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const count = state.appointments.filter(a => a.date === ds).length;
    data.push({ day: days[d.getDay()], count, isToday: i === 0, dateStr: ds });
  }

  const max   = Math.max(...data.map(d => d.count), 1);
  const chart = document.getElementById('barChart');
  const labels = document.getElementById('barLabels');
  if (!chart) return;

  chart.innerHTML = data.map(d => {
    const pct = Math.round((d.count / max) * 100);
    const h   = Math.max(pct, d.count > 0 ? 8 : 4);
    return `<div class="bar-item">
      <div class="bar-fill ${d.isToday ? 'today' : ''}" style="height:${h}%" title="${d.count} appointment${d.count !== 1 ? 's' : ''} on ${d.dateStr}">
        <div class="bar-tooltip">${d.count} appt${d.count !== 1 ? 's' : ''}</div>
      </div>
    </div>`;
  }).join('');

  if (labels) {
    labels.innerHTML = data.map(d =>
      `<span style="${d.isToday ? 'color:var(--primary);font-weight:700' : ''}">${d.day}</span>`
    ).join('');
  }
}

/* ---- Recent Patients ---- */
function renderRecentPatients() {
  const list = document.getElementById('recentPatientsList');
  if (!list) return;

  /* Sort patients by createdAt descending, take last 4 */
  const recent = [...state.patients]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 4);

  if (recent.length === 0) {
    list.innerHTML = `<div class="empty-state"><span class="material-symbols-outlined">person_off</span><p>No patients yet</p></div>`;
    return;
  }

  list.innerHTML = recent.map(p => {
    const age       = calcAge(p.dob);
    const dateLabel = p.createdAt === todayStr()
      ? 'Added Today'
      : p.createdAt === getPrevDay(1)
        ? 'Added Yesterday'
        : formatDate(p.createdAt);

    return `<div class="recent-patient-item" data-id="${p.id}" onclick="viewPatientDetail('${p.id}')">
      <div class="rp-left">
        <div class="patient-avatar ${avatarColor(p.id)}">${getInitials(p.firstName, p.lastName)}</div>
        <div>
          <div class="rp-name">${fullName(p)}</div>
          <div class="rp-meta">${age} yrs • ${p.gender}</div>
        </div>
      </div>
      <span class="rp-date">${dateLabel}</span>
    </div>`;
  }).join('');
}

function getPrevDay(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0,10);
}

function getFilteredPatients() {
  const search = (document.getElementById('patientSearch')?.value || '').toLowerCase().trim();
  const status = document.getElementById('patientStatusFilter')?.value || '';
  const sort   = document.getElementById('patientSort')?.value || 'name-asc';

  let list = state.patients.filter(p => {
    const matchSearch = !search ||
      fullName(p).toLowerCase().includes(search) ||
      (p.phone || '').includes(search) ||
      (p.id || '').toLowerCase().includes(search);
    const matchStatus = !status || p.status === status;
    return matchSearch && matchStatus;
  });

  list.sort((a, b) => {
    if (sort === 'name-asc')  
      return fullName(a).localeCompare(fullName(b));
    if (sort === 'name-desc') return fullName(b).localeCompare(fullName(a));
    if (sort === 'date-desc') return (b.createdAt || '').localeCompare(a.createdAt || '');
    if (sort === 'date-asc')  return (a.createdAt || '').localeCompare(b.createdAt || '');
    return 0;
  });

  return list;
}

function renderPatients() {
  const list     = getFilteredPatients();
  const page     = state.currentPage.patients;
  const size     = state.pageSize.patients;
  const total    = list.length;
  const start    = (page - 1) * size;
  const end      = Math.min(start + size, total);
  const pageData = list.slice(start, end);
  const tbody    = document.getElementById('patientsBody');
  if (!tbody) return;

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8">
      <div class="empty-state">
        <span class="material-symbols-outlined">person_search</span>
        <p>No patients found</p>
        <span>Try adjusting your search or filters.</span>
      </div>
    </td></tr>`;
  } else {
    tbody.innerHTML = pageData.map(p => {
      const age      = calcAge(p.dob);
      const lastAppt = state.appointments
        .filter(a => a.patientId === p.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      const lastVisit = lastAppt ? formatDate(lastAppt.date) : '—';

      return `<tr>
        <td style="color:var(--secondary);font-size:13px">${p.id}</td>
        <td>
          <div class="patient-cell">
            <div class="patient-avatar ${avatarColor(p.id)}">${getInitials(p.firstName, p.lastName)}</div>
            <span class="patient-name-link" onclick="viewPatientDetail('${p.id}')">${fullName(p)}</span>
          </div>
        </td>
        <td style="color:var(--on-surface-variant)">${age}</td>
        <td style="color:var(--on-surface-variant)">${p.gender}</td>
        <td>
          <div class="contact-cell">
            <p>${p.phone}</p>
            ${p.email ? `<span>${p.email}</span>` : ''}
          </div>
        </td>
        <td style="color:var(--on-surface-variant)">${lastVisit}</td>
        <td>${statusBadge(p.status)}</td>
        <td>
          <div class="row-actions">
            <button class="action-btn" title="View" onclick="viewPatientDetail('${p.id}')">
              <span class="material-symbols-outlined">visibility</span>
            </button>
            <button class="action-btn" title="Edit" onclick="openEditPatient('${p.id}')">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="action-btn delete-btn" title="Delete" onclick="confirmDeletePatient('${p.id}')">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  renderPagination('patient', total, page, size);
}



function renderPagination(type, total, current, size) {
  const totalPages = Math.ceil(total / size);
  const infoEl     = document.getElementById(`${type}PaginationInfo`);
  const btnsEl     = document.getElementById(`${type}PaginationBtns`);
  if (!infoEl || !btnsEl) return;

  const start = total === 0 ? 0 : (current - 1) * size + 1;
  const end   = Math.min(current * size, total);
  infoEl.textContent = total === 0
    ? 'No entries'
    : `Showing ${start} to ${end} of ${total} entries`;

  if (totalPages <= 1) { btnsEl.innerHTML = ''; return; }

  let btns = '';

  btns += `<button class="page-btn" ${current === 1 ? 'disabled' : ''} onclick="changePage('${type}', ${current - 1})">
    <span class="material-symbols-outlined">chevron_left</span>
  </button>`;

  const range = getPageRange(current, totalPages);
  range.forEach(p => {
    if (p === '...') {
      btns += `<span style="padding:0 4px;color:var(--on-surface-variant)">…</span>`;
    } else {
      btns += `<button class="page-btn ${p === current ? 'active' : ''}" onclick="changePage('${type}', ${p})">${p}</button>`;
    }
  });

  btns += `<button class="page-btn" ${current === totalPages ? 'disabled' : ''} onclick="changePage('${type}', ${current + 1})">
    <span class="material-symbols-outlined">chevron_right</span>
  </button>`;

  btnsEl.innerHTML = btns;
}

function getPageRange(current, total) {
  if (total <= 5) return Array.from({length:total}, (_,i)=>i+1);
  const range = [];
  if (current <= 3) {
    range.push(1,2,3,'...',total);
  } else if (current >= total - 2) {
    range.push(1,'...',total-2,total-1,total);
  } else {
    range.push(1,'...',current-1,current,current+1,'...',total);
  }
  return range;
}

function changePage(type, page) {
  const key = type === 'patient' ? 'patients' : 'appointments';
  const totalPages = Math.ceil(
    (type === 'patient' ? getFilteredPatients() : getFilteredAppts()).length /
    state.pageSize[key]
  );
  page = Math.max(1, Math.min(page, totalPages));
  state.currentPage[key] = page;
  if (type === 'patient') renderPatients();
  if (type === 'appt')    renderAppointments();
}

function getFilteredAppts() {
  const search     = (document.getElementById('apptSearch')?.value || '').toLowerCase().trim();
  const dateFilter = document.getElementById('apptDateFilter')?.value || '';
  const status     = document.getElementById('apptStatusFilter')?.value || '';

  return state.appointments.filter(a => {
    const patient    = getPatient(a.patientId);
    const name       = patient ? fullName(patient).toLowerCase() : '';
    const matchSearch = !search ||
      name.includes(search) ||
      (a.id || '').toLowerCase().includes(search) ||
      (a.doctor || '').toLowerCase().includes(search);
    const matchDate   = !dateFilter || a.date === dateFilter;
    const matchStatus = !status || a.status === status;
    return matchSearch && matchDate && matchStatus;
  }).sort((a, b) => {
    const dateComp = b.date.localeCompare(a.date);
    if (dateComp !== 0) return dateComp;
    return (a.time || '').localeCompare(b.time || '');
  });
}

function renderAppointments() {
  const list     = getFilteredAppts();
  const page     = state.currentPage.appointments;
  const size     = state.pageSize.appointments;
  const total    = list.length;
  const start    = (page - 1) * size;
  const end      = Math.min(start + size, total);
  const pageData = list.slice(start, end);
  const tbody    = document.getElementById('apptsBody');
  if (!tbody) return;

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">
      <div class="empty-state">
        <span class="material-symbols-outlined">calendar_off</span>
        <p>No appointments found</p>
        <span>Try adjusting your search or filters.</span>
      </div>
    </td></tr>`;
  } else {
    tbody.innerHTML = pageData.map(a => {
      const patient = getPatient(a.patientId);
      const name    = patient ? fullName(patient) : a.patientId;

      let actions = `
        <button class="action-btn" title="View" onclick="viewApptDetail('${a.id}')">
          <span class="material-symbols-outlined">visibility</span>
        </button>`;

      if (a.status === 'Scheduled') {
        actions += `
          <button class="action-btn" title="Edit" onclick="openEditAppt('${a.id}')">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="action-btn complete-btn" title="Mark Complete" onclick="changeApptStatus('${a.id}','Completed')">
            <span class="material-symbols-outlined">check_circle</span>
          </button>
          <button class="action-btn cancel-appt-btn" title="Cancel" onclick="changeApptStatus('${a.id}','Cancelled')">
            <span class="material-symbols-outlined">cancel</span>
          </button>`;
      } else {
        actions += `
          <button class="action-btn" title="Edit" onclick="openEditAppt('${a.id}')">
            <span class="material-symbols-outlined">edit</span>
          </button>`;
      }
      actions += `
        <button class="action-btn delete-btn" title="Delete" onclick="confirmDeleteAppt('${a.id}')">
          <span class="material-symbols-outlined">delete</span>
        </button>`;

      return `<tr>
        <td style="color:var(--secondary);font-size:13px">${a.id}</td>
        <td>
          <div class="patient-cell">
            <div class="patient-avatar ${patient ? avatarColor(patient.id) : 'av-0'}">${patient ? getInitials(patient.firstName, patient.lastName) : '?'}</div>
            <div>
              <div style="font-weight:600">${name}</div>
              ${patient ? `<div style="font-size:12px;color:var(--secondary)">${patient.phone}</div>` : ''}
            </div>
          </div>
        </td>
        <td>${a.doctor}</td>
        <td>
          <div style="font-weight:500">${formatDate(a.date)}</div>
          <div style="font-size:12px;color:var(--secondary)">${formatTime(a.time)}</div>
        </td>
        <td>${a.type}</td>
        <td>${statusBadge(a.status)}</td>
        <td>
          <div class="row-actions">${actions}</div>
        </td>
      </tr>`;
    }).join('');
  }

  renderPagination('appt', total, page, size);
}

/* Change appointment status directly from table */
function changeApptStatus(id, newStatus) {
  const appt = state.appointments.find(a => a.id === id);
  if (!appt) return;
  appt.status = newStatus;
  save(STORAGE_KEYS.APPOINTMENTS, state.appointments);
  renderAppointments();
  renderDashboard();
  showToast(`Appointment marked as ${newStatus}.`, 'success');
}

/* View appointment detail — reuse edit modal */
function viewApptDetail(id) {
  openEditAppt(id);
}

function openAddPatient() {
  state.editingPatientId = null;
  const titleEl = document.getElementById('patientModalTitle');
  const subEl   = document.getElementById('patientModalSub');
  if (titleEl) titleEl.textContent = 'Add New Patient';
  if (subEl)   subEl.textContent   = 'Enter comprehensive patient details to create a new medical record.';
  resetPatientForm();
  openModal('patientModalOverlay');
}

function openEditPatient(id) {
  const p = getPatient(id);
  if (!p) return;
  state.editingPatientId = id;

  const titleEl = document.getElementById('patientModalTitle');
  const subEl   = document.getElementById('patientModalSub');
  if (titleEl) titleEl.textContent = 'Edit Patient';
  if (subEl)   subEl.textContent   = `Editing record for ${fullName(p)}`;

  /* Fill form fields */
  const fields = {
    patientId:  p.id,
    pFirstName: p.firstName,
    pLastName:  p.lastName,
    pDOB:       p.dob,
    pGender:    p.gender,
    pStatus:    p.status,
    pPhone:     p.phone,
    pEmail:     p.email     || '',
    pAddress:   p.address   || '',
    pNotes:     p.notes     || '',
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  clearFormErrors('errFirstName','errLastName','errDOB','errGender','errPhone','errEmail');
  openModal('patientModalOverlay');
}

function resetPatientForm() {
  const form = document.getElementById('patientForm');
  if (form) form.reset();
  const pidEl = document.getElementById('patientId');
  if (pidEl) pidEl.value = '';
  clearFormErrors('errFirstName','errLastName','errDOB','errGender','errPhone','errEmail');
}

function clearFormErrors(...ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
}

function validatePatientForm() {
  let valid = true;
  const rules = [
    { field:'pFirstName', err:'errFirstName', msg:'First name is required.' },
    { field:'pLastName',  err:'errLastName',  msg:'Last name is required.'  },
    { field:'pDOB',       err:'errDOB',       msg:'Date of birth is required.' },
    { field:'pGender',    err:'errGender',    msg:'Please select a gender.' },
    { field:'pPhone',     err:'errPhone',     msg:'Phone number is required.' },
  ];

  clearFormErrors('errFirstName','errLastName','errDOB','errGender','errPhone','errEmail');

  rules.forEach(r => {
    const el = document.getElementById(r.field);
    if (!el) return;
    if (!el.value.trim()) {
      const errEl = document.getElementById(r.err);
      if (errEl) errEl.textContent = r.msg;
      el.classList.add('error');
      valid = false;
    } else {
      el.classList.remove('error');
    }
  });

  /* Email format validation */
  const emailEl = document.getElementById('pEmail');
  if (emailEl) {
    const email = emailEl.value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const errEl = document.getElementById('errEmail');
      if (errEl) errEl.textContent = 'Please enter a valid email address.';
      emailEl.classList.add('error');
      valid = false;
    }
  }

  return valid;
}

function savePatient() {
  if (!validatePatientForm()) return;

  const getValue = id => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const formData = {
    firstName: getValue('pFirstName'),
    lastName:  getValue('pLastName'),
    dob:       getValue('pDOB'),
    gender:    getValue('pGender'),
    status:    getValue('pStatus'),
    phone:     getValue('pPhone'),
    email:     getValue('pEmail'),
    address:   getValue('pAddress'),
    notes:     getValue('pNotes'),
  };

  if (state.editingPatientId) {
    /* UPDATE existing patient */
    const idx = state.patients.findIndex(p => p.id === state.editingPatientId);
    if (idx !== -1) {
      state.patients[idx] = { ...state.patients[idx], ...formData };
    }
    showToast('Patient updated successfully.', 'success');
  } else {
    /* CREATE new patient */
    const newPatient = {
      id: genPatientId(),
      ...formData,
      createdAt: todayStr(),
    };
    state.patients.push(newPatient);
    showToast('New patient added successfully.', 'success');
  }

  save(STORAGE_KEYS.PATIENTS, state.patients);
  closeModal('patientModalOverlay');
  renderPatients();
  renderDashboard();
  populatePatientDropdown();
}


function viewPatientDetail(id) {
  const p = getPatient(id);
  if (!p) return;
  state.viewingPatientId = id;

  const headerEl = document.getElementById('patientDetailHeader');
  if (headerEl) {
    headerEl.innerHTML = `
      <div class="patient-avatar patient-detail-avatar ${avatarColor(p.id)}">${getInitials(p.firstName, p.lastName)}</div>
      <div>
        <h4 style="font-size:20px;font-weight:700;margin:0">${fullName(p)}</h4>
        <p style="color:var(--secondary);font-size:13px;margin:2px 0 0">${p.id} • ${p.gender} • ${calcAge(p.dob)} yrs</p>
      </div>
    `;
  }

  const patientAppts = state.appointments
    .filter(a => a.patientId === p.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const bodyEl = document.getElementById('patientDetailBody');
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item">
          <label>Full Name</label>
          <p>${fullName(p)}</p>
        </div>
        <div class="detail-item">
          <label>Date of Birth</label>
          <p>${formatDate(p.dob)} (${calcAge(p.dob)} years old)</p>
        </div>
        <div class="detail-item">
          <label>Gender</label>
          <p>${p.gender}</p>
        </div>
        <div class="detail-item">
          <label>Status</label>
          <p>${statusBadge(p.status)}</p>
        </div>
        <div class="detail-item">
          <label>Phone</label>
          <p>${p.phone}</p>
        </div>
        <div class="detail-item">
          <label>Email</label>
          <p>${p.email || '—'}</p>
        </div>
        <div class="detail-item detail-full">
          <label>Address</label>
          <p>${p.address || '—'}</p>
        </div>
        ${p.notes ? `
        <div class="detail-item detail-full">
          <label>Medical Notes</label>
          <p>${p.notes}</p>
        </div>` : ''}
        <hr class="detail-divider" />
        <p class="detail-appts-title">Recent Appointments</p>
        <div class="mini-appt-list">
          ${patientAppts.length === 0
            ? '<p style="color:var(--secondary);font-size:13px">No appointments found.</p>'
            : patientAppts.map(a => `
              <div class="mini-appt-item">
                <div class="mini-appt-left">
                  <p>${a.type} — ${a.doctor}</p>
                  <span>${formatDate(a.date)} at ${formatTime(a.time)}</span>
                </div>
                ${statusBadge(a.status)}
              </div>`).join('')
          }
        </div>
      </div>
    `;
  }

  openModal('patientDetailOverlay');
}


function confirmDeletePatient(id) {
  const p = getPatient(id);
  if (!p) return;
  const msgEl = document.getElementById('confirmDeleteMsg');
  if (msgEl) {
    msgEl.textContent = `Are you sure you want to delete "${fullName(p)}"? All associated appointment data will also be removed. This action cannot be undone.`;
  }
  state.deleteCallback = () => {
    state.patients     = state.patients.filter(pt => pt.id !== id);
    state.appointments = state.appointments.filter(a => a.patientId !== id);
    save(STORAGE_KEYS.PATIENTS,     state.patients);
    save(STORAGE_KEYS.APPOINTMENTS, state.appointments);
    showToast(`Patient "${fullName(p)}" deleted.`, 'success');
    renderPatients();
    renderDashboard();
    populatePatientDropdown();
  };
  openModal('confirmDeleteOverlay');
}


function populatePatientDropdown() {
  const sel = document.getElementById('aPatient');
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="" disabled selected>Select patient...</option>';
  state.patients.forEach(p => {
    const opt       = document.createElement('option');
    opt.value       = p.id;
    opt.textContent = `${fullName(p)} (${p.id})`;
    sel.appendChild(opt);
  });
  if (current) sel.value = current;
}

function openBookAppt(patientId = '') {
  state.editingApptId = null;
  const titleEl = document.getElementById('apptModalTitle');
  if (titleEl) titleEl.textContent = 'Book Appointment';

  const form = document.getElementById('apptForm');
  if (form) form.reset();

  const apptIdEl = document.getElementById('apptId');
  if (apptIdEl) apptIdEl.value = '';

  clearFormErrors('errAPatient','errADoctor','errADate','errATime','errAType');
  populatePatientDropdown();

  if (patientId) {
    const patEl = document.getElementById('aPatient');
    if (patEl) patEl.value = patientId;
  }

  /* Default date = today */
  const dateEl = document.getElementById('aDate');
  if (dateEl) dateEl.value = todayStr();

  openModal('apptModalOverlay');
}

function openEditAppt(id) {
  const a = state.appointments.find(ap => ap.id === id);
  if (!a) return;
  state.editingApptId = id;

  const titleEl = document.getElementById('apptModalTitle');
  if (titleEl) titleEl.textContent = 'Edit Appointment';

  const fields = {
    apptId:   a.id,
    aPatient: a.patientId,
    aDoctor:  a.doctor,
    aDate:    a.date,
    aTime:    a.time,
    aType:    a.type,
    aStatus:  a.status,
    aNotes:   a.notes || '',
  };

  populatePatientDropdown();
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  clearFormErrors('errAPatient','errADoctor','errADate','errATime','errAType');
  openModal('apptModalOverlay');
}

function validateApptForm() {
  let valid = true;
  const rules = [
    { field:'aPatient', err:'errAPatient', msg:'Please select a patient.' },
    { field:'aDoctor',  err:'errADoctor',  msg:'Please select a doctor.'  },
    { field:'aDate',    err:'errADate',    msg:'Please select a date.'    },
    { field:'aTime',    err:'errATime',    msg:'Please select a time.'    },
    { field:'aType',    err:'errAType',    msg:'Please select an appointment type.' },
  ];
  clearFormErrors('errAPatient','errADoctor','errADate','errATime','errAType');
  rules.forEach(r => {
    const el = document.getElementById(r.field);
    if (!el) return;
    if (!el.value.trim()) {
      const errEl = document.getElementById(r.err);
      if (errEl) errEl.textContent = r.msg;
      el.classList.add('error');
      valid = false;
    } else {
      el.classList.remove('error');
    }
  });
  return valid;
}

function saveAppt() {
  if (!validateApptForm()) return;

  const getValue = id => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const formData = {
    patientId: getValue('aPatient'),
    doctor:    getValue('aDoctor'),
    date:      getValue('aDate'),
    time:      getValue('aTime'),
    type:      getValue('aType'),
    status:    getValue('aStatus'),
    notes:     getValue('aNotes'),
  };

  if (state.editingApptId) {
    /* UPDATE */
    const idx = state.appointments.findIndex(a => a.id === state.editingApptId);
    if (idx !== -1) state.appointments[idx] = { ...state.appointments[idx], ...formData };
    showToast('Appointment updated successfully.', 'success');
  } else {
    /* CREATE */
    const newAppt = { id: genApptId(), ...formData };
    state.appointments.push(newAppt);
    showToast('Appointment booked successfully.', 'success');
  }

  save(STORAGE_KEYS.APPOINTMENTS, state.appointments);
  closeModal('apptModalOverlay');
  renderAppointments();
  renderDashboard();
}


function confirmDeleteAppt(id) {
  const a = state.appointments.find(ap => ap.id === id);
  if (!a) return;
  const msgEl = document.getElementById('confirmDeleteMsg');
  if (msgEl) {
    msgEl.textContent = `Are you sure you want to delete appointment ${a.id}? This action cannot be undone.`;
  }
  state.deleteCallback = () => {
    state.appointments = state.appointments.filter(ap => ap.id !== id);
    save(STORAGE_KEYS.APPOINTMENTS, state.appointments);
    showToast(`Appointment ${a.id} deleted.`, 'success');
    renderAppointments();
    renderDashboard();
  };
  openModal('confirmDeleteOverlay');
}

function openModal(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) {
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) {
    el.classList.remove('open');
    document.body.style.overflow = '';
  }
}


function handleNotifications() {
  const todayAppts = state.appointments.filter(a => a.date === todayStr());
  const pending    = todayAppts.filter(a => a.status === 'Scheduled').length;
  const msg = pending > 0
    ? `You have ${pending} scheduled appointment${pending !== 1 ? 's' : ''} today.`
    : 'No scheduled appointments today.';
  showToast(msg, 'info');
}

/* Update notification badge count dynamically */
function updateNotifBadge() {
  const badge    = document.querySelector('.notif-badge');
  const todayPending = state.appointments.filter(a => a.date === todayStr() && a.status === 'Scheduled').length;
  if (badge) {
    badge.textContent = todayPending;
    badge.style.display = todayPending > 0 ? 'flex' : 'none';
  }
}


function handleCheckIn() {
  const todayAppts   = state.appointments.filter(a => a.date === todayStr() && a.status === 'Scheduled');
  if (todayAppts.length === 0) {
    showToast('No scheduled appointments today to check in.', 'info');
    return;
  }
  /* Check in the first scheduled appointment */
  const appt   = todayAppts[0];
  appt.status  = 'Completed';
  save(STORAGE_KEYS.APPOINTMENTS, state.appointments);
  const patient = getPatient(appt.patientId);
  showToast(`${patient ? fullName(patient) : appt.patientId} checked in successfully.`, 'success');
  renderDashboard();
  renderAppointments();
  updateNotifBadge();
}


function handleGlobalSearch(query) {
  query = query.toLowerCase().trim();
  if (!query) return;

  const matchedPatient = state.patients.find(p =>
    fullName(p).toLowerCase().includes(query) ||
    (p.id || '').toLowerCase().includes(query) ||
    (p.phone || '').includes(query)
  );

  if (matchedPatient) {
    navigateTo('patients');
    setTimeout(() => {
      const el = document.getElementById('patientSearch');
      if (el) { el.value = query; renderPatients(); }
    }, 50);
    return;
  }

  const matchedAppt = state.appointments.find(a =>
    (a.id || '').toLowerCase().includes(query)
  );

  if (matchedAppt) {
    navigateTo('appointments');
    setTimeout(() => {
      const el = document.getElementById('apptSearch');
      if (el) { el.value = query; renderAppointments(); }
    }, 50);
    return;
  }

  showToast(`No results found for "${query}".`, 'info');
}


function clearAppointmentFilters() {
  const searchEl = document.getElementById('apptSearch');
  const dateEl   = document.getElementById('apptDateFilter');
  const statusEl = document.getElementById('apptStatusFilter');

  if (searchEl) searchEl.value = '';
  if (dateEl)   dateEl.value   = '';
  if (statusEl) statusEl.value = '';

  state.currentPage.appointments = 1;
  renderAppointments();
  showToast('Filters cleared.', 'info');
}

function initEventListeners() {

  /* ---- Sidebar Navigation ---- */
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  /* ---- Dashboard quick-links ---- */
  document.getElementById('viewAllAppts')?.addEventListener('click', e => {
    e.preventDefault(); navigateTo('appointments');
  });
  document.getElementById('viewAllPatients')?.addEventListener('click', e => {
    e.preventDefault(); navigateTo('patients');
  });

  /* ---- Mobile sidebar toggle ---- */
  document.getElementById('mobileMenuBtn')?.addEventListener('click', openMobileSidebar);
  document.getElementById('sidebarOverlay')?.addEventListener('click', closeMobileSidebar);

  /* ---- New Appointment buttons (sidebar CTA + appointments page) ---- */
  document.getElementById('openBookApptModal')?.addEventListener('click', () => openBookAppt());
  document.getElementById('openBookApptModal2')?.addEventListener('click', () => openBookAppt());

  /* ---- Add Patient button ---- */
  document.getElementById('openAddPatientModal')?.addEventListener('click', openAddPatient);

  /* ---- Patient Modal ---- */
  document.getElementById('closePatientModal')?.addEventListener('click',  () => closeModal('patientModalOverlay'));
  document.getElementById('cancelPatientModal')?.addEventListener('click', () => closeModal('patientModalOverlay'));
  document.getElementById('savePatientBtn')?.addEventListener('click', savePatient);

  /* ---- Appointment Modal ---- */
  document.getElementById('closeApptModal')?.addEventListener('click',  () => closeModal('apptModalOverlay'));
  document.getElementById('cancelApptModal')?.addEventListener('click', () => closeModal('apptModalOverlay'));
  document.getElementById('saveApptBtn')?.addEventListener('click', saveAppt);

  /* ---- Patient Detail Modal ---- */
  document.getElementById('closePatientDetail')?.addEventListener('click',       () => closeModal('patientDetailOverlay'));
  document.getElementById('closePatientDetailFooter')?.addEventListener('click', () => closeModal('patientDetailOverlay'));
  document.getElementById('editFromDetail')?.addEventListener('click', () => {
    closeModal('patientDetailOverlay');
    if (state.viewingPatientId) openEditPatient(state.viewingPatientId);
  });

  /* ---- Confirm Delete Modal ---- */
  document.getElementById('closeConfirmDelete')?.addEventListener('click', () => closeModal('confirmDeleteOverlay'));
  document.getElementById('cancelDelete')?.addEventListener('click',       () => closeModal('confirmDeleteOverlay'));
  document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => {
    if (typeof state.deleteCallback === 'function') {
      state.deleteCallback();
      state.deleteCallback = null;
    }
    closeModal('confirmDeleteOverlay');
  });

  /* ---- Patients Search & Filter ---- */
  document.getElementById('patientSearch')?.addEventListener('input', () => {
    state.currentPage.patients = 1;
    renderPatients();
  });
  document.getElementById('patientStatusFilter')?.addEventListener('change', () => {
    state.currentPage.patients = 1;
    renderPatients();
  });
  document.getElementById('patientSort')?.addEventListener('change', () => {
    state.currentPage.patients = 1;
    renderPatients();
  });

  /* ---- Appointments Search & Filter ---- */
  document.getElementById('apptSearch')?.addEventListener('input', () => {
    state.currentPage.appointments = 1;
    renderAppointments();
  });
  document.getElementById('apptDateFilter')?.addEventListener('change', () => {
    state.currentPage.appointments = 1;
    renderAppointments();
  });
  document.getElementById('apptStatusFilter')?.addEventListener('change', () => {
    state.currentPage.appointments = 1;
    renderAppointments();
  });

  /* ---- Clear Appointment Filters button (the "x" button) ---- */
  document.getElementById('clearApptFilters')?.addEventListener('click', clearAppointmentFilters);

  /* ---- Topbar: Global Search ---- */
  let searchTimeout;
  document.getElementById('globalSearch')?.addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => handleGlobalSearch(e.target.value), 400);
  });
  document.getElementById('globalSearch')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      clearTimeout(searchTimeout);
      handleGlobalSearch(e.target.value);
    }
  });

  /* ---- Topbar: Notifications button ---- */
  document.getElementById('notifBtn')?.addEventListener('click', handleNotifications);

  /* ---- Topbar: Check-in button ---- */
  document.querySelector('.btn-checkin')?.addEventListener('click', handleCheckIn);

  /* ---- Close modals on overlay click ---- */
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  /* ---- ESC key closes any open modal ---- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['patientModalOverlay','apptModalOverlay','patientDetailOverlay','confirmDeleteOverlay'].forEach(id => {
        closeModal(id);
      });
    }
  });
}

function init() {
  initData();
  initEventListeners();
  populatePatientDropdown();
  updateNotifBadge();
  navigateTo('dashboard');
}

/* ---- Expose functions needed by inline onclick handlers ---- */
window.viewPatientDetail    = viewPatientDetail;
window.openEditPatient      = openEditPatient;
window.confirmDeletePatient = confirmDeletePatient;
window.viewApptDetail       = viewApptDetail;
window.openEditAppt         = openEditAppt;
window.changeApptStatus     = changeApptStatus;
window.confirmDeleteAppt    = confirmDeleteAppt;
window.changePage           = changePage;

document.addEventListener('DOMContentLoaded', init);
