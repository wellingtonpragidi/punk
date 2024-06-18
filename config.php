<?php

define( 'PATH', str_replace("\\", "/", __DIR__) );

$protocol = isset($_SERVER["HTTPS"]) ? 'https://' : 'http://';

$current = $protocol.$_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];

function uri($extend = '') {
    global $protocol;
    $root = PATH.'/';
    $root = str_replace($_SERVER["DOCUMENT_ROOT"], $_SERVER["SERVER_NAME"], $root);
    return $protocol.$root.$extend;
}