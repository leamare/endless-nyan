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
document.getElementsByClassName('action-select')[0].value = localStorage.runner;

let srv = new NyanServer();
let nyan = new Nyanner(
  document.getElementById('nyan'),
  srv,
  nyanmap
);

if (!localStorage.help) {
  localStorage.help = '1';
  document.getElementsByClassName('infobox')[0].style.display = 'block';
}

document.getElementsByClassName('action-connector')[0].onclick = () => srv.ns();
document.getElementsByClassName('action-disconnect')[0].onclick = () => srv.leave();
document.getElementsByClassName('action-pause')[0].onclick = () => srv.pause();
document.getElementsByClassName('action-question')[0].onclick = () => {
  const el = document.getElementsByClassName('infobox')[0];
  const state = el.style.display;
  if (state === 'none')
    el.style.display = 'block';
  else
    el.style.display = 'none';
};
document.getElementsByClassName('close-infobox')[0].onclick = () => {
  document.getElementsByClassName('infobox')[0].style.display = 'none';
};
document.getElementsByClassName('slider')[0].onchange = (e) => {
  let vol = +e.target.value/100;
  nyan.setVol(vol);
}

document.getElementsByClassName('action-select')[0].onchange = (e) => {
  srv.updateSettings([ e.target.value ]);
}