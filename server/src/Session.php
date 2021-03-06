<?php

namespace Leamare\ENyan;

use Ratchet\ConnectionInterface;

class Session {
  private $clients = [];
  private $codes = [];

  private $params = [];

  private $active = null;

  public function connect(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if (isset($this->clients[$nm])) {
      return;
    }
    if (empty($this->clients)) {
      $this->active = $nm;
    }

    $m = NyanCodes::encodeMsg([
      'event' => 'SessionNewUser',
    ]);
    $this->notifyAll($m);

    $this->clients[$nm] = $client;
    $this->codes[$nm] = rand(0, 99);

    $m = NyanCodes::encodeMsg([
      'event' => 'JoinSession',
    ]);
    return $this->codes[$nm];
  }

  public function disconnect(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if (isset($this->clients[$nm])) {
      unset($this->clients[$nm]);
      unset($this->codes[$nm]);
    }
    
    $m = NyanCodes::encodeMsg([
      'event' => 'SessionLostUser',
    ]);
    $this->notifyAll($m);
  }

  public function active(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if (!isset($this->clients[$nm])) {
      return;
    }
    $this->active = $nm;
  }

  public function isActive(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if ($this->active != $nm) {
      return false;
    }

    return true;
  }

  public function getClientsNum() {
    return sizeof($this->clients);
  }

  public function isClient(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);

    return isset($this->clients[$nm]);
  }

  public function clientCode(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);

    return $this->codes[$nm] ?? false;
  }

  public function getOwner() {
    return array_values($this->clients)[0];
  }

  public function getPrev(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if (!isset($this->clients[$nm])) {
      throw new \Exception("${nm} is not in this connection");
    }
    $arrk = array_keys($this->clients);
    $key = array_search($nm, $arrk);
    $sz = sizeof($arrk);
    if ($key > 0) {
      return $this->clients[$arrk[$key-1]];
    }

    return $this->clients[$arrk[$sz-1]];
  }

  public function getNext(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if (!isset($this->clients[$nm])) {
      throw new \Exception("${nm} is not in this connection");
    }
    $arrk = array_keys($this->clients);
    $key = array_search($nm, $arrk);
    
    $sz = sizeof($arrk);
    if ($key < $sz-1) {
      $resk = $key+1;
    } else {
      $resk = 0;
    }

    return $this->clients[$arrk[$resk]];
  }

  public function notifyAll(string $msg, ?string $exception = null) {
    foreach ($this->clients as $c) {
      if ($exception && $exception == $this->createConnIdString($c)) {
        continue;
      }
      $c->send($msg);
    }
  }

  public function updateParams(array $params) {
    $this->params = $params;
  }

  private function createConnIdString(ConnectionInterface &$conn) {
    return $conn->remoteAddress.'-'.$conn->resourceId;
  }
}
