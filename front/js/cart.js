/********** CART  **********/

/* pour sauvegarder les quantités ajoutés via le panier */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* get the cart from localStorage */
function getCart() {
  let cart = localStorage.getItem("cart");
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

/* add products to cart */
function addToCart(product) {
  let cart = getCart();
  /* Check si article identitque */
  let productFound = cart.find(
    (p) => p.id === product.id && p.color === product.color
  );
  if (productFound != undefined) {
    productFound.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  saveCart(cart);
}

/* delete products */
function deleteFromCart(product) {
  let cart = getCart();
  cart = cart.filter((p) => p.id != product.id || p.color != product.color);
  saveCart(cart);
}

/* clear cart */
function clearCart() {
  let cart = getCart();
  for (let product of cart) {
    deleteFromCart(product);
  }
}

/* total of products */
function totalOfProducts() {
  let cart = getCart();
  let totalOfProduct = 0;
  for (let product of cart) {
    totalOfProduct += product.quantity;
  }
  return totalOfProduct;
}

/* total price  */
function getTotalPrice(product, quantity) {
  totalCartPrice += product.price * quantity;
  return totalCartPrice;
}

/* modify product quantity */
function changeQuantity(product, quantity) {
  let cart = getCart();
  /* Check si article identique */
  let productFound = cart.find(
    (p) => p.id == product.id && p.color == product.color
  );
  if (productFound != undefined) {
    productFound.quantity = quantity;
    if (quantity <= 0) {
      document.location.reload();
      deleteFromCart(productFound);
      alert("L'article a été retiré de votre panier");
    } else {
      saveCart(cart);
    }
  }
}

/* update total price */
function updateTotalPrice(product, oldQuantity, newQuantity) {
  if (newQuantity > oldQuantity) {
    totalCartPrice += product.price * (newQuantity - oldQuantity);
    return totalCartPrice;
  } else if (newQuantity < oldQuantity) {
    totalCartPrice -= product.price * (oldQuantity - newQuantity);
    return totalCartPrice;
  }
}

/********** CART DISPLAY **********/

let cart = getCart();

const cartItems = document.getElementById("cart__items");

const cartHead = document.querySelector("h1");
const cartPrice = document.querySelector(".cart__price p");
const cartOrderForm = document.querySelector(".cart__order");

let totalQuantity = document.getElementById("totalQuantity");
let totalPrice = document.getElementById("totalPrice");
let totalCartPrice = 0;

for (let product of cart) {
  let productId = product.id;
  let productColor = product.color;
  let productQuantity = product.quantity;
  let productName = product.name;

  fetch("http://localhost:3000/api/products/" + productId)
    .then((response) => response.json())
    /* reponse de l'API = productDetails  */
    .then((productDetails) => {
      let productArticle = document.createElement("article");
      productArticle.classList.add("cart__item");
      productArticle.setAttribute("data-id", productId);
      productArticle.setAttribute("data-color", productColor);
      cartItems.appendChild(productArticle);

      let productImgContainer = document.createElement("div");
      productImgContainer.classList.add("cart__item__img");
      productArticle.appendChild(productImgContainer);

      let productImg = document.createElement("img");
      productImg.setAttribute("src", productDetails.imageUrl);
      productImg.setAttribute("alt", productDetails.altTxt);
      productImgContainer.appendChild(productImg);

      let productContent = document.createElement("div");
      productContent.classList.add("cart__item__content");
      productArticle.appendChild(productContent);

      /*///////////          /!\               */ //////////
      let productContentDescription = document.createElement("div");
      productContentDescription.classList.add(
        "cart__item__content__description"
      );
      productContent.appendChild(productContentDescription);
      /*///////////          /!\               */ //////////

      let productName = document.createElement("h2");
      productName.textContent = productDetails.name;
      productContentDescription.appendChild(productName);

      let productColorPicked = document.createElement("p");
      productColorPicked.textContent = productColor;
      productContentDescription.appendChild(productColorPicked);

      let productPrice = document.createElement("p");
      productPrice.textContent = `${productDetails.price} €`;
      productContentDescription.appendChild(productPrice);

      let productContentSettings = document.createElement("div");
      productContentSettings.classList.add("cart__item__content__settings");
      productContent.appendChild(productContentSettings);

      let productQuantitySettings = document.createElement("div");
      productQuantitySettings.classList.add(
        "cart__item__content__settings__quantity"
      );
      productContentSettings.appendChild(productQuantitySettings);

      let productQuantityPickedLabel = document.createElement("p");
      productQuantityPickedLabel.textContent = "Quantité : ";
      productQuantitySettings.appendChild(productQuantityPickedLabel);

      /*///////////          /!\               */ //////////
      let productQuantityPicked = document.createElement("input");
      productQuantityPicked.setAttribute("type", "number");
      productQuantityPicked.setAttribute("name", "itemQuantity");
      productQuantityPicked.setAttribute("min", 1);
      productQuantityPicked.setAttribute("max", 100);
      productQuantityPicked.setAttribute("value", productQuantity);
      productQuantityPicked.classList.add("itemQuantity");
      productQuantitySettings.appendChild(productQuantityPicked);

      let productDelete = document.createElement("div");
      productDelete.classList.add("cart__item__content__settings__delete");
      productContentSettings.appendChild(productDelete);

      let productDeleteButton = document.createElement("p");
      productDeleteButton.classList.add("deleteItem");
      productDeleteButton.textContent = "Supprimer";
      productDelete.appendChild(productDeleteButton);

      productDeleteButton.addEventListener("click", function () {
        deleteFromCart(product);
        alert("L'article a été retiré de votre panier");
        document.location.reload();
      });

/********** TOTAL DISPLAY **********/

      totalQuantity.textContent = totalOfProducts();
      totalPrice.textContent = getTotalPrice(productDetails, productQuantity);
      let oldQuantity = Number(productQuantityPicked.value);

      productQuantityPicked.addEventListener("change", () => {
        productQuantity = changeQuantity(
          product,
          Number(productQuantityPicked.value)
        );
        totalPrice.textContent = updateTotalPrice(
          productDetails,
          oldQuantity,
          Number(productQuantityPicked.value)
        );
        oldQuantity = Number(productQuantityPicked.value);
        totalQuantity.textContent = totalOfProducts();
      });
    })
    .catch((error) => {
      console.log("Erreur dans le chargement du panier");
    });
}

/********** FORM  **********/

let form = document.querySelector(".cart__order__form");
let submitButton = document.querySelector("#order");

form.firstName.setAttribute("pattern", "[a-z A-Z-']{2,50}");
form.firstName.addEventListener("input", () => {
  textValidity(form.firstName);
});
form.lastName.setAttribute("pattern", "[a-z A-Z-']{2,50}");
form.lastName.addEventListener("input", () => {
  textValidity(form.lastName);
});
form.address.setAttribute("pattern", "[a-zA-Z 0-9'-]{2,50}");
form.address.addEventListener("input", () => {
  adressValidity(form.address);
});
form.city.setAttribute("pattern", "[0-9]{5}[a-zA-Zéèôöîïûùü' -]{2,50}");
form.city.addEventListener("input", () => {
  cityValidity(form.city);
});
form.email.addEventListener("input", () => {
  emailValidity(form.email);
});


form.addEventListener("submit", (event) => {
  event.preventDefault();

  let products = [];
  for (let product of cart) {
    products.push(product.id);
  }

  let contact = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    address: form.address.value,
    city: form.city.value,
    email: form.email.value,
  };
});
