export function addActiveClass(modal) {
  if (modal == null) return
  modal.classList.add('active')
}

export function removeActiveClass(modal) {
  if (modal == null) return
  modal.classList.remove('active')
}

export const initialPath = (() => location.pathname.split("/")
.slice(0, location.pathname.split("/").length - 1))()
.join("/");