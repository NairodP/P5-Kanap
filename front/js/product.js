//............Product Page..............;

(async function () {
  const kanapId = getKanapId();
  console.log(kanapId);

  const article = await getArticle(kanapId);
  console.log(article);

  displayKanap(article);
})();

function getKanapId() {
  return new URL(location.href).searchParams.get("id");
}

function getArticle(kanapId) {
  return fetch(`http://localhost:3000/api/products/${kanapId}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (articles) {
      return articles;
    })
    .catch(function (error) {
      alert(error);
    });
}

function displayKanap(article) {
  let img = document.querySelector(".item__img");

  document.querySelector("title").textContent = article.name;

  img.innerHTML = `<img src="${article.imageUrl}" alt="${article.altTxt}"></img>`;

  document.getElementById("title").textContent = article.name;

  document.getElementById("price").textContent = article.price;

  document.querySelector(".item__content__description__title").textContent =
    article.description;

  let colorProduct = document.getElementById("colors");
  console.log(colorProduct);
  console.log(article.colors);

  article.colors.forEach((colorKanap) => {
    let baliseOption = document.createElement("option");

    baliseOption.innerHTML = `${colorKanap}`;
    baliseOption.value = `${colorKanap}`;

    colorProduct.appendChild(baliseOption);
    console.log(baliseOption.value);
  });

  
  
  // TEST
  
  let productQuantity = document.getElementById("quantity");
  console.log(productQuantity.value);
  if (productQuantity.value != 0){
    
  }

  //............Gestion Panier..............;

  // let addToCart = document.getElementById("addToCart");
  // addToCart.addEventListener("click", addBasket(article));

  // function saveBasket(basket) {
  //   localStorage.setItem("produit", JSON.stringify(basket));
  // }

  // function getBasket() {
  //   let basket = localStorage.getItem("produit");
  //   if (basket == null) {
  //     return [];
  //   } else {
  //     return JSON.parse(basket);
  //   }
  // }

  // function addBasket(product) {
  //   let basket = getBasket();
  //   let foundProduct = basket.find((p) => p.id == product.id);
  //   if (foundProduct != undefined) {
  //     foundProduct.quantity++;
  //   } else {
  //     product.quantity = 1;
  //     basket.push(product);
  //   }
  //   saveBasket(basket);
  // }
}

// rafraichir la page
// location.reload();