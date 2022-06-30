fetch("http://localhost:3000/api/products/")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })