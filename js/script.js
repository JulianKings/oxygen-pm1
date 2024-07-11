// vars
const menuIcon = document.querySelector('.header__nav__img');
const menuContainer = document.querySelector('.header__nav__list');
const scrollStatusBar = document.querySelector('.header__scrollbar');
const errorContainer = document.querySelector('.question__form__error');
const errorList = [];
const inputList = document.querySelectorAll('.question__input');
const formElement = document.querySelector('#question-form');

// events
inputList.forEach((element) => {
    element.addEventListener('change', (event) => {
        onInputChange(event.target);
    })
})

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

formElement.addEventListener('submit', (event) => validateForm(event));
 
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

// form validation functionality
function onInputChange(target)
{
    // cleanup
    if(target.classList.contains('question__input__valid'))
    {
        target.classList.remove('question__input__valid');

    }

    if(target.classList.contains('question__input__error'))
    {
        target.classList.remove('question__input__error');

    }

    runValidation([target]);

    updateErrorContainer();
}

function validateForm(event)
{
    event.preventDefault();

    const inputElements = document.querySelectorAll('.question__checkbox__input, .question__input');
    const validationResult = runValidation(inputElements);

    if(!validationResult)
    {
        updateErrorContainer();
    } else {
        // send data
    }
}

function runValidation(elementArray)
{
    let validationResult = true;
    elementArray.forEach((target) => {
        // handle name
        if(target.id === 'contact-name')
        {
            if(validateName(target.value))
            {
                target.classList.add('question__input__valid');
                cleanupErrors(target.id);
            } else {
                validationResult = false;
                target.classList.add('question__input__error');
                cleanupErrors(target.id);
                errorList.push({
                    origin_id: target.id,
                    message: 'Name must be between 2 and 100 characters'
                });
            }
        }
    
        // handle mail
        if(target.id === 'contact-mail')
        {
            if(validateEmail(target.value))
            {
                target.classList.add('question__input__valid');
                cleanupErrors(target.id);
            } else {
                validationResult = false;
                target.classList.add('question__input__error');
                cleanupErrors(target.id);
                errorList.push({
                    origin_id: target.id,
                    message: 'Invalid Email'
                });
            }
    
        }

        // handle checkbox
        if(target.id === 'contact-consent')
        {
            if(target.checked)
            {
                validationResult = false;
                if(target.classList.contains('question__checkbox__input__error'))
                {
                    target.classList.remove('question__checkbox__input__error');            
                }
                cleanupErrors(target.id);
            } else {
                target.classList.add('question__checkbox__input__error');
                cleanupErrors(target.id);
                errorList.push({
                    origin_id: target.id,
                    message: 'You have to give consent to share your data with us in order to continue'
                });
            }    
        }
    });

    return validationResult;

}

function cleanupErrors(input_id)
{
    const clearIndex = [];
    errorList.forEach((error, index) => {
        if(error.origin_id === input_id)
        {
            clearIndex.push(index);
        }
    });

    clearIndex.forEach((index) => {
        errorList.splice(index, 1);
    });
}

function validateName(name)
{
    if(name.length >= 2)
    {
        if(name.length <= 100)
        {
            return true;
        }
    }

    return false;
}

function validateEmail(mail)
{
    return (/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(mail))
}

function updateErrorContainer()
{
    if(errorList.length > 0)
    {
        errorContainer.style['display'] = 'block';
        let errorResult = "We've found the following errors: \r\n";
        errorList.forEach((error) => {
            errorResult += '- ' + error.message + "\r\n";
        });

        errorContainer.textContent = (errorResult);
    } else {
        errorContainer.style['display'] = 'none';
    }
}