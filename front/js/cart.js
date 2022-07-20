//...............CART PAGE.....................

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
    removeToCard();
  }
}
//..............................................

// ......LANCE LES DIFFERENTES FONCTIONS........
(async function () {
  const productsData = await getArticles();
  console.log(productsData);
  // CONTENU RECUP DEPUIS L'API

  let allData = merge(productsData, localStorageContent);

  totalProductPrice();
  // CALCUL LE PRIX TOTAL D'UN ARTICLE EN FONCTION DE SA QUANTITÉ

  totalPrice();
  // CALCUL PRIX TOTAL PANIER

  totalQuantity();
  // CALCUL LA QUANTITÉ TOTALE DE PRODUITS DANS LE PANIER

  localStorage.setItem("produit", JSON.stringify(allData));
  // MET À JOUR LE LS AVEC LE TABLEAU MERGE

  cartDisplay(allData);
  // AFFICHE CONTENU HTML DEPUIS LES INFOS DU LS
})();
//..............................................

//.........RECUP CONTENU LOCALSTORAGE..........
let allData = JSON.parse(localStorage.getItem("produit"));
//.............................................

// CALCUL LE PRIX TOTAL D'UN ARTICLE EN FONCTION DE SA QUANTITÉ
function totalProductPrice() {
  for (let i = 0; i < allData.length; i++) {
    allData = JSON.parse(localStorage.getItem("produit"));
    const productTotalPrice = allData[i];
    productTotalPrice.totalPrice =
      productTotalPrice.quantity * productTotalPrice.price;
    localStorage.setItem("produit", JSON.stringify(allData));
  }
  console.log(allData);
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

  for (let i = 0; i < allData.length; i++) {
    const quantityInCart = allData[i].quantity;
    productTotalQuantity.push(quantityInCart);
    let reducer = (acc, curr) => acc + curr;
    const totalArticles = productTotalQuantity.reduce(reducer, 0);
    targetTotalArticleQuantity.textContent = totalArticles;
  }
}

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
      for (let a = 0; a < allData.length; a++) {
        if (
          allData[a]._id == idProductForDelete &&
          allData[a].colorSelected == colorProductForDelete
        ) {
          allData.splice(allData[a], 1);
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

function updateQuantityProduct() {
  let updateQuantityBtn = document.getElementsByClassName("itemQuantity").value;
  for (let i = 0; i < updateQuantityBtn.length; i++) {
    let buttonUpdate = updateQuantityBtn[i];
    buttonUpdate.addEventListener("change", (ev) => {
      ev.preventDefault;

      allData = JSON.parse(localStorage.getItem("produit"));
      let a =
        allData[
          allData.findIndex(
            (product) =>
              product.id == article._id &&
              product.colorSelected == article.colorSelected
          )
        ];

      if (a) {
        a["quantity"] = updateQuantityBtn[i].value;
        localStorage.setItem("produit", JSON.stringify(allData));
        return;
      }

      totalProductPrice();
      // CALCUL LE PRIX TOTAL D'UN ARTICLE EN FONCTION DE SA QUANTITÉ

      totalPrice();
      // CALCUL PRIX TOTAL PANIER

      totalQuantity();
      // CALCUL LA QUANTITÉ TOTALE DE PRODUITS DANS LE PANIER

      allData = JSON.parse(localStorage.getItem("produit"));
      console.log(allData);
    });
  }
}

// ..........ENVOI DE LA COMMANDE..............
async function sentOrder() {
  const responseApi = await getArticles();
  allData.push({
    id: responseApi._id,
    quantity: responseApi.quantity,
    colorSelected: responseApi.colorSelected,
  });

  const finalTab = merge(responseApi, allData);
  console.log(finalTab);

  localStorage.setItem("produit", JSON.stringify(finalTab));
  // MET À JOUR LE LS AVEC LE TABLEAU MERGE

  // poster la commande du client
  const sentPost = async function (finalTab, contact) {
    let response = await fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      Headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(finalTab, contact),
    });
    let responseData = await response.json();
    console.log(responseData);
    console.log(responseData.id); // affiche l'ID client pour la commande
    let validationId = responseData.id;
    let linkConfirmationPage = "./confirmation.html?${validationId}"
  };
}

// ..........RECUP ID DANS L'URL................
function getConsumerId() {
  return new URL(location.href).searchParams.get("id");
}
//.............................................



// .........GESTION DU FORMULAIRE..............
let form = document.getElementsByClassName("cart__order__form");
let sentBtn = document.getElementById("order");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");
const contact = {
  Prénom: firstName.value,
  Nom: lastName.value,
  Adresse: address.value,
  Ville: city.value,
  Email: email.value,
};

//Ecoute le Click d'envoi de commande
sentBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let clientInformation = JSON.parse(localStorage.getItem("contact"));
  if (
    validFirstName(firstName) &&
    validLastName(lastName) &&
    validAddress(address) &&
    validCity(city) &&
    validEmail(email)
  ) {
    clientInformation.push([contact]);
    localStorage.setItem("produit", JSON.stringify(clientInformation));
    return;
    sentOrder();
  } else {
    console.log("Non Valide");
  }
});

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
const validFirstName = function (inputFirstName) {
  //Creation de la RegExp pour validation FirstName
  let FirstNameRegExp = new RegExp("^[a-zA-Z]+$", "g");

  // Recup paragraphe pour afficher le message
  let pFirstName = document.getElementById("firstNameErrorMsg");

  // Test de l'Expression Regulière
  if (FirstNameRegExp.test(inputFirstName.value)) {
    pFirstName.innerHTML = "Prénom Valide";
    pFirstName.removeAttribute("style.color");
    pFirstName.style.color = "green";
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
    pLastName.style.color = "green";
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
    pAddress.style.color = "green";
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
    pCity.style.color = "green";
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
    pEmail.style.color = "green";
    return true;
  } else {
    pEmail.innerHTML = "Email Non Valide";
    pEmail.removeAttribute("style.color");
    pEmail.style.color = "red";
    return false;
  }
};
