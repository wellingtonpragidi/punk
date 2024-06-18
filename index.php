<?php
include('config.php');
include __DIR__.'/includes/punk.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>punk editor</title>
<style>
<?php 
include __DIR__.'/assets/css/colorscheme/light.css';
include __DIR__.'/assets/css/init.css';
include __DIR__.'/assets/css/icon.css';
include __DIR__.'/assets/css/toolbar.css';
include __DIR__.'/assets/css/content.css';
include __DIR__.'/assets/css/footer.css';
include __DIR__.'/assets/css/popup-files.css';
?>
</style>
</head>
<body>
    <form method="POST" action="" enctype="multipart/form-data">
        <?php new Punk; ?>
        <textarea id="editor" name="content"></textarea>
    </form>

<script src="assets/js/punk.js"></script>
<script src="assets/js/packit.js"></script>
<script src="assets/js/icons.js" type="module"></script>
<script>
new punk ({
    selector: "#editor",
    width: "860px",
    height: "80vh",
    upload: "http://localhost/punk/includes/upload.php"
});
</script>
</body>
</html>