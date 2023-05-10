<?php

namespace FormInteg\ZOCACFLite\Core\Hooks;

use FilesystemIterator;
use FormInteg\ZOCACFLite\Admin\AdminAjax;
use FormInteg\ZOCACFLite\Config;
use FormInteg\ZOCACFLite\Core\Util\Hooks;
use FormInteg\ZOCACFLite\Core\Util\Request;

class HookService
{
    public function __construct()
    {
        $this->loadTriggersAjax();
        $this->loadAppHooks();
        $this->loadActionsHooks();
        $this->loadAdminAjax();
        Hooks::add('rest_api_init', [$this, 'loadApi']);
    }

    /**
     * Helps to register admin side ajax
     *
     * @return null
     */
    public function loadAdminAjax()
    {
        (new AdminAjax())->register();
    }

    /**
     * Helps to register integration ajax
     *
     * @return void
     */
    public function loadActionsHooks()
    {
        $this->_includeTaskHooks('Actions');
    }

    /**
     * Loads API routes
     *
     * @return null
     */
    public function loadApi()
    {
        if (is_readable(Config::get('BASEDIR') . 'includes' . DIRECTORY_SEPARATOR . 'Routes' . DIRECTORY_SEPARATOR . 'api.php')) {
            include Config::get('BASEDIR') . 'includes' . DIRECTORY_SEPARATOR . 'Routes' . DIRECTORY_SEPARATOR . 'api.php';
        }
    }

    /**
     * Helps to register App hooks
     *
     * @return null
     */
    protected function loadAppHooks()
    {
        if (Request::Check('ajax') && is_readable(Config::get('BASEDIR') . 'includes' . DIRECTORY_SEPARATOR . 'Routes' . DIRECTORY_SEPARATOR . 'ajax.php')) {
            include Config::get('BASEDIR') . 'includes' . DIRECTORY_SEPARATOR . 'Routes' . DIRECTORY_SEPARATOR . 'ajax.php';
        }

        if (is_readable(Config::get('BASEDIR') . 'includes' . DIRECTORY_SEPARATOR . 'hooks.php')) {
            include Config::get('BASEDIR') . 'includes' . DIRECTORY_SEPARATOR . 'hooks.php';
        }
    }

    /**
     * Helps to register Triggers ajax
     *
     * @return null
     */
    protected function loadTriggersAjax()
    {
        $this->_includeTaskHooks('Triggers');
    }

    /**
     * Includes Routes and Hooks
     *
     * @param string $taskName Triggers|Actions
     *
     * @return void
     */
    private function _includeTaskHooks($taskName)
    {
        $taskDir = Config::get('BASEDIR') . 'includes' . DIRECTORY_SEPARATOR . $taskName;
        $dirs    = new FilesystemIterator($taskDir);
        foreach ($dirs as $dirInfo) {
            if ($dirInfo->isDir()) {
                $taskName = basename($dirInfo);
                $taskPath = $taskDir . DIRECTORY_SEPARATOR . $taskName . DIRECTORY_SEPARATOR;
                if (is_readable($taskPath . 'Routes.php') && Request::Check('ajax') && Request::Check('admin')) {
                    include $taskPath . 'Routes.php';
                }

                if (is_readable($taskPath . 'Hooks.php')) {
                    include $taskPath . 'Hooks.php';
                }
            }
        }
    }
}
