//...............CART PAGE....................

//.........RECUP CONTENU LOCALSTORAGE..........
let localStorageContent = JSON.parse(localStorage.getItem("produit"));
console.log(localStorageContent);
//.............................................

//......RECUP INFOS PRODUITS DEPUIS L'API......
function getArticles() {
  return fetch(`http://localhost:3000/api/products/`)
    .then((response) => response.json())
    .then((productsData) => productsData)
    .catch((error) => {
      alert(error);
    });
}
//..............................................

//...........MERGE DES 2 TABLEAUX...............
function merge(firstArray, secondArray) {
  const tab = [];

  firstArray.forEach((x) => {
    secondArray.forEach((y) => {
      if (x._id === y._id) {
        tab.push({ ...x, ...y });
      }
    });
  });
  return tab;
}
//..............................................

// AFFICHAGE PRODUITS DANS LE PANIER SI ÉLÉMENTS PRÉSENTS DANS LE LS
function cartDisplay(allData) {
  if (allData) {
    document.getElementById("cart__items").innerHTML = allData
      .map(
        (article) =>
          `<article class="cart__item" data-id="${article._id}" data-color="${article.colorSelected}">
                <div class="cart__item__img">
                <img src="${article.imageUrl}" alt="${article.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${article.name}</h2>
                    <p>${article.colorSelected}</p>
                    <p>${article.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`
      )
      .join("");
  }
}
//..............................................

// ......LANCE LES DIFFERENTES FONCTIONS........
(async function () {
  const productsData = await getArticles();
  // CONTENU RECUP DEPUIS L'API

  merge(productsData, localStorageContent);
  let allData = merge(productsData, localStorageContent);
  // MET À JOUR LES DONNÉES PRODUITS

  localStorage.setItem("produit", JSON.stringify(allData));
  // MET À JOUR LE LS AVEC LE TABLEAU MERGE

  cartDisplay(allData);
  // AFFICHE CONTENU HTML DEPUIS LES INFOS DU LS
})();
//..............................................

//.........RECUP CONTENU LOCALSTORAGE..........
let allData = JSON.parse(localStorage.getItem("produit"));
//.............................................

// SUPPRIME L'ARTICLE DU PANIER AU CLIC SUR LE BTN 'supprimer'
function removeToCard() {
  let removeToCardBtn = document.getElementsByClassName("deleteItem");
  for (let b = 0; b < removeToCardBtn.length; b++) {
    let buttonDelete = removeToCardBtn[b];
    buttonDelete.addEventListener("click", (ev) => {
      let buttonClicked =
        ev.target.parentElement.parentElement.parentElement.parentElement;
      idProductForDelete = buttonClicked.dataset.id;
      colorProductForDelete = buttonClicked.dataset.color;
      console.log(
        "id du produit supprimé :",
        idProductForDelete,
        "couleur du produit supprimé :",
        colorProductForDelete
      );
      for (let k = 0; k < allData.length; k++) {
        if (
          allData[k]._id == idProductForDelete &&
          allData[k].colorSelected == colorProductForDelete
        ) {
          allData.splice(data[k], 1);
          location.reload();
          buttonClicked.remove();
          localStorage.setItem("produit", JSON.stringify(allData)),
            (allData = JSON.parse(localStorage.getItem("produit")));
          console.log(allData);
        }
      }
    });
  }
}
//.............................................

// CALCUL LE PRIX TOTAL D'UN ARTICLE EN FONCTION DE SA QUANTITÉ
function totalProductPrice() {
  for (let i = 0; i < allData.length; i++) {
    const productTotalPrice = allData[i];
    productTotalPrice.totalPrice =
      productTotalPrice.quantity * productTotalPrice.price;
  }
}
//.............................................

// CALCUL PRIX TOTAL PANIER
function totalPrice() {
  let productsTotalPrice = [];
  let targetTotalPrice = document.getElementById("totalPrice");
  for (let i = 0; i < allData.length; i++) {
    const calcTotal = allData[i].totalPrice;
    productsTotalPrice.push(calcTotal);
    let reducer = (acc, curr) => acc + curr;
    const totalPrice = productsTotalPrice.reduce(reducer, 0);
    targetTotalPrice.textContent = totalPrice;
  }
}
//.............................................

// CALCUL LA QUANTITÉ TOTALE DE PRODUITS DANS LE PANIER
function totalQuantity() {
  let productTotalQuantity = [];
  let targetTotalArticleQuantity = document.getElementById("totalQuantity");

  for (let i = 0; i < addProduct.length; i++) {
    const quantityInCart = addProduct[i].quantity;
    productTotalQuantity.push(quantityInCart);
    let reducer = (acc, curr) => acc + curr;
    const totalArticles = productTotalQuantity.reduce(reducer, 0);
    targetTotalArticleQuantity.textContent = totalArticles;
  }
}

// // récupération de ce qui est enregistré sur le local storage
// let allData = JSON.parse(localStorage.getItem("produit"));
// // console.log(allData); // affichage tableau des infos pour l'article

// for (let i = 0; i < allData.length; i++) {
//   const element = allData[i]._id;
//   const element2 = allData[i].colorSelected;
//   console.log("id:", element, ",", "colorSelected:", element2);
// }

// FORMULAIRE ET ENVOI DE LA COMMANDE
function sentOrder() {
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let address = document.getElementById("address").value;
  let city = document.getElementById("city").value;
  let email = document.getElementById("email").value;
  let btnOrder = document.getElementById("order").value;

  const formClient = {
    firstName : firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  }

  const sentOrder = {
    form,
    allData
  }

  btnOrder.addEventListener("click", (e) => {
    e.preventDefault;

  })
}
//.............................................
