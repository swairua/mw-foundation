<?php
require_once __DIR__ . '/includes/auth.php';
requireLogin();
$title = 'Hero Slider';
$db = getDB();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $action = $_POST['action'] ?? '';
  if ($action === 'save' || $action === 'update') {
    $id = $_POST['id'] ?? '';
    $image = $_POST['image'] ?? '';
    $image_alt = $_POST['image_alt'] ?? '';
    $headline = $_POST['headline'] ?? '';
    $subheadline = $_POST['subheadline'] ?? '';
    $button_text = $_POST['button_text'] ?? '';
    $button_url = $_POST['button_url'] ?? '';
    $overlay_opacity = (float)($_POST['overlay_opacity'] ?? 0.6);
    $sort_order = (int)($_POST['sort_order'] ?? 0);
    $is_active = isset($_POST['is_active']) ? 1 : 0;

    if ($id) {
      $stmt = $db->prepare("UPDATE hero_slides SET image=?, image_alt=?, headline=?, subheadline=?, button_text=?, button_url=?, overlay_opacity=?, sort_order=?, is_active=? WHERE id=?");
      $stmt->execute([$image, $image_alt, $headline, $subheadline, $button_text, $button_url, $overlay_opacity, $sort_order, $is_active, $id]);
      $message = 'Slide updated.';
    } else {
      $stmt = $db->prepare("INSERT INTO hero_slides (image, image_alt, headline, subheadline, button_text, button_url, overlay_opacity, sort_order, is_active) VALUES (?,?,?,?,?,?,?,?,?)");
      $stmt->execute([$image, $image_alt, $headline, $subheadline, $button_text, $button_url, $overlay_opacity, $sort_order, $is_active]);
      $message = 'Slide created.';
    }
  } elseif ($action === 'delete' && !empty($_POST['id'])) {
    $stmt = $db->prepare("DELETE FROM hero_slides WHERE id=?");
    $stmt->execute([$_POST['id']]);
    $message = 'Slide deleted.';
  } elseif ($action === 'reorder' && !empty($_POST['order'])) {
    $order = json_decode($_POST['order'], true);
    if (is_array($order)) {
      foreach ($order as $i => $id) {
        $stmt = $db->prepare("UPDATE hero_slides SET sort_order=? WHERE id=?");
        $stmt->execute([$i + 1, $id]);
      }
      $message = 'Order updated.';
    }
  }
}

$slides = $db->query("SELECT * FROM hero_slides ORDER BY sort_order")->fetchAll();
$media = $db->query("SELECT * FROM media ORDER BY created_at DESC LIMIT 50")->fetchAll();
require __DIR__ . '/includes/header.php';
?>
<div class="container">
  <div class="flex-between"><h2>Hero Slider</h2><button class="btn btn-primary" onclick="openSlideForm()">+ Add Slide</button></div>
  <?php if ($message): ?><div class="alert alert-success"><?= htmlspecialchars($message) ?></div><?php endif; ?>

  <div id="slide-form" class="card" style="display:none">
    <form method="post" class="form" id="slideForm">
      <input type="hidden" name="action" id="form-action" value="save">
      <input type="hidden" name="id" id="edit-id">
      <div class="form-group">
        <label>Background Image</label>
        <div class="img-picker-row">
          <input type="text" name="image" id="edit-image" class="img-picker-input" placeholder="/assets/images/..." required>
          <button type="button" class="btn btn-sm btn-secondary" onclick="openMediaPicker('edit-image')">Browse</button>
        </div>
        <img id="edit-image-preview" class="img-preview" style="display:none" />
      </div>
      <div class="form-row">
        <div class="form-group"><label>Image Alt Text</label><input type="text" name="image_alt" id="edit-image-alt"></div>
        <div class="form-group"><label>Sort Order</label><input type="number" name="sort_order" id="edit-order" min="0" value="0"></div>
      </div>
      <div class="form-group"><label>Headline</label><input type="text" name="headline" id="edit-headline" placeholder="A future where everyone belongs."></div>
      <div class="form-group"><label>Subheadline</label><textarea name="subheadline" id="edit-subheadline" rows="2" placeholder="Building stronger communities..."></textarea></div>
      <div class="form-row">
        <div class="form-group"><label>Button Text (optional)</label><input type="text" name="button_text" id="edit-btn-text" placeholder="Explore our work"></div>
        <div class="form-group"><label>Button URL</label><input type="text" name="button_url" id="edit-btn-url" placeholder="/our-work"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Overlay Opacity (0.00 - 1.00)</label><input type="number" name="overlay_opacity" id="edit-opacity" step="0.05" min="0" max="1" value="0.60"></div>
        <div class="form-group" style="padding-top:24px"><label><input type="checkbox" name="is_active" id="edit-active" checked> Active</label></div>
      </div>
      <div class="form-actions"><button type="submit" class="btn btn-primary">Save</button><button type="button" class="btn btn-secondary" onclick="closeSlideForm()">Cancel</button></div>
    </form>
  </div>

  <div class="card">
    <div class="flex-between"><h3 style="font-size:1rem">Slides</h3></div>
    <div class="slide-list" id="slide-list">
      <?php foreach ($slides as $s): ?>
      <div class="slide-row" data-id="<?= $s['id'] ?>">
        <div class="slide-drag" title="Drag to reorder">⠿</div>
        <div class="slide-preview"><img src="<?= htmlspecialchars($s['image']) ?>" alt=""></div>
        <div class="slide-info">
          <strong><?= htmlspecialchars($s['headline'] ?: '[No headline]') ?></strong>
          <span class="text-muted">Order: <?= $s['sort_order'] ?> · <?= $s['is_active'] ? 'Active' : 'Inactive' ?></span>
        </div>
        <div class="slide-actions">
          <button class="btn btn-sm" onclick="editSlide(<?= $s['id'] ?>)">Edit</button>
          <form method="post" style="display:inline" onsubmit="return confirm('Delete this slide?')">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= $s['id'] ?>">
            <button class="btn btn-sm btn-danger">Delete</button>
          </form>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
    <form method="post" id="reorder-form"><input type="hidden" name="action" value="reorder"><input type="hidden" name="order" id="slide-order-input"></form>
  </div>
</div>

<div id="media-picker-modal" class="modal" style="display:none">
  <div class="modal-backdrop" onclick="closeMediaPicker()"></div>
  <div class="modal-content">
    <div class="modal-header"><h3>Select Image</h3><button type="button" class="btn btn-sm btn-secondary" onclick="closeMediaPicker()">Close</button></div>
    <div class="modal-body">
      <div class="media-grid media-grid-sm">
        <?php foreach ($media as $m): ?>
        <div class="media-item" onclick="selectMedia('<?= htmlspecialchars($m['filepath']) ?>')">
          <img src="<?= htmlspecialchars($m['filepath']) ?>" alt="" loading="lazy">
          <div class="media-info"><span class="media-name"><?= htmlspecialchars($m['original_name']) ?></span></div>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</div>

<script>
const slides = <?= json_encode($slides) ?>;
let pickerTarget = '';

function openSlideForm() {
  document.getElementById('form-action').value = 'save';
  ['id','image','image-alt','headline','subheadline','btn-text','btn-url','order','opacity','image-alt'].forEach(k => {
    const el = document.getElementById('edit-' + k.replace(/_/g,'-'));
    if (el) el.value = '';
  });
  document.getElementById('edit-active').checked = true;
  document.getElementById('edit-image-preview').style.display = 'none';
  document.getElementById('slide-form').style.display = 'block';
}

function closeSlideForm() { document.getElementById('slide-form').style.display = 'none'; }

function editSlide(id) {
  const s = slides.find(x => x.id === id);
  if (!s) return;
  document.getElementById('form-action').value = 'update';
  document.getElementById('edit-id').value = s.id;
  document.getElementById('edit-image').value = s.image || '';
  document.getElementById('edit-image-alt').value = s.image_alt || '';
  document.getElementById('edit-headline').value = s.headline || '';
  document.getElementById('edit-subheadline').value = s.subheadline || '';
  document.getElementById('edit-btn-text').value = s.button_text || '';
  document.getElementById('edit-btn-url').value = s.button_url || '';
  document.getElementById('edit-order').value = s.sort_order || 0;
  document.getElementById('edit-opacity').value = s.overlay_opacity || 0.6;
  document.getElementById('edit-active').checked = s.is_active == 1;
  const preview = document.getElementById('edit-image-preview');
  if (s.image) { preview.src = s.image; preview.style.display = 'block'; }
  document.getElementById('slide-form').style.display = 'block';
}

function openMediaPicker(targetId) {
  pickerTarget = targetId;
  document.getElementById('media-picker-modal').style.display = 'block';
}
function closeMediaPicker() { document.getElementById('media-picker-modal').style.display = 'none'; }
function selectMedia(path) {
  const input = document.getElementById(pickerTarget);
  if (input) { input.value = path; input.dispatchEvent(new Event('input')); }
  const preview = document.getElementById(pickerTarget + '-preview');
  if (preview) { preview.src = path; preview.style.display = 'block'; }
  closeMediaPicker();
}

// Image preview on input change
document.getElementById('edit-image')?.addEventListener('input', function() {
  const preview = document.getElementById('edit-image-preview');
  if (this.value) { preview.src = this.value; preview.style.display = 'block'; }
  else preview.style.display = 'none';
});

// Drag reorder
let dragSrc = null;
document.querySelectorAll('.slide-row').forEach(row => {
  row.addEventListener('dragstart', () => dragSrc = row);
  row.addEventListener('dragover', e => e.preventDefault());
  row.addEventListener('drop', function(e) {
    e.preventDefault();
    if (dragSrc && dragSrc !== this) {
      const list = document.getElementById('slide-list');
      const all = [...list.querySelectorAll('.slide-row')];
      const fromIdx = all.indexOf(dragSrc);
      const toIdx = all.indexOf(this);
      if (fromIdx < toIdx) this.after(dragSrc);
      else this.before(dragSrc);
      saveOrder();
    }
  });
  row.draggable = true;
});

function saveOrder() {
  const ids = [...document.querySelectorAll('.slide-row')].map(r => r.dataset.id);
  document.getElementById('slide-order-input').value = JSON.stringify(ids);
  document.getElementById('reorder-form').submit();
}
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
