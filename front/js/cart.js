//...............CART PAGE.....................

//.........RECUP CONTENU LOCALSTORAGE..........
let localStorageContent = JSON.parse(localStorage.getItem("produit"));
console.log("infos localstorage :", localStorageContent);
let tabMerge = undefined;
let article = undefined;
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
  let targetTotalPrice = document.getElementById("totalPrice");
  let reducer = (accumulateur, productTotal) =>
    accumulateur + productTotal.price * productTotal.quantity;
  targetTotalPrice.textContent = tabMerge.reduce(reducer, 0);
  // réduit le tableau à un résultat
}
//.............................................

// CALCUL LA QUANTITÉ TOTALE DE PRODUITS DANS LE PANIER
function totalQuantity() {
  let targetTotalArticlesQuantity = document.getElementById("totalQuantity");
  // tabMerge.forEach((el) => {
  //   productTotalQuantity.push(el.quantity);
  //   let reducer = (sum, product) => sum + product;
  //   let totalQuantity = productTotalQuantity.reduce(reducer, 0);
  //   targetTotalArticlesQuantity.textContent = totalQuantity;
  // });
  let reducer = (sum, product) => sum + product.quantity;
  targetTotalArticlesQuantity.textContent = tabMerge.reduce(reducer, 0);
}
//.............................................

//......RECUP INFOS PRODUITS DEPUIS L'API......
if (localStorageContent) {
  fetch(`http://localhost:3000/api/products/`)
    .then((response) => response.json())
    .then((productsData) => {
      article = productsData;
      tabMerge = merge(productsData, localStorageContent);
      console.log(
        "tableau fusionné comportant toutes les données produits :",
        tabMerge
      );
      totalPrice();
      // CALCUL PRIX TOTAL PANIER
      totalQuantity();
      // CALCUL LA QUANTITÉ TOTALE DE PRODUITS DANS LE PANIER
      cartDisplay(tabMerge);
    })
    .catch((error) => alert(error));
} else {
  alert("VOTRE PANIER EST VIDE");
  let cart = document.querySelector(".cart");
  cart.remove();
  // let titleCart = document.querySelector("#cartAndFormContainer h1");
  // titleCart.innerHTML = "Votre Panier est vide !";
  // let textPanierVide = document.querySelector(".cart__price p");
  // textPanierVide.innerHTML = "";
}

//..............................................

// SUPPRIME L'ARTICLE DU PANIER AU CLIC SUR LE BTN 'supprimer'
function removeToCard() {
  let removeToCardBtn = document.getElementsByClassName("deleteItem");
  for (let i = 0; i < removeToCardBtn.length; i++) {
    let buttonDelete = removeToCardBtn[i];
    buttonDelete.addEventListener("click", (ev) => {
      let input = ev.target;
      let inputData =
        input.parentElement.parentElement.parentElement.parentElement;
      let idProductForDelete = inputData.dataset.id;
      let colorProductForDelete = inputData.dataset.color;
      let indexProductDelete = localStorageContent.findIndex(
        (nbr) =>
          nbr.id == idProductForDelete &&
          nbr.colorSelected == colorProductForDelete
      );
      if (indexProductDelete < 0) {
        return;
      }
      console.log(
        "produit supprimé :",
        idProductForDelete,
        colorProductForDelete
      );
      localStorageContent.splice(indexProductDelete, 1);
      localStorage.setItem("produit", JSON.stringify(localStorageContent));
      console.log("produit supprimé dans le LS");
      for (let index = 0; index < tabMerge.length; index++) {
        if (
          tabMerge[index]._id == idProductForDelete &&
          tabMerge[index].colorSelected == colorProductForDelete
        ) {
          tabMerge.splice(tabMerge[index], 1);
          inputData.remove();
          totalPrice();
          totalQuantity();
        }
      }
    });
  }
}
//.............................................

// MET À JOUR LES QUANTITÉS
function updateQuantityProduct() {
  let qttBtn = document.getElementsByClassName("itemQuantity");
  // ou document.querySelectorAll('input.itemQuantity');
  for (let i = 0; i < qttBtn.length; i++) {
    let updateBtn = qttBtn[i];
    console.log("Quantité du produit", [i + 1], ":", updateBtn.value);
    updateBtn.addEventListener("change", quantityChanged);
  }
}

function quantityChanged(ev) {
  let input = ev.target;
  let inputData = input.parentElement.parentElement.parentElement.parentElement;
  let idProductToUpdate = inputData.dataset.id;
  let colorProductToUpdate = inputData.dataset.color;
  console.log("produit modifié :", idProductToUpdate, colorProductToUpdate);
  let productUpdate = localStorageContent.find(
    (nbr) =>
      nbr.id == idProductToUpdate && nbr.colorSelected == colorProductToUpdate
  );
  productUpdate.quantity = parseInt(input.value);
  localStorage.setItem("produit", JSON.stringify(localStorageContent));
  console.log("Quantité produit MAJ dans le LS");
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  for (let index = 0; index < tabMerge.length; index++) {
    if (
      tabMerge[index]._id == idProductToUpdate &&
      tabMerge[index].colorSelected == colorProductToUpdate
    ) {
      tabMerge[index].quantity = parseInt(input.value);
      totalPrice();
      totalQuantity();
    }
  }
}
//.............................................

// function checkIfNull() {
//   if ((localStorageContent.length == 0)) {
//     let cart = document.querySelector(".cart");
//     cart.remove();
//   }
// }

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
    updateQuantityProduct();
    // checkIfNull();
  }
}
//..............................................

// ..........ENVOI DE LA COMMANDE..............

// .........GESTION DU FORMULAIRE..............
let sentBtn = document.getElementById("order");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");
let orderId = undefined;

// poster la commande du client
function fetchPost(order) {
  fetch(`http://localhost:3000/api/products/order`, {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(
      (idCommande) =>
        (document.location = `confirmation.html?id=${idCommande.orderId}`)
    )
    .catch((error) => alert(error));
}

function sentOrder() {
  if (
    validFirstName(firstName) &&
    validLastName(lastName) &&
    validAddress(address) &&
    validCity(city) &&
    validEmail(email) &&
    tabMerge &&
    tabMerge.length > 0
  ) {
    let contact = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };
    let order = {
      contact: contact,
      products: tabMerge.map((el) => el._id),
    };
    fetchPost(order);
  } else {
    alert("Champ(s) du formulaire Non Valide ou panier Vide !");
    console.log("Champ(s) du formulaire Non Valide ou panier Vide !");
  }
}
//...Ecoute le Click d'envoi de commande
if (localStorageContent) {
  sentBtn.addEventListener("click", function (e) {
    e.preventDefault();
    sentOrder();
  });
}

//Ecoute la modification du Prénom
if (localStorageContent) {
  firstName.addEventListener("change", function () {
    validFirstName(this);
  });
}

//Ecoute la modification du Nom de famille
if (localStorageContent) {
  lastName.addEventListener("change", function () {
    validLastName(this);
  });
}

//Ecoute la modification de l'adresse
if (localStorageContent) {
  address.addEventListener("change", function () {
    validAddress(this);
  });
}

//Ecoute la modification de la ville
if (localStorageContent) {
  city.addEventListener("change", function () {
    validCity(this);
  });
}

//Ecoute la modification de l'email
if (localStorageContent) {
  email.addEventListener("change", function () {
    validEmail(this);
  });
}

// VALIDATION FIRSTNAME
function validFirstName(inputFirstName) {
  //Creation de la RegExp pour validation FirstName
  let FirstNameRegExp = new RegExp("^[a-z A-ZA-zÀ-ú-']+$", "g");

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
}

// VALIDATION LASTNAME
function validLastName(inputLastName) {
  //Creation de la RegExp pour validation lastName
  let lastNameRegExp = new RegExp("^[a-z A-ZA-zÀ-ú-']+$", "g");

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
}

// VALIDATION ADRESSE
function validAddress(inputAddress) {
  //Creation de la RegExp pour validation address
  let addressRegExp = new RegExp("^[0-9]{1,3} [a-z A-ZA-zÀ-ú-']{3,100}$", "g");

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
}

// VALIDATION VILLE
function validCity(inputCity) {
  //Creation de la RegExp pour validation city
  let cityRegExp = new RegExp(
    "^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$",
    "g"
  );

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
}

// VALIDATION EMAIL
function validEmail(inputEmail) {
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
}
