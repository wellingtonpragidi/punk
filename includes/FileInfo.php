<?php
/**
 * filename
 * extension
 * mimetype
 * size
 * dimension
 */
class FileInfo {

    const PERIOD = ".";

    /** 
     * 
     * a variavel $file_name pode tanto ser o arquivo por diretorio, url ou só o nome do arquivo
     * 
     * */

    static function filename($file_name, $with_ext = true) {
        if($with_ext == false)
            return pathinfo($file_name, PATHINFO_FILENAME);
        else
            return basename($file_name);
    }

    static function extension($file_name, $period = false) {
        if($period == true)
            return self::PERIOD.pathinfo($file_name, PATHINFO_EXTENSION);
        else
            return pathinfo($file_name, PATHINFO_EXTENSION);
    }

    /**
     * @link https://www.php.net/manual/pt_BR/function.finfo-open.php 
     * */
    static function mimetype($file_dir) {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        return $finfo->file($file_dir);
    }

    static function size($file_dir) {
        $size = filesize($file_dir);
        $units = array('B', 'KB', 'MB');
        $power = (($size > 0) ? log($size, 1024) : 0);
        $proportion = number_format($size / pow(1024, $power), 2, ',', '.');
        //$proportion = intval($proportion);
        return $proportion.' '.$units[$power];
    }

    static function dimension($file_url) {
        if( in_array(pathinfo($file_url, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'webp', 'gif']) ) {
            $width = number_format(getimagesize($file_url)[0], 0, '.', '.');
            $height = number_format(getimagesize($file_url)[1], 0, '.', '.');
            if($width != null && $height != null)
                return $width.' &times; '.$height;
        }
    }

}