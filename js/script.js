const menuIcon = document.querySelector('.header__nav__img');
const menuContainer = document.querySelector('.header__nav__list');

menuIcon.addEventListener('click', (event) => alternateMenu(event.target));
menuIcon.addEventListener('blur', (event) => {
    const target = event.target;

    if(target.getAttribute('data-open-menu') && target.getAttribute('data-open-menu') === 'open')
    {
        target.src = './assets/Menu.png';
        target.setAttribute('data-open-menu', 'closed');

        menuContainer.style['max-height'] = '0';
    }
});

function alternateMenu(target)
{
    if(target.getAttribute('data-open-menu') && target.getAttribute('data-open-menu') === 'open')
    {
        target.src = './assets/Menu.png';
        target.setAttribute('data-open-menu', 'closed');
        menuContainer.style['max-height'] = '0';
    } else {
        target.src = './assets/cross.png';
        target.setAttribute('data-open-menu', 'open');
        menuContainer.style['max-height'] = '40vw';
    }
}