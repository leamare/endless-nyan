let srv = new NyanServer();
let nyan = new Nyanner(
  document.getElementById('nyan'),
  srv
);

document.getElementsByClassName('action-connector')[0].onclick = () => srv.ns();
document.getElementsByClassName('action-disconnect')[0].onclick = () => srv.leave();
document.getElementsByClassName('action-pause')[0].onclick = () => srv.pause();
document.getElementsByClassName('action-question')[0].onclick = () => {
  alert('This is nyan cat that runs from one screen to another. Create a session, give your code to friends so they join you. Start moving! https://github.com/leamare/endless-nyan')
};
document.getElementsByClassName('slider')[0].onchange = (e) => {
  let vol = +e.target.value/100;
  nyan.setVol(vol);
}