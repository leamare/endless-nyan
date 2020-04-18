function Nyanner(elem, server) {
  this.srv = server;
  server.link(this);

  this.el = elem;
  this.moveTimer = null;

  this.status = 'waiting';

  this.audio = new Howl({
    preload: true,
    loop: true,
    src: [`assets/${server.type || 'orig'}/nyan.mp3`]
  });

  this.speed = 0.1;
  this.timer = 40;

  this.beginAudio = new Audio(`assets/${server.type || 'orig'}/begin.mp3`);
  this.beginAudio.load();

  this.init = () => {
    // play init music
    // 
    this.stopNyan();
    this.el.style.left = '-80%';
    
    this.beginAudio.play();
    this.beginAudio.addEventListener('timeupdate', () => {
      const buffer = .27;
      if (this.beginAudio.currentTime > this.beginAudio.duration - buffer) {
        this.startRunning();
        this.beginAudio.pause();
        this.beginAudio.currentTime = 0;
      }
    });
  }

  let runnerFunc = () => {
    let val = (+this.el.style.left.replace('%', ''))+this.speed;
    if (val > 80 && this.status === 'over') {
      this.hidden();
    } else if (-val < this.speed && this.status === 'approaching') {
      this.hitEdge();
    } else if (-val < this.speed * this.timer * 1.3 && this.status === 'running') {
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
    this.el.style.left = '-105%';
    if (this.moveTimer) {
      clearInterval(this.moveTimer);
      this.moveTimer = null;
    }
  }

  this.startRunning = (fade = false) => {
    if (fade)
      this.audio.fade(0, 1, this.timer * (50 / this.speed));
    else 
      this.audio.play();
    this.srv.event('running'); // set timing for all clients
    this.status = 'running';
    this.startMovement(fade);
  }

  this.stopNyan = () => {
    this.audio.stop();
    this.stopMovement();
  }

  this.hitEdge = () => {
    console.log('hit edge');
    this.srv.event('edge');
    this.status = 'over';
    this.audio.fade(1, 0, this.timer * (50 / this.speed));
  }

  this.approachingEdge = () => {
    if (this.status === 'approaching')
      return;
    console.log('approaching edge');
    this.srv.event('approaching');
    this.status = 'approaching';
  }

  this.hidden = () => {
    if (this.status === 'waiting')
      return;
    console.log('completely hidden');
    this.srv.event('hidden');
    this.status = 'waiting';
    this.stopMovement();
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
}