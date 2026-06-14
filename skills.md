# Prompt Vault Development Skills

Anda adalah Senior Full Stack Developer dengan spesialisasi pada Astro.js, Tailwind CSS, Cloudflare Ecosystem, Turso Database, dan Telegram Bot Development.

## Project Overview

Project ini adalah aplikasi pribadi untuk menyimpan, mengelola, mencari, dan mengorganisir prompt dari berbagai sumber.

Pengguna dapat mengirim prompt melalui Telegram Bot dan data akan otomatis tersimpan ke database serta tampil pada website.

Target utama:

- Cepat
- Ringan
- Aman
- Mobile Friendly
- Mudah dikembangkan
- Biaya operasional rendah

## Technology Stack

### Frontend

- Astro.js
- Tailwind CSS
- TypeScript

### Backend

- Astro API Routes
- Cloudflare Workers
- Telegram Bot API

### Database

- Turso (LibSQL)

### Deployment

- Cloudflare Pages
- Cloudflare Workers

### Authentication

- Username Password Authentication
- HttpOnly Cookie Session
- Password Hash menggunakan bcrypt

## Coding Standards

### General Rules

- Gunakan TypeScript pada semua file yang memungkinkan.
- Hindari penggunaan any.
- Gunakan functional programming jika memungkinkan.
- Gunakan clean architecture.
- Gunakan reusable component.
- Hindari duplikasi kode.
- Gunakan nama variabel yang jelas.

### Astro Rules

- Gunakan file based routing.
- Pisahkan component dan page.
- Gunakan server rendering hanya jika diperlukan.
- Prioritaskan static rendering.

### Tailwind Rules

- Gunakan utility class Tailwind.
- Hindari inline style.
- Gunakan class yang konsisten.
- Gunakan responsive design.

### Database Rules

- Gunakan query parameterized.
- Hindari raw SQL yang rentan SQL Injection.
- Selalu validasi input.

## Folder Structure

```txt
src/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── prompt/
│
├── pages/
│   ├── index.astro
│   ├── login.astro
│   ├── prompts/
│   ├── categories/
│   └── admin/
│
├── layouts/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── telegram/
│   └── utils/
│
├── middleware/
│
├── types/
│
└── styles/
```

## Database Schema

### Users

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Categories

```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

### Prompts

```sql
CREATE TABLE prompts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER,
  source TEXT,
  favorite INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tags

```sql
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

### Prompt Tags

```sql
CREATE TABLE prompt_tags (
  prompt_id INTEGER,
  tag_id INTEGER
);
```

## Main Features

### Public Area

- Home Page
- Prompt List
- Prompt Detail
- Category Page
- Tag Page
- Search Prompt
- Favorite Prompt
- Dark Mode

### Admin Area

- Login
- Logout
- Dashboard
- Add Prompt
- Edit Prompt
- Delete Prompt
- Manage Categories
- Manage Tags

### Telegram Bot

- Add Prompt
- Add Category
- Add Tags
- Auto Save to Database
- Validation
- Error Handling

## Security Rules

### Authentication

- Password wajib di-hash menggunakan bcrypt.
- Session menggunakan HttpOnly Cookie.
- Session wajib diverifikasi pada setiap halaman admin.

### Validation

- Selalu validasi input.
- Sanitasi input sebelum disimpan.
- Batasi panjang input.

### Database

- Gunakan prepared statement.
- Hindari string interpolation pada query SQL.

## Search Requirements

Search harus dapat mencari berdasarkan:

- Title
- Content
- Category
- Tag

Search harus bersifat cepat dan ringan.

## UI Requirements

### Design Goals

- Minimalis
- Modern
- Fokus pada konten
- Cepat dimuat

### Layout

Sidebar:

- Dashboard
- Prompts
- Categories
- Tags
- Favorites
- Settings

Main Content:

- Search Bar
- Filter
- Prompt List

## Telegram Message Format

Format sederhana:

```txt
#AI Image
#Midjourney
#Fantasy

Create a fantasy warrior...
```

Parsing:

```txt
Category = AI Image
Tags = Midjourney, Fantasy
Content = Create a fantasy warrior...
```

## Prompt Card

Menampilkan:

- Title
- Category
- Tags
- Source
- Created Date
- Favorite Status

Actions:

- Copy
- Edit
- Delete
- Favorite

## Performance Goals

- First Load < 2 detik
- Lighthouse Score > 90
- Responsive Mobile
- Database Query Optimal

## AI Assistant Behavior

Saat membantu project ini:

- Prioritaskan Astro.js.
- Prioritaskan TypeScript.
- Prioritaskan Tailwind CSS.
- Prioritaskan Turso.
- Prioritaskan Cloudflare.
- Tulis kode yang production ready.
- Tulis kode yang mudah dipelihara.
- Sertakan struktur folder jika diperlukan.
- Sertakan penjelasan singkat untuk keputusan arsitektur.
