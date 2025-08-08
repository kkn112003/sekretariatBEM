// ==========================
// === Toggle Menu Mobile ===
// ==========================
function toggleMenu() {
  const nav = document.getElementById("navMenu");
  if (nav) nav.classList.toggle("show");
}

// =============================
// === Highlight Menu Aktif ===
// =============================
const currentLocation = window.location.href;
document.querySelectorAll("nav a").forEach((link) => {
  if (link.href === currentLocation) link.classList.add("active");
});

// =============================
// ======= GLOBAL POPUP ========
// =============================
function showPopup() {
  const popupNotif = document.getElementById("popupNotif");
  if (popupNotif) popupNotif.style.display = "flex";
}

function setupPopupButtons() {
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");

  if (btnYes) {
    btnYes.addEventListener("click", () => {
      window.location.href = "rekap.html";
    });
  }

  if (btnNo) {
    btnNo.addEventListener("click", () => {
      const popupNotif = document.getElementById("popupNotif");
      if (popupNotif) popupNotif.style.display = "none";
    });
  }
}

// ========================
// ===== ABSENSI LOGIC ====
// ========================
const formAbsensi = document.getElementById("formAbsensi");
const absensiBody = document.querySelector("#rekapAbsensi tbody");
let absensiData = JSON.parse(localStorage.getItem("absensi")) || [];

function renderAbsensi() {
  if (!absensiBody) return;
  absensiBody.innerHTML = "";
  absensiData.forEach((item, index) => {
    absensiBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.nama}</td>
        <td>${item.nim}</td>
        <td>${item.keterangan}</td>
        <td>${item.kegiatan}</td>
        <td><button onclick="hapusAbsensi(${index})">Hapus</button></td>
      </tr>`;
  });
}

function hapusAbsensi(index) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    absensiData.splice(index, 1);
    localStorage.setItem("absensi", JSON.stringify(absensiData));
    renderAbsensi();
  }
}

if (formAbsensi) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nama = document.getElementById("nama").value;
    const jabatan = document.getElementById("jabatan").value;
    const keterangan = document.getElementById("keterangan").value;
    const kegiatan = document.getElementById("kegiatan").value;

    const data = {
      nama,
      jabatan,
      keterangan,
      kegiatan,
      tanggal: new Date().toLocaleDateString("id-ID"),
    };

    dataAbsensi.push(data);
    localStorage.setItem("absensi", JSON.stringify(dataAbsensi));

    // Hapus class active dari navbar
    document.querySelector("a.active")?.classList.remove("active");

    // Tampilkan popup
    document.getElementById("popupDialog").style.display = "flex";
  });

  renderAbsensi();
}

// =========================
// ====== SURAT LOGIC ======
// =========================
const formSurat = document.getElementById("formSurat");
const tabelSurat = document.getElementById("tabelSurat");
let dataSurat = JSON.parse(localStorage.getItem("dataSurat")) || [];

function simpanSuratKeLocal() {
  localStorage.setItem("dataSurat", JSON.stringify(dataSurat));
}

function renderTabelSurat() {
  if (!tabelSurat) return;
  const tbody = tabelSurat.querySelector("tbody");
  tbody.innerHTML = "";

  dataSurat.forEach((data, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${data.nomor}</td>
      <td>${data.tanggal}</td>
      <td>${data.jenis}</td>
      <td>${data.perihal}</td>
      <td><button class="btn-hapus" data-index="${index}">Hapus</button></td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".btn-hapus").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      dataSurat.splice(index, 1);
      simpanSuratKeLocal();
      renderTabelSurat();
    });
  });
}

if (formSurat) {
  formSurat.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = {
      nomor: formSurat.nomor.value,
      tanggal: formSurat.tanggal.value,
      jenis: formSurat.jenis.value,
      perihal: formSurat.perihal.value,
    };
    dataSurat.push(data);
    simpanSuratKeLocal();
    renderTabelSurat();
    formSurat.reset();
    showPopup(); // Tampilkan notifikasi besar
  });
  renderTabelSurat();
}

// ===============================
// ====== REKAP SURAT/ABSEN ======
// ===============================
function renderRekapSurat() {
  const tabelRekap =
    document.getElementById("tabelRekapSurat") ||
    document.getElementById("rekapSurat");
  if (!tabelRekap) return;
  const tbody = tabelRekap.querySelector("tbody");
  const surat = JSON.parse(localStorage.getItem("dataSurat")) || [];
  tbody.innerHTML = "";
  surat.forEach((item, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.nomor}</td>
        <td>${item.tanggal}</td>
        <td>${item.jenis}</td>
        <td>${item.perihal}</td>
      </tr>`;
  });
}

function renderRekapAbsensi() {
  const tabelRekap =
    document.getElementById("tabelRekapAbsen") ||
    document.getElementById("rekapAbsensi");
  if (!tabelRekap) return;
  const tbody = tabelRekap.querySelector("tbody");
  const absen = JSON.parse(localStorage.getItem("absensi")) || [];
  tbody.innerHTML = "";
  absen.forEach((item, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.nama}</td>
        <td>${item.nim}</td>
        <td>${item.keterangan}</td>
        <td>${item.kegiatan}</td>
      </tr>`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderRekapSurat();
  renderRekapAbsensi();
  setupPopupButtons(); // Setup tombol popup setelah DOM dimuat
});

// ===============================
// ======= EXPORT EXCEL =========
// ===============================

function exportTableToExcel(tableID, filename = "") {
  const table = document.getElementById(tableID);
  if (!table) {
    alert("Tabel tidak ditemukan!");
    return;
  }

  // Bikin salinan tabel biar fungsi export bisa pakai data yang muncul di DOM
  const clone = table.cloneNode(true);

  // Hapus kolom "Aksi" (kolom tombol Hapus) sebelum export
  const rows = clone.querySelectorAll("tr");
  rows.forEach((row) => {
    row.deleteCell(row.cells.length - 1); // hapus kolom terakhir
  });

  const wb = XLSX.utils.table_to_book(clone, { sheet: "Sheet1" });
  XLSX.writeFile(wb, filename + ".xlsx");
}

// MODE
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("modeToggle");

  if (!toggleBtn) {
    console.error("Element dengan ID 'modeToggle' tidak ditemukan.");
    return;
  }

  // Cek preferensi sebelumnya
  const isDark = localStorage.getItem("theme") === "dark";
  if (isDark) {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isNowDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isNowDark ? "dark" : "light");
    toggleBtn.textContent = isNowDark ? "☀️" : "🌙";
  });
});

const toggleBtn = document.getElementById("darkModeToggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Ganti ikon
  toggleBtn.textContent = document.body.classList.contains("dark-mode")
    ? "☀️"
    : "🌙";

  // Simpan preferensi di localStorage (opsional)
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
});

// Cek preferensi sebelumnya (opsional)
window.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
  }
});

const checkbox = document.getElementById("toggleMode");

// Toggle dark mode
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
});

// Cek preferensi sebelumnya
window.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark-mode", isDark);
  checkbox.checked = isDark;
});

// darkmode.js
window.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark-mode", isDark);
});

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
