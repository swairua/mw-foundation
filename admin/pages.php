<?php
require_once __DIR__ . '/includes/auth.php';
requireLogin();
$title = 'Manage Pages';
$db = getDB();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $id = $_POST['id'] ?? '';
  $slug = $_POST['slug'] ?? '';
  $title = $_POST['title'] ?? '';
  $subtitle = $_POST['subtitle'] ?? '';
  $description = $_POST['description'] ?? '';
  $content = $_POST['content'] ?? '';
  $image = $_POST['image'] ?? '';
  $image_alt = $_POST['image_alt'] ?? '';
  $meta_title = $_POST['meta_title'] ?? '';
  $meta_description = $_POST['meta_description'] ?? '';
  $is_published = isset($_POST['is_published']) ? 1 : 0;

  if ($id) {
    $stmt = $db->prepare("UPDATE pages SET slug=?, title=?, subtitle=?, description=?, content=?, image=?, image_alt=?, meta_title=?, meta_description=?, is_published=? WHERE id=?");
    $stmt->execute([$slug, $title, $subtitle, $description, $content, $image, $image_alt, $meta_title, $meta_description, $is_published, $id]);
    $message = 'Page updated.';
  } else {
    $stmt = $db->prepare("INSERT INTO pages (slug, title, subtitle, description, content, image, image_alt, meta_title, meta_description, is_published) VALUES (?,?,?,?,?,?,?,?,?,?)");
    $stmt->execute([$slug, $title, $subtitle, $description, $content, $image, $image_alt, $meta_title, $meta_description, $is_published]);
    $message = 'Page created.';
  }
}

$pages = $db->query("SELECT * FROM pages ORDER BY id")->fetchAll();
$media = $db->query("SELECT * FROM media ORDER BY created_at DESC LIMIT 50")->fetchAll();
require __DIR__ . '/includes/header.php';
?>
<div class="container">
  <div class="flex-between"><h2>Pages</h2></div>
  <?php if ($message): ?><div class="alert alert-success"><?= htmlspecialchars($message) ?></div><?php endif; ?>

  <div class="table-tabs">
    <?php foreach ($pages as $p): ?>
    <button class="tab-btn <?= $p === $pages[0] ? 'active' : '' ?>" onclick="editPage(<?= $p['id'] ?>)"><?= htmlspecialchars($p['slug']) ?></button>
    <?php endforeach; ?>
  </div>

  <div id="page-form" class="card">
    <form method="post" class="form" id="pageForm">
      <input type="hidden" name="id" id="edit-id">
      <div class="form-row">
        <div class="form-group"><label>Slug</label><input type="text" name="slug" id="edit-slug" required></div>
        <div class="form-group"><label>Title</label><input type="text" name="title" id="edit-title" required></div>
      </div>
      <div class="form-group"><label>Subtitle</label><input type="text" name="subtitle" id="edit-subtitle"></div>
      <div class="form-group"><label>Description / Excerpt</label><textarea name="description" id="edit-description" rows="3"></textarea></div>
      <div class="form-group"><label>Content</label><textarea name="content" id="edit-content" rows="8" class="code-textarea"></textarea></div>
      <div class="form-row">
        <div class="form-group">
          <label>Featured Image</label>
          <div class="img-picker-row">
            <input type="text" name="image" id="edit-image" class="img-picker-input" placeholder="/assets/images/...">
            <button type="button" class="btn btn-sm btn-secondary" onclick="openMediaPicker('edit-image')">Browse</button>
          </div>
          <img id="edit-image-preview" class="img-preview" style="display:none" />
        </div>
        <div class="form-group"><label>Image Alt</label><input type="text" name="image_alt" id="edit-image-alt"></div>
      </div>
      <hr>
      <h4 style="margin-bottom:12px;color:#4a5e58">SEO / Meta</h4>
      <div class="form-group"><label>Meta Title</label><input type="text" name="meta_title" id="edit-meta-title"></div>
      <div class="form-group"><label>Meta Description</label><textarea name="meta_description" id="edit-meta-desc" rows="2"></textarea></div>
      <div class="form-group"><label><input type="checkbox" name="is_published" id="edit-published" checked> Published</label></div>
      <div class="form-actions"><button type="submit" class="btn btn-primary">Save</button></div>
    </form>
  </div>
</div>

<div id="media-picker-modal" class="modal" style="display:none">
  <div class="modal-backdrop" onclick="closeMediaPicker()"></div>
  <div class="modal-content">
    <div class="modal-header"><h3>Select Image</h3><button type="button" class="btn btn-sm btn-secondary" onclick="closeMediaPicker()">Close</button></div>
    <div class="modal-body"><div class="media-grid media-grid-sm">
      <?php foreach ($media as $m): ?>
      <div class="media-item" onclick="selectMedia('<?= htmlspecialchars($m['filepath']) ?>')">
        <img src="<?= htmlspecialchars($m['filepath']) ?>" alt="" loading="lazy">
        <div class="media-info"><span class="media-name"><?= htmlspecialchars($m['original_name']) ?></span></div>
      </div>
      <?php endforeach; ?>
    </div></div>
  </div>
</div>

<script>
const pages = <?= json_encode($pages) ?>;
let pickerTarget = '';

function openMediaPicker(targetId) { pickerTarget = targetId; document.getElementById('media-picker-modal').style.display = 'block'; }
function closeMediaPicker() { document.getElementById('media-picker-modal').style.display = 'none'; }
function selectMedia(path) {
  const input = document.getElementById(pickerTarget);
  if (input) { input.value = path; input.dispatchEvent(new Event('input')); }
  const preview = document.getElementById(pickerTarget + '-preview');
  if (preview) { preview.src = path; preview.style.display = 'block'; }
  closeMediaPicker();
}

document.getElementById('edit-image')?.addEventListener('input', function() {
  const preview = document.getElementById('edit-image-preview');
  if (this.value) { preview.src = this.value; preview.style.display = 'block'; } else preview.style.display = 'none';
});

function editPage(id) {
  const p = pages.find(x => x.id === id);
  if (!p) return;
  ['id','slug','title','subtitle','description','content','image','image_alt','meta_title'].forEach(k => {
    const el = document.getElementById('edit-' + k.replace(/_/g,'-'));
    if (el) el.value = p[k] || '';
  });
  document.getElementById('edit-meta-desc').value = p.meta_description || '';
  document.getElementById('edit-published').checked = p.is_published == 1;
  const preview = document.getElementById('edit-image-preview');
  if (p.image) { preview.src = p.image; preview.style.display = 'block'; } else preview.style.display = 'none';
  // Activate tab
  document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
  const tabs = document.querySelectorAll('.tab-btn');
  const idx = pages.findIndex(x => x.id === id);
  if (tabs[idx]) tabs[idx].classList.add('active');
}
// Auto-select first page
if (pages.length) editPage(pages[0].id);
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
