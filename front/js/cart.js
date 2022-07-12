// récupère le contenu du localstorage
let addProduct = JSON.parse(localStorage.getItem("produit"));
// console.log(addProduct); // contenu non sensible localstorage

(async function () {
  const productsData = await getArticles();
  // console.log(productsData); // contenu global récupéré par l'API

  // met en relation nos deux tableaux. Celui du localstorage avec les infos non sensibles, et le tableaux général avec toutes les infos sur les produits récupéré depuis l'API
  arr1 = productsData;
  arr2 = addProduct;

  const merge = (arr1, arr2) => {
    const temp = [];

    arr1.forEach((x) => {
      arr2.forEach((y) => {
        if (x._id === y._id) {
          temp.push({ ...x, ...y });
        }
      });
    });
    return temp;
  };
  let allData = merge(arr1, arr2);
  // console.log(allData); // tableau contenant toutes les infos des produits mises en corélation

  // ajoute le prix total de l'article en fonction de la quantité choisi dans son tableau de données
  for (let c = 0; c < allData.length; c++) {
    const unicObject = allData[c];
    // console.log(unicObject);
    unicObject.totalPrice = unicObject.quantity * unicObject.price;
  }

  // calcul le prix total du panier en fonction des articles présents dedans
  let kanapTotalPrice = [];
  let targetTotalPrice = document.getElementById("totalPrice");
  for (let d = 0; d < allData.length; d++) {
    const calcTotal = allData[d].totalPrice;
    // console.log(calcTotal);
    kanapTotalPrice.push(calcTotal);
    let reducer = (acc, curr) => acc + curr;
    const totalPrice = kanapTotalPrice.reduce(reducer, 0);
    targetTotalPrice.textContent = totalPrice;
  }

  // ajoute toutes les infos des produits en panier dans le localstorage
  addProduct = allData;
  localStorage.setItem("produit", JSON.stringify(addProduct));

  // affiche le contenu HTML des produits en localstorage pour qu'ils apparaissent sur la page
  cartDisplay(allData);
})();

// récupère toutes les infos produits depuis l'API
function getArticles() {
  return fetch(`http://localhost:3000/api/products/`)
    .then(function (response) {
      return response.json();
    })
    .then(function (productsData) {
      return productsData;
    })
    .catch(function (error) {
      alert(error);
    });
}

function cartDisplay(allData) {
  // Pour afficher les éléments dans le panier, on vérifie d'abord qu'il y ai qqch dans le local storage
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

// nombre total de produit dans le panier
let kanapTotalQuantity = [];
let targetTotalArticleQuantity = document.getElementById("totalQuantity");

for (let a = 0; a < addProduct.length; a++) {
  const quantityInCart = addProduct[a].quantity;
  kanapTotalQuantity.push(quantityInCart);
  // console.log(kanapTotalQuantity);
  let reducer = (acc, curr) => acc + curr;
  const totalArticles = kanapTotalQuantity.reduce(reducer, 0);
  targetTotalArticleQuantity.textContent = totalArticles;
  // console.log(totalArticles);
}

// Pour supprimer visuellement du panier
function deleteArticle() {
  let removeToCardBtn = document.getElementsByClassName("deleteItem");
  for (b = 0; b < removeToCardBtn.length; b++) {
    let button = removeToCardBtn[b];
    button.addEventListener("click", function (event) {
      let buttonClicked =
        event.target.parentElement.parentElement.parentElement.parentElement;
      console.log(buttonClicked);
      // buttonClicked.remove();
    });
  }
}

// function totalPrice() {
//   // prix total du panier
//   let kanapTotalPrice = [];
//   let targetTotalPrice = document.getElementById("totalPrice");

//   if (allData) {
//     allData.forEach((kanap) => {
//       let priceOfProduct = allData.price;
//       kanapTotalPrice.push(priceOfProduct);
//       targetTotalPrice.textContent = eval(kanapTotalPrice.join("+"));
//     });
//   }
// }

// prix total du panier
// let kanapTotalPrice = [];
// let targetTotalPrice = document.getElementById("totalPrice");

// if(allData) {
//   allData.forEach((kanap) => {
//     kanapTotalPrice.push(kanap.value*quantity);
//     targetTotalPrice.textContent = eval(kanapTotalPrice.join("+"));
//   })
// }

// for( let i = 0; i < localStorage.length; i++){
//   console.log(localStorage.key(i));
// }

// function saveBasket(allData) {
//   localStorage.setItem("produit", JSON.stringify(allData));
// }

// function getBasket() {
//   let basket = localStorage.getItem("produit");
//   if (basket == null) {
//     return [];
//   } else {
//     return JSON.parse(basket);
//   }
// }

// function gettTotalPrice(){
//   let basket = getBasket();
//   let total = 0;
//   for(let article of basket){
//     total += article.quantity * article.price;
//   }
//   return total;
// }

// let removeFromBasket = addProduct.filter(function(article) {
//   let removeToCart = document.getElementsById(`delete.${article._id}`);
//   removeToCart.addEventListener("click", () => {
//     addProduct = addProduct.filter((p) => p._id != article._id);
//     return (
//       addProduct.push(article),
//       localStorage.setItem("produit", JSON.stringify(addProduct)),
//       (addProduct = JSON.parse(localStorage.getItem("produit"))));
//       location.reload();
// console.log(removeFromBasket);
//   })
// })

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

// function addBasket(article) {
//   let basket = getBasket();
//   let foundProduct = basket.find((p) => p._id == article._id);
//   if (foundProduct != undefined) {
//     foundProduct.quantity++;
//   } else {
//     article.quantity = 1;
//     basket.push(article);
//   }
//   saveBasket(basket);
// }

// function removeFromBasket(article) {
//   let basket = getBasket();
//   basket = basket.filter((p) => p._id != article._id);
//   saveBasket(basket);
// }

// function changeQuantity(article, quantity) {
//   let basket = getBasket();
//   let foundProduct = basket.find((p) => p._id == article._id);
//   if (foundProduct != undefined) {
//     foundProduct.quantity += quantity;
//     if (foundProduct.quantity <= 0) {
//       removeFromBasket(foundProduct);
//     } else {
//       saveBasket(basket);
//     }
//   }
// }

// function getNumberProduct(){
//   let basket = getBasket();
//   let number = 0;
//   for(let article of basket){
//     number += article.quantity;
//   }
//   return number;
// }

// function getTotalPrice(){
//   let basket = getBasket();
//   let total = 0;
//   for(let article of basket){
//     total += article.quantity * article.price;
//   }
//   return total;
// }
