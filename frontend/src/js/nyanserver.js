function NyanServer() {
  //this.type = 'default';
  this.conn = new WebSocket(__nyansrv__);
  this.session = null;
  this.container = document.getElementsByClassName('container')[0];

  this.link = (nyanner) => {
    this.nyanner = nyanner;
  }

  this.join = (ssid) => {
    this.conn.send(`js:${ssid}`);
  }
  this.newSession = () => {
    this.conn.send('ns');
    this.primary = true;
  }

  this.ns = () => {
    let ssid = document.getElementsByClassName('action-session')[0].value;
    if (ssid !== '') {
      this.join(ssid);
    } else {
      this.newSession();
    }
  }

  this.updateSettings = (params) => {
    if (this.type !== params[0]) {
      this.container.classList.remove(`${this.type}-cat`);
      this.type = params[0];
      this.container.classList.add(`${this.type}-cat`);
    }
  }

  this.leave = () => {
    this.conn.send('ds');
    this.primary = undefined;
    this.code = undefined;
    this.nyanner.status = 'idle';
    this.nyanner.idleReset();
    this.unsetSession();
  }

  this.connMsg = (evt) => {
    let cd = evt.data.split('|');
    if (cd[1] !== undefined && +cd[1] != this.code) 
      return;
    evt.data = cd[0];
    // session created
    if (evt.data.indexOf('ss') === 0) {
      let t = evt.data.split(':');
      this.setSession(t[1]);
    }
    // prepare
    if (evt.data.indexOf('fp') === 0) {
      //
    }
    // start move
    if (evt.data.indexOf('fm') === 0) {
      this.startMovement();
    }

    // session started
    if (evt.data.indexOf('ss') === 0) {
      let params = evt.data.split(':');
      console.log('Session started, ssid: '+params[1]);
      this.primary = true;
      this.setSession(params[1], this.primary);
      this.code = +params[2];
    }
    // session joined
    if (evt.data.indexOf('js') === 0) {
      let params = evt.data.split(':');
      console.log('Session joined, ssid: '+params[1]);
      this.primary = false;
      this.setSession(params[1], this.primary);
      this.code = +params[2];
      this.nyanner.stopMovement();
      this.nyanner.status = 'waiting';
      if (!this.nyanner.audio.playing()) {
        this.nyanner.audio.volume(0);
        this.nyanner.audio.play();
      }
    }
    // session new user
    if (evt.data.indexOf('sc') === 0) {
      console.log('Session new user');
    }
    // session lost user
    if (evt.data.indexOf('sd') === 0) {
      console.log('Session lost user');
    }
    // session settings update
    if (evt.data.indexOf('su') === 0) {
      let params = evt.data.split(':');
      this.updateSettings( params.slice(1) );
    }
    // session terminated
    if (evt.data.indexOf('se') === 0) {
      this.leave();
    }


    // Sync timer
    if (evt.data.indexOf('sy') === 0) {
      let params = evt.data.split(':');
      this.sync(+params[1], params.slice(2));
    }
    // Sync request
    if (evt.data.indexOf('ct') === 0) {
      this.sendSync();
    }

    // Pause
    if (evt.data === 'pp' || evt.data === 'pu') {
      this.pause(evt.data === 'pp');
    }

    // Error
    if (evt.data.indexOf('ee') === 0) {
      let err = evt.data.split(':');
      console.error('Encountered some kind of error: '+err[1]);
    }
  }

  this.conn.onmessage = this.connMsg;

  this.event = (event) => {
    if (event === 'edge') {
      this.conn.send('he');
    } else if (event === 'approaching') {
      this.conn.send('ae');
    } else if (event === 'hidden') {
      this.conn.send('hh');
    } else if (event === 'move') {
      this.sendSync();
    }
  }

  this.setSession = (ssid, primary) => {
    this.session = ssid;
    let sscont = document.getElementsByClassName('action-session')[0];
    this.container.classList.add('connected');
    sscont.value = this.session;
    sscont.setAttribute('disabled', '');
    if (primary) {
      this.container.classList.add('primary');
    }
  }

  this.unsetSession = () => {
    let sscont = document.getElementsByClassName('action-session')[0];
    this.container.classList.remove('connected');
    this.container.classList.remove('primary');
    sscont.value = '';
    sscont.removeAttribute('disabled');
  }

  this.sendSync = () => {
    this.conn.send('sy:'+this.nyanner.audio.seek()+':'+this.type);
  }

  this.sync = (time, params) => {
    this.nyanner.audio.seek(time+.05);
    this.updateSettings(params);
  }

  this.startMovement = () => {
    if (this.nyanner.status === 'idle') {
      this.nyanner.init();
    } else if (this.nyanner.status === 'waiting') {
      this.nyanner.startRunning(true);
    } else {
      this.nyanner.mvAfterHidden = true;
    }
  }

  this.pause = (pause) => {
    if (pause !== undefined) {
      this.nyanner.paused = pause;
      if (pause)
        this.nyanner.pause();
      else 
        this.nyanner.unpause();
      return;
    }

    if (this.nyanner.paused) {
      this.nyanner.paused = false;
      this.nyanner.unpause();
    } else {
      if (this.nyanner.status === 'idle') {
        this.nyanner.init();
      } else if (this.nyanner.status === 'waiting') {
        this.nyanner.startRunning(true);
      } else {
        this.nyanner.pause();
        this.nyanner.paused = true;
      }
    }
  }

  this.updateSettings([ 'default' ]);
}