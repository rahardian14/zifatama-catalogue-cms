<?php
header('Content-Type: application/json');
require 'koneksi.php';

try {
    $stmt = $pdo->query("SELECT * FROM books ORDER BY id DESC");
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Pastikan path image menjadi array agar cocok dengan script.js bawaanmu
    foreach ($books as &$book) {
        $book['image'] = [$book['image_path']];
    }

    echo json_encode($books);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>