/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = "id" | "en";

export interface Translations {
  // Navigation
  nav_home: string;
  nav_browse_talent: string;
  nav_jobs: string;
  nav_learning: string;
  nav_programs: string;
  nav_programs_dropdown: string;
  nav_training_bootcamps: string;
  nav_scholarships: string;
  nav_internships: string;
  nav_career_tips: string;
  nav_pricing: string;
  nav_about: string;
  nav_login: string;
  nav_build_profile: string;
  nav_dashboard: string;
  nav_developer_portal: string;
  nav_dev_docs: string;
  nav_simulation_tools: string;
  nav_candidate_simulator: string;
  nav_recruiter_simulator: string;
  nav_admin_simulator: string;
  nav_logout: string;
  nav_signed_in_as: string;
  nav_notifications: string;
  nav_no_notifications: string;
  nav_mark_all_read: string;
  nav_clear_notifications: string;
  nav_language: string;
  
  // Landing Page
  hero_badge: string;
  hero_title_1: string;
  hero_title_highlight: string;
  hero_title_2: string;
  hero_desc: string;
  hero_search_placeholder: string;
  hero_search_btn: string;
  hero_popular_skills: string;
  hero_cta_recruiter: string;
  hero_cta_candidate: string;
  hero_stats_profiles: string;
  hero_stats_time: string;
  hero_stats_satisfaction: string;
  hero_stats_companies: string;
  hero_trusted_by: string;
  how_it_works_badge: string;
  how_it_works_title: string;
  how_it_works_subtitle: string;
  step1_title: string;
  step1_desc: string;
  step2_title: string;
  step2_desc: string;
  step3_title: string;
  step3_desc: string;
  featured_talent_badge: string;
  featured_talent_title: string;
  featured_talent_subtitle: string;
  featured_view_all: string;
  expected_salary: string;
  verified_badge: string;
  open_to_work: string;
  view_profile_btn: string;
  send_invite_btn: string;
  learning_section_badge: string;
  learning_section_title: string;
  learning_section_subtitle: string;
  explore_trainings_btn: string;
  faq_badge: string;
  faq_title: string;
  faq_subtitle: string;
  cta_banner_title: string;
  cta_banner_desc: string;
  cta_banner_candidate_btn: string;
  cta_banner_recruiter_btn: string;
  footer_tagline: string;
  footer_quick_links: string;
  footer_for_candidates: string;
  footer_for_recruiters: string;
  footer_rights: string;
  
  // Browse Talent View
  browse_hero_badge: string;
  browse_hero_title: string;
  browse_hero_subtitle: string;
  browse_hero_desc: string;
  browse_search_placeholder: string;
  browse_filter_role_placeholder: string;
  browse_filter_tech_placeholder: string;
  browse_filter_company_placeholder: string;
  browse_filters_title: string;
  browse_reset_filters: string;
  browse_filter_location: string;
  browse_filter_all_locations: string;
  browse_filter_experience: string;
  browse_filter_any_experience: string;
  browse_filter_salary_range: string;
  browse_filter_education: string;
  browse_filter_ats_score: string;
  browse_filter_verified_only: string;
  browse_filter_remote_only: string;
  browse_filter_open_only: string;
  browse_candidates_found: string;
  browse_sort_by: string;
  browse_sort_ats: string;
  browse_sort_salary_low: string;
  browse_sort_salary_high: string;
  browse_sort_name: string;
  browse_no_candidates: string;
  browse_no_candidates_desc: string;
  browse_clear_filters_btn: string;
  filter_skill: string;
  filter_role: string;
  filter_tech: string;
  filter_company: string;
  filter_education: string;
  filter_cert: string;
  filter_verified_only: string;
  filter_open_to_work: string;
  filter_location: string;
  filter_experience: string;
  filter_employment_type: string;
  invite_interview_btn: string;
  candidate_notice_period: string;
  profile_about_title: string;
  profile_skills_title: string;
  profile_experience_title: string;
  profile_cert_title: string;
  
  // Candidate Profile Drawer / Modal
  modal_candidate_profile: string;
  modal_overview: string;
  modal_portfolio: string;
  modal_experience: string;
  modal_education: string;
  modal_certificates: string;
  modal_about: string;
  modal_skills: string;
  modal_availability: string;
  modal_employment_type: string;
  modal_preferred_location: string;
  modal_ats_score: string;
  modal_ats_breakdown: string;
  modal_send_interview_pitch: string;
  modal_pitch_title: string;
  modal_pitch_desc: string;
  modal_position_label: string;
  modal_salary_offer_label: string;
  modal_meet_link_label: string;
  modal_interview_date_label: string;
  modal_pitch_message_label: string;
  modal_send_pitch_btn: string;
  modal_cancel_btn: string;
  modal_pitch_sent_success: string;
  hr_auth_required_title: string;
  hr_auth_required_desc: string;
  hr_role_restricted_title: string;
  hr_role_restricted_desc: string;
  btn_login_hr: string;
  btn_register_hr: string;
  btn_switch_hr: string;
  google_meet_manual_label: string;
  google_meet_create_btn: string;
  google_meet_manual_tip: string;
  google_meet_required_error: string;
  
  // Candidate Dashboard
  cand_dash_welcome: string;
  cand_dash_subtitle: string;
  cand_tab_job_search: string;
  cand_tab_my_applications: string;
  cand_tab_profile: string;
  cand_tab_invitations: string;
  cand_tab_messages: string;
  cand_tab_ats_optimizer: string;
  cand_tab_skill_gap: string;
  cand_tab_settings: string;
  cand_completion_title: string;
  cand_completion_desc: string;
  cand_btn_edit_profile: string;
  cand_btn_add_skill: string;
  cand_btn_add_experience: string;
  cand_btn_add_education: string;
  cand_btn_add_certificate: string;
  cand_btn_add_portfolio: string;
  cand_invitations_title: string;
  cand_no_invitations: string;
  cand_accept_invite: string;
  cand_decline_invite: string;
  cand_invite_accepted: string;
  cand_invite_declined: string;
  cand_join_interview: string;
  cand_chat_title: string;
  cand_type_message: string;
  cand_send_btn: string;
  cand_ats_title: string;
  cand_ats_subtitle: string;
  cand_ats_analyze_btn: string;
  cand_ats_analyzing: string;
  cand_skill_gap_title: string;
  cand_skill_gap_subtitle: string;
  cand_skill_gap_check_btn: string;
  
  // Recruiter Dashboard
  rec_dash_welcome: string;
  rec_dash_subtitle: string;
  rec_tab_discover: string;
  rec_tab_saved: string;
  rec_tab_invitations: string;
  rec_tab_messages: string;
  rec_tab_company_profile: string;
  rec_saved_candidates_count: string;
  rec_active_pitches_count: string;
  rec_scheduled_interviews_count: string;
  rec_quick_pitch_btn: string;
  rec_bookmark_added: string;
  rec_bookmark_removed: string;
  
  // Training & Programs
  training_title: string;
  training_subtitle: string;
  training_filter_category: string;
  training_filter_type: string;
  training_filter_format: string;
  training_search_placeholder: string;
  training_all_categories: string;
  training_all_types: string;
  training_all_formats: string;
  training_free_badge: string;
  training_government_badge: string;
  training_ngo_badge: string;
  training_private_badge: string;
  training_duration: string;
  training_certified: string;
  training_no_cert: string;
  training_enroll_btn: string;
  training_learning_paths_title: string;
  
  programs_scholarships_title: string;
  programs_scholarships_subtitle: string;
  programs_internships_title: string;
  programs_internships_subtitle: string;
  programs_amount_grant: string;
  programs_stipend: string;
  programs_deadline: string;
  programs_requirements: string;
  programs_apply_now: string;
  programs_saved_success: string;
  programs_applied_success: string;
  
  // Career Articles
  articles_title: string;
  articles_subtitle: string;
  articles_search_placeholder: string;
  articles_category_all: string;
  articles_read_time: string;
  articles_calculator_title: string;
  articles_calculator_desc: string;
  articles_calculate_btn: string;
  articles_negotiator_title: string;
  articles_negotiator_desc: string;
  articles_generate_script_btn: string;
  articles_newsletter_title: string;
  articles_newsletter_desc: string;
  articles_newsletter_placeholder: string;
  articles_newsletter_btn: string;
  articles_newsletter_success: string;
  
  // Admin Panel
  admin_title: string;
  admin_subtitle: string;
  admin_total_candidates: string;
  admin_pending_verification: string;
  admin_pitches_delivered: string;
  admin_platform_revenue: string;
  admin_tab_dashboard: string;
  admin_tab_candidates: string;
  admin_tab_recruiters: string;
  admin_tab_verification_desk: string;
  admin_verify_candidate_btn: string;
  admin_verified_success: string;
  admin_candidate_verified_badge: string;
  
  // Auth
  auth_login_title: string;
  auth_login_subtitle: string;
  auth_email_label: string;
  auth_password_label: string;
  auth_forgot_password: string;
  auth_login_btn: string;
  auth_no_account: string;
  auth_register_link: string;
  auth_register_title: string;
  auth_register_subtitle: string;
  auth_full_name_label: string;
  auth_role_label: string;
  auth_role_candidate: string;
  auth_role_recruiter: string;
  auth_register_btn: string;
  auth_hr_job_title_label: string;
  auth_hr_job_title_placeholder: string;
  auth_hr_work_email_hint: string;
  auth_hr_phone_label: string;
  auth_hr_phone_placeholder: string;
  auth_company_name_label: string;
  auth_company_name_placeholder: string;
  auth_company_website_label: string;
  auth_company_website_placeholder: string;
  auth_company_size_label: string;
  auth_company_location_label: string;
  auth_company_location_placeholder: string;
  auth_company_reg_number_label: string;
  auth_company_reg_number_placeholder: string;
  auth_hr_linkedin_label: string;
  auth_hr_linkedin_placeholder: string;
  auth_company_linkedin_label: string;
  auth_company_linkedin_placeholder: string;
  auth_company_id_doc_label: string;
  auth_company_id_doc_hint: string;
  auth_corporate_domain_detected: string;
  auth_public_domain_notice: string;
  auth_hr_verified_instant_badge: string;
  auth_hr_verified_pending_badge: string;
  auth_hr_declaration_label: string;
  auth_hr_verification_notice: string;
  auth_hr_verified_badge: string;
  auth_candidate_intro_badge: string;
  auth_register_candidate_btn: string;
  auth_register_hr_btn: string;
  auth_have_account: string;
  auth_login_link: string;
  auth_forgot_title: string;
  auth_forgot_subtitle: string;
  auth_send_reset_link: string;
  auth_back_to_login: string;
  auth_reset_title: string;
  auth_reset_subtitle: string;
  auth_new_password_label: string;
  auth_confirm_password_label: string;
  auth_reset_password_btn: string;
  auth_verify_title: string;
  auth_verify_subtitle: string;
  auth_enter_code_label: string;
  auth_verify_btn: string;
  auth_resend_code: string;

  // General & Common
  common_currency_symbol: string;
  common_currency_code: string;
  common_per_month: string;
  common_per_year: string;
  common_free: string;
  common_immediate: string;
  common_notice_1mo: string;
  common_notice_3mo: string;
  common_flexible: string;
  common_fulltime: string;
  common_parttime: string;
  common_contract: string;
  common_internship: string;
  common_freelance: string;
  common_remote: string;
  common_hybrid: string;
  common_onsite: string;
  common_yes: string;
  common_no: string;
  common_close: string;
  common_save: string;
  common_cancel: string;
  common_loading: string;
  common_success: string;
  common_error: string;
}

export const translations: Record<Language, Translations> = {
  id: {
    // Navigation
    nav_home: "Beranda",
    nav_browse_talent: "Cari Talenta",
    nav_jobs: "Lowongan Kerja",
    nav_learning: "Pelatihan & Kursus",
    nav_programs: "Program",
    nav_programs_dropdown: "Katalog Program",
    nav_training_bootcamps: "Pelatihan & Bootcamp",
    nav_scholarships: "Beasiswa",
    nav_internships: "Magang",
    nav_career_tips: "Tips Karier",
    nav_pricing: "Paket & Harga",
    nav_about: "Tentang Kami",
    nav_login: "Masuk",
    nav_build_profile: "Buat Profil",
    nav_dashboard: "Dashboard Aktif",
    nav_developer_portal: "Portal Pengembang",
    nav_dev_docs: "Dokumentasi Developer",
    nav_simulation_tools: "Alat Simulasi",
    nav_candidate_simulator: "Simulator Kandidat",
    nav_recruiter_simulator: "Simulator Perekrut",
    nav_admin_simulator: "Simulator Admin",
    nav_logout: "Keluar",
    nav_signed_in_as: "Masuk sebagai",
    nav_notifications: "Notifikasi Perekrutan",
    nav_no_notifications: "Semua sudah terbaca! Belum ada notifikasi baru.",
    nav_mark_all_read: "Tandai Semua Dibaca",
    nav_clear_notifications: "Hapus Riwayat Notifikasi",
    nav_language: "Bahasa",
    
    // Landing Page
    hero_badge: "Paradigma Perekrutan Terbalik",
    hero_title_1: "Talenta Terbaik Tak Perlu",
    hero_title_highlight: "Kirim Ratusan CV.",
    hero_title_2: "Biar Perekrut yang Datang.",
    hero_desc: "Bangun profil profesional terverifikasi, pamerkan portofolio nyata, dan dapatkan undangan wawancara langsung dengan penawaran gaji transparan dari perusahaan teknologi terkemuka.",
    hero_search_placeholder: "Cari keahlian (contoh: React, UI/UX, Node.js, Growth)...",
    hero_search_btn: "Cari Talenta",
    hero_popular_skills: "Keahlian Populer:",
    hero_cta_recruiter: "Mulai Rekrut Talenta",
    hero_cta_candidate: "Buat Profil Kandidat",
    hero_stats_profiles: "Profil Aktif Terverifikasi",
    hero_stats_time: "Rata-rata Waktu ke Undangan",
    hero_stats_satisfaction: "Kepuasan Penempatan HR",
    hero_stats_companies: "Perusahaan Mitra Perekrut",
    hero_trusted_by: "Dipercaya oleh tim rekrutmen perusahaan terkemuka",
    how_it_works_badge: "Cara Kerja",
    how_it_works_title: "Bagaimana Perekrutan Terbalik Bekerja?",
    how_it_works_subtitle: "Proses cepat, transparan, dan efisien tanpa lamaran tanpa akhir.",
    step1_title: "1. Bangun Profil Terverifikasi",
    step1_desc: "Lengkapi portofolio proyek, sertifikasi yang tervalidasi, dan skor ATS resume Anda.",
    step2_title: "2. Perekrut Mencari & Menemukan Anda",
    step2_desc: "Tim HR menyaring talenta berdasarkan keahlian teruji, ekspektasi gaji, dan ketersediaan.",
    step3_title: "3. Terima Undangan Pitch Langsung",
    step3_desc: "Dapatkan penawaran wawancara transparan dengan nominal gaji dan jadwal tatap muka langsung.",
    featured_talent_badge: "Talenta Unggulan",
    featured_talent_title: "Jelajahi Profesional Terverifikasi",
    featured_talent_subtitle: "Siap bergabung dan direkrut untuk posisi penuh waktu, kontrak, maupun remote.",
    featured_view_all: "Lihat Semua Talenta",
    expected_salary: "Ekspektasi Gaji",
    verified_badge: "Terverifikasi",
    open_to_work: "Siap Bekerja",
    view_profile_btn: "Lihat Profil",
    send_invite_btn: "Kirim Undangan Pitch",
    learning_section_badge: "Pusat Pengembangan Keahlian",
    learning_section_title: "Tingkatkan Kompetensi Anda",
    learning_section_subtitle: "Akses pelatihan resmi pemerintah, NGO, dan sertifikasi industri untuk meningkatkan daya saing profil Anda.",
    explore_trainings_btn: "Jelajahi Semua Pelatihan",
    faq_badge: "Pertanyaan Umum",
    faq_title: "Sering Ditanyakan",
    faq_subtitle: "Pelajari lebih lanjut tentang platform TalentHub dan ekosistem rekrutmen terbalik.",
    cta_banner_title: "Siap Menemukan Karier atau Talenta Impian?",
    cta_banner_desc: "Bergabunglah dengan ribuan profesional dan ratusan perusahaan yang telah beralih ke rekrutmen berbasis kompetensi terverifikasi.",
    cta_banner_candidate_btn: "Daftar Sebagai Kandidat",
    cta_banner_recruiter_btn: "Daftar Sebagai Perekrut",
    footer_tagline: "Platform penemuan talenta terbalik pertama di Indonesia yang menghubungkan profesional terverifikasi dengan perusahaan terpercaya.",
    footer_quick_links: "Tautan Cepat",
    footer_for_candidates: "Untuk Kandidat",
    footer_for_recruiters: "Untuk Perekrut",
    footer_rights: "Hak Cipta Dilindungi Undang-Undang.",
    
    // Browse Talent View
    browse_hero_badge: "Direktori Talenta Terverifikasi",
    browse_hero_title: "Katalog & Pencarian Talenta Terverifikasi",
    browse_hero_subtitle: "Temukan talenta dengan keahlian teruji, portofolio nyata, dan penawaran gaji transparan dalam hitungan detik.",
    browse_hero_desc: "Temukan talenta dengan keahlian teruji, portofolio nyata, dan penawaran gaji transparan dalam hitungan detik.",
    browse_search_placeholder: "Cari nama, keahlian, atau posisi...",
    browse_filter_role_placeholder: "Filter peran (cth: Frontend, Product)...",
    browse_filter_tech_placeholder: "Teknologi (cth: React, TypeScript, SQL)...",
    browse_filter_company_placeholder: "Pengalaman di perusahaan...",
    browse_filters_title: "Filter Penelusuran",
    browse_reset_filters: "Reset Filter",
    browse_filter_location: "Lokasi & Domisili",
    browse_filter_all_locations: "Semua Lokasi",
    browse_filter_experience: "Pengalaman Kerja Minimal",
    browse_filter_any_experience: "Semua Pengalaman",
    browse_filter_salary_range: "Rentang Ekspektasi Gaji",
    browse_filter_education: "Tingkat Pendidikan",
    browse_filter_ats_score: "Skor ATS Resume",
    browse_filter_verified_only: "Hanya Profil Terverifikasi",
    browse_filter_remote_only: "Hanya Bersedia Remote",
    browse_filter_open_only: "Hanya yang Siap Bekerja",
    browse_candidates_found: "talenta ditemukan",
    browse_sort_by: "Urutkan Berdasarkan:",
    browse_sort_ats: "Skor ATS Tertinggi",
    browse_sort_salary_low: "Gaji: Rendah ke Tinggi",
    browse_sort_salary_high: "Gaji: Tinggi ke Rendah",
    browse_sort_name: "Nama (A - Z)",
    browse_no_candidates: "Tidak Ada Talenta yang Sesuai",
    browse_no_candidates_desc: "Coba sesuaikan kata kunci pencarian atau bersihkan filter lokasi dan gaji.",
    browse_clear_filters_btn: "Bersihkan Semua Filter",
    filter_skill: "Keahlian",
    filter_role: "Posisi / Peran",
    filter_tech: "Teknologi",
    filter_company: "Perusahaan",
    filter_education: "Pendidikan",
    filter_cert: "Sertifikasi",
    filter_verified_only: "Hanya Profil Terverifikasi",
    filter_open_to_work: "Hanya yang Siap Bekerja",
    filter_location: "Lokasi & Domisili",
    filter_experience: "Pengalaman Kerja Minimal",
    filter_employment_type: "Jenis Pekerjaan",
    invite_interview_btn: "Undang Wawancara",
    candidate_notice_period: "Ketersediaan / Notice Period",
    profile_about_title: "Tentang Saya",
    profile_skills_title: "Keahlian & Kemampuan",
    profile_experience_title: "Riwayat Pengalaman Kerja",
    profile_cert_title: "Sertifikasi & Lisensi",
    
    // Candidate Profile Drawer / Modal
    modal_candidate_profile: "Detail Profil Kandidat",
    modal_overview: "Ikhtisar",
    modal_portfolio: "Portofolio",
    modal_experience: "Pengalaman",
    modal_education: "Pendidikan",
    modal_certificates: "Sertifikasi",
    modal_about: "Tentang Saya",
    modal_skills: "Keahlian & Kompetensi",
    modal_availability: "Ketersediaan",
    modal_employment_type: "Jenis Pekerjaan",
    modal_preferred_location: "Lokasi Pilihan",
    modal_ats_score: "Skor ATS Resume",
    modal_ats_breakdown: "Analisis Kecocokan Industri",
    modal_send_interview_pitch: "Kirim Undangan Wawancara Langsung",
    modal_pitch_title: "Kirim Tawaran Sourcing Langsung",
    modal_pitch_desc: "Kirim undangan wawancara langsung beserta tawaran gaji yang jelas ke kandidat ini.",
    modal_position_label: "Posisi yang Ditawarkan",
    modal_salary_offer_label: "Tawaran Gaji (Rupiah)",
    modal_meet_link_label: "Tautan Rapat / Wawancara Virtual",
    modal_interview_date_label: "Jadwal Wawancara yang Diusulkan",
    modal_pitch_message_label: "Pesan Pembuka ke Kandidat",
    modal_send_pitch_btn: "Kirim Undangan Sekarang",
    modal_cancel_btn: "Batal",
    modal_pitch_sent_success: "Undangan wawancara berhasil dikirim ke kandidat!",
    hr_auth_required_title: "Akses Dibatasi: Masuk Sebagai HR Diperlukan",
    hr_auth_required_desc: "Untuk mengundang talenta atau menjadwalkan sesi wawancara via menu Cari Talenta, Anda wajib masuk terlebih dahulu dengan akun HR / Rekruter terverifikasi. Akun pencari kerja atau tamu tidak memiliki akses untuk mengirim undangan wawancara.",
    hr_role_restricted_title: "Akses Khusus Akun HR Perusahaan",
    hr_role_restricted_desc: "Anda saat ini terautentikasi dengan akun Talenta / Kandidat. Otoritas untuk mengundang talenta dan menjadwalkan sesi wawancara dibatasi secara eksklusif hanya untuk perwakilan HR / Rekruter resmi perusahaan.",
    btn_login_hr: "Masuk Sebagai HR",
    btn_register_hr: "Daftar Akun HR Perusahaan",
    btn_switch_hr: "Beralih ke Akun HR",
    google_meet_manual_label: "Link Google Meet (Dibuat Manual oleh HR)",
    google_meet_create_btn: "Buat Link di Google Meet Baru",
    google_meet_manual_tip: "Tautan rapat harus dibuat secara manual oleh HR. Klik tombol untuk membuka Google Meet, buat link rapat, lalu tempelkan (paste) URL ke kolom ini.",
    google_meet_required_error: "Tautan Google Meet wajib diisi secara manual oleh HR.",
    
    // Candidate Dashboard
    cand_dash_welcome: "Selamat Datang di Workspace Anda,",
    cand_dash_subtitle: "Cari lowongan kerja HR, kelola profil digital, dan tanggapi undangan wawancara langsung dari perekrut.",
    cand_tab_job_search: "Cari Lowongan Kerja HR",
    cand_tab_my_applications: "Lamaran Saya",
    cand_tab_profile: "Profil & Portofolio",
    cand_tab_invitations: "Undangan Masuk",
    cand_tab_messages: "Pesan & Sourcing Chat",
    cand_tab_ats_optimizer: "AI Resume & ATS Optimizer",
    cand_tab_skill_gap: "AI Analisis Kesenjangan Keahlian",
    cand_tab_settings: "Pengaturan Akun",
    cand_completion_title: "Kelengkapan Profil Anda",
    cand_completion_desc: "Profil lengkap dengan portofolio dan sertifikasi terbukti 4x lebih sering mendapat undangan wawancara.",
    cand_btn_edit_profile: "Ubah Profil",
    cand_btn_add_skill: "Tambah Keahlian",
    cand_btn_add_experience: "Tambah Pengalaman",
    cand_btn_add_education: "Tambah Pendidikan",
    cand_btn_add_certificate: "Tambah Sertifikat",
    cand_btn_add_portfolio: "Tambah Proyek Portofolio",
    cand_invitations_title: "Undangan Perekrutan Langsung",
    cand_no_invitations: "Belum ada undangan masuk. Tingkatkan kelengkapan profil untuk menarik perhatian perekrut!",
    cand_accept_invite: "Terima Undangan",
    cand_decline_invite: "Tolak",
    cand_invite_accepted: "Undangan Diterima",
    cand_invite_declined: "Undangan Ditolak",
    cand_join_interview: "Masuk Ruang Wawancara",
    cand_chat_title: "Percakapan dengan Perekrut",
    cand_type_message: "Ketik pesan balasan Anda...",
    cand_send_btn: "Kirim",
    cand_ats_title: "AI ATS Resume Analyzer",
    cand_ats_subtitle: "Pindai resume Anda dengan kecerdasan buatan untuk mengidentifikasi kata kunci yang hilang dan meningkatkan skor lolos seleksi.",
    cand_ats_analyze_btn: "Analisis Resume Sekarang",
    cand_ats_analyzing: "Sedang Menganalisis Resume...",
    cand_skill_gap_title: "AI Skill Gap & Career Roadmap",
    cand_skill_gap_subtitle: "Pilih target posisi impian Anda untuk mengetahui keahlian apa saja yang perlu Anda pelajari berikutnya.",
    cand_skill_gap_check_btn: "Cek Kesenjangan Keahlian",
    
    // Recruiter Dashboard
    rec_dash_welcome: "Selamat Datang di Portal Perekrut,",
    rec_dash_subtitle: "Cari talenta terbaik, kirim undangan wawancara langsung, dan pantau proses rekrutmen perusahaan Anda.",
    rec_tab_discover: "Cari & Temukan Talenta",
    rec_tab_saved: "Talenta Tersimpan",
    rec_tab_invitations: "Undangan Terkirim",
    rec_tab_messages: "Pesan & Jadwal Wawancara",
    rec_tab_company_profile: "Profil Perusahaan",
    rec_saved_candidates_count: "Kandidat Tersimpan",
    rec_active_pitches_count: "Undangan Aktif",
    rec_scheduled_interviews_count: "Wawancara Terjadwal",
    rec_quick_pitch_btn: "Kirim Undangan Baru",
    rec_bookmark_added: "Kandidat ditambahkan ke daftar tersimpan",
    rec_bookmark_removed: "Kandidat dihapus dari daftar tersimpan",
    
    // Training & Programs
    training_title: "Pusat Pelatihan & Sertifikasi Digital",
    training_subtitle: "Akses program pelatihan berkualitas dari pemerintah, NGO, dan lembaga terpercaya untuk meningkatkan kompetensi Anda.",
    training_filter_category: "Kategori Keahlian",
    training_filter_type: "Penyelenggara / Tipe",
    training_filter_format: "Format Pelaksanaan",
    training_search_placeholder: "Cari judul program pelatihan atau penyedia...",
    training_all_categories: "Semua Kategori",
    training_all_types: "Semua Penyelenggara",
    training_all_formats: "Semua Format",
    training_free_badge: "Gratis",
    training_government_badge: "Pemerintah (Kominfo/BUMN)",
    training_ngo_badge: "Lembaga NGO / Beasiswa",
    training_private_badge: "Swasta / Industri",
    training_duration: "Durasi",
    training_certified: "Ada Sertifikasi Resmi",
    training_no_cert: "Sertifikat Kehadiran",
    training_enroll_btn: "Daftar Pelatihan",
    training_learning_paths_title: "Alur Pembelajaran Terstruktur",
    
    programs_scholarships_title: "Program Beasiswa Pendidikan & Pelatihan",
    programs_scholarships_subtitle: "Dapatkan pendanaan penuh untuk gelar sarjana, pascasarjana, atau bootcamp teknologi intensif.",
    programs_internships_title: "Program Magang Industri & BUMN",
    programs_internships_subtitle: "Dapatkan pengalaman kerja nyata dan uang saku bulanan dari perusahaan teknologi terkemuka.",
    programs_amount_grant: "Jumlah Beasiswa / Dana Hibah",
    programs_stipend: "Uang Saku Bulanan",
    programs_deadline: "Batas Akhir Pendaftaran",
    programs_requirements: "Persyaratan",
    programs_apply_now: "Daftar Sekarang",
    programs_saved_success: "Program berhasil disimpan!",
    programs_applied_success: "Lamaran berhasil diajukan!",
    
    // Career Articles
    articles_title: "Buku Panduan Karier & Wawasan Rekrutmen",
    articles_subtitle: "Tips praktis untuk mengoptimalkan profil, lulus wawancara kerja, dan menegosiasikan penawaran gaji tertinggi.",
    articles_search_placeholder: "Cari artikel, panduan, atau topik...",
    articles_category_all: "Semua Artikel",
    articles_read_time: "waktu baca",
    articles_calculator_title: "Kalkulator Kesiapan Resume",
    articles_calculator_desc: "Periksa kelayakan format resume dan portofolio Anda secara instan.",
    articles_calculate_btn: "Hitung Skor Kesiapan",
    articles_negotiator_title: "Generator Skrip Negosiasi Gaji",
    articles_negotiator_desc: "Hasilkan kalimat negosiasi gaji profesional dalam mata uang Rupiah berdasarkan pengalaman Anda.",
    articles_generate_script_btn: "Buat Skrip Negosiasi",
    articles_newsletter_title: "Berlangganan Wawasan Karier Mingguan",
    articles_newsletter_desc: "Dapatkan tips negosiasi gaji, tren keahlian teknologi, dan info beasiswa terbaru langsung di email Anda.",
    articles_newsletter_placeholder: "Masukkan email Anda...",
    articles_newsletter_btn: "Berlangganan",
    articles_newsletter_success: "Terima kasih telah berlangganan buletin kami!",
    
    // Admin Panel
    admin_title: "Panel Administrasi Sistem TalentHub",
    admin_subtitle: "Moderasi platform, verifikasi identitas kandidat, dan analisis aktivitas perekrutan.",
    admin_total_candidates: "Total Kandidat Terdaftar",
    admin_pending_verification: "Menunggu Verifikasi Identitas",
    admin_pitches_delivered: "Total Undangan Terkirim",
    admin_platform_revenue: "Pendapatan Platform Bulanan",
    admin_tab_dashboard: "Dashboard Ringkasan",
    admin_tab_candidates: "Kelola Kandidat",
    admin_tab_recruiters: "Kelola Perekrut",
    admin_tab_verification_desk: "Meja Verifikasi",
    admin_verify_candidate_btn: "Verifikasi & Berikan Lencana",
    admin_verified_success: "Kandidat berhasil diverifikasi!",
    admin_candidate_verified_badge: "Lencana Terverifikasi Aktif",
    
    // Auth
    auth_login_title: "Masuk ke Akun TalentHub",
    auth_login_subtitle: "Akses dashboard kandidat atau portal rekrutmen perusahaan Anda.",
    auth_email_label: "Alamat Email",
    auth_password_label: "Kata Sandi",
    auth_forgot_password: "Lupa kata sandi?",
    auth_login_btn: "Masuk",
    auth_no_account: "Belum memiliki akun?",
    auth_register_link: "Daftar sekarang",
    auth_register_title: "Buat Akun TalentHub Baru",
    auth_register_subtitle: "Pilih peran Anda dan mulai perjalanan rekrutmen modern hari ini.",
    auth_full_name_label: "Nama Lengkap",
    auth_role_label: "Daftar Sebagai",
    auth_role_candidate: "Kandidat / Pencari Kerja",
    auth_role_recruiter: "Perekrut / Perusahaan (HR)",
    auth_register_btn: "Daftar Akun",
    auth_hr_job_title_label: "Jabatan HR / Rekruter Resmi",
    auth_hr_job_title_placeholder: "cth. Talent Acquisition Lead / HR Manager",
    auth_hr_work_email_hint: "Gunakan email resmi perusahaan untuk verifikasi otomatis",
    auth_hr_phone_label: "Nomor Telepon / WhatsApp Kantor",
    auth_hr_phone_placeholder: "cth. +62 812-3456-7890",
    auth_company_name_label: "Nama Resmi Perusahaan / Badan Usaha",
    auth_company_name_placeholder: "cth. PT Teknologi Inovasi Bangsa",
    auth_company_website_label: "Website / Tautan Karier Perusahaan",
    auth_company_website_placeholder: "cth. https://perusahaan.co.id",
    auth_company_size_label: "Skala / Jumlah Karyawan",
    auth_company_location_label: "Kota Kantor Pusat",
    auth_company_location_placeholder: "cth. Jakarta Selatan, DKI Jakarta",
    auth_company_reg_number_label: "NIB (Nomor Induk Berusaha) / NPWP Badan",
    auth_company_reg_number_placeholder: "cth. 0123456789 (Opsional)",
    auth_hr_linkedin_label: "Tautan Profil LinkedIn HR / Rekruter",
    auth_hr_linkedin_placeholder: "https://linkedin.com/in/profil-hr-anda",
    auth_company_linkedin_label: "Halaman LinkedIn / Profil Karier Perusahaan",
    auth_company_linkedin_placeholder: "https://linkedin.com/company/nama-perusahaan",
    auth_company_id_doc_label: "Bukti ID Karyawan / Kartu Nama HR (Opsional)",
    auth_company_id_doc_hint: "Unggah foto ID card kantor atau kartu nama untuk mempercepat verifikasi instan",
    auth_corporate_domain_detected: "Domain Email Kantor Terdeteksi — Memenuhi Syarat Lencana HR Terverifikasi Instan ✓",
    auth_public_domain_notice: "Domain email publik terdeteksi (@gmail, @yahoo, dll). Anda tetap dapat mendaftar; verifikasi akan diproses melalui profil LinkedIn & data perusahaan.",
    auth_hr_verified_instant_badge: "HR Terverifikasi (Domain Korporat)",
    auth_hr_verified_pending_badge: "Menunggu Tinjauan Verifikasi",
    auth_hr_declaration_label: "Saya menyatakan dan mengonfirmasi secara resmi bahwa saya adalah perwakilan sah tim HR / Rekrutmen yang memiliki wewenang untuk membuka lowongan dan merekrut talenta atas nama perusahaan ini.",
    auth_hr_verification_notice: "Verifikasi Keamanan HR: Pendaftaran akun HR memerlukan data legalitas perusahaan dan kontak resmi untuk memvalidasi wewenang rekrutmen serta melindungi talenta.",
    auth_hr_verified_badge: "Perwakilan HR Terverifikasi",
    auth_candidate_intro_badge: "Pencari Kerja: Buat portofolio terverifikasi dan lamar lowongan favorit Anda secara langsung.",
    auth_register_candidate_btn: "Daftar Akun Talenta",
    auth_register_hr_btn: "Daftar & Verifikasi Akun HR",
    auth_have_account: "Sudah punya akun?",
    auth_login_link: "Masuk di sini",
    auth_forgot_title: "Pemulihan Kata Sandi",
    auth_forgot_subtitle: "Masukkan email terdaftar Anda untuk menerima tautan atur ulang kata sandi.",
    auth_send_reset_link: "Kirim Tautan Pemulihan",
    auth_back_to_login: "Kembali ke halaman masuk",
    auth_reset_title: "Atur Ulang Kata Sandi Baru",
    auth_reset_subtitle: "Buat kata sandi baru yang aman untuk akun Anda.",
    auth_new_password_label: "Kata Sandi Baru",
    auth_confirm_password_label: "Konfirmasi Kata Sandi Baru",
    auth_reset_password_btn: "Simpan Kata Sandi Baru",
    auth_verify_title: "Verifikasi Alamat Email",
    auth_verify_subtitle: "Masukkan kode 6-digit yang dikirimkan ke kotak masuk email Anda.",
    auth_enter_code_label: "Kode Verifikasi (OTP)",
    auth_verify_btn: "Verifikasi Akun",
    auth_resend_code: "Kirim Ulang Kode",

    // General & Common
    common_currency_symbol: "Rp",
    common_currency_code: "IDR",
    common_per_month: "bulan",
    common_per_year: "tahun",
    common_free: "Gratis",
    common_immediate: "Langsung Siap Kerja",
    common_notice_1mo: "Pemberitahuan 1 Bulan",
    common_notice_3mo: "Pemberitahuan 3 Bulan",
    common_flexible: "Fleksibel",
    common_fulltime: "Penuh Waktu (Full-time)",
    common_parttime: "Paruh Waktu (Part-time)",
    common_contract: "Kontrak",
    common_internship: "Magang (Internship)",
    common_freelance: "Pekerja Lepas (Freelance)",
    common_remote: "Remote / Jarak Jauh",
    common_hybrid: "Hybrid",
    common_onsite: "Di Kantor (On-site)",
    common_yes: "Ya",
    common_no: "Tidak",
    common_close: "Tutup",
    common_save: "Simpan",
    common_cancel: "Batal",
    common_loading: "Memuat...",
    common_success: "Berhasil",
    common_error: "Terjadi kesalahan",
  },
  en: {
    // Navigation
    nav_home: "Home",
    nav_browse_talent: "Browse Talent",
    nav_jobs: "Job Openings",
    nav_learning: "Learning & Courses",
    nav_programs: "Programs",
    nav_programs_dropdown: "Programs Catalog",
    nav_training_bootcamps: "Training & Bootcamps",
    nav_scholarships: "Scholarships",
    nav_internships: "Internships",
    nav_career_tips: "Career Tips",
    nav_pricing: "Pricing",
    nav_about: "About",
    nav_login: "Login",
    nav_build_profile: "Build Profile",
    nav_dashboard: "Active Dashboard",
    nav_developer_portal: "Developer Portal",
    nav_dev_docs: "Developer Docs",
    nav_simulation_tools: "Simulation Tools",
    nav_candidate_simulator: "Candidate Simulator",
    nav_recruiter_simulator: "Recruiter Simulator",
    nav_admin_simulator: "Admin Simulator",
    nav_logout: "Log Out",
    nav_signed_in_as: "Signed in as",
    nav_notifications: "Hiring Notifications",
    nav_no_notifications: "You are completely caught up! No new notifications.",
    nav_mark_all_read: "Mark All as Read",
    nav_clear_notifications: "Clear Notification History",
    nav_language: "Language",
    
    // Landing Page
    hero_badge: "Reversed Recruitment Paradigm",
    hero_title_1: "Top Talent Shouldn't Send",
    hero_title_highlight: "Hundreds of CVs.",
    hero_title_2: "Let Recruiters Pitch You.",
    hero_desc: "Build a verified professional profile, showcase real portfolio projects, and receive direct interview invitations with transparent Indonesian Rupiah offers from leading tech teams.",
    hero_search_placeholder: "Search skills (e.g. React, UI/UX, Node.js, Growth Marketing)...",
    hero_search_btn: "Find Talent",
    hero_popular_skills: "Popular Skills:",
    hero_cta_recruiter: "Start Sourcing Talent",
    hero_cta_candidate: "Build Candidate Profile",
    hero_stats_profiles: "Verified Active Profiles",
    hero_stats_time: "Average Time-to-Invitation",
    hero_stats_satisfaction: "HR Placement Satisfaction",
    hero_stats_companies: "Partner Companies Hiring",
    hero_trusted_by: "Trusted by hiring teams from high-growth tech companies",
    how_it_works_badge: "How It Works",
    how_it_works_title: "How Does Reversed Recruitment Work?",
    how_it_works_subtitle: "A faster, transparent, and respectful hiring flow without the endless application black hole.",
    step1_title: "1. Build a Verified Profile",
    step1_desc: "Showcase working projects, validated certifications, and your ATS-analyzed resume scores.",
    step2_title: "2. Recruiters Search & Discover You",
    step2_desc: "HR teams filter verified candidates by real skills, expected IDR compensation, and availability.",
    step3_title: "3. Receive Direct Interview Pitches",
    step3_desc: "Get transparent interview invitations with explicit Rupiah salary ranges and instant meeting slots.",
    featured_talent_badge: "Featured Talent",
    featured_talent_title: "Explore Verified Professionals",
    featured_talent_subtitle: "Available immediately for Full-time, Contract, Hybrid, and Remote tech positions.",
    featured_view_all: "View All Talent Directory",
    expected_salary: "Expected Salary",
    verified_badge: "Verified",
    open_to_work: "Open to Work",
    view_profile_btn: "View Profile",
    send_invite_btn: "Send Sourcing Pitch",
    learning_section_badge: "Skill Development Hub",
    learning_section_title: "Elevate Your Capabilities",
    learning_section_subtitle: "Access official training from government, NGO, and tech academies to boost your verified profile score.",
    explore_trainings_btn: "Explore All Trainings",
    faq_badge: "FAQ",
    faq_title: "Frequently Asked Questions",
    faq_subtitle: "Learn how the reversed recruitment model and talent verification protect your time.",
    cta_banner_title: "Ready to Transform How You Hire or Get Hired?",
    cta_banner_desc: "Join thousands of vetted professionals and hundreds of employers discovering each other without cold CV submissions.",
    cta_banner_candidate_btn: "Join as Candidate",
    cta_banner_recruiter_btn: "Join as Recruiter",
    footer_tagline: "The modern reversed talent discovery platform connecting verified Indonesian & global builders with forward-thinking teams.",
    footer_quick_links: "Quick Links",
    footer_for_candidates: "For Candidates",
    footer_for_recruiters: "For Recruiters",
    footer_rights: "All Rights Reserved.",
    
    // Browse Talent View
    browse_hero_badge: "Verified Talent Directory",
    browse_hero_title: "Verified Talent Directory & Search",
    browse_hero_subtitle: "Discover high-caliber professionals with proven skills, interactive portfolios, and transparent Rupiah expectations in seconds.",
    browse_hero_desc: "Discover high-caliber professionals with proven skills, interactive portfolios, and transparent Rupiah expectations in seconds.",
    browse_search_placeholder: "Search by candidate name, skill, or role headline...",
    browse_filter_role_placeholder: "Filter role (e.g. Frontend, Architect)...",
    browse_filter_tech_placeholder: "Technology (e.g. React, TypeScript, SQL)...",
    browse_filter_company_placeholder: "Past company experience...",
    browse_filters_title: "Search Filters",
    browse_reset_filters: "Reset Filters",
    browse_filter_location: "Location & Province",
    browse_filter_all_locations: "All Locations",
    browse_filter_experience: "Minimum Experience",
    browse_filter_any_experience: "Any Experience",
    browse_filter_salary_range: "Expected Salary Range (IDR)",
    browse_filter_education: "Education Level",
    browse_filter_ats_score: "Resume ATS Score",
    browse_filter_verified_only: "Verified Profiles Only",
    browse_filter_remote_only: "Remote-Ready Only",
    browse_filter_open_only: "Actively Open to Work",
    browse_candidates_found: "candidates found",
    browse_sort_by: "Sort By:",
    browse_sort_ats: "Highest ATS Score",
    browse_sort_salary_low: "Salary: Low to High",
    browse_sort_salary_high: "Salary: High to Low",
    browse_sort_name: "Name (A - Z)",
    browse_no_candidates: "No Matching Candidates Found",
    browse_no_candidates_desc: "Try adjusting your search criteria or clearing specific location and salary filters.",
    browse_clear_filters_btn: "Clear All Filters",
    filter_skill: "Skill",
    filter_role: "Role / Headline",
    filter_tech: "Technology",
    filter_company: "Company",
    filter_education: "Education",
    filter_cert: "Certification",
    filter_verified_only: "Verified Profiles Only",
    filter_open_to_work: "Actively Open to Work",
    filter_location: "Location & Province",
    filter_experience: "Minimum Experience",
    filter_employment_type: "Employment Type",
    invite_interview_btn: "Invite to Interview",
    candidate_notice_period: "Availability / Notice Period",
    profile_about_title: "About Me",
    profile_skills_title: "Skills & Competencies",
    profile_experience_title: "Work Experience",
    profile_cert_title: "Certifications & Licenses",
    
    // Candidate Profile Drawer / Modal
    modal_candidate_profile: "Candidate Profile Details",
    modal_overview: "Overview",
    modal_portfolio: "Portfolio",
    modal_experience: "Experience",
    modal_education: "Education",
    modal_certificates: "Certifications",
    modal_about: "About Me",
    modal_skills: "Skills & Core Competencies",
    modal_availability: "Availability",
    modal_employment_type: "Employment Type",
    modal_preferred_location: "Preferred Location",
    modal_ats_score: "Resume ATS Score",
    modal_ats_breakdown: "Industry Alignment Analysis",
    modal_send_interview_pitch: "Send Direct Interview Invitation",
    modal_pitch_title: "Dispatch Direct Sourcing Pitch",
    modal_pitch_desc: "Send a direct invitation with a clear Indonesian Rupiah salary offer to this candidate.",
    modal_position_label: "Target Position / Role",
    modal_salary_offer_label: "Salary Offer (Indonesian Rupiah)",
    modal_meet_link_label: "Virtual Meeting Link",
    modal_interview_date_label: "Proposed Interview Schedule",
    modal_pitch_message_label: "Introductory Pitch Message",
    modal_send_pitch_btn: "Dispatch Pitch Now",
    modal_cancel_btn: "Cancel",
    modal_pitch_sent_success: "Interview pitch dispatched successfully to candidate inbox!",
    hr_auth_required_title: "Access Restricted: HR Login Required",
    hr_auth_required_desc: "To invite candidates or schedule interviews via Find Talent, you must log in specifically with a verified Company HR / Recruiter account. Job seeker and guest accounts cannot send recruiter interview invitations.",
    hr_role_restricted_title: "Access Restricted to Company HR",
    hr_role_restricted_desc: "You are currently logged in with a Candidate account. Inviting talent and scheduling interviews is exclusively reserved for verified Company HR / Recruiter accounts.",
    btn_login_hr: "Log In as HR",
    btn_register_hr: "Register HR Account",
    btn_switch_hr: "Switch to HR Account",
    google_meet_manual_label: "Google Meet Link (Manually Generated by HR)",
    google_meet_create_btn: "Generate New Google Meet Link",
    google_meet_manual_tip: "Meeting link must be generated manually by HR. Click the button to create a new Google Meet room, then copy and paste the URL here.",
    google_meet_required_error: "Google Meet link must be manually provided by HR.",
    
    // Candidate Dashboard
    cand_dash_welcome: "Welcome back to your workspace,",
    cand_dash_subtitle: "Explore job openings posted by HR, manage your profile, and respond to interview invitations.",
    cand_tab_job_search: "Search HR Jobs",
    cand_tab_my_applications: "My Applications",
    cand_tab_profile: "Profile & Portfolio",
    cand_tab_invitations: "Sourcing Inbox",
    cand_tab_messages: "Direct Messages",
    cand_tab_ats_optimizer: "AI Resume & ATS Optimizer",
    cand_tab_skill_gap: "AI Skill Gap Explorer",
    cand_tab_settings: "Account Settings",
    cand_completion_title: "Your Profile Completeness",
    cand_completion_desc: "Candidates with full portfolios and verified certificates receive 4x more direct interview pitches.",
    cand_btn_edit_profile: "Edit Profile",
    cand_btn_add_skill: "Add Skill",
    cand_btn_add_experience: "Add Experience",
    cand_btn_add_education: "Add Education",
    cand_btn_add_certificate: "Add Certificate",
    cand_btn_add_portfolio: "Add Portfolio Project",
    cand_invitations_title: "Direct Sourcing Invitations",
    cand_no_invitations: "No active invitations yet. Optimize your profile completeness to attract top recruiters!",
    cand_accept_invite: "Accept & Schedule",
    cand_decline_invite: "Decline",
    cand_invite_accepted: "Invitation Accepted",
    cand_invite_declined: "Invitation Declined",
    cand_join_interview: "Join Virtual Interview",
    cand_chat_title: "Recruiter Communication Channel",
    cand_type_message: "Type your reply message...",
    cand_send_btn: "Send Message",
    cand_ats_title: "AI ATS Resume Analyzer",
    cand_ats_subtitle: "Scan your resume using Gemini AI to identify missing industry keywords and boost your profile match score.",
    cand_ats_analyze_btn: "Analyze Resume with AI",
    cand_ats_analyzing: "Analyzing Resume & Vectors...",
    cand_skill_gap_title: "AI Skill Gap & Career Roadmap",
    cand_skill_gap_subtitle: "Select your target dream job to discover missing tech vectors and recommended training.",
    cand_skill_gap_check_btn: "Explore Skill Gap Roadmap",
    
    // Recruiter Dashboard
    rec_dash_welcome: "Welcome to Recruiter Command Center,",
    rec_dash_subtitle: "Source top verified talent, dispatch direct interview pitches, and accelerate your engineering hiring pipeline.",
    rec_tab_discover: "Search & Source Talent",
    rec_tab_saved: "Bookmarked Talent",
    rec_tab_invitations: "Dispatched Pitches",
    rec_tab_messages: "Messages & Schedules",
    rec_tab_company_profile: "Company Profile",
    rec_saved_candidates_count: "Saved Candidates",
    rec_active_pitches_count: "Active Sourcing Pitches",
    rec_scheduled_interviews_count: "Scheduled Interviews",
    rec_quick_pitch_btn: "New Sourcing Pitch",
    rec_bookmark_added: "Candidate bookmarked to saved list",
    rec_bookmark_removed: "Candidate removed from saved list",
    
    // Training & Programs
    training_title: "Digital Skill Academy & Certifications",
    training_subtitle: "Access verified curricula from Government, NGO, and top tech partners to expand your candidate qualifications.",
    training_filter_category: "Skill Category",
    training_filter_type: "Provider Type",
    training_filter_format: "Course Format",
    training_search_placeholder: "Search courses by title, skill, or provider...",
    training_all_categories: "All Categories",
    training_all_types: "All Providers",
    training_all_formats: "All Formats",
    training_free_badge: "Free",
    training_government_badge: "Government Sponsored",
    training_ngo_badge: "NGO / Scholarship",
    training_private_badge: "Industry Academy",
    training_duration: "Duration",
    training_certified: "Official Certificate Included",
    training_no_cert: "Certificate of Completion",
    training_enroll_btn: "Enroll Course",
    training_learning_paths_title: "Guided Career Learning Paths",
    
    programs_scholarships_title: "Educational Scholarships & Grants",
    programs_scholarships_subtitle: "Unlock fully funded scholarships and research grants for computer science and digital development.",
    programs_internships_title: "Industry Internships & Traineeships",
    programs_internships_subtitle: "Gain real-world software building experience with competitive monthly stipends in Indonesian Rupiah.",
    programs_amount_grant: "Scholarship Amount / Funding",
    programs_stipend: "Monthly Stipend",
    programs_deadline: "Application Deadline",
    programs_requirements: "Requirements",
    programs_apply_now: "Apply Now",
    programs_saved_success: "Program saved to your wishlist!",
    programs_applied_success: "Application submitted successfully!",
    
    // Career Articles
    articles_title: "Career Strategy Handbook & Playbooks",
    articles_subtitle: "Actionable frameworks for high-impact portfolios, reversed recruitment, and salary negotiation.",
    articles_search_placeholder: "Search articles, guides, or interview strategies...",
    articles_category_all: "All Articles",
    articles_read_time: "read time",
    articles_calculator_title: "Resume Readiness Calculator",
    articles_calculator_desc: "Evaluate your portfolio and CV layout strength instantly before publishing.",
    articles_calculate_btn: "Calculate Readiness Score",
    articles_negotiator_title: "IDR Salary Negotiation Script Generator",
    articles_negotiator_desc: "Generate professional Indonesian Rupiah counter-offer phrases tailored to your experience level.",
    articles_generate_script_btn: "Generate Negotiation Script",
    articles_newsletter_title: "Subscribe to Weekly Tech Career Insights",
    articles_newsletter_desc: "Get vetted compensation benchmarks in Indonesian Rupiah and interview tactics straight to your inbox.",
    articles_newsletter_placeholder: "Enter your work email...",
    articles_newsletter_btn: "Subscribe",
    articles_newsletter_success: "Thank you for subscribing to our newsletter!",
    
    // Admin Panel
    admin_title: "TalentHub Administration & Moderation",
    admin_subtitle: "Platform moderation, candidate identity verification desk, and sourcing analytics.",
    admin_total_candidates: "Total Registered Candidates",
    admin_pending_verification: "Pending Identity Verifications",
    admin_pitches_delivered: "Total Sourcing Pitches Dispatched",
    admin_platform_revenue: "Monthly Platform Revenues",
    admin_tab_dashboard: "Admin Dashboard",
    admin_tab_candidates: "Candidates Directory",
    admin_tab_recruiters: "Recruiters Directory",
    admin_tab_verification_desk: "Verification Desk",
    admin_verify_candidate_btn: "Verify & Boost Badge",
    admin_verified_success: "Candidate verified and badge boosted successfully!",
    admin_candidate_verified_badge: "Verified Badge Active",
    
    // Auth
    auth_login_title: "Sign in to TalentHub",
    auth_login_subtitle: "Access your candidate workspace or recruiter sourcing tools.",
    auth_email_label: "Email Address",
    auth_password_label: "Password",
    auth_forgot_password: "Forgot password?",
    auth_login_btn: "Sign In",
    auth_no_account: "Don't have an account?",
    auth_register_link: "Sign up now",
    auth_register_title: "Create Your TalentHub Account",
    auth_register_subtitle: "Select your role and start your modern talent journey today.",
    auth_full_name_label: "Full Name",
    auth_role_label: "Register As",
    auth_role_candidate: "Candidate / Job Seeker",
    auth_role_recruiter: "Recruiter / Hiring Employer (HR)",
    auth_register_btn: "Create Account",
    auth_hr_job_title_label: "Official HR / Recruiter Job Title",
    auth_hr_job_title_placeholder: "e.g. Talent Acquisition Lead / HR Manager",
    auth_hr_work_email_hint: "Use official corporate email domain for instant verification",
    auth_hr_phone_label: "Corporate Office Phone / WhatsApp",
    auth_hr_phone_placeholder: "e.g. +62 812-3456-7890",
    auth_company_name_label: "Official Legal Company / Entity Name",
    auth_company_name_placeholder: "e.g. PT Global Tech Innovations",
    auth_company_website_label: "Company Official Website / Career URL",
    auth_company_website_placeholder: "e.g. https://company.com",
    auth_company_size_label: "Company Employee Headcount",
    auth_company_location_label: "Headquarters City / Location",
    auth_company_location_placeholder: "e.g. South Jakarta, Indonesia",
    auth_company_reg_number_label: "Business Registration / Tax / NIB ID",
    auth_company_reg_number_placeholder: "e.g. 0123456789 (Optional)",
    auth_hr_linkedin_label: "HR / Recruiter LinkedIn Profile URL",
    auth_hr_linkedin_placeholder: "https://linkedin.com/in/your-profile",
    auth_company_linkedin_label: "Company LinkedIn / Careers Page URL",
    auth_company_linkedin_placeholder: "https://linkedin.com/company/your-company",
    auth_company_id_doc_label: "Employee ID / Business Card Proof (Optional)",
    auth_company_id_doc_hint: "Upload work badge or business card photo for accelerated instant verification",
    auth_corporate_domain_detected: "Official Work Domain Detected — Eligible for Instant Verified HR Badge ✓",
    auth_public_domain_notice: "Public email domain detected (@gmail, @yahoo, etc.). You can still register; verification will be confirmed via your LinkedIn profile & company details.",
    auth_hr_verified_instant_badge: "Verified HR (Corporate Domain)",
    auth_hr_verified_pending_badge: "Verification Review Pending",
    auth_hr_declaration_label: "I officially declare and confirm that I am an authorized representative of the HR / Talent Acquisition team with legal authority to publish job openings and recruit candidates on behalf of this company.",
    auth_hr_verification_notice: "HR Security Verification: Recruiter registration requires corporate details and official contact info to validate hiring authority and protect candidates.",
    auth_hr_verified_badge: "Verified HR Representative",
    auth_candidate_intro_badge: "Job Seeker: Build a verified portfolio and apply directly to top company job openings.",
    auth_register_candidate_btn: "Create Candidate Account",
    auth_register_hr_btn: "Register & Verify HR Workspace",
    auth_have_account: "Already have an account?",
    auth_login_link: "Sign in here",
    auth_forgot_title: "Reset Password",
    auth_forgot_subtitle: "Enter your registered email to receive a password reset link.",
    auth_send_reset_link: "Send Reset Link",
    auth_back_to_login: "Back to Login",
    auth_reset_title: "Set New Password",
    auth_reset_subtitle: "Choose a secure new password for your account.",
    auth_new_password_label: "New Password",
    auth_confirm_password_label: "Confirm New Password",
    auth_reset_password_btn: "Update Password",
    auth_verify_title: "Verify Your Email Address",
    auth_verify_subtitle: "Enter the 6-digit verification code sent to your email.",
    auth_enter_code_label: "Verification Code (OTP)",
    auth_verify_btn: "Verify Account",
    auth_resend_code: "Resend Code",

    // General & Common
    common_currency_symbol: "Rp",
    common_currency_code: "IDR",
    common_per_month: "month",
    common_per_year: "year",
    common_free: "Free",
    common_immediate: "Immediate",
    common_notice_1mo: "1 Month Notice",
    common_notice_3mo: "3 Months Notice",
    common_flexible: "Flexible",
    common_fulltime: "Full-time",
    common_parttime: "Part-time",
    common_contract: "Contract",
    common_internship: "Internship",
    common_freelance: "Freelance",
    common_remote: "Remote",
    common_hybrid: "Hybrid",
    common_onsite: "On-site",
    common_yes: "Yes",
    common_no: "No",
    common_close: "Close",
    common_save: "Save",
    common_cancel: "Cancel",
    common_loading: "Loading...",
    common_success: "Success",
    common_error: "An error occurred",
  }
};

/**
 * Formats a number or string amount into Indonesian Rupiah format.
 * Examples:
 * - formatRupiah(15000000) => "Rp 15.000.000"
 * - formatRupiah(8500000, "month", "id") => "Rp 8.500.000 / bulan"
 * - formatRupiah(8500000, "month", "en") => "Rp 8,500,000 / month"
 */
export function formatRupiah(
  amount: number | string, 
  period?: "month" | "year" | "bln" | "thn", 
  lang: Language = "id"
): string {
  if (typeof amount === "string") {
    // If it's already an explicit Rupiah string like "Rp 15.000.000 / bulan", normalize it if needed
    if (amount.toLowerCase().includes("gratis") || amount.toLowerCase().includes("free")) {
      return lang === "id" ? "Gratis" : "Free";
    }
    // Extract numeric parts
    const numeric = parseInt(amount.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(numeric) && numeric > 0) {
      amount = numeric;
    } else {
      return amount; // return raw if unparseable
    }
  }

  const num = typeof amount === "number" ? amount : 0;
  
  // Format with Indonesian standard thousands dots
  const formattedNum = num.toLocaleString(lang === "id" ? "id-ID" : "en-US");
  
  let result = `Rp ${formattedNum}`;
  
  if (period) {
    if (period === "month" || period === "bln") {
      result += lang === "id" ? " / bulan" : " / month";
    } else if (period === "year" || period === "thn") {
      result += lang === "id" ? " / tahun" : " / year";
    }
  }

  return result;
}

/**
 * Formats compact Rupiah amounts (e.g. 15000000 -> "Rp 15 Jt" or "Rp 15M")
 */
export function formatRupiahCompact(amount: number, lang: Language = "id"): string {
  if (amount >= 1000000000) {
    const val = (amount / 1000000000).toFixed(1).replace(/\.0$/, "");
    return lang === "id" ? `Rp ${val} Miliar` : `Rp ${val}B`;
  }
  if (amount >= 1000000) {
    const val = (amount / 1000000).toFixed(1).replace(/\.0$/, "");
    return lang === "id" ? `Rp ${val} Juta` : `Rp ${val}M`;
  }
  if (amount >= 1000) {
    const val = (amount / 1000).toFixed(0);
    return lang === "id" ? `Rp ${val} Ribu` : `Rp ${val}K`;
  }
  return `Rp ${amount.toLocaleString(lang === "id" ? "id-ID" : "en-US")}`;
}
