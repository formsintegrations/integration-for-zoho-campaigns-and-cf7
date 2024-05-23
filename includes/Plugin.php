<?php

namespace FormInteg\ZOCACFLite;

/**
 * Main class for the plugin.
 *
 * @since 1.0.0-alpha
 */

use FormInteg\ZOCACFLite\Admin\Admin_Bar;
use FormInteg\ZOCACFLite\Core\Database\DB;
use FormInteg\ZOCACFLite\Core\Hooks\HookService;
use FormInteg\ZOCACFLite\Core\Hooks\InstallerProvider;
use FormInteg\ZOCACFLite\Core\Util\Activation;
use FormInteg\ZOCACFLite\Core\Util\Capabilities;
use FormInteg\ZOCACFLite\Core\Util\Deactivation;
use FormInteg\ZOCACFLite\Core\Util\Hooks;
use FormInteg\ZOCACFLite\Core\Util\Request;
use FormInteg\ZOCACFLite\Core\Util\UnInstallation;
use FormInteg\ZOCACFLite\Log\LogHandler;

final class Plugin
{
    /**
     * Main instance of the plugin.
     *
     * @since 1.0.0-alpha
     *
     * @var Plugin|null
     */
    private static $_instance;

    /**
     * Initialize the hooks
     *
     * @return void
     */
    public function initialize()
    {
        Hooks::add('plugins_loaded', [$this, 'loaded'], 12);
        (new Activation())->activate();
        (new Deactivation())->register();
        (new UnInstallation())->register();
        new InstallerProvider();
    }

    public function loaded()
    {
        Hooks::add('init', [$this, 'initClasses'], 8);
        Hooks::add('init', [$this, 'deleteIntegrationLog'], 11);
        Hooks::filter('plugin_action_links_' . Config::get('BASENAME'), [$this, 'actionLinks']);
    }

    /**
     * Instantiate the required classes
     *
     * @return void
     */
    public function initClasses()
    {
        static::migrateTables();
        if (Request::Check('admin')) {
            (new Admin_Bar())->register();
        }

        new HookService();
    }

    /**
     * Plugin action links
     *
     * @param array $links
     *
     * @return array
     */
    public function actionLinks($links)
    {
        $linksToAdd = Config::get('PLUGIN_PAGE_LINKS');
        foreach ($linksToAdd as $link) {
            $attr    = isset($link['attr']) ? $link['attr'] : '';
            $links[] = '<a ' . $attr . ' href="' . $link['url'] . '">' . $link['title'] . '</a>';
        }

        return $links;
    }

    /**
     * Retrieves the main instance of the plugin.
     *
     * @since 1.0.0-alpha
     *
     * @return Plugin Plugin main instance.
     */
    public static function instance()
    {
        return static::$_instance;
    }

    public static function migrateTables()
    {
        if (!Capabilities::Check('manage_options')) {
            return;
        }

        if (Config::DB_VERSION != Config::getOption('db_version')) {
            DB::migrate();
        }
    }

    public static function deleteIntegrationLog()
    {
        $option = get_option(Config::withPrefix('app_conf'));
        if (isset($option->enable_log_del, $option->day)) {
            LogHandler::logAutoDelete($option->day);
        }
    }

    public static function load()
    {
        if (static::$_instance !== null) {
            return false;
        }

        static::$_instance = new static();
        static::$_instance->initialize();

        return true;
    }
}
