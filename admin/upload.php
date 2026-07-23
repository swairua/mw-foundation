<?php
require_once __DIR__ . '/includes/auth.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_FILES['file'])) {
  http_response_code(400);
  echo json_encode(['error' => 'No file uploaded']);
  exit;
}

$file = $_FILES['file'];
$allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
$maxSize = 10 * 1024 * 1024; // 10MB

if ($file['error'] !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(['error' => 'Upload error code: ' . $file['error']]);
  exit;
}

if ($file['size'] > $maxSize) {
  http_response_code(400);
  echo json_encode(['error' => 'File too large (max 10MB)']);
  exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime, $allowed)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid file type. Allowed: jpg, png, webp, gif, svg']);
  exit;
}

$ext = match ($mime) {
  'image/jpeg' => 'jpg',
  'image/png' => 'png',
  'image/webp' => 'webp',
  'image/gif' => 'gif',
  'image/svg+xml' => 'svg',
  default => 'jpg',
};

$filename = uniqid('img_') . '_' . time() . '.' . $ext;
$destPath = __DIR__ . '/uploads/' . $filename;
$webPath = '/admin/uploads/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to save file']);
  exit;
}

$db = getDB();
$stmt = $db->prepare("INSERT INTO media (filename, original_name, filepath, mime_type, file_size) VALUES (?,?,?,?,?)");
$stmt->execute([$filename, $file['name'], $webPath, $mime, $file['size']]);

$id = $db->lastInsertId();

echo json_encode([
  'id' => $id,
  'filename' => $filename,
  'original_name' => $file['name'],
  'filepath' => $webPath,
  'mime_type' => $mime,
  'file_size' => $file['size'],
]);
