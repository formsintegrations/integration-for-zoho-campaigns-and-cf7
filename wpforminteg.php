<?php

/**
 * Plugin Name: Integrations for Zoho Campaigns and CF7
 * Requires plugins: contact-form-7
 * Plugin URI:  https://formsintegrations.com/integration-for-zoho-campaigns-and-cf7
 * Description: This plugin integrates CF7 forms with Zoho Campaigns
 * Version:     1.0
 * Author:      Forms Integrations
 * Author URI:  https://formsintegrations.com
 * Text Domain: integration-for-zoho-campaigns-and-cf7
 * Requires PHP: 5.6
 * Requires at least: 5.0
 * Requires Plugins: contact-form-7
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
