function NyanServer() {
  this.type = 'orig';
  this.conn = new WebSocket(__nyansrv__);
  this.session = null;

  this.link = (nyanner) => {
    this.nyanner = nyanner;
  }

  this.connect = (ssid) => {
    this.conn.send('ns');
  }
  this.newSession = () => {
    this.conn.send('ns');
  }
  this.updateSettings = () => {}
  this.pause = () => {}

  this.disconnect = () => {}

  this.connMsg = (evt) => {
    if (evt.data.indexOf('ss') === 0) {
      let t = evt.data.split(':');
      this.session = t[1];
    }

    // Server responses
    // 'Error' => 'ee',

    // 'Prepare' => 'fp',
    // 'StartMove' => 'fm',

    // 'SessionStarted' => 'ss',
    // 'SessionNewUser' => 'sc',
    // 'SessionLostUser' => 'sd',
    // 'SettingsUpdate' => 'su',
    // 'SessionTerminated' => 'se',
    // on session end - stop movement lightly
    // sync
    // sy
  }

  this.conn.onmessage = this.connMsg;

  this.event = (event) => {
    // send: hit edge
    // send: approaching + sync audio
    // send: hide
    // send: started movement
  }
  
  // receive: start move
}