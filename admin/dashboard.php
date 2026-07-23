<?php
require_once __DIR__ . '/includes/auth.php';
requireLogin();
$user = currentUser();
$db = getDB();
$pageCount = $db->query("SELECT COUNT(*) FROM pages")->fetchColumn();
$focusCount = $db->query("SELECT COUNT(*) FROM focus_areas")->fetchColumn();
$newsCount = $db->query("SELECT COUNT(*) FROM news_articles")->fetchColumn();
$slideCount = $db->query("SELECT COUNT(*) FROM hero_slides")->fetchColumn();
$mediaCount = $db->query("SELECT COUNT(*) FROM media")->fetchColumn();
$recentNews = $db->query("SELECT title, article_date FROM news_articles WHERE is_published=1 ORDER BY article_date DESC LIMIT 5")->fetchAll();
$title = 'Dashboard';
require __DIR__ . '/includes/header.php';
?>
<div class="container">
  <h2>Dashboard</h2>
  <p class="text-muted">Welcome back, <?= htmlspecialchars($user['display_name']) ?> &middot; <?= date('l, F j, Y') ?></p>

  <div class="stats-grid">
    <div class="stat-card"><span class="stat-number"><?= $pageCount ?></span><span class="stat-label">Pages</span></div>
    <div class="stat-card"><span class="stat-number"><?= $focusCount ?></span><span class="stat-label">Focus Areas</span></div>
    <div class="stat-card"><span class="stat-number"><?= $newsCount ?></span><span class="stat-label">News</span></div>
    <div class="stat-card"><span class="stat-number"><?= $slideCount ?></span><span class="stat-label">Hero Slides</span></div>
    <div class="stat-card"><span class="stat-number"><?= $mediaCount ?></span><span class="stat-label">Media Files</span></div>
  </div>

  <div class="dashboard-grid">
    <div class="card">
      <h3 style="font-size:1rem;margin-bottom:12px">Quick Actions</h3>
      <div class="quick-links-col">
        <a href="pages.php" class="ql-item">Edit Pages</a>
        <a href="hero-slider.php" class="ql-item">Manage Hero Slides</a>
        <a href="focus-areas.php" class="ql-item">Edit Focus Areas</a>
        <a href="news.php" class="ql-item">Add News Article</a>
        <a href="media.php" class="ql-item">Upload Media</a>
        <a href="settings.php" class="ql-item">Site Settings</a>
      </div>
    </div>
    <div class="card">
      <h3 style="font-size:1rem;margin-bottom:12px">Recent News</h3>
      <?php if (empty($recentNews)): ?><p class="text-muted">No news articles yet.</p>
      <?php else: ?>
      <div class="news-mini-list">
        <?php foreach ($recentNews as $n): ?>
        <div class="news-mini-item"><span class="news-mini-date"><?= date('M j', strtotime($n['article_date'])) ?></span><span><?= htmlspecialchars($n['title']) ?></span></div>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>
    </div>
  </div>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
