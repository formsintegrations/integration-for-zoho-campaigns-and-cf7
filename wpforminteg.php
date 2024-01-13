<?php

/**
 * Plugin Name: Integrations of Zoho Campaigns and CF7
 * Plugin URI:  https://formsintegrations.com/integration-of-zoho-campaigns-and-cf7
 * Description: This plugin integrates CF7 forms with Zoho Campaigns
 * Version:     1.0.1
 * Author:      Forms Integrations
 * Author URI:  https://formsintegrations.com
 * Text Domain: fitzocacf
 * Requires PHP: 5.6
 * Requires at least: 5.0
 * Domain Path: /languages
 * License: GPLv2 or later
 */

/***
 * If try to direct access  plugin folder it will Exit
 **/
if (!defined('ABSPATH')) {
    exit;
}

require_once plugin_dir_path(__FILE__) . 'includes/loader.php';
