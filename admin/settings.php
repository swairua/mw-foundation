<?php
require_once __DIR__ . '/includes/auth.php';
requireLogin();
$title = 'Site Settings';
$db = getDB();
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $keys = ['site_name', 'site_email', 'site_address', 'site_phone', 'footer_tagline', 'social_facebook', 'social_twitter', 'social_instagram'];
  foreach ($keys as $key) {
    if (isset($_POST[$key])) {
      $stmt = $db->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=?");
      $stmt->execute([$key, $_POST[$key], $_POST[$key]]);
    }
  }
  $message = 'Settings saved.';
}

$settings = [];
$rows = $db->query("SELECT * FROM site_settings")->fetchAll();
foreach ($rows as $row) $settings[$row['setting_key']] = $row['setting_value'];

require __DIR__ . '/includes/header.php';
?>
<div class="container">
  <h2>Site Settings</h2>
  <?php if ($message): ?><div class="alert alert-success"><?= htmlspecialchars($message) ?></div><?php endif; ?>
  <div class="card">
    <form method="post" class="form">
      <div class="form-group"><label>Site Name</label><input type="text" name="site_name" value="<?= htmlspecialchars($settings['site_name'] ?? '') ?>"></div>
      <div class="form-group"><label>Site Email</label><input type="email" name="site_email" value="<?= htmlspecialchars($settings['site_email'] ?? '') ?>"></div>
      <div class="form-group"><label>Address</label><input type="text" name="site_address" value="<?= htmlspecialchars($settings['site_address'] ?? '') ?>"></div>
      <div class="form-group"><label>Phone</label><input type="text" name="site_phone" value="<?= htmlspecialchars($settings['site_phone'] ?? '') ?>"></div>
      <div class="form-group"><label>Footer Tagline</label><textarea name="footer_tagline" rows="2"><?= htmlspecialchars($settings['footer_tagline'] ?? 'Because real change begins when people are seen, supported and empowered.') ?></textarea></div>
      <div class="form-row">
        <div class="form-group"><label>Facebook URL</label><input type="text" name="social_facebook" value="<?= htmlspecialchars($settings['social_facebook'] ?? '') ?>"></div>
        <div class="form-group"><label>Twitter/X URL</label><input type="text" name="social_twitter" value="<?= htmlspecialchars($settings['social_twitter'] ?? '') ?>"></div>
      </div>
      <div class="form-group"><label>Instagram URL</label><input type="text" name="social_instagram" value="<?= htmlspecialchars($settings['social_instagram'] ?? '') ?>"></div>
      <div class="form-actions"><button type="submit" class="btn btn-primary">Save Settings</button></div>
    </form>
  </div>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
