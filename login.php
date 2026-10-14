<?php
session_start();

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header("Location: admin.php");
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $admin_user = 'admin_demo';          
    $admin_pass = 'demo123';   

    if ($username === $admin_user && $password === $admin_pass) {
        $_SESSION['admin_logged_in'] = true;
        header("Location: admin.php");
        exit;
    } else {
        $error = 'Username atau Password salah!';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - Zifatama</title>
    <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Work Sans', sans-serif;
            background-image: url('img/background.jpg'); /* Gambar latar belakang */
            background-size: cover; /* Membuat gambar menutupi seluruh area */
            background-position: center; /* Posisi gambar di tengah */
            background-attachment: fixed; /* Membuat gambar latar tidak ikut scroll */
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .login-card {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 350px;
            text-align: center;
        }
        .login-card img { max-width: 150px; margin-bottom: 20px; }
        .login-card h2 { margin-top: 0; color: #333; margin-bottom: 20px; }
        .form-group { margin-bottom: 15px; text-align: left; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 500; color: #555;}
        .form-group input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-family: 'Work Sans', sans-serif;}
        .btn-login { background: #007bff; color: white; border: none; padding: 12px; width: 100%; border-radius: 4px; font-weight: 600; cursor: pointer; transition: 0.3s; font-family: 'Work Sans', sans-serif; font-size: 16px;}
        .btn-login:hover { background: #0056b3; }
        .error-msg { background: #fee2e2; color: #dc2626; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 14px; font-weight: 500;}
    </style>
</head>
<body>

    <div class="login-card">
        <img src="img/logo.png" alt="Zifatama Logo">
        <h2>Panel Admin</h2>
        
        <?php if($error): ?>
            <div class="error-msg"><?php echo $error; ?></div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" required autocomplete="off">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" class="btn-login">Masuk</button>
        </form>
    </div>

</body>
</html>