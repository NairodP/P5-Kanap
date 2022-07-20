//............PRODUCT PAGE.....................

let article = undefined;

let colorProduct = document.getElementById("colors"); // cible la couleur choisi
colorProduct[0].disabled = true;
colorProduct.required = true;

let numberOfProduct = document.getElementById("quantity"); // cible le nombre choisi
numberOfProduct.defaultValue = 1; // valeur par défaut = 1 pour éviter un ajout de 0 article au panier

// ..........RECUP ID DANS L'URL................
function getKanapId() {
  return new URL(location.href).searchParams.get("id");
}
//..............................................

// .......RECUP INFOS PRODUIT GRACE A L'ID.......
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
//..............................................

// ........AFFICHE LES ELEMENTS DU KANAP........
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

  // Boucle pour afficher les couleurs dispos pour l'article
  article.colors.forEach((colorKanap) => {
    let baliseOption = document.createElement("option");

    baliseOption.innerHTML = `${colorKanap}`;
    baliseOption.value = `${colorKanap}`;

    colorProduct.appendChild(baliseOption);
    // affichage une par une des couleurs possibles pour l'articles
  });
}
//..............................................

// ......LANCE LES DIFFERENTES FONCTIONS........
(async function () {
  const kanapId = getKanapId();
  console.log("id du produit : " + kanapId);

  const article = await getArticle(kanapId);
  console.log(article);

  displayKanap(article);
})();
//..............................................

// .............AJOUT AU PANIER.................
function addBasket() {
  article.colorSelected = colorProduct.value;
  article.quantity = parseInt(numberOfProduct.value);
  // ajoute les clefs 'colorSelected' et 'quantity' à l'objet article

  if (article.colorSelected != "") {
    // récupération de ce qui est enregistré sur le local storage
    let produitTableau = JSON.parse(localStorage.getItem("produit"));
    // console.log(produitTableau); // affichage tableau des infos pour l'article

    // lorsqu'il n'y a encore rien dans le local storage :
    if (produitTableau == null) {
      produitTableau = [];
      // Ne partage pas les éléments sensibles comme le prix, sans pour autant le supprimer
      produitTableau.push({
        id: article._id,
        quantity: article.quantity,
        colorSelected: article.colorSelected,
      });
      // console.log(produitTableau);
      localStorage.setItem("produit", JSON.stringify(produitTableau));
      return;
    }

    // Un article est dans le local storage : le produit est identique
    else {
      for (let i = 0; i < produitTableau.length; i++) {
        if (
          produitTableau[i]._id == article._id &&
          produitTableau[i].colorSelected == colorProduct.value
        ) {
          produitTableau[i].quantity =
            produitTableau[i].quantity + article.quantity;
          localStorage.setItem("produit", JSON.stringify(produitTableau));
          return;
        }

        // Un article est dans le local storage : même id mais pas même couleur
        else if (
          produitTableau[i]._id == article._id &&
          produitTableau[i].colorSelected != colorProduct.value
        ) {
          produitTableau.push({
            id: article._id,
            quantity: article.quantity,
            colorSelected: article.colorSelected,
          });
          localStorage.setItem("produit", JSON.stringify(produitTableau));
          return;
        }

        // Un article est dans le local storage : article différent
        else {
          produitTableau.push({
            id: article._id,
            quantity: article.quantity,
            colorSelected: article.colorSelected,
          });
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