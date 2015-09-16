<?php
require '../vendor/autoload.php';
require_once '../Application/Layouts/header.php';

$app = new \Slim\Slim();
$app->get('/', function ()
{
    require_once '../Application/Modules/Home.php';
});
$app->run();

require_once '../Application/Layouts/footer.php';