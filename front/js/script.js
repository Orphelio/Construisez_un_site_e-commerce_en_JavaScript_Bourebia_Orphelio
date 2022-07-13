//---------API

fetch("http://localhost:3000/api/products/")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function loadDatas(Kanap) {
      Cards(Kanap);
    })
    .catch(function (err) {
      alert("L'API ne se charge pas correctement, veuillez suivre les inscrutions dans le read.me.");
    });     

function Cards(Kanap) {
      for (let data of Kanap) {
            createCard(data);
      }

      function createCard(Kanap) {
        const link = document.createElement("a");
        items.appendChild(link);
        link.setAttribute("href", `./product.html?id=${Kanap._id}`);
  
        const article = document.createElement("article");
        link.appendChild(article);
  
        const img = document.createElement("img");
        article.appendChild(img);
        img.src = Kanap.imageUrl;
        img.alt = Kanap.altTxt;
  
        const title = document.createElement("h3");
        article.appendChild(title);
        title.innerText = Kanap.name;
  
        const description = document.createElement("p");
        article.appendChild(description);
        description.innerText = Kanap.description;
      }
}

//fetch('http://localhost:3000/api/products')

//  .then(response => response.json())

//  .then(kanap => { 
//    showProducts(kanap);
//  })
  
//  .catch(_error => {
//    alert('Le serveur ne répond pas, pour y remédier suivez les instructions dans le read.me.');
//  });

// fin script.js