<?php

require_once __DIR__ . '/../config/database.php';

session_start();

function isLoggedIn(): bool {
  return !empty($_SESSION['admin_user_id']);
}

function requireLogin(): void {
  if (!isLoggedIn()) {
    redirect('login.php');
  }
}

function currentUser(): ?array {
  return isset($_SESSION['admin_user']) ? $_SESSION['admin_user'] : null;
}

function hasRole(string $role): bool {
  $user = currentUser();
  return $user && $user['role'] === $role;
}
