const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

items.addEventListener('click', e =>{
    addCarrito(e)
})

const fetchData = async() => {
    try{
        const res =await fetch('api.json')
        const data = await res.json()
        
        pintarCards(data)

    } catch (error){
        console.log(error)
    }
}

const pintarCards = data => {
    data.forEach(producto => {
         templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
         templateCard.querySelector('h5').textContent = producto.nombre
         templateCard.querySelector('p').textContent = producto.precio
         templateCard.querySelector('button').dataset.id = producto.id
         
         const clone =templateCard.cloneNode(true)
         fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}

const addCarrito = e => {
//    console.log(e.target)
//    console.log()
    if(e.target.classList.contains('button')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    // console.log(objeto)
    const producto = {
        id: objeto.querySelector('button').dataset.id
    }
    console.log(producto)
}