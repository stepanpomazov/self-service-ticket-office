// база данных для товаров - Items database
const data = [
    { id: 123, title: 'Молоко', price: 100, src: 'https://cdn.onlinewebfonts.com/svg/img_85921.png' },
    { id: 321, title: 'Шоколад', price: 50, src: 'https://avatars.mds.yandex.net/i?id=3f0a43e96711cf9f8e51a21d219e43181163cdbb-12544737-images-thumbs&n=13' },
    { id: 231, title: 'Вода', price: 24, src: 'https://avatars.mds.yandex.net/i?id=bdb6d0f7006e0668b4989d5b812b2cb4-5516535-images-thumbs&n=13' },
    { id: 412, title: 'Хлеб', price: 33, src: 'https://avatars.mds.yandex.net/i?id=802d00c8b425bffb02403d1d11797f71e4980a074cca1516-12218216-images-thumbs&n=13' },
    { id: 132, title: 'Квас', price: 90, src: 'https://thumbs.dreamstime.com/b/beer-icon-file-eps-format-36691198.jpg' },
    { id: 122, title: 'Сыр', price: 250, src: 'https://i.pinimg.com/736x/62/e1/c1/62e1c1590c0792a42670e62070181b62.jpg' },
]

// объявление переменных
let cart = []
const form = document.querySelector('.form')
const cartUI = document.querySelector('.cart')
const total = document.querySelector('.total')
const print = document.querySelector('.print')
const clear = document.querySelector('.clear')
const search = document.querySelector('.search')
const searchInput = document.querySelector('.searchInput')
const idInput = document.querySelector('input[name="id"]')
const suggestions = document.createElement('div')

//styles for suggestions - стили для подсказчика
suggestions.style.position = 'absolute'
suggestions.style.backgroundColor = '#fff'
suggestions.style.border = '1px solid #ccc'
suggestions.style.width = '200px'
suggestions.style.maxHeight = '100px'
suggestions.style.overflowY = 'auto'
suggestions.style.zIndex = '1000'
form.appendChild(suggestions)

// функция для подсказки ввода id товара - function for suggestion input id of item
idInput.addEventListener('input', (e) => {
    const inputValue = e.target.value.trim()
    if (inputValue.length > 0) {
        const matchedItems = data.filter(item => item.id.toString().startsWith(inputValue))
        suggestions.innerHTML = ''
        if (matchedItems.length > 0) {
            matchedItems.forEach(item => {
                const suggestion = document.createElement('div')
                suggestion.textContent = `${item.title} -- ID: ${item.id}`
                suggestion.style.padding = '5px'
                suggestion.style.cursor = 'pointer'
                suggestion.addEventListener('click', () => {
                    idInput.value = item.id
                    suggestions.innerHTML = ''
                })
                suggestions.appendChild(suggestion)
            })
        } else {
            const noMatch = document.createElement('div')
            noMatch.textContent = 'Нет совпадений'
            noMatch.style.padding = '5px'
            noMatch.style.color = '#999'
            suggestions.appendChild(noMatch)
        }
    } else {
        suggestions.innerHTML = ''
    }
})

document.addEventListener('click', (e) => {
    if (!form.contains(e.target)) {
        suggestions.innerHTML = ''
    }
})

// функция для получения стоимости товара - function for getting full price for item*count
const getItemData = (item) => {
    return item.count ? `${item.title} ---------- ${item.price * item.count}р \n` : `${item.title} ---------- ${item.price}р \n`
}


// Создание и печать чека  -  Creating and print receipt
const printTotal = (cart) => {
    const receiptWindow = document.createElement('div')

    //styles for receipt - стили для чека
    receiptWindow.style.position = 'fixed'
    receiptWindow.style.top = '20%'
    receiptWindow.style.left = '50%'
    receiptWindow.style.transform = 'translate(-50%, -50%)'
    receiptWindow.style.padding = '20px'
    receiptWindow.style.border = '2px solid #333'
    receiptWindow.style.backgroundColor = '#fff'
    receiptWindow.style.fontFamily = 'monospace'
    receiptWindow.style.fontSize = '14px'
    receiptWindow.style.whiteSpace = 'pre'
    receiptWindow.style.zIndex = '1'
    suggestions.style.zIndex = '0'

    document.body.appendChild(receiptWindow)

    const receiptNumber = Math.floor(Math.random() * 100000)
    const date = new Date()
    const dateStr = date.toLocaleDateString()
    const timeStr = date.toLocaleTimeString()

    let receiptContent = `\n🧾  Магазин "Продукты"\n`
    receiptContent += `Чек № ${receiptNumber}\n`
    receiptContent += `Дата: ${dateStr}    Время: ${timeStr}\n`
    receiptContent += `-----------------------------\n`

    cart.forEach((item, index) => {
        const itemName = item.title.padEnd(15, ' ')
        const itemCount = item.count || 1
        const itemPrice = item.price * itemCount
        receiptContent += `${index + 1}. ${itemName} x${itemCount} шт. - ${itemPrice} руб.\n`
    })

    const totalSum = cart.reduce((total, item) => total + (item.price * (item.count || 1)), 0)
    let discount = 0
    if (totalSum > 500) {
        discount = Math.floor(totalSum * 0.1)
        receiptContent += `-----------------------------\n`
        receiptContent += `СКИДКА: -${discount} руб.\n`
    }

    receiptContent += `-----------------------------\n`
    receiptContent += `ИТОГ: ${(totalSum - discount)} рублей\n`
    receiptContent += `Спасибо за покупку!\n`
    receiptContent += `\nПожалуйста, сохраните чек.\n`

    let currentLine = 0
    const lines = receiptContent.split('\n')

    const printLine = () => {
        if (currentLine < lines.length) {
            receiptWindow.innerHTML += lines[currentLine] + '\n'
            currentLine++
            setTimeout(printLine, 100)
        } else {
            const closeButton = document.createElement('button')
            closeButton.textContent = 'Закрыть чек'
            closeButton.style.marginTop = '10px'
            closeButton.onclick = () => document.body.removeChild(receiptWindow)
            receiptWindow.appendChild(closeButton)
        }
    }

    printLine()
}


const getItem = (item) => {
    const element = cart.find(el => el.id === item.id)
    if (element) {
        element.count = (element.count || 1) + 1
    } else {
        cart.push({ ...item, count: 1 })
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const itemId = e.target[0].valueAsNumber
    const item = data.find(el => el.id === itemId)
    if (item) {
        getItem(item)
        e.target[0].value = ''
    } else {
        alert('Товар не найден')
    }
    updateCartUI()
})

print.addEventListener('click', () => {
    printTotal(cart)
})

//Размещение товара в корзине. - setting item in the cart
const setItemInUICart = (item) => {
    const itemUI = document.createElement('div')
    itemUI.style.display = 'flex'
    itemUI.style.justifyContent = 'space-between'
    itemUI.style.alignItems = 'center'
    itemUI.style.margin = '10px 0'

    const img = document.createElement('img')
    img.src = item.src
    img.style.width = '50px'
    img.style.height = '50px'
    img.style.marginRight = '10px'
    img.title = `ID товара: ${item.id}`

    const title = document.createElement('span')
    title.textContent = item.title
    title.title = `ID товара: ${item.id}`

    const controlContainer = document.createElement('div')
    controlContainer.style.display = 'flex'
    controlContainer.style.alignItems = 'center'
    controlContainer.style.gap = '5px'

    const minusButton = document.createElement('button')
    minusButton.textContent = '-'
    minusButton.addEventListener('click', () => {
        if (item.count > 1) {
            item.count -= 1
        } else {
            cart = cart.filter(el => el.id !== item.id)
        }
        updateCartUI()
    })

    const quantity = document.createElement('span')
    quantity.textContent = item.count || 1
    quantity.style.minWidth = '20px'
    quantity.style.textAlign = 'center'

    const plusButton = document.createElement('button')
    plusButton.textContent = '+'
    plusButton.addEventListener('click', () => {
        item.count = (item.count || 1) + 1
        updateCartUI()
    })

    const totalPrice = document.createElement('span')
    totalPrice.textContent = `${(item.count || 1) * item.price} р`
    totalPrice.style.marginLeft = '10px'
    totalPrice.style.fontWeight = 'bold'

    controlContainer.appendChild(minusButton)
    controlContainer.appendChild(quantity)
    controlContainer.appendChild(plusButton)
    controlContainer.appendChild(totalPrice)

    itemUI.appendChild(img)
    itemUI.appendChild(title)
    itemUI.appendChild(controlContainer)

    return itemUI
}

clear.addEventListener('click', () => {
    cart = [];
    updateCartUI();
});

const updateCartUI = () => {
    cartUI.innerHTML = ''
    cart.forEach(item => cartUI.appendChild(setItemInUICart(item)))
    total.textContent = `ИТОГ: ${cart.reduce((total, el) => total + (el.count || 1) * el.price, 0)} рублей`
}
