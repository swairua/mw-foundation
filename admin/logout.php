<?php
require_once __DIR__ . '/config/database.php';
session_start();
session_destroy();
redirect('login.php');
