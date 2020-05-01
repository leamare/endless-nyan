const nyanmap = {
  'default': {
    begin: 'assets/default/begin.mp3',
    loop:  'assets/default/nyan.mp3'
  },
  'pusheen': {
    begin: 'assets/default/begin.mp3',
    loop:  'assets/default/nyan.mp3'
  },
  'sonic': {
    loop:  'assets/sonic/ghz.mp3'
  },
  'sonic-sunset': {
    loop:  'assets/sonic/ghz.mp3'
  },
  'marisa': {
    loop:  'assets/marisa/music.mp3'
  },
  'marisa-surf': {
    loop:  'assets/marisa/music.mp3'
  },
  'space': {
    begin: 'assets/space/begin.mp3',
    loop:  'assets/space/nyan.mp3'
  },
};

if (!localStorage.runner) {
  localStorage.runner = 'default';
}
document.getElementById('action-select').value = localStorage.runner;

let srv = new NyanServer();
let nyan = new Nyanner(
  document.getElementById('nyan'),
  srv,
  nyanmap
);

if (!localStorage.help) {
  localStorage.help = '1';
  document.getElementById('infobox').style.display = 'block';
}

document.getElementById('action-connector').onclick = () => srv.ns();
document.getElementById('action-disconnect').onclick = () => srv.leave();
document.getElementById('action-pause').onclick = () => srv.pause();
document.getElementById('action-question').onclick = () => {
  const el = document.getElementById('infobox');
  const state = el.style.display;
  if (state === 'none')
    el.style.display = 'block';
  else
    el.style.display = 'none';
};
document.getElementById('close-infobox').onclick = () => {
  document.getElementById('infobox').style.display = 'none';
};
document.getElementById('volbox').onchange = (e) => {
  let vol = +e.target.value/100;
  nyan.setVol(vol);
}

document.getElementById('action-select').onchange = (e) => {
  srv.updateSettings([ e.target.value ]);
}