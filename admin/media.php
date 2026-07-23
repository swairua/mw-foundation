<?php
require_once __DIR__ . '/includes/auth.php';
requireLogin();
$title = 'Media Library';
$db = getDB();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_id'])) {
  $stmt = $db->prepare("SELECT filepath FROM media WHERE id=?");
  $stmt->execute([$_POST['delete_id']]);
  $m = $stmt->fetch();
  if ($m) {
    $localPath = __DIR__ . '/uploads/' . basename($m['filepath']);
    if (file_exists($localPath)) unlink($localPath);
    $stmt = $db->prepare("DELETE FROM media WHERE id=?");
    $stmt->execute([$_POST['delete_id']]);
    $message = 'File deleted.';
  }
}

$media = $db->query("SELECT * FROM media ORDER BY created_at DESC")->fetchAll();
require __DIR__ . '/includes/header.php';
?>
<div class="container">
  <div class="flex-between"><h2>Media Library</h2></div>
  <?php if ($message): ?><div class="alert alert-success"><?= htmlspecialchars($message) ?></div><?php endif; ?>

  <div class="upload-zone" id="dropzone">
    <div class="upload-icon">&#43;</div>
    <p>Drop images here or click to upload</p>
    <p class="text-muted" style="font-size:.75rem">JPG, PNG, WebP, GIF, SVG &mdash; max 10MB</p>
    <input type="file" id="file-input" accept="image/*" multiple style="display:none">
  </div>
  <div class="upload-progress" id="upload-progress" style="display:none">
    <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
    <p class="text-muted" id="progress-text">Uploading...</p>
  </div>

  <div class="media-grid">
    <?php foreach ($media as $m): ?>
    <div class="media-item" data-path="<?= htmlspecialchars($m['filepath']) ?>">
      <img src="<?= htmlspecialchars($m['filepath']) ?>" alt="<?= htmlspecialchars($m['alt_text'] ?: $m['original_name']) ?>" loading="lazy">
      <div class="media-info">
        <span class="media-name" title="<?= htmlspecialchars($m['original_name']) ?>"><?= htmlspecialchars($m['original_name']) ?></span>
        <span class="media-size"><?= $m['file_size'] ? round($m['file_size']/1024, 1) . ' KB' : '-' ?></span>
      </div>
      <div class="media-actions">
        <button class="btn btn-sm btn-secondary" onclick="copyPath('<?= htmlspecialchars($m['filepath']) ?>')">Copy</button>
        <form method="post" style="display:inline" onsubmit="return confirm('Delete this file?')">
          <input type="hidden" name="delete_id" value="<?= $m['id'] ?>">
          <button class="btn btn-sm btn-danger">Delete</button>
        </form>
      </div>
    </div>
    <?php endforeach; ?>
  </div>
</div>

<div id="toast" class="toast" style="display:none"></div>

<script>
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) uploadFiles(fileInput.files);
});

function uploadFiles(files) {
  const prog = document.getElementById('upload-progress');
  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text');
  prog.style.display = 'block';
  let done = 0, total = files.length;

  Array.from(files).forEach(file => {
    const fd = new FormData();
    fd.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.php', true);
    xhr.onload = () => {
      done++;
      fill.style.width = Math.round((done/total)*100) + '%';
      text.textContent = `${done}/${total} uploaded`;
      if (done === total) setTimeout(() => { prog.style.display = 'none'; location.reload(); }, 500);
    };
    xhr.onerror = () => { done++; text.textContent = `Error uploading ${file.name}`; };
    xhr.send(fd);
  });
}

function copyPath(path) {
  navigator.clipboard.writeText(path).then(() => {
    const toast = document.getElementById('toast');
    toast.textContent = 'Path copied: ' + path;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 2000);
  });
}
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
