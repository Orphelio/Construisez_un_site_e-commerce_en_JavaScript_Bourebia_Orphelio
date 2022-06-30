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
        
      })

      .catch(function (err) {
        alert("L'API ne se charge pas correctement, veuillez suivre les inscrutions dans le read.me.");
      });  


// function pour donner remplacer le title de la page par le nom du canapé marche pas
function pageTitle(Kanap) {
      const title = document.getElementsByClassName("title").innerText = Kanap.name;
}

function createProduct(Kanap) {
      const itemImg = document.querySelector(".item__img"); 
      const img = document.createElement("img");
      itemImg.appendChild(img);
      img.src = Kanap.imageUrl;
      img.alt = Kanap.altTxt;

      document.getElementById("price").innerText = Kanap.price;

      document.getElementById("description").innerText = Kanap.description;

      colorChoice(Kanap.colors);

      }


const title = document.getElementById('title');

function colorChoice(colors) {
  const colors = document.getElementById("colors");
  for (const color of colors) {
      console.log(color);
      const option = document.createElement("option");
      colors.appendChild(option);
      option.value = color;
      option.textContent = color
    }

}




