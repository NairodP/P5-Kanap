//...............CONFIRMATION PAGE.....................

// ..........RECUP ID DANS L'URL................
let idCommande = window.location.search.slice(4);

targetIdConsumer = document.getElementById("orderId");
console.log(targetIdConsumer);

targetIdConsumer.textContent = idCommande;
//.............................................

// ..........SUPPRIMER LE PANIER................
document.addEventListener("DOMContentLoaded", () => {
  localStorage.clear();
  console.log("LocalStrorage vidé !");
});
