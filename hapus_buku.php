<?php
// Wajib ditambahkan agar JS tahu responsnya berbentuk JSON
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(["status" => "error", "message" => "Akses Ditolak!"]);
    exit;
}

require 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['id']) && !empty($_POST['id'])) {
        $id = $_POST['id'];

        try {
            // 1. Cari nama file gambar depan dan belakang untuk dihapus
            $stmt = $pdo->prepare("SELECT image_path, image_path_back FROM books WHERE id = ?");
            $stmt->execute([$id]);
            $buku = $stmt->fetch();

            if ($buku) {
                // Hapus cover depan
                if (!empty($buku['image_path']) && file_exists($buku['image_path'])) {
                    unlink($buku['image_path']);
                }
                // Hapus cover belakang (jika ada)
                if (!empty($buku['image_path_back']) && file_exists($buku['image_path_back'])) {
                    unlink($buku['image_path_back']);
                }
            }

            // 2. Hapus data dari database
            $stmtDelete = $pdo->prepare("DELETE FROM books WHERE id = ?");
            
            if ($stmtDelete->execute([$id])) {
                echo json_encode(["status" => "success", "message" => "Buku beserta gambarnya berhasil dihapus"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal menghapus data dari database"]);
            }

        } catch (PDOException $e) {
            // Tangkap error jika buku tidak bisa dihapus karena relasi database (foreign key)
            echo json_encode(["status" => "error", "message" => "Terjadi kesalahan database: " . $e->getMessage()]);
        }

    } else {
        echo json_encode(["status" => "error", "message" => "ID buku tidak ditemukan atau tidak valid"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Metode request tidak diizinkan"]);
}
?>