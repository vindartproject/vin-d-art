import KEYS from "./Keys.js"

const $d = document;
const $cards = $d.getElementById("cards");
const $template = $d.getElementById("template-card").contentEditable;
const $fragment = $d.createDocumentFragment();
const options = { headers: {Authorization:`Bearer ${KEYS.secret}`}}
const FormatoDeMoneda = num => `$${num.slice(0, -2)}.${num.slice(-2)}`
Promise.all([
    fetch("https://api.stripe.com/v1/products",options),
    fetch("https://api.stripe.com/v1/prices",options)
])

.then(responses => Promise.all(responses.map(res => res.json())))
.then(json=>{
    products = json [0].data;
    prices = json [1].data;
   // console.log(products, prices)
   prices.forEach(el => {
    let productData = products.filter(product => product.id === el.product);
    
    $template.querySelector(".cards").setAttribute("data-price", el.id);
    $template.querySelector("img").src = productData[0].images[0];
    $template.querySelector("img").alt = productData[0].name;
    $template.querySelector("figcaption").innerHTML = `${productData[0].name} ${FormatoDeMoneda(el.unit_amount_decimal)} ${(el.currency).toUpperCase()}`;

    let $clone = $d.importNode($template, true);

    $fragment.appendChild($clone);
});

$cards.appendChild($fragment);
})
.catch(error => {
let message = error.statuText || "error";

$cards.innerHTML = `Error: ${error.status}: ${message}`;
})

$d.addEventListener("click", e => {
if (e.target.matches(".cards *")) {
    let priceId = e.target.parentElement.getAttribute("data-price");

    Stripe(KEYS.public).redirectToCheckout({
        lineItems: [{
            price: priceId,
            quantity: 1
        }],
        mode: "subscription",
      //  successUrl:"http://127.0.01:5500/assets/success.html",
       // cancelUrl:"http://127.0.01:5500/assets/cancel.html"
    })
    .then(res => {
        if (res.error){
            $cards.insertAdjacentElement("afterend", res.error.message)
        }
    })
}
})