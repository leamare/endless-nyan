<?php

namespace Leamare\ENyan;

use Ratchet\ConnectionInterface;

class Sessions {
  private $sessions = [];

  public function new() {
    $nm = $this->generateSessionName();
    $this->sessions[$nm] = new Session();

    return $nm;
  }

  public function get(string $name) {
    if (isset($this->sessions[$name])) {
      return $this->sessions[$name];
    }

    throw new \Exception("No session ${name}");
  }

  public function is(string $name) {
    return isset($this->sessions[$name]);
  }

  public function close(string $name) {
    if (isset($this->sessions[$name])) {
      unset($this->sessions[$name]);
    }
  }

  public function findSessionByConn(ConnectionInterface $conn) {
    foreach ($this->sessions as $id => $s) {
      if ($s->isClient($conn)) {
        return $id;
      }
    }

    return null;
  }

  private function generateSessionName() {
    return bin2hex(random_bytes(5));
  }
}
