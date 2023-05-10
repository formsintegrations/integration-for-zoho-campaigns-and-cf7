<?php

namespace FormInteg\ZOCACFLite\Actions;

use FilesystemIterator;
use FormInteg\ZOCACFLite\Config;
use WP_Error;
use WP_REST_Request;

final class ActionController
{
    /**
     * Lists available actions
     *
     * @return JSON|WP_Error
     */
    // public function list()
    // {
    //     $actions = [];
    //     $dirs = new FilesystemIterator(__DIR__);
    //     foreach ($dirs as $dirInfo) {
    //         if ($dirInfo->isDir()) {
    //             $action = basename($dirInfo);
    //             if (
    //                 file_exists(__DIR__ . '/' . $action)
    //                 && file_exists(__DIR__ . '/' . $action . '/' . $action . 'Controller.php')
    //             ) {
    //                 $action_controller = __NAMESPACE__ . "\\{$action}\\{$action}Controller";
    //                 if (method_exists($action_controller, 'info')) {
    //                     $actions[$action] = $action_controller::info();
    //                 }
    //             }
    //         }
    //     }
    //     return $actions;
    // }

    public function handleRedirect(WP_REST_Request $request)
    {
        $state      = esc_url_raw($request->get_param('state'));
        if (strpos($state, Config::get('SITE_URL')) === false) {
            return new WP_Error('404');
        }

        $params = $request->get_params();
        unset($params['rest_route'], $params['state']);
        if (wp_safe_redirect($state . '&' . http_build_query($params), 302)) {
            exit;
        }
    }
}
