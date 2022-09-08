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
document.getElementById('addToCart').onclick = function () {
  var panier = JSON.parse(localStorage.getItem('cart'));
  const color = document.getElementById('colors').value;
  const quantity = Number(document.getElementById('quantity').value);
  if (panier == null) panier = [];
  const findProduct = panier.find(
    (item) => item.id === productId && item.color === color
  );
  if (quantity>100) {
    alert("La quantité doit être inférieur à 100")
    return
  }
  if (findProduct) {
    panier = panier.map((item) => {
      if (item.id === productId && item.color === color) {
        return {
          ...item,
          quantity: item.quantity + quantity,
        };
      }
      return item;
    });
  } else {
    panier.push({
      id: productId,
      quantity,
      color,
    });
  }
  localStorage.setItem('cart', JSON.stringify(panier));
  alert('Mémorisation effectuée');
};

(async () => {
  const res = await fetch('http://localhost:3000/api/products');
  const products = await res.json();
  for (const item of cart) {
    const findProduct = products.find((x) => x._id === item.id);
    const product = Object.assign(item, findProduct);
    createProduct(product);
  }
})();