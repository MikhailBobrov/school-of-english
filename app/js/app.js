const menuButton = document.querySelector('.nav-icon3');
const menuList = document.querySelector('.site-list');
const phoneList = document.querySelector('.phone')



menuButton.addEventListener('click', function () {
    this.classList.toggle('open');
    let expanded = menuButton.getAttribute('aria-expanded') === 'true' || 'false'
    this.setAttribute('aria-expanded', !expanded)
    menuList.classList.toggle('site-list--open')
    phoneList.classList.toggle('phone__open')
    // phoneList.classList.toggle('phone__close')


})







