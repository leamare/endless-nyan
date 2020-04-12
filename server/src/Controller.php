<?php

namespace Leamare\ENyan;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Controller implements MessageComponentInterface {
  private $sessions;

  function __construct(Sessions $s) {
    $this->sessions = $s;
  }

  public function onOpen(ConnectionInterface $conn) {
    echo("[C] New connection {$this->createConnIdString($conn)}\n");
  }

  public function onMessage(ConnectionInterface $from, $msg) {
    // echo("[M] {$this->createConnIdString($conn)} says `$msg`\n");

    $m = NyanCodes::decodeMsg($msg);

    switch ($m['msg']) {
      case NyanCodes::MsgCodes['NewSession']:
        $this->newSession($from);
        break;
      case NyanCodes::MsgCodes['JoinSession']:
        $this->joinSession($from, $m['params']);
        break;
      case NyanCodes::MsgCodes['EndSession']:
        $this->endSession($from);
        break;
      case NyanCodes::MsgCodes['Disconnect']:
        $this->disconnect($from);
        break;
      case NyanCodes::MsgCodes['SessionSettings']:
        $this->updateSettings($from, $m['params']);
        break;
      case NyanCodes::MsgCodes['ApproachingEdge']:
      case NyanCodes::MsgCodes['HitEdge']:
      case NyanCodes::MsgCodes['Hidden']:
        $this->reportStatus($from);
        break;
      default:
        $this->sendError($from);
    }
  }

  public function onClose(ConnectionInterface $conn) {
    $this->disconnect($conn);
    echo("[Z] Closed onnection - {$this->createConnIdString($conn)}\n");
  }

  public function onError(ConnectionInterface $conn, \Exception $e) {
    echo("[E] {$this->createConnIdString($conn)} : {$e->getMessage()}\n");
  }

  private function createConnIdString(ConnectionInterface &$conn) {
    return $conn->remoteAddress."-".$conn->resourceId;
  }

  private function sendError(ConnectionInterface &$src) {
    $m = NyanCodes::encodeMsg([
      'event' => 'Error'
    ]);
    $src->send($m);
    echo("[M] Sent `$m` to {$this->createConnIdString($src)}\n");
  }

  private function newSession(ConnectionInterface &$src) {}

  private function joinSession(ConnectionInterface &$src, array $params) {}

  private function endSession(ConnectionInterface &$src) {}

  private function disconnect(ConnectionInterface &$src) {}

  private function reportStatus(ConnectionInterface &$src) {}

  private function updateSettings(ConnectionInterface &$src, array $params) {}
}