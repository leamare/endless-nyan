<?php


use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

use Leamare\ENyan\Controller;
use Leamare\ENyan\Sessions;

require dirname(__DIR__) . '/vendor/autoload.php';

$config = \json_decode(\file_get_contents('config.json'), true);

$loop = React\EventLoop\Factory::create();

if ($config['ws']) {
  echo("[ ] Starting WebSocket server!\n");
  $server = IoServer::factory(
    new HttpServer(
        new WsServer(
          new Controller(new Sessions())
        )
    ),
    $config['port']
  );
} else {
  echo("[ ] Starting simple sockets server!\n");
  $server = IoServer::factory(
    new Controller(new Sessions()),
    $config['port']
  );
}

echo("[ ] Nyanning on port {$config['port']}!!\n");
$server->run();
