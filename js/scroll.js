const scrollStatusBar = document.querySelector('.header__scrollbar');
const returnElement = document.querySelector('.header__return-top');

document.addEventListener('scroll', () => {
    const percentage = ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
    const roundedPercentage = Math.round(percentage);

    if(roundedPercentage < 30)
    {
        console.log('a');
        returnElement.classList.toggle('header__return-top--hidden', true);
    } else
    {
        returnElement.classList.toggle('header__return-top--hidden', false);
    }        

    scrollStatusBar.style['width'] = roundedPercentage + '%';
});