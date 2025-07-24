let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const categoriesRevenus = ["salaire", "vente", "cadeau", "autre revenu"];

function getMonnaie() {
  return document.getElementById("monnaie").value;
}

function ajouterTransaction() {
  const description = document.getElementById("description").value;
  const montant = parseFloat(document.getElementById("montant").value);
  const categorie = document.getElementById("categorie").value;
  const date = document.getElementById("dateInput").value;

  if (!description || isNaN(montant) || !categorie || !date) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  const type = categoriesRevenus.includes(categorie.toLowerCase())
    ? "revenu"
    : "depense";

  const transaction = {
    description,
    montant,
    categorie,
    monnaie: getMonnaie(),
    date,
    type
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  afficherTransactions();
  calculerSolde();
  document.getElementById("description").value = "";
  document.getElementById("montant").value = "";
  document.getElementById("categorie").value = "loyer";
  document.getElementById("dateInput").value = "";
}

function afficherTransactions() {
  const liste = document.querySelector("#liste-transactions tbody");
  if (!liste) {
    console.error("Élément #liste-transactions tbody non trouvé !");
    return;
  }

  liste.innerHTML = "";

  transactions.forEach((transaction) => {
    const ligne = document.createElement("tr");

    ligne.innerHTML = `
      <td>${transaction.date}</td>
      <td>${transaction.categorie}</td>
      <td class="${transaction.type}">
        ${transaction.type === "revenu" ? "+" : "-"}${transaction.montant} ${transaction.monnaie}
      </td>
      <td>${transaction.description}</td>
    `;

    liste.appendChild(ligne);
  });
}

function calculerSolde() {
  let soldeFC = 0;
  let soldeUSD = 0;

  transactions.forEach((t) => {
    const effet = t.type === "revenu" ? 1 : -1;
    if (t.monnaie === "FC") {
      soldeFC += effet * t.montant;
    } else {
      soldeUSD += effet * t.montant;
    }
  });

  document.getElementById("soldeFC").textContent = soldeFC.toFixed(2) + " FC";
  document.getElementById("soldeUSD").textContent = soldeUSD.toFixed(2) + " $";
}

document.addEventListener("DOMContentLoaded", () => {
  afficherTransactions();
  calculerSolde();
});