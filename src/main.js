import "./css/index.css"
import IMask from "imask"

const ccBgColor1 = document.querySelector('.cc-bg svg > g g:nth-child(1) path')
const ccBgColor2 = document.querySelector('.cc-bg svg > g g:nth-child(2) path')
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img')
const securityCode = document.querySelector('#security-code')
const expirationDate = document.querySelector('#expiration-date')
const cardNumber = document.querySelector('#card-number')
const form = document.querySelector('#form')
const cardHolder = document.querySelector('#card-holder')
const ccHolder = document.querySelector('.cc-holder .value')

function setCardType(type = 'default') {
    const colors = {
        visa: ["#436D99","#2D57F2"],
        mastercard: ["#DF6F29","#C69347"],
        default: ["black","gray"]
    }

    ccBgColor1.setAttribute('fill', colors[type][0])
    ccBgColor2.setAttribute('fill', colors[type][1])
    ccLogo.setAttribute('src',`cc-${type}.svg`)
}


const securityCodePattern = {
    mask: '0000',
}

const experirationDatePattern = {
    mask: 'MM/YY',

    blocks: {
        YY:{
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        },
        MM:{
            mask: IMask.MaskedRange,
            from:1,
            to:12
        }
    }
}

const cardNumberPattern = {
    mask: [
        {
            mask: '0000 0000 0000 0000',
            regex: /^4\d{0,15}/,
            cardType: 'visa',
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2}\d{0,12}/,
            cardType: 'mastercard',
        },
        {
            mask: '0000 0000 0000 0000',
            cardType: 'default',
        }
    ],

    dispatch: function(appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g,'');
        const foundMask = dynamicMasked.compiledMasks.find(function(item) {
            return number.match(item.regex)
        })
        console.log(foundMask);

        return foundMask
    }
}

const securityMask = IMask(securityCode, securityCodePattern)
const experirationDateMask = IMask(expirationDate, experirationDatePattern)
const carNumberMask = IMask(cardNumber, cardNumberPattern)

const btn = document.querySelector('#btn')

btn.addEventListener('click', () => {
    console.log('clicou');
})

form.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log('evento de form');
})

cardHolder.addEventListener('input', () => {
    ccHolder.innerText = !cardHolder.value.length ? 'FULANO DA SILVA' : cardHolder.value
})

securityMask.on('accept', () => {

    updateCodeSecurity(securityMask.value)
})

function updateCodeSecurity(code) {
    const ccSecurity = document.querySelector('.cc-security .value')
    ccSecurity.innerText = !code.length ? '123' : code
}

carNumberMask.on('accept', () => {
    const cardType = carNumberMask.masked.currentMask.cardType
    setCardType(cardType)
    updateCardNumber(carNumberMask.value)
})

function updateCardNumber(number) {
    const ccNumber = document.querySelector('.cc-number')
    ccNumber.innerText = !number.length ? '1234 5678 9012 3456' : number
}

experirationDateMask.on('accept', () => {
    updateExperiranteDate(experirationDateMask.value)
})

function updateExperiranteDate(date) {
    const ccExpiration = document.querySelector('.cc-expiration .value')
    ccExpiration.innerText = !date.length ? "02/32" : date
}
