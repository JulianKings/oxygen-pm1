// vars
const menuIcon = document.querySelector('.header__nav__img');
const menuContainer = document.querySelector('.header__nav__list');
const scrollStatusBar = document.querySelector('.header__scrollbar');
const errorContainer = document.querySelector('.question__form__error');
const errorList = [];
const inputList = document.querySelectorAll('.question__input');
const formElement = document.querySelector('#question-form');
const pricingSelector = document.querySelector('.pricing__unit-selector__select');
let USDtoEur = 0;
let USDtoGBP = 0;
const modalElement = document.querySelector('.modal');
const modalBoxElement = document.querySelector('.modal__box');
const newsletterErrorList = [];
const newsletterErrorContainer = document.querySelector('.modal__box__form__error');
const newsletterFormElement = document.querySelector('#newsletter-form');

// events
inputList.forEach((element) => {
    element.addEventListener('change', (event) => {
        onInputChange(event.target);
    })
});

document.addEventListener('scroll', () => {
    const percentage = ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
    const roundedPercentage = Math.round(percentage);
    if(roundedPercentage === 25 && (!localStorage.getItem('modal')) && modalElement.style.display !== 'block')
    {
        openModal();
    }
    scrollStatusBar.style['width'] = roundedPercentage + '%';
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

pricingSelector.addEventListener('change', (event) => onSelectChange(event.target));

newsletterFormElement.addEventListener('submit', (event) => validateNewsletterForm(event));

modalElement.addEventListener('click', () => closeModal());
modalBoxElement.addEventListener('click', (event) => {
    event.stopPropagation();
});

//keypress esc event
document.body.addEventListener('keyup', (event) => {
    if (event.key == "Escape" && modalElement.style.display === 'block') {
        closeModal();
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

    if(target.id === 'newsletter-mail')
    {
        updateNewsletterErrorContainer();
    } else {
        updateErrorContainer();
    }
}

function validateForm(event)
{
    event.preventDefault();

    const inputElements = document.querySelectorAll('.question__checkbox__input, input.question__input:not(.modal__box__form__input)');
    const validationResult = runValidation(inputElements);

    if(!validationResult)
    {
        updateErrorContainer();
    } else {
        // send data
        const data = {}
        inputElements.forEach((input) => {
            if(input.id === 'contact-consent')
            {
                data['contact-consent'] = input.checked;
            } else {
                data[input.id] = input.value;
            }
        });

        fetch("https://jsonplaceholder.typicode.com/posts", { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            mode: "cors",
            dataType: 'json',
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.status >= 400) {
                throw new Error("could not reach server: " + response.status);
            }

            return response.json();

        })
        .then((response) => {
            console.log(response);
         })
        .catch((error) => {
            throw new Error(error);
        });;
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
                if(target.classList.contains('question__checkbox__input__error'))
                {
                    target.classList.remove('question__checkbox__input__error');            
                }
                cleanupErrors(target.id);
            } else {
                validationResult = false;
                target.classList.add('question__checkbox__input__error');
                cleanupErrors(target.id);
                errorList.push({
                    origin_id: target.id,
                    message: 'You have to give consent to share your data with us in order to continue'
                });
            }    
        }

        // handle mail
        if(target.id === 'newsletter-mail')
        {
            if(validateEmail(target.value))
            {
                target.classList.add('question__input__valid');
                cleanupNewsletterErrors(target.id);
            } else {
                validationResult = false;
                target.classList.add('question__input__error');
                cleanupNewsletterErrors(target.id);
                newsletterErrorList.push({
                    origin_id: target.id,
                    message: 'Invalid Email'
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

// change unit functionality
function importUnits()
{
    fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json", {                
        method: 'GET',
        mode: "cors",
        dataType: 'json',
     })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("could not reach server: " + response.status);
      }
      return response.json();
    })
    .then((response) => {
        USDtoEur = response.usd.eur;
        USDtoGBP = response.usd.gbp;
    })
    .catch((error) => {
        throw new Error(error);
    })
}

function onSelectChange(target)
{
    const proffValue = 25;
    const premiumValue = 60;
    const freeElement = document.querySelector('.price__value--primary');
    const proffElement = document.querySelector('.price__value--secondary');
    const premiumElement = document.querySelector('.price__value--tertiary');

    if(target.value === 'usd')
    {
        freeElement.textContent = '$0';
        proffElement.textContent = '$' + proffValue;
        premiumElement.textContent = '$' + premiumValue;
    } else if(target.value === 'eur')
    {
        freeElement.textContent = '€0';
        proffElement.textContent = '€' + roundToTwoDecimals(proffValue*USDtoEur);
        premiumElement.textContent = '€' + roundToTwoDecimals(premiumValue*USDtoEur);
    } else if(target.value === 'gbp')
    {
        freeElement.textContent = '£0';
        proffElement.textContent = '£' + roundToTwoDecimals(proffValue*USDtoGBP);
        premiumElement.textContent = '£' + roundToTwoDecimals(premiumValue*USDtoGBP);
    }
}

function roundToTwoDecimals(number)
{
    return Math.round((number + Number.EPSILON) * 100) / 100;
}

// newsletter functions
function cleanupNewsletterErrors(input_id)
{
    const clearIndex = [];
    newsletterErrorList.forEach((error, index) => {
        if(error.origin_id === input_id)
        {
            clearIndex.push(index);
        }
    });

    clearIndex.forEach((index) => {
        newsletterErrorList.splice(index, 1);
    });
}

function updateNewsletterErrorContainer()
{
    if(newsletterErrorList.length > 0)
    {
        newsletterErrorContainer.style['display'] = 'block';
        let errorResult = "We've found the following errors: \r\n";
        newsletterErrorList.forEach((error) => {
            errorResult += '- ' + error.message + "\r\n";
        });

        newsletterErrorContainer.textContent = (errorResult);
    } else {
        newsletterErrorContainer.style['display'] = 'none';
    }
}

function validateNewsletterForm(event)
{
    event.preventDefault();

    const inputElement = document.querySelector('.modal__box__form__input');
    const validationResult = runValidation([inputElement]);

    if(!validationResult)
    {
        updateNewsletterErrorContainer();
    } else {
        // send data
        const data = {}
        data[inputElement.id] = inputElement.value;

        fetch("https://jsonplaceholder.typicode.com/posts", { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            mode: "cors",
            dataType: 'json',
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.status >= 400) {
                throw new Error("could not reach server: " + response.status);
            }

            return response.json();

        })
        .then((response) => {
            console.log(response);
         })
        .catch((error) => {
            throw new Error(error);
        });;
    }
}

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

// slider
// classes
class Slider {
    constructor(element_id)
    {
        this.mainElement = document.getElementById(element_id);
        this.sliderImages = [].slice.call(this.mainElement.children);
        this.currentSlide = undefined;
        this.sliderManager = undefined;
        this.cancelNextPromise = false;
        this.dotContainer = undefined;
        this.dotList = [];
    }

    initialize()
    {
        this.currentSlide = 0;
        this.appendDots();
        this.appendArrows();
        this.updateCurrentImage(true, false);
        this.loadNextSlide();
    }

    loadNextSlide()
    {
        // slide cycle
        this.sliderManager = awaitPromise(4);
        this.sliderManager.then(() => {
            if(!this.cancelNextPromise)
            {
                const oldSlide = this.currentSlide;
                this.currentSlide = this.obtainNextImage();
                this.updateCurrentImage(false, (this.currentSlide < oldSlide));

                this.loadNextSlide();
            }
        })
    }

    updateCurrentImage(initializing, right)
    {
        // update and add animation for slide
        this.sliderImages.forEach((image, index) => {
            if(index === this.currentSlide)
                {
                    // visible image
                    image.style['z-index'] = (5+index);
                    if(!initializing)
                    {
                        image.style['animation'] = ((right) ? 'slideLeft' : 'slideRight') + ' 1s ease-in-out';
                    }
                } else {
                    if(right && index === this.obtainNextImage())
                    {
                        image.style['z-index'] = -1;
                    }
                    if(!right && index === this.obtainPrevImage())
                    {
                        image.style['z-index'] = -1;
                    } else {
                        image.style['z-index'] = -30;
                    }
                    image.style['animation'] = 'null';
                }
        });

        this.dotList.forEach((dot, index) =>
        {
            if(index === this.currentSlide)
            {
                awaitPromise(1).then(() => {
                    dot.style['height'] = '1.25rem';
                    dot.style['width'] = '1.25rem';
                    dot.style['background-color'] = 'rgb(0, 0, 0, .8)';
                });
            } else {
                if(dot.style.height !== '0.75rem')
                {
                    awaitPromise(1).then(() => {
                        dot.style['height'] = '0.75rem';
                        dot.style['width'] = '0.75rem';
                        dot.style['background-color'] = 'rgb(255, 255, 255, .8)';
                    });
                }                
            }
        });
    }

    hardUpdateImage(right)
    {
        // update and add animation for slide
        this.sliderImages.forEach((image, index) => {
            if(index === this.currentSlide)
            {
                // visible image
                image.style['z-index'] = (5+index);
                image.style['animation'] = ((right) ? 'slideLeft' : 'slideRight') + ' 1s ease-in-out';
            } else {
                if(right && index === this.obtainNextImage())
                {
                    image.style['z-index'] = -1;
                } else if(!right && index === this.obtainPrevImage())
                {
                    image.style['z-index'] = -1;
                } else {
                    image.style['z-index'] = -30;
                }
                image.style['animation'] = 'null';
            }
        });

        this.dotList.forEach((dot, index) =>
        {
            if(index === this.currentSlide)
            {
                dot.style['height'] = '1.25rem';
                dot.style['width'] = '1.25rem';
                dot.style['background-color'] = 'rgb(0, 0, 0, .8)';
            } else {
                if(dot.style.height !== '0.75rem')
                {
                    dot.style['height'] = '0.75rem';
                    dot.style['width'] = '0.75rem';
                    dot.style['background-color'] = 'rgb(255, 255, 255, .8)';
                }                
            }
        });
    }

    obtainNextImage()
    {
        // calculate next slide
        if((this.currentSlide) >= (this.sliderImages.length - 1))
        {
            return 0;
        } else {
            return (this.currentSlide + 1);
        }
    }

    obtainPrevImage()
    {
        // calculate next slide
        if((this.currentSlide) === 0)
        {
            return (this.sliderImages.length - 1);
        } else {
            return (this.currentSlide - 1);
        }
    }

    updateSlidePosition(position)
    {
        // move to selected slide
        const alreadyCanceled = this.cancelNextPromise;
        this.cancelNextPromise = true;
        const oldSlide = this.currentSlide;
        this.currentSlide = position;
        this.hardUpdateImage((this.currentSlide < oldSlide));
    
        if(!alreadyCanceled)
        {
            // restart sliding
            this.sliderManager = awaitPromise(5);
            this.sliderManager.then(() => {
                this.cancelNextPromise = false;
                this.loadNextSlide();
            });
        }
    }

    appendDots() {
        this.dotContainer = document.createElement('div');
        this.dotContainer.classList.add('slider__container__dots');
        this.mainElement.appendChild(this.dotContainer);

        for(let i = 0; i < this.sliderImages.length; i++)
        {
            const dot = document.createElement('div');
            dot.classList.add('slider__container__dot');
            dot.addEventListener('click', () => this.updateSlidePosition(i));
            this.dotContainer.appendChild(dot);
            this.dotList.push(dot);            
        }
    }

    appendArrows() {
        const leftArrow = document.createElement('div');
        leftArrow.classList.add('slider__container__arrow');
        leftArrow.textContent = '<';
        leftArrow.addEventListener('click', () => this.updateSlidePosition(this.obtainPrevImage()));
        this.mainElement.appendChild(leftArrow);

        const rightArrow = document.createElement('div');
        rightArrow.classList.add('slider__container__arrow');
        rightArrow.classList.add('slider__container__arrow--right');
        rightArrow.textContent = '>';
        rightArrow.addEventListener('click', () => this.updateSlidePosition(this.obtainNextImage()));
        this.mainElement.appendChild(rightArrow);
    }
}

// executions
importUnits();
if(!localStorage.getItem('modal'))
{
    awaitPromise(5).then(() => {
        openModal();
    });
}

const sliderObject = new Slider('slider');
sliderObject.initialize();