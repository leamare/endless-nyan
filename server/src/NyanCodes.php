<?php

namespace Leamare\ENyan;

class NyanCodes {
  const MsgCodes = [
    // Session status
    'NewSession' => 'ns',
    'JoinSession' => 'js',
    'EndSession' => 'es',
    'Disconnect' => 'ds',

    // Nyan status
    'ApproachingEdge' => 'ae',
    'HitEdge' => 'he',
    'Hidden' => 'hh',
    'Moving' => 'mm',
    'Pause' => 'pp',
    'Unpause' => 'pu',
    'Ping' => 'pi',

    //
    'SessionSettings' => 'st',

    // Server responses
    'Error' => 'ee',

    'Prepare' => 'fp',
    'StartMove' => 'fm',

    'SessionStarted' => 'ss',
    'SessionNewUser' => 'sc',
    'SessionLostUser' => 'sd',
    'SettingsUpdate' => 'su',
    'SessionTerminated' => 'se',
    'YouHost' => 'sh',
    
    'SyncRequest' => 'ct',
    'SyncData' => 'sy',
  ];

  public static function decodeMsg(string $msg): array {
    $args = explode(':', $msg);
    $code = array_shift($args);
    $r = [];

    foreach (self::MsgCodes as $event => $c) {
      if ($code === $c) {
        $r['event'] = $event;
        $r['msg'] = $c;

        break;
      }
    }
    if (!isset($r['event'])) {
      $r['event'] = 'Unknown';
      $r['msg'] = '';
    }

    $r['params'] = $args;

    return $r;
  }

  public static function encodeMsg(array $msg): string {
    if (!isset(self::MsgCodes[$msg['event']])) {
      throw new \Exception("No event {$msg['event']}");
    }
    
    $r = $msg['params'] ?? [];
    array_unshift($r, self::MsgCodes[$msg['event']]);

    return implode(':', $r);
  }
}
