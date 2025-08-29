export function click() {
  const burger = document.getElementById('burger-menu')!;
  const nav = document.getElementsByTagName('nav')[0];

  burger.addEventListener('click', () => {
    burger.classList.toggle('rotate');
    nav.classList.toggle('show');
  });
}