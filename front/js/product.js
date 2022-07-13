const kanapImg = document.querySelector(".item__img");
const kanapName = document.getElementById("title");
const kanapPrice = document.getElementById("price");
const kanapDescription = document.getElementById("description");
const kanapColor = document.getElementById("colors");
const kanapQuantity = document.getElementById("quantity");

let params = new URL(document.location).searchParams;
let productId = params.get("id");

fetch("http://localhost:3000/api/products/" + productId)
  .then((response) => response.json())
  /* reponse de l'API = productData */
  .then((productData) => {
    let productImg = document.createElement("img");
    productImg.setAttribute("src", productData.imageUrl);
    productImg.setAttribute("alt", productData.altTxt);
    kanapImg.appendChild(productImg);

    let productName = productData.name;
    kanapName.textContent = productName;

    let productPrice = productData.price;
    kanapPrice.textContent = productPrice;

    let productDescription = productData.description;
    kanapDescription.textContent = productDescription;

    /* array insere colorOption dans l'élément kanapColor */
    let productColors = productData.colors;
    for (i = 0; i < productColors.length; i++) {
      let colorOption = document.createElement("option");
      colorOption.setAttribute("value", productColors[i]);
      colorOption.innerText = productColors[i];
      kanapColor.appendChild(colorOption);
    }
  })
  .catch(function (err) {
    alert(
      "L'API ne se charge pas correctement, veuillez suivre les inscrutions dans le read.me."
    );
  });

/* PANIER // CART */

// Méthode de stockage
document.getElementById("addToCart").onclick = function () {
  var panier = JSON.parse(localStorage.getItem("cart"));
  if (panier == null) panier = [];
  panier.push({
    id: productId,
    img: document.querySelector(".img src"),
    name: kanapName.textContent,
    quantity: document.getElementById("quantity").value,
    color: document.getElementById("colors").value,
  });
  localStorage.setItem("cart", JSON.stringify(panier));
  alert("Mémorisation effectuée");
};

/* Méthode de lecture
document.getElementById('cartAndFormContainer').onclick = function() {
  var panier = JSON.parse(localStorage.getItem('cart'));
		document.getElementById('title').value = productName.title;
		document.getElementById('price').value = productName.price;
		document.getElementById('quantity').value = productName.quantity;
		alert("Lecture effectuée");
	} else alert("localStorage n'est pas supporté");
}; */

