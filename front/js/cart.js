/********** CART FUNCTION  **********/

/* pour sauvegarder les quantités ajoutés via le panier */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* get cart from localStorage */
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
      console.log("Erreur du chargement du panier");
    });
}

/* array products to be sent to the API */
let products = [];

/********** FORM  **********/
let SubmitButton = document.querySelector("#order");

/* To control and send form+products to back */
SubmitButton.addEventListener("click", (e) => {
  e.preventDefault();

  /* Form values */
  const contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  function firstNameControle() {
    const firstName = contact.firstName;
    if (/^([A-Za-z\s]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(firstName)) {
      document.querySelector("#firstNameErrorMsg").textContent = "";
      return true;
    } else {
      document.querySelector("#firstNameErrorMsg").textContent =
        "Veuillez inscrire votre prénom. e.g: Maxime";
      return false;
    }
  }

  function lastNameControle() {
    const lastName = contact.lastName;
    if (/^([A-Za-z\s]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(lastName)) {
      document.querySelector("#lastNameErrorMsg").textContent = "";
      return true;
    } else {
      document.querySelector("#lastNameErrorMsg").textContent =
        "Veuillez inscrire votre nom de famille. e.g: Dupont";
      return false;
    }
  }

  function addressControl() {
    const adresse = contact.address;
    if (/^[A-Za-z0-9\s]{5,100}$/.test(adresse)) {
      document.querySelector("#addressErrorMsg").textContent = "";
      return true;
    } else {
      document.querySelector("#addressErrorMsg").textContent =
        "Veuillez inscrire votre adresse. e.g: 10 quai de la charente";
      return false;
    }
  }

  function cityControl() {
    const city = contact.city;
    if (/^([A-Za-z\s]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(city)) {
      document.querySelector("#cityErrorMsg").textContent = "";
      return true;
    } else {
      document.querySelector("#cityErrorMsg").textContent =
        "Veuillez inscrire la ville lié à votre adresse. e.g: Paris";
      return false;
    }
  }

  function emailControle() {
    const email = contact.email;
    if (
      /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(
        email
      )
    ) {
      document.querySelector("#emailErrorMsg").textContent = "";
      return true;
    } else {
      document.querySelector("#emailErrorMsg").textContent =
        "Veuillez inscrire un email valide, e.g: support@name.com";
      return false;
    }
  }

  /* Validation control */
  if (
    firstNameControle() &&
    lastNameControle() &&
    addressControl() &&
    cityControl() &&
    emailControle()
  ) {
    //Contact in localstorage
    localStorage.setItem("contact", JSON.stringify(contact));
    sendFromToServer();
  } else {
    alert("Le formulaire n'est pas rempli correctement");
  }


  
  /* Get orderId as response send by server */
  var orderId = "";

  /* Send contact object and products array to API */
  function sendFromToServer() {
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",

      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact, products }),
    })
      .then((response) => {
        return response.json();
      })
      .then((server) => {
        orderId = server.orderId;
        if (orderId != "") {
          alert("Votre commande est validée");
          location.href = "confirmation.html?id=" + orderId;
          clearCart();
        }
        else{
          alert("Veuillez remplir le formulaire de commande.")
        }
      })
      .catch((error) => {
        console.log("L'envoi du formulaire a échoué" + error);
      });
  }
});