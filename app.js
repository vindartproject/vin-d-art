const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
const divCantidad= document.getElementById('template-div')
//const clasificarProductos= document.getElementById('filtro-productos')
let carrito = {}
let Keys = {
    public:"pk_test_51LoDgpDQHa1SORpU4kh6Pnznhj7BxmPQIcqzz1anp61gS4ZO2yPeZCzS5iUgef9ozXtnK0CuIpmF5Wn7tNVo9zMW00mcPAXIA6",
    secret:"sk_test_51LoDgpDQHa1SORpUn10FfRHDAdDHv5iJ08dj03x1OezY7ZI4vwAEeRtprguQrWcUjJpKE02mwGrTCnEiUOSb9qOt00S1A0btET"
};



document.addEventListener('DOMContentLoaded', e => { fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }});

cards.addEventListener('click', e => { addCarrito(e) });
items.addEventListener('click', e => { btnAumentarDisminuir(e) })

const fetchData = async() => {
        const res =await fetch('api.json');
        const data = await res.json()
        
        pintarCards(data)
}

const pintarCards = data => {
    data.forEach(item => {
         templateCard.querySelector('img').setAttribute("src", item.thumbnailUrl)
         templateCard.querySelector('h5').textContent = item.nombre
         templateCard.querySelector('p').textContent = item.precio
         templateCard.querySelector('button').dataset.id = item.id
         templateCard.querySelector('button').dataset.price = item.priceID 
         
         const clone =templateCard.cloneNode(true)
         fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

document.addEventListener("keyup", e => {
    if(e.target.matches(producto.clasificacion)){
        document.querySelectorAll('#class').forEach( elemento =>{
            elemento.textContent.toLowerCase().includes(e.target.value.toLowerCase())
            ?elemento.classList.remove("filters")
            :elemento.classList.add("filters")
        })
    }
})
const addCarrito = e => {
//    console.log(e.target)
//    console.log()
    if(e.target.classList.contains('button')){
        // console.log(e.target.dataset.id)
        // console.log(e.target.parentElement)
        //AQUI ira lo del video 32
        console.log(e.target)
        let price = e.target.getAttribute("data-price");

        console.log(price)
        Stripe(Keys.public)
        .redirectToCheckout({
            lineItems:[{price: price, quantity:1}],
            mode:"payment",
            successUrl:"http://127.0.0.1:5500/pagos/exitoso.html",
            cancelUrl:"http://127.0.0.1:5500/pagos/cancelado.html"
        })  
        .then((res) => {
            console.log(res);
        })
       // setCarrito(e.target.parentElement)
    }
   // e.stopPropagation()
}

const setCarrito = item => {
    const producto = {
        id: item.querySelector('button').dataset.id,
        nombre: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        cantidad:1
    }

if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1 
}

    carrito[producto.id] = {...producto}

   pintarCarrito()
}

const pintarCarrito= () => {
    items.innerHTML=''

    
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent  = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito',JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío </th>
        `
        divCantidad.innerText=Object.keys(carrito).length   
        return
    }


    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    // console.log(nPrecio)

    divCantidad.innerText=nCantidad
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}


const btnAumentarDisminuir = e => {
    // console.log(e.target.classList.contains('btn-info'))
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation()
}
