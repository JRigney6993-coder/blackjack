document.addEventListener("DOMContentLoaded", function () {
  // DOM elements for the dealer and player card containers
  const dealerContainer = document.querySelector(".dealerContainer");
  const playerContainer = document.querySelector(".playerContainer");

  // Function to create an HTML element for a card
  function createCardElement(card) {
    const cardElement = document.createElement("img");
    cardElement.src = card.image;
    cardElement.alt = `${card.value} of ${card.suit}`;
    return cardElement;
  }

  // Function to update the dealer's cards
  function updateDealerCards(dealerHand) {
    dealerContainer.innerHTML = "";
    dealerHand.forEach((card) => {
      const cardElement = createCardElement(card);
      dealerContainer.appendChild(cardElement);
    });
  }

  // Function to update the player's cards
  function updatePlayerCards(playerHand) {
    playerContainer.innerHTML = "";
    playerHand.forEach((card) => {
      const cardElement = createCardElement(card);
      playerContainer.appendChild(cardElement);
    });
  }

  // Add event listeners to the HIT and STAND buttons
  document.querySelector(".hit").addEventListener("click", function () {
    // Call the /hit endpoint in your game.js to get the updated player hand
    fetch("/hit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hand: playerHand }), // Send the player's current hand
    })
      .then((response) => response.json())
      .then((data) => {
        playerHand = data; // Update the player's hand
        updatePlayerCards(playerHand);
      });
  });

  document.querySelector(".stand").addEventListener("click", function () {
    // Implement your logic for standing in the game here
  });

  // Initialize the player's and dealer's hands with the initial deal
  // Call the /deal endpoint in your game.js to get the initial hands
  fetch("/deal")
    .then((response) => response.json())
    .then((data) => {
      const { player, dealer } = data;
      playerHand = player;
      dealerHand = dealer;
      updatePlayerCards(playerHand);
      updateDealerCards(dealerHand);
    });
});
