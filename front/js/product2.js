//............Product Page..............;

(async function () {
  const kanapId = getKanapId();
  console.log(kanapId);

  const article = await getArticle(kanapId);
  console.log(article);

  displayKanap(article);
})();

//récupérer l'id dans l'URL
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

// Afficher les différents éléments du Kanap
function displayKanap(article) {
  let img = document.querySelector(".item__img");

  document.querySelector("title").textContent = article.name;

  img.innerHTML = `<img src="${article.imageUrl}" alt="${article.altTxt}"></img>`;

  document.getElementById("title").textContent = article.name;

  document.getElementById("price").textContent = article.price;

  document.querySelector(".item__content__description__title").textContent =
    article.description;

  // Gestion des couleurs pour le produit
  let colorProduct = document.getElementById("colors");
  console.log(colorProduct); // ciblage balise avec id colors
  console.log(article.colors); // affichage tableau couleurs possibles pour l'articles

  // Boucle pour afficher les couleurs dispos pour l'article
  article.colors.forEach((colorKanap) => {
    let baliseOption = document.createElement("option");

    baliseOption.innerHTML = `${colorKanap}`;
    baliseOption.value = `${colorKanap}`;

    colorProduct.appendChild(baliseOption);
    console.log(baliseOption.value);
    // affichage une par une des couleurs possibles pour l'articles
  });

  console.log(colorProduct.value); // cible la couleur choisi
  let numberOfProduct = document.getElementById('quantity')
  console.log(numberOfProduct.value); // cible le nombre choisi

  // ............Gestion Panier..............;

  let addToCart = document.getElementById("addToCart");
  addToCart.addEventListener("click", addBasket);

  // enregistrement de l'ajout sur le local storage en format JSON
  function saveBasket(basket) {
    localStorage.setItem("produit", JSON.stringify(basket));
  }

  // récupération de ce qui est enregistré sur le local storage
  function getBasket() {
    let basket = localStorage.getItem("produit");
    if (basket == null) {
      return [];
    } else {
      return JSON.parse(basket);
    }
  }

  // ajout produit au panier et vérif si celui-ci n'est pas déjà existant
  function addBasket(product) {
    let basket = getBasket();
    let foundProduct = basket.find((p) => p.id == product.id && p.color == product.color);
    if (foundProduct != undefined) {
      foundProduct.quantity = numberOfProduct.value;
    } else if (foundProduct = basket.find((p) => p.id == product._id)){
      foundProduct.quantity++;
    } else {
      product.quantity = 1;
      basket.push(product);
    }
    saveBasket(basket);
  }
}

// rafraichir la page
// location.reload();

// alert("Merci d'indiquer un nombre de produits");