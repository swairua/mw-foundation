<?php
require_once __DIR__ . '/includes/auth.php';
requireLogin();
$title = 'Manage News';
$db = getDB();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $id = $_POST['id'] ?? '';
  $title_val = $_POST['title'] ?? '';
  $slug = $_POST['slug'] ?? '';
  $excerpt = $_POST['excerpt'] ?? '';
  $content = $_POST['content'] ?? '';
  $image = $_POST['image'] ?? '';
  $categories = $_POST['categories'] ?? '';
  $article_date = $_POST['article_date'] ?? date('Y-m-d');
  $is_published = isset($_POST['is_published']) ? 1 : 0;

  if ($id) {
    $stmt = $db->prepare("UPDATE news_articles SET title=?, slug=?, excerpt=?, content=?, image=?, categories=?, article_date=?, is_published=? WHERE id=?");
    $stmt->execute([$title_val, $slug, $excerpt, $content, $image, $categories, $article_date, $is_published, $id]);
    $message = 'Article updated.';
  } else {
    $stmt = $db->prepare("INSERT INTO news_articles (title, slug, excerpt, content, image, categories, article_date, is_published) VALUES (?,?,?,?,?,?,?,?)");
    $stmt->execute([$title_val, $slug, $excerpt, $content, $image, $categories, $article_date, $is_published]);
    $message = 'Article created.';
  }
}

$articles = $db->query("SELECT * FROM news_articles ORDER BY article_date DESC")->fetchAll();
$media = $db->query("SELECT * FROM media ORDER BY created_at DESC LIMIT 50")->fetchAll();
require __DIR__ . '/includes/header.php';
?>
<div class="container">
  <div class="flex-between"><h2>News Articles</h2><button class="btn btn-primary" onclick="openForm()">+ New Article</button></div>
  <?php if ($message): ?><div class="alert alert-success"><?= htmlspecialchars($message) ?></div><?php endif; ?>

  <div id="news-form" class="card" style="display:none">
    <form method="post" class="form">
      <input type="hidden" name="id" id="edit-id">
      <div class="form-group"><label>Title</label><input type="text" name="title" id="edit-title" required></div>
      <div class="form-row">
        <div class="form-group"><label>Slug</label><input type="text" name="slug" id="edit-slug" required></div>
        <div class="form-group"><label>Date</label><input type="date" name="article_date" id="edit-date"></div>
      </div>
      <div class="form-group"><label>Excerpt</label><textarea name="excerpt" id="edit-excerpt" rows="3"></textarea></div>
      <div class="form-group"><label>Content</label><textarea name="content" id="edit-content" rows="6" class="code-textarea"></textarea></div>
      <div class="form-row">
        <div class="form-group">
          <label>Image</label>
          <div class="img-picker-row">
            <input type="text" name="image" id="edit-image" class="img-picker-input" placeholder="/assets/images/...">
            <button type="button" class="btn btn-sm btn-secondary" onclick="openMediaPicker('edit-image')">Browse</button>
          </div>
          <img id="edit-image-preview" class="img-preview" style="display:none" />
        </div>
        <div class="form-group"><label>Categories (comma-separated)</label><input type="text" name="categories" id="edit-cats" placeholder="Wellness,Technology"></div>
      </div>
      <div class="form-group"><label><input type="checkbox" name="is_published" id="edit-published" checked> Published</label></div>
      <div class="form-actions"><button type="submit" class="btn btn-primary">Save</button><button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button></div>
    </form>
  </div>

  <table class="table">
    <thead><tr><th>Date</th><th>Title</th><th>Categories</th><th>Image</th><th>Published</th><th>Actions</th></tr></thead>
    <tbody>
      <?php foreach ($articles as $a): ?>
      <tr>
        <td nowrap><?= htmlspecialchars($a['article_date']) ?></td>
        <td><?= htmlspecialchars($a['title']) ?></td>
        <td><?= htmlspecialchars($a['categories']) ?></td>
        <td><?= $a['image'] ? '✓' : '✗' ?></td>
        <td><?= $a['is_published'] ? '✓' : '✗' ?></td>
        <td><button class="btn btn-sm" onclick="editArticle(<?= $a['id'] ?>)">Edit</button></td>
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
const articles = <?= json_encode($articles) ?>;
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
  ['id','title','slug','excerpt','content','image','cats','image_alt'].forEach(k => {
    const el = document.getElementById('edit-' + k.replace(/_/g,'-'));
    if (el) el.value = '';
  });
  document.getElementById('edit-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('edit-published').checked = true;
  document.getElementById('edit-image-preview').style.display = 'none';
  document.getElementById('news-form').style.display = 'block';
}
function closeForm() { document.getElementById('news-form').style.display = 'none'; }
function editArticle(id) {
  const a = articles.find(x => x.id === id);
  if (!a) return;
  document.getElementById('edit-id').value = a.id;
  document.getElementById('edit-title').value = a.title || '';
  document.getElementById('edit-slug').value = a.slug || '';
  document.getElementById('edit-excerpt').value = a.excerpt || '';
  document.getElementById('edit-content').value = a.content || '';
  document.getElementById('edit-image').value = a.image || '';
  document.getElementById('edit-cats').value = a.categories || '';
  document.getElementById('edit-date').value = a.article_date;
  document.getElementById('edit-published').checked = a.is_published == 1;
  const preview = document.getElementById('edit-image-preview');
  if (a.image) { preview.src = a.image; preview.style.display = 'block'; } else preview.style.display = 'none';
  document.getElementById('news-form').style.display = 'block';
}
</script>
<?php require __DIR__ . '/includes/footer.php'; ?>
