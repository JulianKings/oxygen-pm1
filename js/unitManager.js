const pricingSelector = document.querySelector('.pricing__unit-selector__select');
let USDtoEur = 0;
let USDtoGBP = 0;

pricingSelector.addEventListener('change', (event) => onSelectChange(event.target));

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

importUnits();