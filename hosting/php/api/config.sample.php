<?php
/**
 * Copy this file to ONE LEVEL ABOVE the web root as `mwf-config.php`
 * (e.g. /home/<account>/mwf-config.php when the site is in /home/<account>/public_html),
 * so the secrets can never be downloaded. Never commit the real file.
 */
return [
    // MySQL database created in the hosting control panel (cPanel → MySQL Databases)
    'db_dsn' => 'mysql:host=localhost;dbname=CHANGE_ME_mwf;charset=utf8mb4',
    'db_user' => 'CHANGE_ME_user',
    'db_pass' => 'CHANGE_ME_password',

    // Where notifications go, and who they come from (must be a mailbox on mw-foundation.org)
    'mail_to' => 'info@mw-foundation.org',
    'mail_from' => 'Mercy Wanjau Foundation <hello@mw-foundation.org>',

    // Optional: Resend API key for reliable delivery. Leave empty to use the server's own mail().
    'resend_api_key' => '',

    // Long random string used to hash visitor IP addresses for rate limiting
    'rate_limit_salt' => 'CHANGE_ME_to_a_long_random_string',

    // true only while testing: accepts submissions even if the database and mail are unavailable
    'debug' => false,
];
