let kanapData = [];

const kanapDisplay = async () => {
  fetch(`http://localhost:3000/api/products`)
    .then((response) => response.json())
    .then(function (kanapData) {
      article = kanapData;
      return kanapData;
    })
    .catch(function (error) {
      alert(error);
    });
};

let addProduct = JSON.parse(localStorage.getItem("produit"));
console.log(addProduct);

const cartDisplay = async () => {
  if (addProduct) {
    await addProduct;
    document.getElementById("cart__items").innerHTML = addProduct
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

    let removeToCardBtn = document.getElementsByClassName("deleteItem");
    console.log(removeToCardBtn);
    for (i = 0; i < removeToCardBtn.length; i++) {
      let button = removeToCardBtn[i];
      button.addEventListener("click", function (event) {
        let buttonClicked = event.target;
        buttonClicked.parentElement.parentElement.parentElement.parentElement.remove();
      });
    }
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
  }
  console.log(addProduct);
};
cartDisplay();

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
