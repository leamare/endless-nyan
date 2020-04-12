<?php

namespace Leamare\ENyan;

use Ratchet\ConnectionInterface;

class Session {
  private $clients = [];
  private $params = [];
  private $active = null;

  public function connect(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if (isset($this->clients[$nm])) return;
    if (empty($this->clients)) $this->active = $nm;
    $this->clients[$nm] = $client;

    $m = NyanCodes::encodeMsg([
      'event' => 'SessionNewUser'
    ]);
    $this->notifyAll($m);
  }
  public function disconnect(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if (isset($this->clients[$nm])) unset($this->clients[$nm]);
    
    $m = NyanCodes::encodeMsg([
      'event' => 'SessionLostUser'
    ]);
    $this->notifyAll($m);
  }
  public function active(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if (!isset($this->clients[$nm])) return;
    $this->active = $nm;
  }
  public function isActive(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if (!isset($this->clients[$nm])  || $this->active !== $nm) return false;
    return true;
  }

  public function getClientsNum() {
    return sizeof($this->clients);
  }
  public function isClient(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    return isset($this->clients[$nm]);
  }

  public function getOwner() {
    return array_values($this->clients)[0];
  }
  public function getPrev(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if (!isset($this->clients[$nm])) throw new \Exception("$nm is not in this connection");
    $arrk = array_keys($this->clients);
    $key = array_search($nm, $arrk);
    $sz = sizeof($arrk);
    if ($key > 0) return $this->clients[ $arrk[$key-1] ];
    return $this->clients[ $arrk[$sz-1] ];
  }
  public function getNext(ConnectionInterface $client) {
    $nm = $this->createConnIdString($client);
    if (!isset($this->clients[$nm])) throw new \Exception("$nm is not in this connection");
    $arrk = array_keys($this->clients);
    $key = array_search($nm, $arrk);
    $sz = sizeof($arrk);
    if ($key < $sz-1) return $this->clients[ $arrk[$key+1] ];
    return $this->clients[ $arrk[0] ];
  }

  public function notifyAll(string $msg) {
    foreach ($this->clients as $c)
      $c->send($msg);
  }

  public function updateParams(array $params) {
    $this->params = $params;
  }

  private function createConnIdString(ConnectionInterface &$conn) {
    return $conn->remoteAddress."-".$conn->resourceId;
  }
}