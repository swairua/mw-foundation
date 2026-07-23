<?php
require_once __DIR__ . '/includes/auth.php';
requireLogin();
$title = 'Manage Highlights';
$db = getDB();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $action = $_POST['action'] ?? '';
  if ($action === 'delete' && !empty($_POST['id'])) {
    $stmt = $db->prepare("DELETE FROM highlights WHERE id=?");
    $stmt->execute([$_POST['id']]);
    $message = 'Highlight deleted.';
  } elseif ($action === 'save' && !empty($_POST['focus_area_id']) && !empty($_POST['text'])) {
    $stmt = $db->prepare("INSERT INTO highlights (focus_area_id, sort_order, text) VALUES (?,?,?)");
    $stmt->execute([$_POST['focus_area_id'], (int)($_POST['sort_order'] ?? 0), $_POST['text']]);
    $message = 'Highlight added.';
  } elseif ($action === 'update' && !empty($_POST['id'])) {
    $stmt = $db->prepare("UPDATE highlights SET text=?, sort_order=? WHERE id=?");
    $stmt->execute([$_POST['text'], (int)($_POST['sort_order'] ?? 0), $_POST['id']]);
    $message = 'Highlight updated.';
  }
}

$focusAreas = $db->query("SELECT * FROM focus_areas ORDER BY sort_order")->fetchAll();
$highlights = $db->query("SELECT h.*, f.label as area_label FROM highlights h JOIN focus_areas f ON h.focus_area_id = f.id ORDER BY f.sort_order, h.sort_order")->fetchAll();
require __DIR__ . '/includes/header.php';
?>
<div class="container">
  <div class="flex-between"><h2>Highlights</h2><button class="btn btn-primary" onclick="toggleForm()">+ Add Highlight</button></div>
  <?php if ($message): ?><div class="alert alert-success"><?= htmlspecialchars($message) ?></div><?php endif; ?>

  <div id="hl-form" class="card" style="display:none">
    <form method="post" class="form">
      <input type="hidden" name="action" value="save">
      <input type="hidden" name="id" id="edit-id">
      <div class="form-row">
        <div class="form-group"><label>Focus Area</label>
          <select name="focus_area_id" id="edit-area" required>
            <option value="">Select...</option>
            <?php foreach ($focusAreas as $fa): ?>
            <option value="<?= $fa['id'] ?>"><?= htmlspecialchars($fa['label']) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="form-group"><label>Sort Order</label><input type="number" name="sort_order" id="edit-order" min="0" value="0"></div>
      </div>
      <div class="form-group"><label>Highlight Text</label><input type="text" name="text" id="edit-text" required></div>
      <div class="form-actions"><button type="submit" class="btn btn-primary">Save</button><button type="button" class="btn btn-secondary" onclick="toggleForm()">Cancel</button></div>
    </form>
  </div>

  <table class="table">
    <thead><tr><th>Area</th><th>Order</th><th>Text</th><th>Actions</th></tr></thead>
    <tbody>
      <?php foreach ($highlights as $h): ?>
      <tr>
        <td><?= htmlspecialchars($h['area_label']) ?></td>
        <td><?= $h['sort_order'] ?></td>
        <td><?= htmlspecialchars($h['text']) ?></td>
        <td class="actions-cell">
          <button class="btn btn-sm" onclick="editHL(<?= $h['id'] ?>)">Edit</button>
          <form method="post" style="display:inline" onsubmit="return confirm('Delete this highlight?')">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= $h['id'] ?>">
            <button type="submit" class="btn btn-sm btn-danger">Delete</button>
          </form>
        </td>
      </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>
<script>
const highlights = <?= json_encode($highlights) ?>;
function toggleForm() {
  const f = document.getElementById('hl-form');
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
  if (f.style.display === 'block') {
    document.querySelector('input[name="action"]').value = 'save';
    document.getElementById('edit-id').value = '';
    document.getElementById('edit-area').value = '';
    document.getElementById('edit-text').value = '';
    document.getElementById('edit-order').value = '0';
  }
}
function editHL(id) {
  const h = highlights.find(x => x.id === id);
  if (!h) return;
  document.querySelector('input[name="action"]').value = 'update';
  document.getElementById('edit-id').value = h.id;
  document.getElementById('edit-area').value = h.focus_area_id;
  document.getElementById('edit-text').value = h.text;
  document.getElementById('edit-order').value = h.sort_order;
  document.getElementById('hl-form').style.display = 'block';
}
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
