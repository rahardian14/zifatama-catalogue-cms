<?php
header('Content-Type: application/json');
session_start();

// Proteksi agar hanya admin yang bisa memproses
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(["status" => "error", "message" => "Akses Ditolak!"]); 
    exit;
}

require 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    $title = $_POST['title'];
    $author = $_POST['author'];
    $editor = empty($_POST['editor']) ? NULL : $_POST['editor'];
    
    // MENANGKAP ISBN
    $isbn = empty($_POST['isbn']) ? NULL : $_POST['isbn'];
    
    $category = $_POST['category'];
    $harga = $_POST['harga'];
    $description = $_POST['description'];
    
    $is_popular = (isset($_POST['is_popular']) && $_POST['is_popular'] === 'true') ? 1 : 0;
    
    // 1. Proses Cover Depan
    $image_path = null;
    if (isset($_FILES['coverImage']) && $_FILES['coverImage']['error'] == 0) {
        $target_dir = "img/Buku/";
        if (!is_dir($target_dir)) mkdir($target_dir, 0777, true);
        $fileName = time() . "_depan_" . str_replace(' ', '_', basename($_FILES["coverImage"]["name"]));
        $target_file = $target_dir . $fileName; 
        if(move_uploaded_file($_FILES["coverImage"]["tmp_name"], $target_file)){
            $image_path = $target_file;
        }
    }

    // 2. Proses Cover Belakang
    $image_path_back = null;
    if (isset($_FILES['backCoverImage']) && $_FILES['backCoverImage']['error'] == 0) {
        $target_dir = "img/Buku/";
        if (!is_dir($target_dir)) mkdir($target_dir, 0777, true);
        $fileNameBack = time() . "_belakang_" . str_replace(' ', '_', basename($_FILES["backCoverImage"]["name"]));
        $target_file_back = $target_dir . $fileNameBack; 
        if(move_uploaded_file($_FILES["backCoverImage"]["tmp_name"], $target_file_back)){
            $image_path_back = $target_file_back;
        }
    }

    try {
        if ($id) {
            // LOGIKA UPDATE (TAMBAHKAN ISBN)
            $updateFields = ["title=?", "author=?", "editor=?", "isbn=?", "category=?", "harga=?", "description=?", "is_popular=?"];
            $params = [$title, $author, $editor, $isbn, $category, $harga, $description, $is_popular];

            if ($image_path) {
                $updateFields[] = "image_path=?";
                $params[] = $image_path;
            }
            if ($image_path_back) {
                $updateFields[] = "image_path_back=?";
                $params[] = $image_path_back;
            }
            
            $params[] = $id;
            
            $sql = "UPDATE books SET " . implode(", ", $updateFields) . " WHERE id=?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $pesan = "Buku berhasil diupdate";
            
        } else {
            // LOGIKA INSERT BUKU BARU (TAMBAHKAN ISBN)
            $sql = "INSERT INTO books (title, author, editor, isbn, category, harga, description, image_path, image_path_back, is_popular) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$title, $author, $editor, $isbn, $category, $harga, $description, $image_path, $image_path_back, $is_popular]);
            $pesan = "Buku berhasil ditambahkan";
        }
        
        echo json_encode(["status" => "success", "message" => $pesan]);
        
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
    }
}
?>