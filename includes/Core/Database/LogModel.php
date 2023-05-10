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

    public function autoLogDelete($condition)
    {
        global $wpdb;
        if (
            !\is_null($condition)
        ) {
            $tableName = $wpdb->prefix . static::$table;

            $result = $this->app_db->get_results("DELETE FROM {$tableName} WHERE {$condition}", OBJECT_K);

            return $result;
        }
    }
}
