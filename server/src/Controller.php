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
    
    try {
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
        case NyanCodes::MsgCodes['Pause']:
        case NyanCodes::MsgCodes['Unpause']:
          $this->reportStatus($from, $m['msg']);

          break;
        default:
          $this->sendError($from);
      }
    } catch (\Exception $e) {
      echo("[E] {$this->createConnIdString($from)} - can't process ${msg} - {$e->getMessage()}\n");
    }
  }

  public function onClose(ConnectionInterface $conn) {
    $this->disconnect($conn);
    echo("[Z] Closed connection - {$this->createConnIdString($conn)}\n");
  }

  public function onError(ConnectionInterface $conn, \Exception $e) {
    echo("[E] {$this->createConnIdString($conn)} : {$e->getMessage()}\n");
  }

  private function createConnIdString(ConnectionInterface &$conn) {
    return $conn->remoteAddress.'-'.$conn->resourceId;
  }

  private function sendError(ConnectionInterface &$src) {
    $m = NyanCodes::encodeMsg([
      'event' => 'Error',
    ]);
    $src->send($m);
    echo("[M] Sent `${m}` to {$this->createConnIdString($src)}\n");
  }

  private function newSession(ConnectionInterface &$src) {
    $ssid = $this->sessions->new();
    echo("[ ] Started session ${ssid}\n");

    $this->sessions->get($ssid)->connect($src);
    $m = NyanCodes::encodeMsg([
      'event' => 'SessionStarted',
      'params' => [ $ssid ],
    ]);
    $src->send($m);
    //echo("[M] Sent `$m` to {$this->createConnIdString($src)}\n");
  }

  private function joinSession(ConnectionInterface &$src, array $params) {
    $ssid = $params[0];
    if (!$this->sessions->is($ssid)) {
      $this->sendError($src);

      return;
    }
    $this->sessions->get($ssid)->connect($src);
  }

  private function endSession(ConnectionInterface &$src) {
    $ssid = $this->sessions->findSessionByConn($src);
    if (!$ssid) {
      return;
    }
    $owner = $this->sessions->get($ssid)->getOwner();
    if ($this->createConnIdString($owner) !== $this->createConnIdString($src)) {
      $this->sendError($src);
    }
    $this->sessions->close($ssid);
  }

  private function disconnect(ConnectionInterface &$src) {
    $ssid = $this->sessions->findSessionByConn($src);
    if (!$ssid) {
      return;
    }
    $s = $this->sessions->get($ssid);
    $s->disconnect($src);
    if (!$s->getClientsNum()) {
      $this->sessions->close($ssid);
    }
  }

  private function reportStatus(ConnectionInterface &$src, string $type) {
    $ssid = $this->sessions->findSessionByConn($src);
    if (!$ssid) {
      return;
    }
    $s = $this->sessions->get($ssid);
    if (!$s->isActive($src)) {
      return;
    }

    switch ($type) {
      case NyanCodes::MsgCodes['ApproachingEdge']:
        $next = $s->getNext($src);
        $m = NyanCodes::encodeMsg([
          'event' => 'Prepare',
        ]);
        $next->send($m);

        break;
      case NyanCodes::MsgCodes['Pause']:
      case NyanCodes::MsgCodes['Unpause']:
        $s->notifyAll($type);

        break;
      case NyanCodes::MsgCodes['HitEdge']:
        $next = $s->getNext($src);
        $m = NyanCodes::encodeMsg([
          'event' => 'StartMove',
        ]);
        $next->send($m);
        $s->active($next);

        break;
    }
  }

  private function updateSettings(ConnectionInterface &$src, array $params) {
    $ssid = $this->sessions->findSessionByConn($src);
    if (!$ssid) {
      return;
    }
    $owner = $this->sessions->get($ssid)->getOwner();
    if ($this->createConnIdString($owner) !== $this->createConnIdString($src)) {
      $this->sendError($src);
    }

    $s = $this->sessions->get($ssid);
    $s->updateParams($params);
    $m = NyanCodes::encodeMsg([
      'event' => 'SettingsUpdate',
      'params' => $params,
    ]);
    $s->notifyAll($m);
  }
}
