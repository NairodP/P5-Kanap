// récupère le contenu du localstorage
let data = JSON.parse(localStorage.getItem("produit"));


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


// poster la commande du client
const sentPost = async function (data) {
  let response = await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    Headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let responseData = await response.json();
  console.log(responseData);
  console.log(responseData.id); // affiche l'ID client pour la commande
};

targetIdConsumer = document.getElementById('orderId');
console.log(targetIdConsumer);