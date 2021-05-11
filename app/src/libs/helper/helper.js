export function addActiveClass(modal) {
  if (modal == null) return
  modal.classList.add('active')
}

export function removeActiveClass(modal) {
  if (modal == null) return
  modal.classList.remove('active')
}