<?php

namespace FormInteg\ZOCACFLite\Admin;

use FormInteg\ZOCACFLite\Config;
use FormInteg\ZOCACFLite\Core\Util\Route;

class AdminAjax
{
    public function register()
    {
        Route::post('app/config', [$this, 'updatedAppConfig']);
        Route::get('get/config', [$this, 'getAppConfig']);
    }

    public function updatedAppConfig($data)
    {
        if (!property_exists($data, 'data')) {
            wp_send_json_error(__('Data can\'t be empty', 'fitzocacf'));
        }

        update_option(Config::withPrefix('app_conf'), $data->data);
        wp_send_json_success(__('save successfully done', 'fitzocacf'));
    }

    public function getAppConfig()
    {
        $data = get_option(Config::withPrefix('app_conf'));
        wp_send_json_success($data);
    }
}
