<?php
require '../vendor/autoload.php';
require_once '../Application/Layouts/head.php';

$app = new \Slim\Slim();
require_once '../Application/Layouts/head.php';
$app->get('/', function ()
{
    require_once '../Application/Modules/Home.php';
});
$app->run();

require_once '../Application/Layouts/footer.php';