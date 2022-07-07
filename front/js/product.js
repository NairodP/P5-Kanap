//............Product Page..............;

let article = undefined;

// Gestion des couleurs pour le produit
let colorProduct = document.getElementById("colors");
// console.log(colorProduct.value);
// cible la couleur choisi

let numberOfProduct = document.getElementById("quantity");
numberOfProduct.defaultValue = 1;
// console.log(numberOfProduct.value);
// cible le nombre choisi


(async function () {
  const kanapId = getKanapId();
  console.log(kanapId);

  const article = await getArticle(kanapId);
  console.log(article);

  displayKanap(article);
})();

function deleteSensibleInformation(article) {
  delete article.price;
  delete article.colors;
  delete article.altTxt;
  delete article.imageUrl;
  delete article.description;
  delete article.name;
}

//récupérer l'id dans l'URL
function getKanapId() {
  return new URL(location.href).searchParams.get("id");
}

function addBasket() {
  article.colorSelected = colorProduct.value;
  article.quantity = parseInt(numberOfProduct.value);
  // ajoute les clefs couleurSelected et numberSelected à l'objet article
  // console.log(article);

  // récupération de ce qui est enregistré sur le local storage
  let produitTableau = JSON.parse(localStorage.getItem("produit"));
  console.log(produitTableau); // affichage tableau des infos pour l'article

  deleteSensibleInformation(article);

  // lorsqu'il n'y a encore rien dans le local storage :
  if (produitTableau == null) {
    produitTableau = [];
    produitTableau.push(article);
    console.log(produitTableau);
    localStorage.setItem("produit", JSON.stringify(produitTableau));
  }
  // lorsqu'il n'y a au moins un article dans le local storage :
  else {
    for (let i = 0; i < produitTableau.length; i++) {
      console.log("test boucle");
      // lorsque l'article est strictement identique :
      if (
        produitTableau[i]._id == article._id &&
        produitTableau[i].colorSelected == colorProduct.value
      ) {
        return (
          (produitTableau[i].quantity =
            parseInt(produitTableau[i].quantity) + parseInt(article.quantity)),
          console.log("Sucess add quantity ?"),
          localStorage.setItem("produit", JSON.stringify(produitTableau)),
          (produitTableau = JSON.parse(localStorage.getItem("produit")))
        );
      }
    }
    // lorsque l'article est identique mais que la couleur est différente :
    for (i = 0; i < produitTableau.length; i++) {
      console.log("test boucle 2");
      if (
        produitTableau[i]._id == article._id &&
        produitTableau[i].colorSelected != colorProduct.value
      ) {
        return (
          produitTableau.push(article),
          localStorage.setItem("produit", JSON.stringify(produitTableau)),
          (produitTableau = JSON.parse(localStorage.getItem("produit")))
        );
      }
    }
    // lorsque le produit n'existe pas dans le local storage :
    for (i = 0; i < produitTableau.length; i++) {
      console.log("test boucle 3");
      if (produitTableau[i]._id != article._id) {
        return (
          produitTableau.push(article),
          localStorage.setItem("produit", JSON.stringify(produitTableau)),
          (produitTableau = JSON.parse(localStorage.getItem("produit")))
        );
      }
    }
  }
  return (produitTableau = JSON.parse(localStorage.getItem("produit")));
}

function getArticle(kanapId) {
  return fetch(`http://localhost:3000/api/products/${kanapId}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (apiArticle) {
      article = apiArticle
      return apiArticle;
    })
    .catch(function (error) {
      alert(error);
    });
}

// Afficher les différents éléments du Kanap
function displayKanap(article) {
  //Clic sur le bouton ajouter au panier qui déclenche la fonction addBasket
  let addToCartBtn = document.getElementById("addToCart");
  addToCartBtn.addEventListener("click", addBasket);

  let img = document.querySelector(".item__img");

  document.querySelector("title").textContent = article.name;

  img.innerHTML = `<img src="${article.imageUrl}" alt="${article.altTxt}"></img>`;

  document.getElementById("title").textContent = article.name;

  document.getElementById("price").textContent = article.price;

  document.querySelector(".item__content__description__title").textContent =
    article.description;

  // Gestion des couleurs pour le produit
  let colorProduct = document.getElementById("colors");

  // Boucle pour afficher les couleurs dispos pour l'article
  article.colors.forEach((colorKanap) => {
    let baliseOption = document.createElement("option");

    baliseOption.innerHTML = `${colorKanap}`;
    baliseOption.value = `${colorKanap}`;

    colorProduct.appendChild(baliseOption);
    // console.log(baliseOption.value);
    // affichage une par une des couleurs possibles pour l'articles
  });
}
