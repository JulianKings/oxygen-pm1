// vars
const menuIcon = document.querySelector('.header__nav__img');
const menuContainer = document.querySelector('.header__nav__list');
const scrollStatusBar = document.querySelector('.header__scrollbar');


// events
document.addEventListener('scroll', () => {
    const percentage = ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
    scrollStatusBar.style['width'] = Math.round(percentage) + '%';
})
 
menuIcon.addEventListener('click', (event) => alternateMenu(event.target));
menuIcon.addEventListener('blur', (event) => {
    const target = event.target;
 
    if(target.getAttribute('data-open-menu') && target.getAttribute('data-open-menu') === 'open')
    {
        target.src = './assets/Menu.png';
        target.setAttribute('data-open-menu', 'closed');
 
        menuContainer.style['max-height'] = '0';
        menuContainer.style['padding-top'] = '0';
    }
});
 
// functions
// hamburger menu functionality
function alternateMenu(target)
{
    if(target.getAttribute('data-open-menu') && target.getAttribute('data-open-menu') === 'open')
    {
        target.src = './assets/Menu.png';
        target.setAttribute('data-open-menu', 'closed');
        menuContainer.style['max-height'] = '0';
        menuContainer.style['padding-top'] = '0';
    } else {
        target.src = './assets/cross.png';
        target.setAttribute('data-open-menu', 'open');
        menuContainer.style['max-height'] = '40vh';
        menuContainer.style['padding-top'] = '2.5rem';
    }
}

// scroll top functionality
function scrollToTop()
{
    setTimeout(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});        
    }, 200);

}