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

// RECUP INFOS PRODUIT DEPUIS L'API GRÂÇE A L'ID
function getArticle(kanapId) {
  return fetch(`http://localhost:3000/api/products/${kanapId}`)
    .then((response) => response.json())
    .then((apiArticle) => (article = apiArticle))
    .catch((error) => {
      alert(error);
    });
}
//..............................................

// ........AFFICHE LES ELEMENTS DU KANAP........
function displayKanap(article) {
  document.querySelector("title").textContent = article.name;
  document.querySelector(
    ".item__img"
  ).innerHTML = `<img src="${article.imageUrl}" alt="${article.altTxt}"></img>`;
  document.getElementById("title").textContent = article.name;
  document.getElementById("price").textContent = article.price;
  document.querySelector(".item__content__description__title").textContent =
    article.description;

  // BOUCLE POUR INSÉRER LES COULEURS DISPOS POUR L'ARTICLE
  article.colors.forEach((colors4TheProduct) => {
    let baliseOption = document.createElement("option");
    baliseOption.innerHTML = `${colors4TheProduct}`;
    baliseOption.value = `${colors4TheProduct}`;
    
    colorProduct.appendChild(baliseOption);
    // AFFICHE LES COULEURS DISPOS POUR L'ARTICLE
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

// LANCE 'addBasket' AU CLIC DU BOUTON 'ajouter au panier'
let addToCartBtn = document.getElementById("addToCart");
addToCartBtn.addEventListener("click", addBasket);

function addBasket() {
  article.colorSelected = colorProduct.value;
  article.quantity = parseInt(numberOfProduct.value);
  // AJOUTE 'colorSelected' & 'quantity' À L'OBJET 'article'

  if (article.colorSelected != "") {
    // RÉCUPÉRATION LS
    let produitTableau = JSON.parse(localStorage.getItem("produit"));

    // SI RIEN DANS LE LS :
    if (produitTableau == null) {
      produitTableau = [];
      // STOCKAGE DANS LS DES INFOS NON SENSIBLES
      produitTableau.push({
        id: article._id,
        quantity: article.quantity,
        colorSelected: article.colorSelected,
      });
      localStorage.setItem("produit", JSON.stringify(produitTableau));
      return;
    }

    // SI ARTICLE DANS LE LS IDENTIQUE
    else {
      let a =
        produitTableau[
          produitTableau.findIndex(
            (product) =>
              product.id == article._id &&
              product.colorSelected == article.colorSelected
          )
        ];

      if (a) {
        (a["quantity"] = a["quantity"] + article.quantity),
          localStorage.setItem("produit", JSON.stringify(produitTableau));
      }

      // SI ARTICLE DANS LE LS DIFFÉRENT
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
    // SI AUCUNE COULEUR N'EST SÉLECTIONNÉE
  } else {
    alert("Merci de sélectionner une couleur");
    return;
  }
}
//..............................................
