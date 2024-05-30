<?php

namespace FormInteg\ZOCACFLite\Core\Hooks;

use FormInteg\ZOCACFLite\Config;
use FormInteg\ZOCACFLite\Core\Util\Hooks;

class InstallerProvider
{
    private static $_activateHook;

    private static $_deactivateHook;

    private static $_uninstallHook;

    public function __construct()
    {
        register_activation_hook(Config::get('MAIN_FILE'), [self::class, 'registerActivator']);
        register_deactivation_hook(Config::get('MAIN_FILE'), [self::class, 'registerDeactivator']);
        self::$_activateHook   = Config::withPrefix('activate');
        self::$_deactivateHook = Config::withPrefix('deactivate');
        self::$_uninstallHook  = Config::withPrefix('uninstall');

        Hooks::add(self::$_deactivateHook, [self::class, 'deactivate']);

        // Only a static class method or function can be used in an uninstall hook.
        register_uninstall_hook(Config::get('MAIN_FILE'), [self::class, 'registerUninstaller']);
    }


    public  static function deactivate($networkWide)
    {
        // TODO: things to when plugin is deactivate
    }

    public static function registerActivator($networkWide)
    {
        //phpcs:disable
        global $wp_version;
        if (version_compare($wp_version, Config::REQUIRED_WP_VERSION, '<')) {
            wp_die(
                esc_html('This plugin requires WordPress version 5.1 or higher.'),
                esc_html('Error Activating')
            );
        }

        if (version_compare(PHP_VERSION, Config::REQUIRED_PHP_VERSION, '<')) {
            wp_die(
                esc_html('Forms Integrations requires PHP version 5.6.'),
                esc_html('Error Activating')
            );
        }

        Hooks::run(self::$_activateHook, $networkWide);
    }

    public static function registerDeactivator($networkWide)
    {
        Hooks::run(self::$_deactivateHook, $networkWide);
    }

    public static function registerUninstaller($networkWide)
    {
        Hooks::run(self::$_uninstallHook, $networkWide);
    }
}
