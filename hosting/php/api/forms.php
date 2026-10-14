<?php
/**
 * POST /api/forms — form endpoint for the private-server (LiteSpeed/Apache + PHP + MySQL) deployment.
 * Mirrors api/_lib/forms.ts used on Vercel: honeypot + timing check, validation, rate limiting by
 * salted IP hash, storage in MySQL, notification to the Foundation and an auto-reply.
 * Works with PHP 7.4+. Configuration: see config.sample.php (keep the real file outside the web root).
 */
declare(strict_types=1);

require __DIR__ . '/lib.php';

header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$config = mwf_config();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    mwf_json(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// Same-origin check (basic CSRF protection for a cookie-less endpoint)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? ($_SERVER['HTTP_HOST'] ?? '');
if ($origin !== '' && $host !== '' && strtolower((string) parse_url($origin, PHP_URL_HOST) . mwf_port($origin)) !== strtolower($host)) {
    mwf_json(403, ['ok' => false, 'error' => 'Forbidden']);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$raw = file_get_contents('php://input', false, null, 0, 100000);
if (stripos($contentType, 'application/json') !== false) {
    $input = json_decode((string) $raw, true);
    if (!is_array($input)) {
        mwf_json(400, ['ok' => false, 'error' => 'Invalid request.']);
    }
} else {
    $input = $_POST;
}

$ip = mwf_client_ip();
$result = mwf_handle_submission($input, $ip, (string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), $config);

$isNativeForm = stripos($contentType, 'application/x-www-form-urlencoded') !== false
    && stripos((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json') === false;

if ($isNativeForm) {
    $type = $result['type'] ?? 'contact';
    $page = isset($input['page']) && is_string($input['page']) && strpos($input['page'], '/') === 0 && strpos($input['page'], '//') !== 0 ? $input['page'] : '/contact';
    $location = $result['body']['ok'] ? '/thank-you?type=' . rawurlencode($type) : $page . '?form_error=1#form-' . rawurlencode($type);
    header('Location: ' . $location, true, 303);
    exit;
}

mwf_json($result['status'], $result['body']);
