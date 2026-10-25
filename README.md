# 🚀 TalentHub — The Modern Reversed Recruitment & Talent Platform

<div align="center">

[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

**Platform rekrutmen terbalik (*reversed recruitment*) berbasis kurasi talenta terverifikasi, analisis ATS cerdas, dan integrasi ekosistem pelatihan karir nasional.**

[Demo Langsung](#-quick-start) • [Tentang Proyek](#-tentang-talenthub) • [Fitur Utama](#-fitur-utama) • [Teknologi](#-teknologi-yang-digunakan) • [Hak Cipta](#-kepemilikan--hak-cipta)

</div>

---

## 💡 Tentang TalentHub

**TalentHub** lahir dari gagasan untuk merevolusi proses rekrutmen tenaga kerja di Indonesia yang sering kali melelahkan dan merugikan kedua belah pihak:
* **Masalah Pelamar Kerja**: Mengirim ratusan resume lamaran kerja tanpa kepastian (*ghosting*), transparansi gaji yang minim, serta maraknya lowongan kerja palsu.
* **Masalah Tim HR / Recruiter**: Menghabiskan waktu menyaring ribuan CV yang tidak relevan dan sulit memvalidasi keaslian kompetensi kandidat.

### 🌟 Konsep Solusi: *Reversed Recruitment*
Di **TalentHub**, alur pencarian kerja dibalik:
> **Bukan pencari kerja yang memohon-mohon mengirim CV, melainkan Tim HR perusahaan yang secara aktif mencari, memilah kandidat terverifikasi, dan langsung mengirimkan undangan wawancara resmi (*Interview Pitch*) dengan tawaran gaji transparan dalam mata uang Rupiah.**

---

## ⚡ Fitur Utama

### 1. 🔄 Model Sourcing Terbalik (*Direct Interview Pitch*)
* Tim HR dan Recruiter dapat memfilter talenta berdasarkan keahlian teknis, pengalaman, ketersediaan, dan rentang gaji.
* Fitur pengiriman undangan wawancara langsung terhubung dengan tautan pertemuan online (Google Meet) dan jadwal otomatis.

### 2. 🛡️ Verifikasi HR & Anti-Lowongan Palsu (*Trust & Safety*)
* Mencegah akun bodong dengan validasi **Domain Korporat**, pencatatan **NIB/NPWP Perusahaan**, profil LinkedIn, dan bukti ID Card/Kartu Nama.
* Kurasi ganda: Otomatis (*Corporate Domain Tier*) dan Kurasi Manual oleh Super Admin.

### 3. 🤖 AI ATS Resume Optimizer & Skill Gap Explorer
* Dilengkapi asisten cerdas untuk mengaudit format resume kandidat, memberikan skor ATS (0–100), mencocokkan kata kunci industri, serta merekomendasikan langkah peningkatan karir.

### 4. 🎓 Ekosistem Pelatihan, Beasiswa, & Magang
* Mengintegrasikan program bootcamp intensif, beasiswa digital nasional (seperti DTS Kemnaker), dan magang.
* Dilengkapi sistem tiket masuk offline QR Code, modul silabus interaktif, dan integrasi kelas virtual LMS.

### 5. 🔐 Keamanan Multi-Faktor (*Enterprise Device Trust*)
* Autentikasi aman menggunakan **PBKDF2 Cryptographic Salt Hashing**.
* Sistem deteksi perangkat baru otomatis dengan verifikasi **OTP 6-digit** ke email.
* Proteksi ketat untuk akun **Super Admin**: auto-logout dalam 2 jam dan proteksi anti-brute force (*account lockout*).

### 6. 🌐 Lokalisasi Penuh (Bilingual & Mata Uang Lokal)
* Dukungan pergantian bahasa instan (Bahasa Indonesia 🇮🇩 dan English 🇬🇧).
* Standarisasi format mata uang Rupiah (IDR) presisi.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan arsitektur modern berstandar industri:

* **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/) + [Framer Motion](https://motion.dev/)
* **Backend Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) RESTful APIs
* **Database & Cloud**: [Supabase](https://supabase.com/) (PostgreSQL Cloud Relational Database)
* **AI Capabilities**: Google Gemini AI Models (ATS resume parser & evaluation)
* **PDF Engine**: jsPDF (Generator CV dan portofolio cetak instan)

> **Catatan Pengembangan:**  
> Seluruh konsep produk, arsitektur alur bisnis, tata letak UI/UX, dan spesifikasi fungsional dirancang oleh konseptor/pemilik proyek, dengan proses rekayasa perangkat lunak (*software engineering*) yang diakselerasi menggunakan bantuan AI terkini.

---

## 💻 Panduan Menjalankan Proyek (Quick Start)

### Prasyarat:
Pastikan di komputer Anda sudah terinstal **Node.js** (versi 18 ke atas) dan **npm**.

### 1. Kloning Repository:
```bash
git clone https://github.com/Adrians-R/TalentHub-.git
cd TalentHub-
```

### 2. Instal Dependensi:
```bash
npm install
```

### 3. Konfigurasi Environment:
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi Supabase Anda di dalam file `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Jalankan Aplikasi:
```bash
npm run dev
```
Buka browser Anda di `http://localhost:3000` (atau port yang tertera di terminal).

---

## 📁 Struktur Direktori

```text
talenthub/
├── docs/                 # Dokumentasi sistem, arsitektur database & AI
├── public/               # Aset publik statis (avatar, logo, favicon)
├── server/               # Endpoint REST API Express (Auth, Kandidat, Recruiter, Admin)
├── src/
│   ├── assets/           # Media & gambar preview UI
│   ├── components/       # Komponen UI utama (Dashboard, Landing, Admin, Auth)
│   ├── context/          # State global (LanguageContext ID/EN)
│   ├── data/             # Mock data & fallback database schema
│   ├── i18n/             # Kamus terjemahan Bahasa Indonesia & English
│   ├── lib/              # Client SDK (Supabase client instance)
│   └── types.ts          # Definisi interface TypeScript
├── .env.example          # Template konfigurasi environment aman
├── package.json          # Manajemen paket dependensi
├── server.ts             # Entrypoint server backend
└── vite.config.ts        # Konfigurasi bundler Vite
```

---

## ⚖️ Kepemilikan & Hak Cipta

**Hak Cipta © 2026 Adriansyah Ramadhan ([@Adrians-R](https://github.com/Adrians-R)). Seluruh Hak Cipta Dilindungi Undang-Undang.**

* Desain antarmuka, arsitektur alur kerja *reversed recruitment*, dan kode sumber platform ini merupakan hak cipta proprietary dari pemilik proyek.
* Penggunaan, distribusi, modifikasi, atau penyebarluasan komersial tanpa izin tertulis dari pemilik proyek dilarang keras.
