<?php

namespace FormInteg\ZOCACFLite\Admin;

use FormInteg\ZOCACFLite\Config;
use FormInteg\ZOCACFLite\Core\Util\Capabilities;
use FormInteg\ZOCACFLite\Core\Util\DateTimeHelper;
use FormInteg\ZOCACFLite\Core\Util\Hooks;

/**
 * The admin menu and page handler class
 */
class Admin_Bar
{
    public function register()
    {
        Hooks::add('in_admin_header', [$this, 'RemoveAdminNotices']);
        Hooks::add('admin_menu', [$this, 'adminMenu'], 12);
        Hooks::add('admin_enqueue_scripts', [$this, 'adminAssets'], 12);
    }

    /**
     * Register the admin menu
     *
     * @return void
     */
    public function adminMenu()
    {
        $capability = Hooks::apply('manage_wp_integrations', 'manage_options');
        if (Capabilities::Check($capability)) {
            $rootExists = !empty($GLOBALS['admin_page_hooks'][Config::DASH_URL]);
            if ($rootExists) {
                remove_menu_page(Config::DASH_URL);
            }

            add_menu_page(
                Config::TITLE,
                Config::TRIGGER . '-' . Config::ACTION,
                $capability,
                Config::DASH_URL,
                $rootExists ? '' : [$this, 'rootPage'],
                'data:image/svg+xml;base64,' . base64_encode(Config::LOGO),
                30
            );

            add_submenu_page(
                Config::DASH_URL,
                Config::TITLE,
                'Integrations',
                $capability,
                Config::DASH_URL,
                $rootExists ? '' : [$this, 'rootPage'],
                30
            );
        }
    }

    /**
     * Load the asset libraries
     *
     * @param mixed $currentPage
     *
     * @return void
     */
    public function adminAssets($currentPage)
    {
        if (strpos($currentPage, Config::DASH_URL) === false) {
            return;
        }

        wp_enqueue_script(
            Config::withPrefix('vendors'),
            Config::get('ASSET_JS_URI') . '/vendors-main.js',
            null,
            Config::VERSION,
            true
        );

        wp_enqueue_script(
            Config::withPrefix('runtime'),
            Config::get('ASSET_JS_URI') . '/runtime.js',
            null,
            Config::VERSION,
            true
        );

        if (wp_script_is('wp-i18n')) {
            $deps = [Config::withPrefix('vendors'), Config::withPrefix('runtime'), 'wp-i18n'];
        } else {
            $deps = [Config::withPrefix('vendors'), Config::withPrefix('runtime')];
        }

        wp_enqueue_script(
            Config::withPrefix('admin-script'),
            Config::get('ASSET_JS_URI') . '/index.js',
            $deps,
            Config::VERSION,
            true
        );

        wp_enqueue_style(
            Config::withPrefix('styles'),
            Config::get('ASSET_CSS_URI') . '/app.css',
            null,
            Config::VERSION,
            'screen'
        );

        $users    = get_users(['fields' => ['ID', 'user_nicename', 'user_email', 'display_name']]);
        $userMail = [];
        if (current_user_can('manage_options')) {
            foreach ($users as $key => $value) {
                $userMail[$key]['label'] = !empty($value->display_name) ? $value->display_name : '';
                $userMail[$key]['value'] = !empty($value->user_email) ? $value->user_email : '';
                $userMail[$key]['id']    = $value->ID;
            }
        }

        $scriptExtraData = apply_filters(
            'forminteg_zocacflite_localized_script',
            [
                'nonce'      => wp_create_nonce(Config::VAR_PREFIX . 'nonce'),
                'prefix'     => Config::VAR_PREFIX,
                'title'      => Config::TITLE,
                'trigger'    => Config::TRIGGER,
                'action'     => Config::ACTION,
                'assetsURL'  => Config::get('ASSET_URI'),
                'baseURL'    => Config::get('ADMIN_URL') . 'admin.php?page=' . Config::DASH_URL . '#',
                'siteURL'    => site_url(),
                'proUrl'     => Config::PRO_URL,
                'isPro'      => false,
                'ajaxURL'    => admin_url('admin-ajax.php'),
                'api'        => Config::get('API_URL'),
                'dateFormat' => get_option('date_format'),
                'timeFormat' => get_option('time_format'),
                'timeZone'   => DateTimeHelper::wp_timezone_string(),
                'userMail'   => $userMail,
            ]
        );
        if (get_locale() !== 'en_US' && file_exists(Config::get('BASEDIR') . '/languages/generatedString.php')) {
            include_once Config::get('BASEDIR') . '/languages/generatedString.php';
            $scriptExtraData['translations'] = $i18nStrings;
        }

        wp_localize_script(Config::withPrefix('admin-script'), str_replace('-', '_', Config::DASH_URL), $scriptExtraData);
    }

    /**
     * App root
     *
     * @return void
     */
    public function rootPage()
    {
        include Config::get('BASEDIR') . '/views/view-root.php';
    }

    public function RemoveAdminNotices()
    {
        // phpcs:disable
        global $plugin_page;
        if (empty($plugin_page) || strpos($plugin_page, Config::DASH_URL) === false) {
            return;
        }
        remove_all_actions('admin_notices');
        remove_all_actions('all_admin_notices');
    }
}
