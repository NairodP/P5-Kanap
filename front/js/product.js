//............Product Page..............;

let article = undefined;

let colorProduct = document.getElementById("colors");
colorProduct[0].disabled = true;
colorProduct.required = true;
// Gestion des couleurs pour le produit
// console.log(colorProduct.value);
// cible la couleur choisi

let numberOfProduct = document.getElementById("quantity");
numberOfProduct.defaultValue = 1;
// console.log(numberOfProduct.value);
// cible le nombre choisi
// valeur par défaut = 1 pour éviter un ajout de 0 article au panier

(async function () {
  const kanapId = getKanapId();
  console.log("id du produit : " + kanapId);

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
    .then(function (apiArticle) {
      article = apiArticle;
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

function deleteSensibleInformation(a) {
  delete a.price;
  delete a.colors;
  delete a.altTxt;
  delete a.imageUrl;
  delete a.description;
  delete a.name;
}

function addBasket() {
  let articleClear = article;
  // console.log(articleClear);

  articleClear.colorSelected = colorProduct.value;
  articleClear.quantity = parseInt(numberOfProduct.value);
  // ajoute les clefs couleurSelected et quantity à l'objet articleClear

  deleteSensibleInformation(articleClear);
  // console.log(articleClear);

  if (articleClear.colorSelected != "") {
    // récupération de ce qui est enregistré sur le local storage
    let produitTableau = JSON.parse(localStorage.getItem("produit"));
    // console.log(produitTableau); // affichage tableau des infos pour l'article

    // lorsqu'il n'y a encore rien dans le local storage :
    if (produitTableau == null) {
      produitTableau = [];
      // Ne partage pas les éléments sensibles comme le prix, sans pour autant le supprimer
      produitTableau.push(articleClear);
      // console.log(produitTableau);
      localStorage.setItem("produit", JSON.stringify(produitTableau));
      return;
    }
    // lorsqu'il n'y a au moins un article dans le local storage :

    // le produit est identique
    else {
      for (let i = 0; i < produitTableau.length; i++) {
        if (
          produitTableau[i]._id == articleClear._id &&
          produitTableau[i].colorSelected == colorProduct.value
        ) {
          produitTableau[i].quantity =
            produitTableau[i].quantity + articleClear.quantity;
          localStorage.setItem("produit", JSON.stringify(produitTableau));
          return;
        }

        // Le produit à le même id mais pas la même couleur
        else if (
          produitTableau[i]._id == articleClear._id &&
          produitTableau[i].colorSelected != colorProduct.value
        ) {
          produitTableau.push(articleClear);
          localStorage.setItem("produit", JSON.stringify(produitTableau));
          return;
        }
        // Le produit est différent
        else {
          produitTableau.push(articleClear);
          localStorage.setItem("produit", JSON.stringify(produitTableau));
          return;
        }
      }
    }
    return;
  } else {
    alert("Merci de sélectionner une couleur");
    return;
  }
}
