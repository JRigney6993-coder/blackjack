let deck = [];
const setupDeck = () => [
    ...require('../data/deck')
];

resetDeck(deck);

function resetDeck(deck) {
    const newDeck = setupDeck();
    deck.length = 0;
    deck.push(...newDeck);
}

function getRandomCard(deck) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck.splice(randomIndex, 1)[0];
}

function deal(deck) {
    return {
        player: [getRandomCard(deck), getRandomCard(deck)],
        dealer: [getRandomCard(deck), getRandomCard(deck)]
    };
}

function hit(hand, deck) {
    hand.push(getRandomCard(deck));
    return hand;
}

function calculateTotal(hand) {
    const cardValues = {
        'j': 10,
        'q': 10,
        'k': 10,
    };

    let total = 0;
    let aces = 0;

    for (let card of hand) 
    {
        // Check if the card value is an array, which shows it's an Ace
        if (Array.isArray(card.value)) 
        {
            // Assuming the ace's value is 11 for now
            total += 11;
            aces++;
        } else {
            // Add card's value or face card's defined value
            total += cardValues[card.value] || card.value;
        }
    }

    // If the player has an ace and goes over 21 it will be seen as 1 instead of 11
    while (total > 21 && aces-- && hand === player) 
    {
        total -= 10;
    }

    return total;
}

function determineWinner(playerHand, dealerHand, secret) {
    const playerTotal = calculateTotal(playerHand);
    const dealerTotal = calculateTotal(dealerHand);

    // Check if the player has busted or if the dealer's total is less than or equal to 21 and greater than or equal to the player's total
    if (playerTotal > 21 || (dealerTotal <= 21 && dealerTotal >= playerTotal))
    {
        // (I'll add loss here for the mongo database using the secret)
        return "Dealer"
    };
    // Check if the dealer has busted or if the player's total is greater than the dealer's total
    if (dealerTotal > 21 || playerTotal > dealerTotal) 
    {
        // (I'll add win here for the mongo database using the secret)
        return "Player"
    };
    return "Draw";
}


// Game test / examples of calling functions
const { player, dealer } = deal(deck);
console.log("Player's Hand:", player);
console.log("Dealer's Hand:", dealer);
hit(player, deck);
console.log("Player's Hand after hit:", player);
console.log("Winner:", determineWinner(player, dealer));
