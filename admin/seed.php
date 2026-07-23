<?php
require_once __DIR__ . '/includes/auth.php';
requireLogin();
$title = 'Seed Data';
$message = '';
$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['seed'])) {
  try {
    $db->exec("TRUNCATE TABLE highlights");
    $db->exec("TRUNCATE TABLE news_articles");
    $db->exec("TRUNCATE TABLE pages");
    $db->exec("TRUNCATE TABLE focus_areas");
    $db->exec("TRUNCATE TABLE site_settings");
    $db->exec("TRUNCATE TABLE admin_users");

    $db->exec("INSERT INTO admin_users (username, email, password_hash, display_name, role) VALUES
      ('admin', 'admin@mw-foundation.org', SHA2('admin123', 256), 'Super Admin', 'admin'),
      ('editor', 'editor@mw-foundation.org', SHA2('editor123', 256), 'Content Editor', 'editor')");

    $db->exec("INSERT INTO focus_areas (slug, label, title, description, image, image_alt, eyebrow, sort_order) VALUES
      ('technology', 'Technology', 'Technology that opens doors.', 'The Technology pillar is a critical driver of the Mercy Wanjau Foundation mission to empower Kenyan communities through inclusive growth and social transformation.', '/assets/images/tech-education.jpg', 'Students learning with technology', 'Our work · 01', 1),
      ('education', 'Education and leadership', 'Curious minds. Courageous leaders.', 'The Education & Leadership pillar is a vital driver of the Mercy Wanjau Foundation mission to empower Kenyan communities.', '/assets/images/education-global.jpg', 'Students in a classroom', 'Our work · 02', 2),
      ('economic-empowerment', 'Economic empowerment', 'Backing people to thrive.', 'The Economic Empowerment pillar is rooted in the belief that every Kenyan deserves the opportunity to thrive.', '/assets/images/economic-empowerment-women.jpg', 'Women working together', 'Our work · 03', 3),
      ('wellness', 'Wellness and mental health', 'Wellbeing can flourish.', 'The Wellness pillar is central to the Mercy Wanjau Foundation vision.', '/assets/images/healthcare-wellness.jpg', 'Community health workers', 'Our work · 04', 4),
      ('disability-inclusion', 'Disability inclusion', 'Every person belongs.', 'The foundation strives to be a beacon of hope by driving social transformation.', '/assets/images/disability-inclusion-tech.jpg', 'Person using assistive technology', 'Our work · 05', 5)");

    $db->exec("INSERT INTO highlights (focus_area_id, sort_order, text) VALUES
      (1,1,'Digital skills'),(1,2,'Access to knowledge'),(1,3,'Innovation for communities'),(1,4,'Connections that create opportunity'),
      (2,1,'Learning pathways'),(2,2,'Youth leadership'),(2,3,'Mentorship and confidence'),(2,4,'Skills for a changing world'),
      (3,1,'Women enterprise'),(3,2,'Skills and resources'),(3,3,'Confidence to lead'),(3,4,'More resilient livelihoods'),
      (4,1,'Mental wellbeing'),(4,2,'Healthy communities'),(4,3,'Resilience and care'),(4,4,'Connection that strengthens us'),
      (5,1,'Access and dignity'),(5,2,'Participation without barriers'),(5,3,'Community belonging'),(5,4,'Opportunity for all')");

    $db->exec("INSERT INTO pages (slug, title, description, image, image_alt) VALUES
      ('home', 'Mercy Wanjau Foundation', 'Building stronger communities in Kenya through technology, education, leadership, economic empowerment, wellness and inclusion.', '/assets/images/rural-community.jpg', 'Rural community in Kenya'),
      ('our-work', 'Progress is a practice.', 'Rooted in a passion for creative problem-solving, we turn ideas into reality.', '/assets/images/community-support.jpg', 'Community members working together'),
      ('who-we-are', 'People at the heart of progress.', 'Empowering communities through technology, education, economic inclusion, wellness and support for persons with disabilities.', '/assets/images/rural-community.jpg', 'Rural community in Kenya'),
      ('news', 'Stories of change, shared.', 'Follow the people, partnerships, and everyday ideas bringing opportunity closer to communities across Kenya.', '/assets/images/community-wellness.jpg', 'A community gathering'),
      ('support', 'Let work together.', 'Your time, partnership, and belief can help make opportunity more visible, accessible, and possible.', '/assets/images/community-support.jpg', 'Community members supporting each other')");

    $db->exec("INSERT INTO news_articles (title, slug, categories, article_date) VALUES
      ('Why Mental Health Matters for Kenya Future', 'why-mental-health-matters', 'Wellness', '2026-02-03'),
      ('Assistive Technology: A Game-Changer for Equal Opportunities', 'assistive-technology-game-changer', 'Technology,Disability', '2026-01-20'),
      ('How Digital Skills Open Doors for Persons With Disabilities', 'digital-skills-pwd', 'Disability', '2026-01-10'),
      ('How Community Wellness Programs Transform Lives', 'community-wellness-programs', 'Wellness', '2025-12-20'),
      ('Digital Skills for Kenyan Youth', 'digital-skills-kenyan-youth', 'Education,Technology', '2025-11-21')");

    $db->exec("INSERT INTO site_settings (setting_key, setting_value) VALUES
      ('site_name', 'Mercy Wanjau Foundation'),
      ('site_email', 'info@mw-foundation.org'),
      ('site_address', 'Mbaruk Road, Nairobi - Kenya'),
      ('site_phone', '+254 7XXXXXXXX')");

    $message = 'Database seeded successfully!';
  } catch (Exception $e) {
    $message = 'Error: ' . $e->getMessage();
  }
}
require __DIR__ . '/includes/header.php';
?>
<div class="container">
  <h2>Seed Database</h2>
  <p class="text-muted">Re-seed all tables with default data. This will replace all existing data.</p>
  <?php if ($message): ?><div class="alert <?= str_starts_with($message, 'Error') ? 'alert-error' : 'alert-success' ?>"><?= htmlspecialchars($message) ?></div><?php endif; ?>
  <form method="post" onsubmit="return confirm('This will delete all existing data. Continue?')">
    <button type="submit" name="seed" value="1" class="btn btn-warning">Seed Database</button>
  </form>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>
