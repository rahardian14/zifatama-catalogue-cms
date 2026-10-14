# Zifatama Digital Catalog & Custom CMS

Sebuah platform web komprehensif untuk penerbit Zifatama, dirancang untuk mengelola katalog buku secara mandiri dan menyajikan informasi produk kepada pelanggan. Sistem ini dibangun dengan fokus pada efisiensi manajemen konten (*backend*) dan antarmuka pengguna yang bersih (*frontend*).

## FITUR UTAMA

### 1. Sistem Manajemen Konten (Admin Panel)
*   **Autentikasi Aman:** Menggunakan sistem *session* PHP untuk memastikan hanya administrator yang dapat mengakses *dashboard*.
*   **Operasi CRUD Dinamis:** Kemampuan untuk menambah, mengedit, dan menghapus data buku yang terhubung langsung ke basis data.
*   **Manajemen Aset:** Logika *backend* yang menangani pengunggahan file gambar secara aman untuk sampul depan dan belakang buku ke dalam direktori server.
*   **Visibilitas Konten:** Fitur *toggle* "Tampil Depan" (`is_popular`) untuk menentukan buku mana yang muncul di beranda utama.

### 2. Frontend & Pengalaman Pengguna (Public Interface)
*   **Katalog Terintegrasi:** Data buku diambil dari *backend* dan dikonversi menjadi format JSON untuk dirender secara dinamis di *frontend*.
*   **Sistem Pencarian Cerdas:** Pengguna dapat mencari buku secara spesifik berdasarkan judul, kategori, maupun nomor ISBN.
*   **Navigasi Produk:** Detail buku menyediakan informasi komprehensif dengan Call-to-Action (CTA) interaktif untuk proses penyewaan atau pembelian.

## TECH STACK
*   **Backend:** PHP (Native), PDO (PHP Data Objects) untuk interaksi basis data yang aman.
*   **Frontend:** HTML5, CSS3 kustom, JavaScript (Vanilla).
*   **Database:** MySQL / MariaDB.

## Arsitektur Logika (Cuplikan Kode)
Sistem ini menggunakan metode parameterisasi (Prepared Statements) pada PDO untuk mencegah serangan *SQL Injection* saat admin memasukkan data buku baru (termasuk ISBN, Harga, dan Deskripsi). 

```php
// Contoh penanganan data buku baru
$sql = "INSERT INTO books (title, author, editor, isbn, category, harga, description, image_path, image_path_back, is_popular) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt =$pdo->prepare($sql);$stmt->execute([$title,$author, $editor,$isbn, $category,$harga, $description,$image_path, $image_path_back,$is_popular]);
```

## Kontak & Demo
Karena alasan privasi klien, basis data asli tidak disertakan. Jika Anda adalah perekrut yang ingin melihat demonstrasi sistem localhost atau membahas rancangan arsitektur database (ERD) proyek ini lebih lanjut, silakan hubungi saya melalui email di rahardiandewantoro190@gmail.com.
