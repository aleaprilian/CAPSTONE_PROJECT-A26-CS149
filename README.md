# CAPSTONE PROJECT — A26-CS149 (RoyalStore)

**Sistem Manajemen dan Pencatatan Stok Pakaian Berbasis Digital — Royal Thrift Store**  
Program **Asah 2026** *led by Dicoding supported by GoTo*

---

## Anggota Tim (`roadtogoto`)

| ID | Nama | Learning Path |
| :--- | :--- | :--- |
| `FS308B6Y0130` | Ale Aprilian Putra Anton | AI Full-Stack Developer |
| `FS308B6X0874` | Kenhairani Baeha | AI Full-Stack Developer |
| `FS308B6X1703` | T. Syarifah Gita Azzahra | AI Full-Stack Developer |
| `AE308B6X1332` | Nasywa Razhan Deethia | Next-Gen AI Engineer |
| `AE704B6Y1785` | Yanuarizal Kurnia | Next-Gen AI Engineer |
| `DS200B6Y1593` | Rizky Andrian | Data Science Specialist |

---

## Alur Branching (`Git Workflow`)

- **`main`** — Branch stabil siap demo / rilis (dilindungi, hanya menerima *merge* dari `dev`).
- **`dev`** — Branch integrasi utama tempat seluruh fitur FE, BE, AI, dan DS digabungkan & diuji bersama.
- **`feat/<nama-fitur>`** / **`fix/<nama-perbaikan>`** — Branch kerja per tugas yang dibuat dari `dev`, lalu digabung kembali ke `dev` melalui *Pull Request*.

### Contoh Alur Kerja Harian
```bash
git checkout dev
git pull origin dev
git checkout -b feat/nama-fitur
# ... kerjakan & commit ...
git push -u origin feat/nama-fitur
# Buat Pull Request ke branch dev di GitHub
```
