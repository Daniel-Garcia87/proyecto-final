function cart(db, printProducts) {
  let cart = []

  // Elementos en el DOM
  const productsDOM = document.querySelector(".products__container");
  const notifyDOM = document.querySelector(".notify");
  const cartDOM = document.querySelector(".cart__body");
  const countDOM = document.querySelector(".cart__count--item");
  const totalDOM = document.querySelector(".cart__total--item");
  const ckeckoutDOM = document.querySelector(".btn--buy");

  // Funciones
  function printCart () {
    let htmlCart = ""

    if (cart.length === 0) {
        htmlCart += `
        <div class="cart__empty">
        <i class='bx bx-cart'></i>
        <p class="cart__empty--text">No hay producto en el carrito</p>
        </div>
        `
    notifyDOM.classList.remove("show--notify");
    } else {
    for (const item of cart) {
        const product = db.find(p => p.id === item.id)
        htmlCart += `
            <article class="article">
            <div class="article__image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="article__content">
                <h3 class="article__title">${product.name}</h3>
                <span class="article__price">$ ${product.price}</span>
                <div class="article__quantity">
                    <button type="button" class="article__quantity--btn article--minus" data-id="${item.id}">
                        <i class="bx bx-minus"></i>
                    </button>
                    <span class="article__quantity-text">${item.qty}</span>
                    <button class="article__quantity--btn article--plus" data-id=${item.id}>
                        <i class="bx bx-plus"></i>
                    </button>
                </div>
                <button class="article__quantity--btn remover--fron-cart" data-id="${item.id}">
                    <i class="bx bx-trash"></i>
                </button>
            </div>
            </article>
        `
    }    
    notifyDOM.classList.add("show--notify");
    }

    cartDOM.innerHTML = htmlCart
    notifyDOM.innerHTML = showItemsCount()
    countDOM.innerHTML = showItemsCount()
    totalDOM.innerHTML = showTotal()
  }

  function addToCart (id, qty = 1) {
    const itemFinded = cart.find(i => i.id === id);
    if (itemFinded) {
      itemFinded.qty += qty;
    } else {
      cart.push({ id, qty });
    }
    printCart();
  }
  
  function removerFromCart (id, qty = 1) {
    const itemFinded = cart.find(i => i.id === id);

    const result = itemFinded.qty - qty;
    if (result > 0) {
      itemFinded.qty -= qty;
    } else {
      const res = confirm("Seguro quieres eliminar")
            if (!res) return;
      cart = cart.filter(i => i.id !== id);
    }
    printCart()
  }

  function deleteFromCart(id) {
    cart = cart.filter(i => i.id !== id)
    const res = confirm("Seguro quieres eliminar")
    if (!res) return;
    printCart();
  }

  function showItemsCount () {
    let suma = 0
    for (const item of cart) {
      suma += item.qty
    }
    return suma
  }

  function showTotal () {
    let total = 0
    for (const item of cart) {
      const productFinded = db.find(p => p.id === item.id)
      total += item.qty * productFinded.price
    }
    return total
  }

  function ckeckout () {
    for (const item of cart) {
      const productFinded = db.find(p => p.id === item.id);
      productFinded.quantity -= item.qty;
    }
    cart = []
    printCart()
    printProducts()
    window.alert("Gracias por su compra")
  }

printCart()

  //Eventos
productsDOM.addEventListener('click', function (e) {
    if (e.target.closest(".add--to--cart")) {
      const id = +e.target.closest(".add--to--cart").dataset.id
      addToCart(id);
    }
});

cartDOM.addEventListener('click', function (e) {
    if (e.target.closest(".article--minus")) {
      const id = +e.target.closest(".article--minus").dataset.id
      removerFromCart(id);
    }

    if (e.target.closest(".article--plus")) {
        const id = +e.target.closest(".article--plus").dataset.id
        addToCart(id);
    }

    if (e.target.closest(".remover--fron-cart")) {
        const id = +e.target.closest(".remover--fron-cart").dataset.id
        deleteFromCart(id);
    }
})

ckeckoutDOM.addEventListener('click', function (e){
    ckeckout()
})

}

export default cart
