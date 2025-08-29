export function date() {
  const year = new Date().getFullYear();
  const footer = document.getElementsByTagName('footer')[0];
  const rights = footer.getElementsByTagName('p')[0]
  rights.innerHTML = `&copy; ${year} ${rights.innerHTML}`;
}