//...............CART PAGE.....................

//.........RECUP CONTENU LOCALSTORAGE..........
let localStorageContent = JSON.parse(localStorage.getItem("produit"));
console.log(localStorageContent);
let tabMerge = undefined;
//.............................................

//...........MERGE DES 2 TABLEAUX...............
function merge(productsData, localStorageContent) {
  let tab = [];

  productsData.forEach((x) => {
    localStorageContent.forEach((y) => {
      if (x._id === y.id) {
        tab.push({ ...x, ...y });
      }
    });
  });
  return tab;
}
//..............................................

// CALCUL PRIX TOTAL PANIER
function totalPrice() {
  let productsTotalPrice = [];
  let targetTotalPrice = document.getElementById("totalPrice");
  tabMerge.forEach((el) => {
    productsTotalPrice.push(el.price * el.quantity);
  });
  let reducer = (accumulateur, productTotal) => accumulateur + productTotal;
  let totalPrice = productsTotalPrice.reduce(reducer, 0);
  targetTotalPrice.textContent = totalPrice;
  // réduit le tableau à un résultat
}
//.............................................

// CALCUL LA QUANTITÉ TOTALE DE PRODUITS DANS LE PANIER
function totalQuantity() {
  let productTotalQuantity = [];
  let targetTotalArticlesQuantity = document.getElementById("totalQuantity");

  for (let i = 0; i < tabMerge.length; i++) {
    let quantityInCart = tabMerge[i].quantity;
    productTotalQuantity.push(quantityInCart);
    let reducer = (accumulateur, product) => accumulateur + product;
    let totalArticles = productTotalQuantity.reduce(reducer, 0);
    targetTotalArticlesQuantity.textContent = totalArticles;
  }
}
//.............................................

//......RECUP INFOS PRODUITS DEPUIS L'API......
fetch(`http://localhost:3000/api/products/`)
  .then((response) => response.json())
  .then((productsData) => {
    tabMerge = merge(productsData, localStorageContent);
    console.log(tabMerge);
    totalPrice();
    // CALCUL PRIX TOTAL PANIER
    totalQuantity();
    // CALCUL LA QUANTITÉ TOTALE DE PRODUITS DANS LE PANIER
    cartDisplay(tabMerge);
  })
  .catch((error) => alert(error));
//..............................................

// SUPPRIME L'ARTICLE DU PANIER AU CLIC SUR LE BTN 'supprimer'
function removeToCard() {
  let removeToCardBtn = document.getElementsByClassName("deleteItem");
  for (let i = 0; i < removeToCardBtn.length; i++) {
    let buttonDelete = removeToCardBtn[i];
    buttonDelete.addEventListener("click", (ev) => {
      ev.preventDefault;
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
      for (let index = 0; index < tabMerge.length; index++) {
        if (
          tabMerge[index]._id == idProductForDelete &&
          tabMerge[index].colorSelected == colorProductForDelete
        ) {
          tabMerge.splice(tabMerge[index], 1);
          buttonClicked.remove();
          totalPrice();
          totalQuantity();
        }
      }
    });
  }
}
//.............................................

// AFFICHAGE PRODUITS DANS LE PANIER SI ÉLÉMENTS PRÉSENTS DANS LE LS
function cartDisplay(tabMerge) {
  if (tabMerge) {
    document.getElementById("cart__items").innerHTML = tabMerge
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
    removeToCard();
  }
}
//..............................................

// MET À JOUR LES QUANTITÉS
function updateQuantityProduct() {
  let updateQuantityBtn = document.getElementsByClassName("itemQuantity").value;
  for (let i = 0; i < updateQuantityBtn.length; i++) {
    let buttonUpdate = updateQuantityBtn[i];
    buttonUpdate.addEventListener("change", (ev) => {
      ev.preventDefault;

      let a =
        tabMerge[
          tabMerge.findIndex(
            (product) =>
              product.id == article._id &&
              product.colorSelected == article.colorSelected
          )
        ];

      if (a) {
        a["quantity"] = updateQuantityBtn[i].value;
        return;
      }

      totalProductPrice();
      // CALCUL LE PRIX TOTAL D'UN ARTICLE EN FONCTION DE SA QUANTITÉ

      totalPrice();
      // CALCUL PRIX TOTAL PANIER

      totalQuantity();
      // CALCUL LA QUANTITÉ TOTALE DE PRODUITS DANS LE PANIER
    });
  }
}
//.............................................

// ..........ENVOI DE LA COMMANDE..............

let contact = undefined;

// poster la commande du client
function fetchPost() {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    Headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(tabMerge, contact),
  })
  .then(res => res.json())
  .then(res => console.log(res.id))
  let responseData = await response.json();
  console.log(responseData);
  console.log(responseData.id); // affiche l'ID client pour la commande
  let validationId = responseData.id;
  // .then document.location
}

function sentOrder() {
// .........GESTION DU FORMULAIRE..............
let sentBtn = document.getElementById("order");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");
let contact = {
  Prénom: firstName.value,
  Nom: lastName.value,
  Adresse: address.value,
  Ville: city.value,
  Email: email.value,
}
  //...Ecoute le Click d'envoi de commande
  sentBtn.addEventListener("click", function (e) {
    e.preventDefault();
  if (
    validFirstName(firstName) &&
    validLastName(lastName) &&
    validAddress(address) &&
    validCity(city) &&
    validEmail(email) &&
    tabMerge &&
    tabMerge.length > 0
  ) {
    fetchPost();

    return;
  } else {
    alert("Champ(s) du formulaire Non Valide ou panier Vide !");
    console.log("Champ(s) du formulaire Non Valide ou panier Vide !");
    }
  });
}

//Ecoute la modification du Prénom
firstName.addEventListener("change", function () {
  validFirstName(this);
});

//Ecoute la modification du Nom de famille
lastName.addEventListener("change", function () {
  validLastName(this);
});

//Ecoute la modification de l'adresse
address.addEventListener("change", function () {
  validAddress(this);
});

//Ecoute la modification de la ville
city.addEventListener("change", function () {
  validCity(this);
});

//Ecoute la modification de l'email
email.addEventListener("change", function () {
  validEmail(this);
});

// VALIDATION FIRSTNAME
function validFirstName(inputFirstName) {
  //Creation de la RegExp pour validation FirstName
  let FirstNameRegExp = new RegExp("^[a-zA-Z]+$", "g");

  // Recup paragraphe pour afficher le message
  let pFirstName = document.getElementById("firstNameErrorMsg");

  // Test de l'Expression Regulière
  if (FirstNameRegExp.test(inputFirstName.value)) {
    pFirstName.innerHTML = "Prénom Valide";
    pFirstName.removeAttribute("style.color");
    pFirstName.style.color = "#083B32";
    return true;
  } else {
    pFirstName.innerHTML = "Prénom Non Valide";
    pFirstName.removeAttribute("style.color");
    pFirstName.style.color = "red";
    return false;
  }
};

// VALIDATION LASTNAME
const validLastName = function (inputLastName) {
  //Creation de la RegExp pour validation lastName
  let lastNameRegExp = new RegExp("^[a-zA-Z]+$", "g");

  // Recup paragraphe pour afficher le message
  let pLastName = document.getElementById("lastNameErrorMsg");

  // Test de l'Expression Regulière
  if (lastNameRegExp.test(inputLastName.value)) {
    pLastName.innerHTML = "Nom Valide";
    pLastName.removeAttribute("style.color");
    pLastName.style.color = "#083B32";
    return true;
  } else {
    pLastName.innerHTML = "Nom Non Valide";
    pLastName.removeAttribute("style.color");
    pLastName.style.color = "red";
    return false;
  }
};

// VALIDATION ADRESSE
const validAddress = function (inputAddress) {
  //Creation de la RegExp pour validation address
  let addressRegExp = new RegExp("^[a-zA-Z0-9s,.'-]{3,}$", "g");

  // Recup paragraphe pour afficher le message
  let pAddress = document.getElementById("addressErrorMsg");

  // Test de l'Expression Regulière
  if (addressRegExp.test(inputAddress.value)) {
    pAddress.innerHTML = "Adresse Valide";
    pAddress.removeAttribute("style.color");
    pAddress.style.color = "#083B32";
    return true;
  } else {
    pAddress.innerHTML = "Adresse Non Valide";
    pAddress.removeAttribute("style.color");
    pAddress.style.color = "red";
    return false;
  }
};

// VALIDATION VILLE
const validCity = function (inputCity) {
  //Creation de la RegExp pour validation city
  let cityRegExp = new RegExp("^[[:alpha:]]([-' ]?[[:alpha:]])*$", "g");

  // Recup paragraphe pour afficher le message
  let pCity = document.getElementById("cityErrorMsg");

  // Test de l'Expression Regulière
  if (cityRegExp.test(inputCity.value)) {
    pCity.innerHTML = "Ville Valide";
    pCity.removeAttribute("style.color");
    pCity.style.color = "#083B32";
    return true;
  } else {
    pCity.innerHTML = "Ville Non Valide";
    pCity.removeAttribute("style.color");
    pCity.style.color = "red";
    return false;
  }
};

// VALIDATION EMAIL
const validEmail = function (inputEmail) {
  //Creation de la RegExp pour validation email
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
    "g"
  );
  // Commence par des caractères majuscules, minuscules,chiffres de 0 à 9 ou encore des ".", "-" ou "_". Ces caractères peuvent ête écrit une fois ou plusieurs. il y a à la suite un seul @ qui ne pourra plus être écrit. De nous les mêmes caractères qu'au début peuvent être éctit. Un "." viendra séparer cette partie de la suivante et sera le dernier point qui pourra être renseigné. Pour finir des caractères devront être écrit. il doit y avoir entre 2 et 10 caractères forcément en minuscule.
  // Le marqueur "g" indique que le RegExp est lu de manière globale.

  // Recup paragraphe pour afficher le message
  let pEmail = document.getElementById("emailErrorMsg");

  // Test de l'Expression Regulière
  if (emailRegExp.test(inputEmail.value)) {
    pEmail.innerHTML = "Email Valide";
    pEmail.removeAttribute("style.color");
    pEmail.style.color = "#083B32";
    return true;
  } else {
    pEmail.innerHTML = "Email Non Valide";
    pEmail.removeAttribute("style.color");
    pEmail.style.color = "red";
    return false;
  }
};
