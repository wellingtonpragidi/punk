<div id="callback"></div>
<?php
include dirname(__DIR__).'/includes/FileInfo.php';
//$url = uri('punk/uploads/');
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator(dirname(__DIR__).'/uploads/'),
    RecursiveIteratorIterator::SELF_FIRST
);
foreach($iterator as $file) :
    if($file->isDir()) continue;
    $url = str_replace($_SERVER["DOCUMENT_ROOT"], $_SERVER["SERVER_NAME"], $file->getRealPath());
    //$url = uri('punk/uploads/');
    switch($file->getExtension()) {
        case 'jpg': case 'jpeg': case 'png': case 'webp': case 'gif':
            echo '<div>
                <label><input type="radio" name="thumbnail" />
                    <div>
                        <img src="'.$url.$file->getFilename().'" alt="" loading="lazy" width="250" height="250" />
                        <input type="" id="file-dir" value="'.$file->getRealPath().'" />
                        <input type="" id="file-url" value="'.$url.$file->getFilename().'" />
                        <p class="filename">'.FileInfo::filename($file->getRealPath()).'</p>
                        <p class="ext">'.FileInfo::extension($file->getRealPath()).'</p>
                        <p class="mime">'.Fileinfo::mimetype($file->getRealPath()).'</p>
                        <p class="size">'.filesize($file->getRealPath()).'</p>
                        <p class="dimension">'.Fileinfo::dimension($file->getRealPath()).'</p>
                    </div>
                </label>
            </div>';
        break;
        case 'mp3':
            echo '<div>
                <label><input type="radio" name="thumbnail" />
                    <div>
                        <img src="assets/img/audio.png" alt="" />
                        <input type="hidden" value="'.__DIR__.'/img/02.webp" loading="lazy" width="250" height="250" />
                        <p class="filename">'.FileInfo::filename($file->getRealPath()).'</p>
                        <p class="ext">'.FileInfo::extension($file->getRealPath()).'</p>
                        <p class="mime">'.Fileinfo::mimetype($file->getRealPath()).'</p>
                        <p class="size">'.filesize($file->getRealPath()).'</p>
                        <p class="dimension">'.Fileinfo::dimension($file->getRealPath()).'</p>
                    </div>
                </label>
            </div>';
        break;
        case 'mp4':
            echo '<div>
                <label><input type="radio" name="thumbnail" />
                    <div>
                        <img src="assets/img/video.png" alt="" />
                        <input type="hidden" value="'.__DIR__.'/img/02.webp" loading="lazy" width="250" height="250" />
                        <p class="filename">'.FileInfo::filename($file->getRealPath()).'</p>
                        <p class="ext">'.FileInfo::extension($file->getRealPath()).'</p>
                        <p class="mime">'.Fileinfo::mimetype($file->getRealPath()).'</p>
                        <p class="size">'.filesize($file->getRealPath()).'</p>
                        <p class="dimension">'.Fileinfo::dimension($file->getRealPath()).'</p>
                    </div>
                </label>
            </div>';
        default:
            echo '<div>
                <label>
                    <input type="radio" name="thumbnail" />
                    <div>
                        <img src="assets/img/generic.png" alt="" loading="lazy" width="250" height="250" />
                        <input type="hidden" value="'.__DIR__.'/img/02.webp" />
                        <p class="filename">'.FileInfo::filename($file->getRealPath()).'</p>
                        <p class="ext">'.FileInfo::extension($file->getRealPath()).'</p>
                        <p class="mime">'.Fileinfo::mimetype($file->getRealPath()).'</p>
                        <p class="size">'.filesize($file->getRealPath()).'</p>
                        <p class="dimension">'.Fileinfo::dimension($file->getRealPath()).'</p>
                    </div>
                </label>
            </div>';
        break;
    }
endforeach;