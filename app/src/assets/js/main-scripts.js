
// CUSTOM TAB
const content_body = document.querySelectorAll(".recipe-wrapper")
const un_button = document.querySelectorAll("[data-id]")

un_button.forEach(button => {
    button.addEventListener("click", (e) => {
        var target_id = findTargetForEvent(e, 'data-id')

        un_button.forEach(buttons => {
            removeActiveClass(buttons)
        })
        content_body.forEach(target => {
            removeActiveClass(target)
        })
        addActiveClass(target_id)
        addActiveClass(e.target)
        
    })
})


// First Popup
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        addActiveClass(modal)
        addActiveClass(overlay)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        removeActiveClass(modal)
        removeActiveClass(overlay)
    })
})


// Second Popup
const openPordessingModal = document.querySelectorAll('[data-modal-target-processing]')

openPordessingModal.forEach(button => {
    button.addEventListener('click', (event) => {
        const modal = findTargetForEvent(event, 'data-modal-target-processing')
        const prevmodal = findPreviousSibling("processing")
        removeActiveClass(prevmodal)
        addActiveClass(modal)
    })
})

// Thard Popup
const openFatigModal = document.querySelectorAll('[data-modal-target-fatig]')

openFatigModal.forEach(button => {
    button.addEventListener('click', (event) => {
        const modal = findTargetForEvent(event, 'data-modal-target-fatig')
        const prevmodal = findPreviousSibling("fatig")
        removeActiveClass(prevmodal)
        addActiveClass(modal)
    })
})

// Popup Close with overlay
overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        removeActiveClass(modal)
        removeActiveClass(overlay)
    })
})


// Functionality
function findPreviousSibling(id) {
    const prev_sibling_find = document.getElementById(id).previousSibling
    return prev_sibling_find.previousElementSibling
}

function findTargetForEvent(event, data_id) {
    var target_id = event.target.attributes[data_id].textContent
    return document.querySelector(`${target_id}`)
}

function addActiveClass(modal) {
    if (modal == null) return
    modal.classList.add('active')
}

function removeActiveClass(modal) {
    if (modal == null) return
    modal.classList.remove('active')
}
