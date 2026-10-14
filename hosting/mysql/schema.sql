-- Form submissions for the private-server (PHP + MySQL/MariaDB) deployment.
-- Equivalent of supabase/migrations/20261014000000_forms.sql.
-- Import once via phpMyAdmin (Import tab) or: mysql -u USER -p DBNAME < schema.sql
-- Times are stored in UTC.

CREATE TABLE IF NOT EXISTS form_submissions (
  id           CHAR(36)     NOT NULL,
  created_at   DATETIME     NOT NULL,
  form_type    VARCHAR(20)  NOT NULL,
  name         VARCHAR(160) NULL,
  email        VARCHAR(254) NOT NULL,
  phone        VARCHAR(40)  NULL,
  organisation VARCHAR(200) NULL,
  payload      LONGTEXT     NOT NULL,
  page         VARCHAR(200) NULL,
  consent      TINYINT(1)   NOT NULL DEFAULT 0,
  ip_hash      CHAR(32)     NULL,
  user_agent   VARCHAR(300) NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'new',
  notes        TEXT         NULL,
  PRIMARY KEY (id),
  KEY form_submissions_rate_idx (ip_hash, created_at),
  KEY form_submissions_type_idx (form_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Volunteer, partner, contact and newsletter submissions. ip_hash is a salted SHA-256 used only for rate limiting.';

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email           VARCHAR(254) NOT NULL,
  name            VARCHAR(160) NULL,
  source          VARCHAR(200) NULL,
  created_at      DATETIME     NOT NULL,
  unsubscribed_at DATETIME     NULL,
  PRIMARY KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data retention (Kenya Data Protection Act, 2019). Run monthly, e.g. as a cPanel cron job:
--   mysql -u USER -pPASS DBNAME -e "DELETE FROM form_submissions WHERE created_at < UTC_TIMESTAMP() - INTERVAL 24 MONTH AND status IN ('responded','archived','spam');"
--
-- The database user used by the website only needs SELECT and INSERT on these two tables.
