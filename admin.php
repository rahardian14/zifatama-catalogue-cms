<?php
session_start();
// Cek apakah laptop ini punya tiket login
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: login.php");
    exit;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Zifatama</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .admin-container { max-width: 800px; margin: 40px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
        .form-group input, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
        .btn-submit { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="admin-container">
        <h2>Manajemen Buku Zifatama</h2>
        <a href="logout.php" style="background: #dc2626; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">Logout</a>
        
        <form id="adminBookForm">
            <input type="hidden" id="bookId" value=""> 
            
            <div class="form-group">
                <label for="title">Judul Buku</label>
                <input type="text" id="title" placeholder="Tulis Judul Buku..." required>
            </div>
            
           <div class="form-group">
                <label for="author">Penulis (pisahkan dengan koma jika lebih dari satu)</label>
                <input type="text" id="author" placeholder= "Nama Penulis..." required>
            </div>
            
            <div class="form-group">
                <label for="editor">Editor (Kosongkan jika tidak ada)*</label>
                <input type="text" id="editor" placeholder="Nama Editor...">
            </div>

            <div class="form-group">
                <label for="isbn">Nomor ISBN (Opsional)</label>
                <input type="text" id="isbn" placeholder="Contoh: 978-623-8623-95-2">
            </div>
            
            <div class="form-group">
                <label for="category">Kategori</label>
                <input type="text" id="category" placeholder="Genre Buku... (Cth. Bisnis & Manajemen, Ekonomi, Hukum, dll.)" required>
            </div>

            <div class="form-group">
                <label for="harga">Harga</label>
                <input type="text" id="harga" placeholder="Contoh: Rp. 200.000,00" required>
            </div>
            
            <div class="form-group">
                <label for="description">Deskripsi</label>
                <textarea id="description" rows="5" required></textarea>
            </div>

            <div class="form-group">
                <label for="coverImage">Upload Cover Depan (URL/File)</label>
                <input type="file" id="coverImage" placeholder="file harus .PNG" accept="image/*">
            </div>

            <div class="form-group">
                <label for="backCoverImage">Upload Cover Belakang (URL/File)</label>
                <input type="file" id="backCoverImage" placeholder="file harus .PNG" accept="image/*">
            </div>
            
            <div class="form-group" style="display: flex; align-items: center; gap: 10px; background: #eef2f5; padding: 10px; border-radius: 4px;">
                <input type="checkbox" id="isPopular" style="width: 20px; height: 20px; cursor: pointer;">
                <label for="isPopular" style="margin: 0; cursor: pointer; color: #007bff;">⭐ Tampilkan buku ini di Halaman Beranda (Depan)</label>
            </div>

            <button type="submit" class="btn-submit">Simpan Buku</button>
        </form>

        <hr style="margin: 30px 0;">

        <h3>Daftar Buku Saat Ini</h3>
        <table width="100%" border="1" cellspacing="0" cellpadding="10" id="adminBookTable">
            <thead>
                <tr>
                    <th width="35">Id</th>
                    <th width="70">Cover</th>
                    <th>Judul</th>
                    <th>ISBN</th>
                    <th>Kategori</th>
                    <th>Harga</th>
                    <th>Tampil Depan</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                </tbody>
        </table>
    </div>

    <script src="js/admin.js"></script>
</body>
</html>