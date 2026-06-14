# Build Prompt Vault Application

Baca dan patuhi seluruh isi file skills.md dan design.md sebelum menulis kode apa pun.

Anda bertindak sebagai Senior Full Stack Engineer yang bertanggung jawab membangun aplikasi Prompt Vault production-ready.

Tujuan aplikasi adalah menyimpan, mengelola, mencari, dan mengorganisir prompt pribadi dari berbagai sumber.

Prompt dapat ditambahkan melalui Dashboard Admin maupun Telegram Bot.

Tech Stack wajib:

* Astro.js
* TypeScript
* Tailwind CSS
* Turso Database
* Cloudflare Pages
* Cloudflare Workers
* Telegram Bot API

Jangan menggunakan framework lain kecuali benar-benar diperlukan.

Authentication menggunakan:

* Username
* Password
* bcrypt password hashing
* HttpOnly Cookie Session

Jangan menggunakan:

* Google Login
* GitHub Login
* Clerk
* Auth0
* Firebase Auth

Prioritaskan:

* Clean Architecture
* Reusable Components
* Type Safety
* Performance
* Security
* Accessibility

Tahapan pengerjaan wajib dilakukan secara berurutan.

Tahap 1

Inisialisasi project Astro menggunakan TypeScript dan Tailwind CSS.

Buat struktur folder sesuai skills.md.

Pastikan seluruh folder dan file dasar sudah tersedia.

Tahap 2

Implementasikan konfigurasi Turso Database.

Buat:

* database client
* environment configuration
* database helper
* migration folder

Tahap 3

Buat schema database.

Tabel:

* users
* prompts
* categories
* tags
* prompt_tags

Sertakan migration SQL.

Tahap 4

Implementasikan Authentication System.

Fitur:

* login
* logout
* session validation
* middleware protection
* bcrypt password verification

Tahap 5

Buat Dashboard Layout.

Dashboard harus memiliki:

* Sidebar
* Header
* Search Bar
* Responsive Navigation

Tahap 6

Implementasikan Prompt CRUD.

Fitur:

* Create Prompt
* Read Prompt
* Update Prompt
* Delete Prompt
* Favorite Prompt

Gunakan server actions atau API routes yang paling sesuai dengan Astro.

Tahap 7

Implementasikan Category Management.

Fitur:

* Create Category
* Edit Category
* Delete Category

Tahap 8

Implementasikan Tag Management.

Fitur:

* Create Tag
* Edit Tag
* Delete Tag

Tahap 9

Implementasikan Search Engine.

Pencarian harus mendukung:

* title
* content
* category
* tag

Optimalkan query database.

Tahap 10

Implementasikan Telegram Integration.

Buat:

* webhook endpoint
* telegram parser
* database insertion service

Format pesan Telegram:

#Category
#Tag1
#Tag2

Isi Prompt

Parser harus otomatis memisahkan category, tags, dan content.

Tahap 11

Implementasikan Public Pages.

Halaman:

* Home
* Prompt List
* Prompt Detail
* Categories
* Tags
* Favorites

Tahap 12

Implementasikan Dark Mode.

Gunakan Tailwind CSS.

Tahap 13

Optimasi Project.

Lakukan:

* code cleanup
* remove duplication
* improve accessibility
* improve performance
* improve security

Setiap kali menyelesaikan satu tahap:

1. Jelaskan file yang dibuat.
2. Jelaskan alasan arsitektur yang digunakan.
3. Tampilkan struktur folder terbaru.
4. Tunggu instruksi sebelum lanjut ke tahap berikutnya.

Jangan mengerjakan seluruh project sekaligus.

Kerjakan satu tahap pada satu waktu.

Semua kode harus production-ready.

Semua kode harus menggunakan TypeScript.

Semua input harus divalidasi.

Semua query database harus aman dari SQL Injection.

Jika ada keputusan teknis yang ambigu, pilih solusi yang paling sederhana, aman, dan mudah dipelihara.

