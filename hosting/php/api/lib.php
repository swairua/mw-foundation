<?php
/**
 * Form handling library for the PHP deployment (see forms.php).
 * Direct web access to this file is blocked by api/.htaccess.
 */
declare(strict_types=1);

const MWF_FORM_TYPES = ['volunteer', 'partner', 'contact', 'newsletter'];
const MWF_WINDOW_SECONDS = 600;
const MWF_MAX_PER_WINDOW = 5;

/** Loads configuration from (in order) the parent of the web root, this folder, then environment variables. */
function mwf_config(): array
{
    $defaults = [
        'db_dsn' => getenv('MWF_DB_DSN') ?: '',
        'db_user' => getenv('MWF_DB_USER') ?: '',
        'db_pass' => getenv('MWF_DB_PASS') ?: '',
        'mail_to' => getenv('MAIL_TO') ?: 'info@mw-foundation.org',
        'mail_from' => getenv('MAIL_FROM') ?: 'Mercy Wanjau Foundation <hello@mw-foundation.org>',
        'resend_api_key' => getenv('RESEND_API_KEY') ?: '',
        'rate_limit_salt' => getenv('RATE_LIMIT_SALT') ?: '',
        'debug' => false,
    ];
    $candidates = [
        dirname(__DIR__, 2) . '/mwf-config.php', // one level above the web root (recommended)
        __DIR__ . '/config.local.php',           // fallback, protected by api/.htaccess
    ];
    foreach ($candidates as $file) {
        if (is_file($file)) {
            $loaded = require $file;
            if (is_array($loaded)) {
                return array_merge($defaults, $loaded);
            }
        }
    }
    return $defaults;
}

function mwf_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function mwf_port(string $url): string
{
    $port = parse_url($url, PHP_URL_PORT);
    return $port ? ':' . $port : '';
}

function mwf_client_ip(): string
{
    // Behind a proxy/CDN the first X-Forwarded-For entry is the visitor
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($forwarded !== '') {
        $first = trim(explode(',', $forwarded)[0]);
        if (filter_var($first, FILTER_VALIDATE_IP)) {
            return $first;
        }
    }
    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

function mwf_len(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

/** Field rules mirror the zod schemas in api/_lib/forms.ts. */
function mwf_rules(string $type): array
{
    $phone = ['type' => 'phone', 'max' => 30, 'required' => true, 'missing' => 'Please enter your phone number.'];
    $optionalPhone = ['type' => 'phone', 'max' => 30, 'required' => false];
    $email = ['type' => 'email', 'max' => 254, 'required' => true, 'missing' => 'Please enter your email address.'];
    $consent = ['type' => 'consent', 'required' => true];
    $text = function (int $max, int $min = 0, string $missing = 'Please complete this field.', string $short = '') {
        return ['type' => 'text', 'max' => $max, 'min' => $min, 'required' => $min > 0, 'missing' => $missing, 'short' => $short ?: $missing];
    };
    switch ($type) {
        case 'volunteer':
            return [
                'name' => $text(120, 2, 'Please enter your full name.'),
                'email' => $email,
                'phone' => $phone,
                'location' => $text(120),
                'skills' => $text(600, 2, 'Tell us which skills you would like to offer.'),
                'availability' => $text(120, 2, 'Please choose your availability.'),
                'message' => $text(3000),
                'consent' => $consent,
            ];
        case 'partner':
            return [
                'organisation' => $text(160, 2, 'Please enter your organisation name.'),
                'name' => $text(120, 2, 'Please enter your name.'),
                'role' => $text(120),
                'email' => $email,
                'phone' => $optionalPhone,
                'interest' => $text(120, 2, 'Please choose an area of interest.'),
                'message' => $text(4000, 10, 'Please tell us a little about the partnership you have in mind.'),
                'consent' => $consent,
            ];
        case 'contact':
            return [
                'name' => $text(120, 2, 'Please enter your name.'),
                'email' => $email,
                'phone' => $optionalPhone,
                'topic' => $text(80),
                'message' => $text(4000, 10, 'Please write a short message (at least 10 characters).'),
                'consent' => $consent,
            ];
        case 'newsletter':
            return ['email' => $email, 'name' => $text(120)];
    }
    return [];
}

/** @return array{0: array<string, mixed>, 1: array<string, string>} [clean data, field errors] */
function mwf_validate(array $input, array $rules): array
{
    $data = [];
    $errors = [];
    foreach ($rules as $field => $rule) {
        $value = $input[$field] ?? null;
        if ($rule['type'] === 'consent') {
            $ok = in_array($value, ['on', 'true', true, 'yes', '1', 1], true);
            if (!$ok) {
                $errors[$field] = 'Please confirm we may use your details to respond.';
            } else {
                $data[$field] = true;
            }
            continue;
        }
        $value = is_scalar($value) ? trim((string) $value) : '';
        if ($value === '') {
            if (!empty($rule['required'])) {
                $errors[$field] = $rule['missing'] ?? 'Please complete this field.';
            } else {
                $data[$field] = '';
            }
            continue;
        }
        if (isset($rule['max']) && mwf_len($value) > $rule['max']) {
            $errors[$field] = 'Please keep this under ' . $rule['max'] . ' characters.';
            continue;
        }
        if ($rule['type'] === 'email') {
            $value = strtolower($value);
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                $errors[$field] = 'Please enter a valid email address.';
                continue;
            }
        } elseif ($rule['type'] === 'phone') {
            if (!preg_match('/^[+()\d\s-]{7,30}$/', $value)) {
                $errors[$field] = 'Please enter a valid phone number, e.g. +254 712 345 678.';
                continue;
            }
        } elseif (!empty($rule['min']) && mwf_len($value) < $rule['min']) {
            $errors[$field] = $rule['short'] ?? $rule['missing'];
            continue;
        }
        $data[$field] = $value;
    }
    return [$data, $errors];
}

function mwf_db(array $config): ?PDO
{
    static $pdo = null;
    static $tried = false;
    if ($tried) {
        return $pdo;
    }
    $tried = true;
    if (($config['db_dsn'] ?? '') === '') {
        return null;
    }
    try {
        $pdo = new PDO($config['db_dsn'], $config['db_user'] ?: null, $config['db_pass'] ?: null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (Throwable $e) {
        error_log('[mwf-forms] database connection failed: ' . $e->getMessage());
        $pdo = null;
    }
    return $pdo;
}

function mwf_uuid(): string
{
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

function mwf_now(int $offset = 0): string
{
    return gmdate('Y-m-d H:i:s', time() + $offset);
}

/** File-based limiter used when no database is configured (per server, survives between requests). */
function mwf_file_limited(string $ipHash): bool
{
    $file = sys_get_temp_dir() . '/mwf-rate-' . $ipHash;
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $hits = array_filter(array_map('intval', explode("\n", (string) file_get_contents($file))), function ($t) use ($now) {
            return $now - $t < MWF_WINDOW_SECONDS;
        });
    }
    $hits[] = $now;
    @file_put_contents($file, implode("\n", $hits), LOCK_EX);
    return count($hits) > MWF_MAX_PER_WINDOW;
}

function mwf_db_limited(?PDO $db, string $ipHash): bool
{
    if (!$db) {
        return false;
    }
    try {
        $stmt = $db->prepare('SELECT COUNT(*) FROM form_submissions WHERE ip_hash = ? AND created_at >= ?');
        $stmt->execute([$ipHash, mwf_now(-MWF_WINDOW_SECONDS)]);
        return (int) $stmt->fetchColumn() >= MWF_MAX_PER_WINDOW;
    } catch (Throwable $e) {
        error_log('[mwf-forms] rate-limit query failed: ' . $e->getMessage());
        return false;
    }
}

function mwf_store(?PDO $db, string $type, array $data, array $input, string $ipHash, string $userAgent): bool
{
    if (!$db) {
        return false;
    }
    $payload = $data;
    foreach (['name', 'email', 'phone', 'organisation', 'consent'] as $k) {
        unset($payload[$k]);
    }
    try {
        $stmt = $db->prepare('INSERT INTO form_submissions (id, created_at, form_type, name, email, phone, organisation, payload, page, consent, ip_hash, user_agent, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            mwf_uuid(),
            mwf_now(),
            $type,
            ($data['name'] ?? '') ?: null,
            $data['email'],
            ($data['phone'] ?? '') ?: null,
            ($data['organisation'] ?? '') ?: null,
            json_encode($payload, JSON_UNESCAPED_UNICODE),
            substr((string) ($input['page'] ?? ''), 0, 200) ?: null,
            $type === 'newsletter' || !empty($data['consent']) ? 1 : 0,
            $ipHash,
            substr($userAgent, 0, 300) ?: null,
            'new',
        ]);
        if ($type === 'newsletter') {
            $exists = $db->prepare('SELECT 1 FROM newsletter_subscribers WHERE email = ?');
            $exists->execute([$data['email']]);
            if (!$exists->fetchColumn()) {
                $ins = $db->prepare('INSERT INTO newsletter_subscribers (email, name, source, created_at) VALUES (?, ?, ?, ?)');
                $ins->execute([$data['email'], ($data['name'] ?? '') ?: null, substr((string) ($input['page'] ?? ''), 0, 200) ?: null, mwf_now()]);
            }
        }
        return true;
    } catch (Throwable $e) {
        error_log('[mwf-forms] insert failed: ' . $e->getMessage());
        return false;
    }
}

function mwf_esc(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Sends through Resend when an API key is configured, otherwise PHP mail() via the host's mail server. */
function mwf_send_mail(array $config, string $to, string $subject, string $html, string $text, string $replyTo = ''): bool
{
    // Never allow header injection through user-supplied values
    $to = str_replace(["\r", "\n"], '', $to);
    $replyTo = str_replace(["\r", "\n"], '', $replyTo);
    $subject = str_replace(["\r", "\n"], ' ', $subject);
    $from = str_replace(["\r", "\n"], '', (string) $config['mail_from']);

    if (($config['resend_api_key'] ?? '') !== '' && function_exists('curl_init')) {
        $body = ['from' => $from, 'to' => [$to], 'subject' => $subject, 'html' => $html, 'text' => $text];
        if ($replyTo !== '') {
            $body['reply_to'] = $replyTo;
        }
        $ch = curl_init('https://api.resend.com/emails');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $config['resend_api_key'], 'Content-Type: application/json'],
            CURLOPT_POSTFIELDS => json_encode($body),
        ]);
        $response = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($status >= 200 && $status < 300) {
            return true;
        }
        error_log('[mwf-forms] Resend failed (' . $status . '): ' . substr((string) $response, 0, 300));
        return false;
    }

    $boundary = 'mwf-' . bin2hex(random_bytes(8));
    $headers = [
        'From: ' . $from,
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];
    if ($replyTo !== '') {
        $headers[] = 'Reply-To: ' . $replyTo;
    }
    $message = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n$text\r\n"
        . "--$boundary\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n$html\r\n--$boundary--";
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $ok = @mail($to, $encodedSubject, $message, implode("\r\n", $headers));
    if (!$ok) {
        error_log('[mwf-forms] mail() failed for ' . $to);
    }
    return $ok;
}

const MWF_LABELS = [
    'volunteer' => 'Volunteer application',
    'partner' => 'Partnership enquiry',
    'contact' => 'Contact message',
    'newsletter' => 'Newsletter signup',
];

const MWF_AUTO_REPLY = [
    'volunteer' => ['Thank you for offering to volunteer with the Mercy Wanjau Foundation', 'Thank you for offering your time and skills. Our team reviews volunteer applications against current programme needs and will be in touch if there is a suitable role.'],
    'partner' => ['Your partnership enquiry — Mercy Wanjau Foundation', 'Thank you for your interest in partnering with the Foundation. A member of our partnerships team will review your enquiry and respond.'],
    'contact' => ['We have received your message — Mercy Wanjau Foundation', 'Thank you for getting in touch. We have received your message and will respond as soon as we can.'],
    'newsletter' => ["You're subscribed to updates from the Mercy Wanjau Foundation", 'Thank you for subscribing. We will send occasional updates from our work in rural Kenya. You can unsubscribe at any time by replying to any of our emails.'],
];

function mwf_notify(array $config, string $type, array $data): bool
{
    $rows = '';
    $text = MWF_LABELS[$type] . "\n\n";
    foreach ($data as $k => $v) {
        if ($k === 'consent') {
            continue;
        }
        $v = is_bool($v) ? ($v ? 'yes' : 'no') : (string) $v;
        $rows .= '<tr><td style="padding:6px 12px 6px 0;color:#54655d;vertical-align:top">' . mwf_esc($k) . '</td><td style="padding:6px 0;white-space:pre-wrap">' . mwf_esc($v) . '</td></tr>';
        $text .= "$k: $v\n";
    }
    $who = (string) ($data['organisation'] ?? '') ?: (string) ($data['name'] ?? '') ?: (string) $data['email'];
    $html = '<div style="font-family:Arial,sans-serif;color:#13261f;font-size:15px"><h2 style="font-size:18px">' . mwf_esc(MWF_LABELS[$type]) . '</h2><table>' . $rows . '</table><p style="color:#54655d;font-size:13px">Sent from the form on mw-foundation.org. Reply to this email to respond directly.</p></div>';
    return mwf_send_mail($config, (string) $config['mail_to'], substr(MWF_LABELS[$type] . ': ' . $who, 0, 140), $html, $text, (string) $data['email']);
}

function mwf_auto_reply(array $config, string $type, array $data): void
{
    [$subject, $body] = MWF_AUTO_REPLY[$type];
    $name = (string) ($data['name'] ?? '');
    $greeting = $name !== '' ? 'Dear ' . $name . ',' : 'Hello,';
    $fraud = 'Please note: the Foundation never asks for payment in exchange for jobs, scholarships or support. If anyone asks you for money on our behalf, contact info@mw-foundation.org.';
    $html = '<div style="font-family:Arial,sans-serif;color:#13261f;font-size:15px;line-height:1.6"><p>' . mwf_esc($greeting) . '</p><p>' . mwf_esc($body) . '</p><p>Warm regards,<br>Mercy Wanjau Foundation<br><a href="https://mw-foundation.org" style="color:#235a47">mw-foundation.org</a></p><p style="color:#54655d;font-size:12px">' . mwf_esc($fraud) . '</p></div>';
    $text = "$greeting\n\n$body\n\nWarm regards,\nMercy Wanjau Foundation\nhttps://mw-foundation.org\n\n$fraud";
    mwf_send_mail($config, (string) $data['email'], $subject, $html, $text);
}

/**
 * @return array{status: int, body: array<string, mixed>, type?: string}
 */
function mwf_handle_submission(array $input, string $ip, string $userAgent, array $config): array
{
    $type = (string) ($input['form_type'] ?? '');
    if (!in_array($type, MWF_FORM_TYPES, true)) {
        return ['status' => 400, 'body' => ['ok' => false, 'error' => 'Unknown form.']];
    }

    // Honeypot and minimum fill time — bots get a fake success and nothing is stored
    $started = isset($input['started_at']) && is_numeric($input['started_at']) ? (float) $input['started_at'] : 0.0;
    $tooFast = $started > 0 && (microtime(true) * 1000 - $started) < 2500;
    $honeypot = isset($input['website']) && is_string($input['website']) && trim($input['website']) !== '';
    if ($honeypot || $tooFast) {
        return ['status' => 200, 'body' => ['ok' => true], 'type' => $type];
    }

    [$data, $errors] = mwf_validate($input, mwf_rules($type));
    if ($errors) {
        return ['status' => 400, 'body' => ['ok' => false, 'error' => 'Please check the highlighted fields.', 'fieldErrors' => $errors], 'type' => $type];
    }

    $salt = (string) ($config['rate_limit_salt'] ?: 'mwf-default-salt');
    $ipHash = substr(hash('sha256', $salt . ':' . $ip), 0, 32);
    $db = mwf_db($config);
    if (mwf_file_limited($ipHash) || mwf_db_limited($db, $ipHash)) {
        return ['status' => 429, 'body' => ['ok' => false, 'error' => 'You have sent several messages in a short time. Please wait a few minutes, or email info@mw-foundation.org.'], 'type' => $type];
    }

    $stored = mwf_store($db, $type, $data, $input, $ipHash, $userAgent);
    $notified = mwf_notify($config, $type, $data);
    if ($stored || $notified) {
        mwf_auto_reply($config, $type, $data);
        return ['status' => 200, 'body' => ['ok' => true], 'type' => $type];
    }

    if (!empty($config['debug'])) {
        error_log('[mwf-forms] (debug) ' . MWF_LABELS[$type] . ' received without storage or email configured: ' . json_encode($data));
        return ['status' => 200, 'body' => ['ok' => true], 'type' => $type];
    }
    return ['status' => 502, 'body' => ['ok' => false, 'error' => 'We could not send your message just now. Please try again, or email info@mw-foundation.org.'], 'type' => $type];
}
