<?php
require_once __DIR__ . '/config/database.php';
session_start();
if (!empty($_SESSION['admin_user_id'])) redirect('dashboard.php');

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = $_POST['username'] ?? '';
  $password = $_POST['password'] ?? '';
  if ($username && $password) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM admin_users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    if ($user && hash('sha256', $password) === $user['password_hash']) {
      $_SESSION['admin_user_id'] = $user['id'];
      $_SESSION['admin_user'] = $user;
      redirect('dashboard.php');
    } else {
      $error = 'Invalid username or password.';
    }
  } else {
    $error = 'Please enter username and password.';
  }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login — MW Foundation Admin</title>
  <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="login-body">
  <div class="login-container">
    <div class="login-card">
      <h1>Mercy Wanjau Foundation</h1>
      <p class="login-subtitle">Admin Portal</p>
      <?php if ($error): ?><div class="alert alert-error"><?= htmlspecialchars($error) ?></div><?php endif; ?>
      <form method="post">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required autofocus>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Sign In</button>
      </form>
    </div>
  </div>
</body>
</html>
