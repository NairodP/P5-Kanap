//............Product Page..............;

(async function () {
  const kanapId = getKanapId();
  console.log(kanapId);

  const article = await getArticle(kanapId);
  console.log(article);

  displayKanap(article);
})();

const img = document.querySelector(".item__img");

function getKanapId() {
  return new URL(location.href).searchParams.get("id");
}

function getArticle(kanapId) {
  return fetch(`http://localhost:3000/api/products/${kanapId}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (articles) {
      return articles;
    })
    .catch(function (error) {
      alert(error);
    });
}

function displayKanap(article) {
  document.querySelector("title").textContent = article.name;

  img.innerHTML = `<img src="${article.imageUrl}" alt="${article.altTxt}"></img>`;

  document.getElementById("title").textContent = article.name;

  document.getElementById("price").textContent = article.price;

  document.querySelector(".item__content__description__title").textContent =
    article.description;

  let colorProduct = document.getElementById("colors");
  console.log(colorProduct);
  console.log(article.colors);

  article.colors.forEach((colorKanap) => {
    console.log(document.createElement("option"));
    let baliseOption = document.createElement("option");
    
    baliseOption.innerHTML = `${colorKanap}`;
    baliseOption.value = `${colorKanap}`;

    colorProduct.appendChild(baliseOption);
  });
}
