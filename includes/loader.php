<?php

if (!\defined('ABSPATH')) {
    exit;
}

// Autoload vendor files.
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    include_once __DIR__ . '/../vendor/autoload.php';
    // Initialize the plugin.
    FormInteg\ZOCACFLite\Plugin::load();
}
