let srv = new NyanServer();
let nyan = new Nyanner(
  document.getElementById('nyan'),
  srv
);

document.getElementsByClassName('action-connector')[0].onclick = () => srv.ns();
document.getElementsByClassName('action-disconnect')[0].onclick = () => srv.leave();
document.getElementsByClassName('action-pause')[0].onclick = () => srv.pause();