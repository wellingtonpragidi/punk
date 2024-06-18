<?php
include_once(dirname(__DIR__).'/config.php');

$filename = $_FILES["filepunk"]["name"];

$guid = 'uploads/30/';

$path = PATH.'/'.$guid;

if(!is_dir($path))
    mkdir($path, 0777, true);

move_uploaded_file( $_FILES["filepunk"]["tmp_name"], $path.$filename );

echo json_encode([
    'path'  => $path.$filename,
    'url'   => uri($guid.$filename)
]);














/*
$filename = $_FILES["filepunk"]["name"];

$path = dirname(__DIR__);

$path = str_replace("\\", "/", $path);
$path = $path.'/uploads/'.date('i').'/';
$path = is_dir($path) ? $path : mkdir($path, 0777, true);

move_uploaded_file( $_FILES["filepunk"]["tmp_name"], $path.$filename );


$protocol = isset($_SERVER["HTTPS"]) ? 'https://' : 'http://';
$base = str_replace($_SERVER["DOCUMENT_ROOT"], $_SERVER["SERVER_NAME"], $path);

echo json_encode([
    'path'  => $path.$filename,
    'url'   => $protocol.$base.$filename
]);
*/