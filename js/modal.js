const modalElement = document.querySelector('.modal');
const modalBoxElement = document.querySelector('.modal__box');

document.addEventListener('scroll', () => {
    const percentage = ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
    const roundedPercentage = Math.round(percentage);
    if(roundedPercentage === 25 && (!localStorage.getItem('modal')) && modalElement.style.display !== 'block')
    {
        openModal();
    }
});

modalElement.addEventListener('click', () => closeModal());
modalBoxElement.addEventListener('click', (event) => {
    event.stopPropagation();
});

document.body.addEventListener('keyup', (event) => {
    if (event.key == "Escape" && modalElement.style.display === 'block') {
        closeModal();
    }
});

function awaitPromise(time)
{
    return new Promise(resolve => {
        setTimeout(resolve, time * 1000);
    })
}

function openModal()
{
    if(modalElement.style.display === 'none' || modalElement.style.display === '')
    {
        modalElement.style['display'] = 'block';
        modalBoxElement.style['animation'] = 'slideDown 1s ease-in-out';
    }
}

function closeModal()
{
    if(!localStorage.getItem('modal') || true)
    {
        modalBoxElement.style['animation'] = 'slideUp 2.5s ease-in-out';
        awaitPromise(2).then(() => {
            modalElement.style['display'] = 'none';
            localStorage.setItem('modal', 'open');
        });
    }
}

if(!localStorage.getItem('modal'))
{
    awaitPromise(5).then(() => {
        openModal();
    });
}
