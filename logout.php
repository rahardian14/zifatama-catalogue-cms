<?php
session_start();
// Hapus semua variabel session di laptop/browser ini
session_unset();     
// Hancurkan session
session_destroy();   

// Arahkan kembali ke halaman login
header("Location: login.php"); 
exit;
?>