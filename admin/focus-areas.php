<?php
require_once __DIR__ . '/includes/auth.php';
requireLogin();
$title = 'Focus Areas';
$db = getDB();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $id = $_POST['id'] ?? '';
  $slug = $_POST['slug'] ?? '';
  $label = $_POST['label'] ?? '';
  $title_val = $_POST['title'] ?? '';
  $subtitle = $_POST['subtitle'] ?? '';
  $description = $_POST['description'] ?? '';
  $image = $_POST['image'] ?? '';
  $image_alt = $_POST['image_alt'] ?? '';
  $eyebrow = $_POST['eyebrow'] ?? '';
  $accent = $_POST['accent'] ?? '';
  $sort_order = (int)($_POST['sort_order'] ?? 0);
  $is_active = isset($_POST['is_active']) ? 1 : 0;

  if ($id) {
    $stmt = $db->prepare("UPDATE focus_areas SET slug=?, label=?, title=?, subtitle=?, description=?, image=?, image_alt=?, eyebrow=?, accent=?, sort_order=?, is_active=? WHERE id=?");
    $stmt->execute([$slug, $label, $title_val, $subtitle, $description, $image, $image_alt, $eyebrow, $accent, $sort_order, $is_active, $id]);
    $message = 'Focus area updated.';
  } else {
    $stmt = $db->prepare("INSERT INTO focus_areas (slug, label, title, subtitle, description, image, image_alt, eyebrow, accent, sort_order, is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->execute([$slug, $label, $title_val, $subtitle, $description, $image, $image_alt, $eyebrow, $accent, $sort_order, $is_active]);
    $message = 'Focus area created.';
  }
}

$areas = $db->query("SELECT * FROM focus_areas ORDER BY sort_order")->fetchAll();
$media = $db->query("SELECT * FROM media ORDER BY created_at DESC LIMIT 50")->fetchAll();
require __DIR__ . '/includes/header.php';
?>
<div class="container">
  <div class="flex-between"><h2>Focus Areas</h2><button class="btn btn-primary" onclick="openForm()">+ New Area</button></div>
  <?php if ($message): ?><div class="alert alert-success"><?= htmlspecialchars($message) ?></div><?php endif; ?>

  <div id="area-form" class="card" style="display:none">
    <form method="post" class="form">
      <input type="hidden" name="id" id="edit-id">
      <div class="form-row">
        <div class="form-group"><label>Slug</label><input type="text" name="slug" id="edit-slug" required></div>
        <div class="form-group"><label>Sort Order</label><input type="number" name="sort_order" id="edit-order" min="0"></div>
      </div>
      <div class="form-group"><label>Label</label><input type="text" name="label" id="edit-label" placeholder="Technology" required></div>
      <div class="form-group"><label>Title</label><input type="text" name="title" id="edit-title" placeholder="Technology that opens doors." required></div>
      <div class="form-group"><label>Subtitle</label><input type="text" name="subtitle" id="edit-subtitle" placeholder="Subheading text"></div>
      <div class="form-group"><label>Eyebrow</label><input type="text" name="eyebrow" id="edit-eyebrow" placeholder="Our work · 01"></div>
      <div class="form-group"><label>Accent</label><input type="text" name="accent" id="edit-accent" placeholder="Focus color label"></div>
      <div class="form-group"><label>Description</label><textarea name="description" id="edit-description" rows="4"></textarea></div>
      <div class="form-row">
        <div class="form-group">
          <label>Image</label>
          <div class="img-picker-row">
            <input type="text" name="image" id="edit-image" class="img-picker-input">
            <button type="button" class="btn btn-sm btn-secondary" onclick="openMediaPicker('edit-image')">Browse</button>
          </div>
          <img id="edit-image-preview" class="img-preview" style="display:none" />
        </div>
        <div class="form-group"><label>Image Alt</label><input type="text" name="image_alt" id="edit-image-alt"></div>
      </div>
      <div class="form-group"><label><input type="checkbox" name="is_active" id="edit-active" checked> Active</label></div>
      <div class="form-actions"><button type="submit" class="btn btn-primary">Save</button><button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button></div>
    </form>
  </div>

  <table class="table">
    <thead><tr><th>#</th><th>Image</th><th>Label</th><th>Title</th><th>Eyebrow</th><th>Active</th><th>Actions</th></tr></thead>
    <tbody>
      <?php foreach ($areas as $a): ?>
      <tr>
        <td><?= $a['sort_order'] ?></td>
        <td><img src="<?= htmlspecialchars($a['image'] ?: '/assets/images/logo.png') ?>" style="width:60px;height:40px;object-fit:cover;border-radius:6px" alt=""></td>
        <td><?= htmlspecialchars($a['label']) ?></td>
        <td><?= htmlspecialchars($a['title']) ?></td>
        <td><?= htmlspecialchars($a['eyebrow']) ?></td>
        <td><?= $a['is_active'] ? '✓' : '✗' ?></td>
        <td><button class="btn btn-sm" onclick="editArea(<?= $a['id'] ?>)">Edit</button></td>
      </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>

<div id="media-picker-modal" class="modal" style="display:none">
  <div class="modal-backdrop" onclick="closeMediaPicker()"></div>
  <div class="modal-content">
    <div class="modal-header"><h3>Select Image</h3><button class="btn btn-sm btn-secondary" onclick="closeMediaPicker()">Close</button></div>
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
const areas = <?= json_encode($areas) ?>;
let pickerTarget = '';
function openMediaPicker(t) { pickerTarget = t; document.getElementById('media-picker-modal').style.display = 'block'; }
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
function openForm() {
  ['id','slug','label','title','subtitle','description','image','image_alt','eyebrow','accent','order'].forEach(k => {
    const el = document.getElementById('edit-' + k.replace(/_/g,'-'));
    if (el) el.value = '';
  });
  document.getElementById('edit-active').checked = true;
  document.getElementById('edit-image-preview').style.display = 'none';
  document.getElementById('area-form').style.display = 'block';
}
function closeForm() { document.getElementById('area-form').style.display = 'none'; }
function editArea(id) {
  const a = areas.find(x => x.id === id);
  if (!a) return;
  ['id','slug','label','title','subtitle','description','image','image_alt','eyebrow','accent'].forEach(k => {
    const el = document.getElementById('edit-' + k.replace(/_/g,'-'));
    if (el) el.value = a[k] || '';
  });
  document.getElementById('edit-order').value = a.sort_order || 0;
  document.getElementById('edit-active').checked = a.is_active == 1;
  const preview = document.getElementById('edit-image-preview');
  if (a.image) { preview.src = a.image; preview.style.display = 'block'; } else preview.style.display = 'none';
  document.getElementById('area-form').style.display = 'block';
}
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
