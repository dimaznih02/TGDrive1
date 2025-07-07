# Google Drive Clone

Sebuah aplikasi web yang meniru tampilan dan fungsi Google Drive asli, dibuat dengan HTML, CSS, dan JavaScript murni.

## Fitur Utama

### 🎨 Design yang Autentik
- Interface yang identik dengan Google Drive asli
- Font Google Sans dan Material Icons
- Warna dan spacing yang akurat
- Animasi dan hover effects yang smooth

### 🧭 Navigasi Lengkap
- **Beranda** - Halaman utama dengan file dan folder yang disarankan
- **Drive Saya** - Tampilan folder dan file pribadi
- **Drive Bersama** - Daftar drive yang dibagikan dengan tim
- **Terbaru** - File yang baru diakses
- **Berbintang** - File yang ditandai
- **Sampah** - File yang dihapus
- **Penyimpanan** - Informasi penggunaan storage

### 🔍 Pencarian dan Filter
- Search box di header yang berfungsi real-time
- Filter berdasarkan jenis file, pemilik, tanggal modifikasi
- Hasil pencarian yang diupdate secara dinamis

### 👀 Multiple View Modes
- **List View** - Tampilan tabel dengan kolom detail
- **Grid View** - Tampilan grid card untuk file dan folder
- Toggle view dengan tombol di header

### 📱 Responsive Design
- Layout yang adaptif untuk desktop, tablet, dan mobile
- Sidebar yang dapat disembunyikan di mobile
- Touch-friendly interface untuk perangkat mobile

### ⚡ Interaktivitas
- Klik file untuk membuka (simulasi)
- Menu "Baru" dengan opsi upload dan create dokumen
- Hover effects dan visual feedback
- Smooth transitions dan animations

## Struktur File

```
├── index.html          # Struktur utama HTML
├── styles.css          # Semua styling CSS
├── script.js           # Logika JavaScript dan interaktivitas
└── README.md          # Dokumentasi ini
```

## Cara Menjalankan

1. **Download semua file** ke dalam satu folder
2. **Buka index.html** di web browser
3. **Nikmati pengalaman** Google Drive yang identik!

### Alternatif dengan Live Server
Jika menggunakan VS Code:
1. Install extension "Live Server"
2. Right-click pada `index.html`
3. Pilih "Open with Live Server"

## Data Mock

Aplikasi menggunakan data mock untuk simulasi:
- **10 file contoh** dengan berbagai jenis (notebook, gambar)
- **13 folder** dengan informasi pemilik dan tanggal
- **10 shared drives** dengan detail anggota

## Teknologi yang Digunakan

- **HTML5** - Struktur semantik modern
- **CSS3** - Flexbox, Grid, Custom Properties, Animations
- **Vanilla JavaScript** - ES6+, DOM manipulation, Event handling
- **Google Fonts** - Google Sans typography
- **Material Icons** - Icon set resmi Google

## Fitur Detail

### Header
- Logo Google Drive dengan ikon SVG
- Search bar yang responsif dengan focus states
- Profile menu dan navigation icons
- Hamburger menu untuk mobile

### Sidebar
- Tombol "Baru" dengan shadow dan hover effects
- Navigasi dengan active states
- Storage indicator dengan progress bar
- Rounded navigation items sesuai Material Design

### Main Content
- Dynamic content switching berdasarkan navigasi
- File dan folder cards dengan hover effects
- Sortable table headers (UI only)
- Load more functionality

### Mobile Experience
- Collapsible sidebar dengan smooth animations
- Touch-optimized button sizes
- Responsive grid layouts
- Optimized typography scaling

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+

## Kustomisasi

Aplikasi dapat dikustomisasi dengan mudah:

### Mengubah Warna
Edit CSS custom properties di `:root`:
```css
:root {
  --primary-color: #1a73e8;
  --background-color: #fff;
  --text-color: #202124;
}
```

### Menambah Data
Edit array `mockFiles`, `mockFolders`, atau `sharedDrives` di `script.js`

### Mengubah Layout
Modifikasi grid templates di CSS untuk mengubah proporsi kolom

## Kontribusi

Aplikasi ini dibuat sebagai demonstrasi kemampuan frontend dan dapat dikembangkan lebih lanjut dengan:
- Backend integration
- Real file upload/download
- User authentication
- File sharing functionality
- Collaborative editing

## Lisensi

MIT License - Feel free to use and modify as needed.

---

*Dibuat dengan ❤️ untuk mendemonstrasikan kemampuan frontend development*
