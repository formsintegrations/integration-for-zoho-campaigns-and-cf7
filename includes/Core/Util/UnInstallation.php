<?php

namespace FormInteg\ZOCACFLite\Core\Util;

use FormInteg\ZOCACFLite\Config;

/**
 * Class handling plugin uninstallation.
 *
 * @since 1.0.0
 *
 * @access private
 *
 * @ignore
 */
final class UnInstallation
{
    /**
     * Registers functionality through WordPress hooks.
     *
     * @since 1.0.0-alpha
     */
    public function register()
    {
        $option = get_option(Config::withPrefix('app_conf'));
        if (isset($option->erase_db)) {
            add_action(Config::withPrefix('uninstall'), [self::class, 'uninstall']);
        }
    }

    public static function uninstall()
    {
        global $wpdb;
        $columns = [
            Config::withPrefix('db_version'),
            Config::withPrefix('installed'),
            Config::withPrefix('version'),
        ];

        $tableArray = [
            $wpdb->prefix . Config::VAR_PREFIX . 'flow',
            $wpdb->prefix . Config::VAR_PREFIX . 'log',
        ];
        foreach ($tableArray as $tablename) {
            $wpdb->query($wpdb->prepare("DROP TABLE IF EXISTS %s", $tablename));
        }

        $columns = $columns + [Config::withPrefix('app_conf')];

        foreach ($columns as $column) {
            $wpdb->query($wpdb->prepare("DELETE FROM `{$wpdb->prefix}options` WHERE option_name = %s", $column));
        }

        $prefix = Config::VAR_PREFIX . 'webhook_%';
        $wpdb->query($wpdb->prepare("DELETE FROM `{$wpdb->prefix}options` WHERE `option_name` LIKE %s", $prefix));
    }
}
