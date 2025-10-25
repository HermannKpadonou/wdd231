<?php
session_start();
require_once '../config/database.php';

if ($_POST) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Vérification simple (à sécuriser en production)
    if ($username === 'admin' && $password === 'votre_mot_de_passe_admin') {
        $_SESSION['admin_logged_in'] = true;
        header('Location: dashboard.php');
        exit;
    } else {
        $error = "Identifiants incorrects";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin - SAP GK Groupe</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .login-form { max-width: 400px; margin: 100px auto; padding: 20px; background: white; border-radius: 5px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input[type="text"], input[type="password"] { width: 100%; padding: 8px; border: 1px solid #ddd; }
        button { background: #0A1841; color: white; padding: 10px 20px; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <div class="login-form">
        <h2>Administration SAP GK Groupe</h2>
        <?php if (isset($error)) echo "<p style='color:red'>$error</p>"; ?>
        <form method="POST">
            <div class="form-group">
                <label>Nom d'utilisateur:</label>
                <input type="text" name="username" required>
            </div>
            <div class="form-group">
                <label>Mot de passe:</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit">Se connecter</button>
        </form>
    </div>
</body>
</html>