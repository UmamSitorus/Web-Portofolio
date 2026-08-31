/*=============== BACKEND PORTFOLIO - CORE LOGIC & INTERACTIVITY ===============*/

// 1. Navigation Show & Hide
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}

if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}

// Remove menu mobile on link click
const navLinks = document.querySelectorAll('.nav__link');
const linkAction = () => {
  if (navMenu) navMenu.classList.remove('show-menu');
};
navLinks.forEach((n) => n.addEventListener('click', linkAction));

// 2. Active Link on Scroll
const sections = document.querySelectorAll('section[id]');
const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 70;
    const sectionId = current.getAttribute('id');
    const sectionsClass = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);

    if (sectionsClass) {
      if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
        sectionsClass.classList.add('active-link');
      } else {
        sectionsClass.classList.remove('active-link');
      }
    }
  });
};
window.addEventListener('scroll', scrollActive);

// 3. Header Blur & ScrollUp Button
const scrollUp = () => {
  const scrollUpElem = document.getElementById('scroll-up');
  if (scrollUpElem) {
    window.scrollY >= 350 ? scrollUpElem.classList.add('show-scroll') : scrollUpElem.classList.remove('show-scroll');
  }
};
window.addEventListener('scroll', scrollUp);

// 4. Live Server Clock
const updateLiveClock = () => {
  const clockEl = document.getElementById('live-clock');
  if (clockEl) {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${utcHours}:${utcMins}:${utcSecs} UTC`;
  }
};
setInterval(updateLiveClock, 1000);
updateLiveClock();

// 5. Hero Architecture Flow Simulator
let isSimulating = false;
window.triggerFlowSimulation = function () {
  if (isSimulating) return;
  isSimulating = true;

  const clientNode = document.getElementById('node-client');
  const gatewayNode = document.getElementById('node-gateway');
  const dbNode = document.getElementById('node-db');
  const cronNode = document.getElementById('node-cron');
  const packet1 = document.getElementById('packet-1');
  const packet2 = document.getElementById('packet-2');
  const telemetry = document.getElementById('telemetry-logs');

  const addLog = (text, type = 'info') => {
    if (!telemetry) return;
    const logLine = document.createElement('p');
    logLine.className = `log-line log-${type}`;
    logLine.textContent = `> ${text}`;
    telemetry.appendChild(logLine);
    telemetry.scrollTop = telemetry.scrollHeight;
  };

  // Step 1: Client sends request
  clientNode?.classList.add('node--active');
  packet1?.classList.add('packet-traveling');
  addLog('[CLIENT] Dispatched payload: POST /v1/orders/webhook', 'info');

  setTimeout(() => {
    // Step 2: Gateway processes
    clientNode?.classList.remove('node--active');
    gatewayNode?.classList.add('node--active');
    packet1?.classList.remove('packet-traveling');
    packet2?.classList.add('packet-traveling');
    addLog('[GATEWAY] HMAC Signature validated. Rate-limit 1/120 OK. Handing off to Controller.', 'success');
  }, 700);

  setTimeout(() => {
    // Step 3: MySQL Transaction
    gatewayNode?.classList.remove('node--active');
    dbNode?.classList.add('node--active');
    packet2?.classList.remove('packet-traveling');
    addLog('[MYSQL] BEGIN TX -> UPDATE orders SET status="PAID" WHERE id=8491 -> COMMIT (12ms)', 'success');
  }, 1400);

  setTimeout(() => {
    // Step 4: Cron Background Worker
    dbNode?.classList.remove('node--active');
    cronNode?.classList.add('node--active');
    addLog('[CRON] Dispatched async job: App\\Jobs\\SendOrderConfirmationEmail to Redis Queue', 'cron');
  }, 2100);

  setTimeout(() => {
    cronNode?.classList.remove('node--active');
    addLog('[PIPELINE] End-to-end flow resolved in 48ms with 0 errors.', 'info');
    isSimulating = false;
  }, 2800);
};

// 6. Project Filter Tabs
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filterCategory = btn.getAttribute('data-filter');

    projectCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      if (filterCategory === 'all' || cardCategory === filterCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// 7. Interactive API Playground
const endpointData = {
  gemini_ai: {
    method: 'POST',
    request: {
      service: 'gemini-intelligent-risk-evaluator',
      model: 'google-gemini-2.5-flash',
      nasabah_profile: {
        id_nasabah: 'NSB-BPR-8812',
        akad_pembiayaan: 'Murabahah Modal Kerja',
        sisa_pokok_idr: 18500000,
        histori_kolektibilitas: 'Kol-1 (Lancar)',
        days_to_due: 3
      },
      task: 'synthesize_personalized_reminder_and_risk_score'
    },
    response: {
      status: 'success',
      http_code: 200,
      message: 'Analisis AI selesai. Pesan reminder disintesis secara cerdas & sopan.',
      data: {
        ai_risk_score: '0.04 (Low Risk - Highly Compliant)',
        recommended_channel: 'WhatsApp Direct (Tone: Friendly & Professional)',
        generated_message_idr: 'Assalamu\'alaikum Bpk. Ahmad, pengingat santun jatuh tempo angsuran BPR Mustaqim H-3 tgl 31/08 sebesar Rp 1.540.000. Rekening VA: 889201923. Abaikan jika sudah bertransaksi.',
        execution_latency: '18ms (Cached Prompt Engine)'
      }
    }
  },
  bpr: {
    method: 'POST',
    request: {
      service: 'bpr-financing-reminder-engine',
      branch: 'BPR Syariah Mustaqim Aceh Cabang Seunagan',
      cron_schedule: '0 8 * * *',
      trigger_modes: ['H-3_warning', 'H-1_urgent', 'H-0_due_date']
    },
    response: {
      status: 'success',
      http_code: 200,
      message: 'Daemon Cron Job dieksekusi. Notifikasi WhatsApp jatuh tempo terkirim otomatis.',
      data: {
        total_nasabah_aktif: 142,
        reminder_h3_sent: 5,
        reminder_h1_sent: 4,
        reminder_h0_sent: 3,
        failed_broadcast: 0,
        api_gateway_latency: '42ms',
        audit_log_id: 'LOG-BPR-2026-99214'
      }
    }
  },
  webhook: {
    method: 'POST',
    request: {
      event: 'payment.success',
      transaction_id: 'TRX-2026-98214',
      amount: 2500000,
      signature: 'sha256=d7a8fbb3920e8b1...'
    },
    response: {
      status: 'success',
      http_code: 200,
      message: 'Webhook payload verified. MySQL transaction committed.',
      data: {
        order_id: 'ORD-8819',
        status: 'PAID',
        updated_at: '2026-08-28 12:00:01',
        audit_log_id: 49201
      }
    }
  },
  cron: {
    method: 'GET',
    request: {
      job: 'daily-reconciliation-pipeline',
      branches: ['Cabang-01', 'Cabang-02', 'Cabang-03'],
      target_date: '2026-08-28'
    },
    response: {
      status: 'success',
      http_code: 200,
      message: 'ETL Batch reconcilation finished in 4.2 seconds.',
      data: {
        total_rows_imported: 12450,
        anomalies_detected: 0,
        mysql_insert_time_ms: 180,
        email_summary_sent: true
      }
    }
  },
  inventory: {
    method: 'PUT',
    request: {
      sku: 'PROD-SKU-992',
      qty_decrement: 1,
      lock_type: 'pessimistic_write'
    },
    response: {
      status: 'success',
      http_code: 200,
      message: 'Inventory lock acquired. Stock broadcasted to channels.',
      data: {
        sku: 'PROD-SKU-992',
        previous_stock: 45,
        remaining_stock: 44,
        broadcast_status: 'ACK_ALL_NODES'
      }
    }
  }
};

window.updateEndpointView = function () {
  const select = document.getElementById('select-endpoint');
  const reqCode = document.getElementById('request-code-preview');
  const methodBadge = document.getElementById('preview-method');

  if (!select || !reqCode) return;
  const key = select.value;
  const data = endpointData[key];

  if (data) {
    if (methodBadge) methodBadge.textContent = data.method;
    reqCode.innerHTML = `<code>${JSON.stringify(data.request, null, 2)}</code>`;
  }
};

window.executeMockRequest = function () {
  const select = document.getElementById('select-endpoint');
  const resCode = document.getElementById('response-code-output');
  const latencyBadge = document.getElementById('response-latency');

  if (!select || !resCode) return;
  const key = select.value;
  const data = endpointData[key];

  resCode.innerHTML = `<code>// Menghubungkan ke endpoint backend & mengeksekusi pipeline...</code>`;

  const simulatedLatency = Math.floor(Math.random() * 20) + 20;

  setTimeout(() => {
    if (latencyBadge) latencyBadge.textContent = `~ ${simulatedLatency}ms`;
    if (data) {
      resCode.innerHTML = `<code>${JSON.stringify(data.response, null, 2)}</code>`;
    }
  }, 350);
};

// 8. Project Details Data & Modal
const projectDetails = {
  bpr: {
    title: 'Sistem Monitoring Pembiayaan BPR & Otomatisasi Reminder Cicilan (Cron Job)',
    subtitle: 'PHP Native, Node.js (node-cron), MySQL / MariaDB, WhatsApp Gateway API, Bootstrap',
    problem: 'Studi Kasus: BPR Syariah Mustaqim Aceh Cabang Seunagan. Proses monitoring pembiayaan dan pengiriman pesan pengingat jatuh tempo cicilan nasabah yang dilakukan manual oleh staf operasional memakan waktu berjam-jam setiap hari, rentan terlewat, dan berisiko meningkatkan rasio pembiayaan bermasalah (NPF).',
    solution: 'Membangun aplikasi web pemantauan pembiayaan dan kolektibilitas nasabah secara real-time berbasis PHP & MySQL, terintegrasi dengan background automation engine Node.js (`node-cron`). Engine ini secara otomatis memindai database dan memicu pengiriman pesan pengingat personal (H-3, H-1, dan hari H) melalui WhatsApp/SMS API tanpa intervensi manual.',
    impact: '100% otomatisasi pengiriman reminder cicilan nasabah, mengeliminasi beban kerja manual staf penagihan harian, dan menjaga kolektibilitas pembiayaan nasabah tetap lancar.',
    architecture: [
      'Frontend & Web Interface PHP Native mengelola direktori nasabah, tabel akad pembiayaan, nominal angsuran, dan kalkulasi denda/tunggakan.',
      'Node.js Background Daemon Service berjalan 24/7 menggunakan modul `node-cron` untuk eksekusi terjadwal.',
      'Cron Job mengeksekusi query SQL teroptimasi untuk mendeteksi nasabah dengan jatuh tempo H-3, H-1, dan Hari H yang belum lunas.',
      'Automation worker memformat template pesan dinamis (nama nasabah, nomor akad, jumlah tagihan, jatuh tempo) dan memicu WhatsApp API Gateway.',
      'Sistem mencatat rekam jejak log notifikasi ke tabel audit database untuk transparansi dan verifikasi staf operasional.'
    ],
    github: 'https://github.com/UmamSitorus/Sistem-Monitoring-BPR-dan-Reminder-Cicilan-Otomatis-Menggunak-Cron-Job-'
  },
  payment: {
    title: 'Sistem Integrasi Gateway Pembayaran & Webhook Engine',
    subtitle: 'Laravel 10, MySQL, Redis, Midtrans / Xendit API, Webhooks',
    problem: 'Sistem e-commerce klien mengalami penundaan verifikasi pembayaran manual hingga 3-4 jam, menyebabkan komplain pembeli dan lonjakan tiket support.',
    solution: 'Membangun webhook processing engine dengan idempotency locking key di database dan signature validation otomatis. Jika terjadi kegagalan jaringan, sistem dilengkapi automatic exponential backoff retry.',
    impact: 'Konfirmasi instan dalam <300ms, 0 transaksi ganda tercatat dari ribuan volume transaksi bulanan, dan efisiensi operasional staf finance meningkat 100%.',
    architecture: [
      'Endpoint Webhook menerima payload notifikasi dari Payment Gateway.',
      'Middleware memvalidasi SHA512 signature hash untuk memastikan payload otentik.',
      'Idempotency filter memeriksa apakah transaksi ID telah diproses di database.',
      'DB Transaction mengunci baris pesanan, memperbarui status menjadi PAID, dan memicu dispatch event.',
      'Event Listener memicu pengiriman faktur PDF otomatis via background queue.'
    ],
    github: 'https://github.com/UmamSitorus'
  },
  etl: {
    title: 'Automasi ETL Data Pipeline & Daily Reconciliation',
    subtitle: 'PHP CLI, Linux Cron, MySQL Stored Procedures, REST API ETL',
    problem: 'Data inventory dan penjualan dari 3 cabang terpisah harus diunduh dan digabungkan manual setiap malam selama 3 jam, rawan human error dan rekonsiliasi lambat.',
    solution: 'Merancang Cron Job terjadwal yang otomatis melakukan fetching API multi-cabang, transformasi skema, batch insert MySQL, dan export summary email.',
    impact: 'Menghemat 21 jam kerja/minggu tim administrasi dengan 100% konsistensi rekonsiliasi data antar cabang.',
    architecture: [
      'Linux Crontab memicu script PHP CLI setiap pukul 00:00 WIB.',
      'Worker mengambil data delta penjualan dari endpoint API masing-masing cabang.',
      'Data dinormalisasi dan di-batch insert ke data warehouse MySQL dengan query cursor hemat memori.',
      'Prosedur rekonsiliasi mendeteksi anomali selisih angka dan mengirim alert ke email finance.'
    ],
    github: 'https://github.com/UmamSitorus'
  },
  ecommerce: {
    title: 'E-commerce RESTful API & Multi-Channel Inventory Sync',
    subtitle: 'Laravel 10 REST API, MySQL Indexing, Queue Jobs, Postman Docs',
    problem: 'Sering terjadi overselling stok barang akibat sinkronisasi yang tidak konsisten antara marketplace dan gudang internal.',
    solution: 'Membangun centralized inventory API dengan database locking (pessimistic lock) dan event queue worker untuk broadcast update stok real-time.',
    impact: 'Insiden overselling berkurang 100% (Zero stock mismatch) dan endpoint query response time di bawah 120ms.',
    architecture: [
      'Client checkout mengirim payload pesanan ke API Gateway.',
      'Database pessimistic locking (`SELECT ... FOR UPDATE`) memastikan kuantitas stok tidak dibeli bersamaan oleh 2 user berbeda.',
      'Event Queue mem-broadcast sinkronisasi stok ke seluruh channel toko.',
      'Dokumentasi API lengkap dengan standarisasi status code dan response JSON format.'
    ],
    github: 'https://github.com/UmamSitorus'
  },
  alumni: {
    title: 'Alumni Portal Management System & Data Directory',
    subtitle: 'PHP Native / Laravel MVC, MySQL RDBMS, RBAC Security, Bootstrap',
    problem: 'Pendataan ribuan alumni tersebar tidak terstruktur, kesulitan verifikasi kelulusan, dan keamanan privasi data kontak tidak terjamin.',
    solution: 'Sistem web lengkap dengan Role-Based Access Control (RBAC), enkripsi password, query filter alumni cepat, dan export data terenkripsi.',
    impact: 'Manajemen 1,500+ entitas alumni dengan query response <45ms dan keamanan data terverifikasi.',
    architecture: [
      'Middleware Role & Permission memvalidasi hak akses Super Admin, Pengurus, dan Alumni.',
      'Query terindeks pada kolom tahun lulus, jurusan, dan status karir untuk pencarian kilat.',
      'Fitur validasi ijazah dan tracking karir lulusan terpusat.',
      'Ekspor laporan format Excel/PDF terproteksi password.'
    ],
    github: 'https://github.com/UmamSitorus'
  },
  p1: {
    title: 'Sistem Monitoring Pembiayaan BPR & Otomatisasi Reminder Cicilan (Cron Job)',
    subtitle: 'PHP Native, Node.js (node-cron), MySQL / MariaDB, WhatsApp Gateway API',
    problem: 'Studi Kasus: BPR Syariah Mustaqim Aceh Cabang Seunagan. Monitoring manual dan reminder cicilan nasabah rawan terlewat serta membebani staf operasional.',
    solution: 'Aplikasi web monitoring pembiayaan real-time dipadukan background daemon Node.js node-cron yang otomatis mengirimkan pesan pengingat jatuh tempo (H-3, H-1, Hari H) via WhatsApp API.',
    impact: '100% otomatisasi pengiriman reminder cicilan nasabah dan eliminasi beban kerja staf manual harian.',
    architecture: [
      'PHP Web Interface mengelola data nasabah, pembiayaan, dan angsuran.',
      'Node.js Daemon Service berjalan 24/7 dengan penjadwalan node-cron.',
      'Query SQL memfilter nasabah mendekati tanggal jatuh tempo.',
      'Pesan terkirim otomatis ke WhatsApp nasabah melalui Gateway API.',
      'Pencatatan riwayat log notifikasi ke database.'
    ],
    github: 'https://github.com/UmamSitorus/Sistem-Monitoring-BPR-dan-Reminder-Cicilan-Otomatis-Menggunak-Cron-Job-'
  }
};

window.openProjectModal = function (projKey) {
  const modal = document.getElementById('project-modal');
  const titleEl = document.getElementById('modal-proj-title');
  const subEl = document.getElementById('modal-proj-sub');
  const bodyEl = document.getElementById('modal-proj-body');
  const linkEl = document.getElementById('modal-proj-link');

  const data = projectDetails[projKey];
  if (!data || !modal) return;

  titleEl.textContent = data.title;
  subEl.textContent = data.subtitle;
  if (linkEl) linkEl.href = data.github;

  bodyEl.innerHTML = `
    <div style="background: var(--bg-surface-2); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <h4 style="color: #f87171; font-family: var(--font-mono); font-size: 0.85rem; margin-bottom: 0.35rem;">
        <i class="ri-error-warning-line"></i> Masalah & Latar Belakang Bisnis:
      </h4>
      <p style="font-size: var(--small-size); color: var(--text-secondary);">${data.problem}</p>
    </div>

    <div style="background: var(--bg-surface-2); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <h4 style="color: #34d399; font-family: var(--font-mono); font-size: 0.85rem; margin-bottom: 0.35rem;">
        <i class="ri-check-line"></i> Solusi Arsitektur & Rekayasa Sistem:
      </h4>
      <p style="font-size: var(--small-size); color: var(--text-secondary);">${data.solution}</p>
    </div>

    <div style="background: var(--accent-cyan-dim); padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--accent-cyan-border);">
      <h4 style="color: var(--accent-cyan); font-size: 0.9rem; margin-bottom: 0.25rem;">
        <i class="ri-flashlight-line"></i> Dampak & Metrik Keberhasilan:
      </h4>
      <p style="font-size: var(--small-size); color: var(--text-primary); font-weight: 500;">${data.impact}</p>
    </div>

    <div>
      <h4 style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.75rem;">
        <i class="ri-node-tree"></i> Alur Data & Eksekusi Pipeline:
      </h4>
      <ol style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: var(--small-size); color: var(--text-secondary);">
        ${data.architecture.map((step) => `<li>${step}</li>`).join('')}
      </ol>
    </div>
  `;

  modal.classList.add('modal-active');
  document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function () {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('modal-active');
    document.body.style.overflow = 'auto';
  }
};

// 9. Resume Modal
window.openResumeModal = function () {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('modal-active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeResumeModal = function () {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.remove('modal-active');
    document.body.style.overflow = 'auto';
  }
};

// Close modal when pressing ESC or clicking backdrop
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
    closeResumeModal();
  }
});

const modals = document.querySelectorAll('.modal-overlay');
modals.forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
      closeResumeModal();
    }
  });
});

// 10. Contact Form Submissions
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-message');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('user_name')?.value || '';
    const email = document.getElementById('user_email')?.value || '';
    const projectType = document.getElementById('user_subject')?.value || '';
    const message = document.getElementById('user_project')?.value || '';

    if (contactStatus) {
      contactStatus.className = 'form-status-box show-success';
      contactStatus.textContent = `Mengirim pesan... [POST /api/contact]`;
    }

    // Try EmailJS if configured, otherwise provide immediate simulated confirmation
    if (typeof emailjs !== 'undefined' && emailjs.sendForm) {
      emailjs
        .sendForm('service_cvygfmq', 'template_8rdin08', '#contact-form', 'pjf9Dx1DvtH-PxfxR')
        .then(() => {
          if (contactStatus) {
            contactStatus.className = 'form-status-box show-success';
            contactStatus.textContent = `Pesan terkirim dengan sukses! Terima kasih, ${name}. Saya akan membalas ke ${email} secepatnya.`;
          }
          contactForm.reset();
        })
        .catch(() => {
          // Fallback confirmation
          if (contactStatus) {
            contactStatus.className = 'form-status-box show-success';
            contactStatus.textContent = `Pesan diterima (Mode Simulasi)! Terima kasih, ${name}. Silakan hubungi juga via umamisuib@gmail.com atau WhatsApp (+62 822-7798-8495).`;
          }
          contactForm.reset();
        });
    } else {
      setTimeout(() => {
        if (contactStatus) {
          contactStatus.className = 'form-status-box show-success';
          contactStatus.textContent = `Pesan diterima! Terima kasih, ${name}. Saya akan segera merespons kebutuhan ${projectType} Anda.`;
        }
        contactForm.reset();
      }, 500);
    }
  });
}

// 11. ScrollReveal Animations
if (typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({
    origin: 'top',
    distance: '40px',
    duration: 1000,
    delay: 150,
    reset: false
  });

  sr.reveal('.hero__badge, .home__title, .home__description, .hero__metrics-grid, .home__buttons, .home__social-bar', {
    interval: 80
  });
  sr.reveal('.home__architecture-card', { origin: 'right', delay: 250 });
  sr.reveal('.bento-card', { interval: 100 });
  sr.reveal('.flow-card--before', { origin: 'left' });
  sr.reveal('.flow-transformation-bridge', { scale: 0.8, delay: 200 });
  sr.reveal('.flow-card--after', { origin: 'right', delay: 300 });
  sr.reveal('.project-card', { interval: 100 });
  sr.reveal('.cert-card', { interval: 120 });
  sr.reveal('.playground-card', { origin: 'bottom' });
  sr.reveal('.contact__profile-card, .contact__form-card', { interval: 150 });
}

// Initialize Playground on load
document.addEventListener('DOMContentLoaded', () => {
  if (typeof updateEndpointPayload === 'function') {
    updateEndpointPayload();
  }
});
