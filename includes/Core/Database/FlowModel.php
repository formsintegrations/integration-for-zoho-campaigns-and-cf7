<?php
/**
 * Provides Base Model Class
 */

namespace FormInteg\ZOCACFLite\Core\Database;

/**
 * Undocumented class
 */

use FormInteg\ZOCACFLite\Config;

class FlowModel extends Model
{
    protected static $table = Config::VAR_PREFIX . 'flow';
}
