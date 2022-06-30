let ProductUrl = window.location;
let url = new URL(ProductUrl);
let id = url.searchParams.get("id");

fetch(`http://localhost:3000/api/products/${id}`)
      .then(function (res) {
            if (res.ok) {
                  return res.json();
            }
      })
      .then(function loadData(Kanap) {
        createProduct(Kanap);
        pageTitle(Kanap);
        colorChoice(Kanap);
      })

      .catch(function (err) {
        alert("L'API ne se charge pas correctement, veuillez suivre les inscrutions dans le read.me.");
      });  


// function pour donner remplacer le title de la page par le nom du canapé marche pas
function pageTitle(Kanap) {
      const title = document.getElementsByClassName("title").innerText = Kanap.name;
}

function createProduct(Kanap) {
      const itemImg = document.getElementsByClassName("item__img")[0];  // pourquoi le 0 a tout débloqué ?
      const img = document.createElement("img");
      itemImg.appendChild(img);
      img.src = Kanap.imageUrl;
      img.alt = Kanap.altTxt;

      const price = (document.getElementById("price").innerText = Kanap.price);

      const description = (document.getElementById("description").innerText = Kanap.description);

      const colors = document.getElementById("colors");

      }


const title = document.getElementById('title');

function colorChoice(Kanap) {
  //for (let i = 0; i < Kanap.colors.length; i++) {    à voir avec john
      const option = document.createElement("option");
      colors.appendChild(option);
      option.value = Kanap.colors[i];
      option.innerText = Kanap.colors[i];
  //}
}
