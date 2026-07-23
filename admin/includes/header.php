<?php requireLogin(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $title ?? 'Admin' ?> — MW Foundation</title>
  <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
  <nav class="admin-nav">
    <div class="nav-inner">
      <a href="dashboard.php" class="nav-brand">MWF Admin</a>
      <div class="nav-links">
        <a href="dashboard.php">Dashboard</a>
        <a href="pages.php">Pages</a>
        <a href="focus-areas.php">Focus Areas</a>
        <a href="highlights.php">Highlights</a>
        <a href="news.php">News</a>
        <a href="media.php">Media</a>
        <a href="hero-slider.php">Hero Slider</a>
        <a href="settings.php">Settings</a>
        <a href="seed.php">Seed</a>
        <a href="logout.php" class="nav-logout">Logout</a>
      </div>
    </div>
  </nav>
  <main class="admin-main">
