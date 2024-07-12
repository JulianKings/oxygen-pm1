const errorContainer = document.querySelector('.question__form__error');
const errorList = [];
const inputList = document.querySelectorAll('.question__input');
const formElement = document.querySelector('#question-form');
const newsletterErrorList = [];
const newsletterErrorContainer = document.querySelector('.modal__box__form__error');
const newsletterFormElement = document.querySelector('#newsletter-form');

inputList.forEach((element) => {
    element.addEventListener('change', (event) => {
        onInputChange(event.target);
    })
});

formElement.addEventListener('submit', (event) => validateForm(event, false));
newsletterFormElement.addEventListener('submit', (event) => validateForm(event, true));

function onInputChange(target)
{
    // cleanup
    target.classList.toggle('question__input__valid', false);
    target.classList.toggle('question__input__error', false);

    runValidation([target]);

    if(target.id === 'newsletter-mail')
    {
        updateNewsletterErrorContainer();
    } else {
        updateErrorContainer();
    }
}

function validateForm(event, newsletter)
{
    event.preventDefault();

    let inputElements = document.querySelectorAll('.question__checkbox__input, input.question__input:not(.modal__box__form__input)');
    if(newsletter)
    {
        inputElements = [document.querySelector('.modal__box__form__input')];
    
    }
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
            let result = 'Form send successfully: \n';
            for (const key in response)
            {
                if(response.hasOwnProperty(key))
                {
                    result += key + ': ' + response[key] + '\n';
                }
            }
            alert(result);
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
            if(!validateName(target.value))
            {
                validationResult = false;
                target.classList.add('question__input__error');
                cleanupErrors(target.id);
                errorList.push({
                    origin_id: target.id,
                    message: 'Name must be between 2 and 100 characters'
                });
            } else if(!validateNameNumbers(target.value))
            {
                validationResult = false;
                target.classList.add('question__input__error');
                cleanupErrors(target.id);
                errorList.push({
                    origin_id: target.id,
                    message: 'Digits are not allowed in your name'
                });
            } else {
                target.classList.add('question__input__valid');
                cleanupErrors(target.id);
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

function validateNameNumbers(name)
{
    return !((/[0-9]/.test(name)));
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