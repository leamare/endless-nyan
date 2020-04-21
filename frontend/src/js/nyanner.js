function Nyanner(elem, server) {
  this.srv = server;
  server.link(this);

  this.el = elem;
  this.moveTimer = null;

  this.status = 'idle';
  this.maxvol = 1;

  this.audio = new Howl({
    preload: true,
    loop: true,
    src: [`assets/${server.type || 'default'}/nyan.mp3`]
  });

  this.paused = false;
  this.mvAfterHidden = false;

  this.speed = 0.5;
  this.timer = 40;

  this.beginAudio = new Howl({
    preload: true,
    loop: false,
    src: [`assets/${server.type || 'default'}/begin.mp3`]
  });

  this.idleReset = () => {
    this.el.style.left = undefined;
  }

  this.init = () => {
    // play init music
    // 
    this.stopNyan();
    this.el.style.left = '-80%';
    
    this.beginAudio.volume(this.maxvol);
    this.beginAudio.play();
    this.beginAudio.on('end', () => {
      this.startRunning();
    })
  }

  let runnerFunc = () => {
    if (this.status === 'waiting') {
      return;
    }
    let val = (+this.el.style.left.replace('%', ''))+this.speed;
    if (val > 80 && this.status === 'over') {
      this.hidden();
    } else if (-val < this.speed * 0.2 && this.status === 'approaching') {
      this.hitEdge();
    } else if (-val < this.speed * this.timer && this.status === 'running') {
      this.approachingEdge();
    }
    
    this.el.style.left = val+'%';
  };

  this.startMovement = (reset = true) => {
    if (reset) {
      this.el.style.display = 'hidden';
      this.stopMovement();
      this.el.style.display = 'block';
    }
    this.moveTimer = setInterval(
      runnerFunc,
      this.timer
    );
  }

  this.stopMovement = () => {
    if (this.moveTimer) {
      clearInterval(this.moveTimer);
      this.moveTimer = null;
    }
    setTimeout(() => {
      if (this.status !== 'idle')
        this.el.style.left = '-100.5%';
    }, 1);
  }

  this.startRunning = (fade = false) => {
    if (fade) {
      this.audio.fade(0, this.maxvol, this.timer * (50 / this.speed));
    } else { 
      this.audio.play();
    }
    this.srv.event('running'); // set timing for all clients
    this.status = 'running';
    this.startMovement(fade);
  }

  this.stopNyan = () => {
    this.audio.stop();
    this.stopMovement();
  }

  this.hitEdge = () => {
    //console.log('hit edge');
    this.srv.event('edge');
    this.status = 'over';
    this.audio.fade(this.audio.volume(), 0, this.timer * (50 / this.speed));
  }

  this.approachingEdge = () => {
    if (this.status === 'approaching')
      return;
    //console.log('approaching edge');
    this.srv.event('approaching');
    this.status = 'approaching';
  }

  this.hidden = () => {
    if (this.status === 'waiting')
      return;
    //console.log('completely hidden');
    this.srv.event('hidden');
    this.status = 'waiting';
    this.stopMovement();
    if (this.mvAfterHidden) {
      this.mvAfterHidden = false;
      this.startRunning(true);
    }
  }

  this.pause = () => {
    if (this.moveTimer) {
      clearInterval(this.moveTimer);
      this.moveTimer = -1;
    }
  }

  this.unpause = () => {
    if (this.moveTimer === -1) {
      this.moveTimer = setInterval(
        runnerFunc,
        this.timer
      );
    }
  }

  this.setVol = (vol) => {
    let k = this.maxvol/this.audio.volume();
    this.audio.volume(vol*k);
    this.maxvol = vol;
  }
}