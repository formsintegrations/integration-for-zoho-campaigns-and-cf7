<?php

namespace FormInteg\ZOCACFLite\Core\Util;

use FormInteg\ZOCACFLite\Config;
use FormInteg\ZOCACFLite\Core\Database\DB;

/**
 * Class handling plugin activation.
 *
 * @since 1.0.0
 */
final class Activation
{
    public function activate()
    {
        add_action(Config::withPrefix('activate'), [$this, 'install']);
    }

    public function install()
    {
        $this->installAsSingleSite();
    }

    public function installAsSingleSite()
    {
        $installed = get_option(Config::withPrefix('installed'));
        if ($installed) {
            $oldVersion = get_option(Config::withPrefix('version'));
        }

        if (!$installed || version_compare($oldVersion, Config::VERSION, '!=')) {
            DB::migrate();
            update_option(Config::withPrefix('installed'), time());
        }

        update_option(Config::withPrefix('version'), Config::VERSION);
    }
}
