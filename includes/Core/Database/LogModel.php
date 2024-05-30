<?php
/**
 * Provides Base Model Class
 */

namespace FormInteg\ZOCACFLite\Core\Database;

/**
 * Undocumented class
 */

use FormInteg\ZOCACFLite\Config;

class LogModel extends Model
{
    protected static $table = Config::VAR_PREFIX . 'log';

    public function autoLogDelete($interval)
    {
        global $wpdb;
        if (
            !\is_null($interval)
        ) {
            $tableName = $wpdb->prefix . static::$table;

            $result = $this->app_db->get_results($wpdb->prepare("DELETE FROM {$tableName} WHERE DATE_ADD(date(created_at), INTERVAL {%d} DAY) < CURRENT_DATE", $interval), OBJECT_K);

            return $result;
        }
    }
}
