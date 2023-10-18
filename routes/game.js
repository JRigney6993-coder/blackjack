const express = require('express');
const router = express.Router();
const deckData = require('../data/deck');
const User = require('../models/user');

let deck = [];
const setupDeck = () => [...deckData];

router.get('/play', (req, res) => {
    res.render('pages/table', {
        user: req.user
    });
});

router.get('/setupDeck', (req, res) => {
    resetDeck(deck);
    res.send({ message: "Deck setup completed", deck: deck });
});

router.get('/deal', (req, res) => {
    const { player, dealer } = deal(deck);
    res.send({ player, dealer });
});

router.post('/hit', (req, res) => {
    if (deck.length === 0) {
        resetDeck(deck);
    }
    const newCard = getRandomCard(deck);
    res.send(newCard);
});

router.post('/determineWinner', async (req, res) => {
    let { playerHand, dealerHand } = req.body;

    // Let the dealer play their turn fully
    dealerHand = dealerPlay(dealerHand, deck);

    const winner = determineWinner(playerHand, dealerHand);

    if (req.isAuthenticated()) {
        const userId = req.user._id;

        if (winner === "Player") {
            await User.findByIdAndUpdate(userId, { $inc: { wins: 1 } });
        } else if (winner === "Dealer") {
            await User.findByIdAndUpdate(userId, { $inc: { losses: 1 } });
        }
    }

    res.send({ winner });
});


router.get('/topPlayers', async (req, res) => {
    try {
        const topPlayers = await User.aggregate([
            {
                $project: {
                    first_name: 1,
                    last_name: 1,
                    difference: { $subtract: ["$wins", "$losses"] }
                }
            },
            {
                $sort: {
                    difference: -1
                }
            },
            {
                $limit: 10
            }
        ]);

        res.send(topPlayers);
    } catch (error) {
        res.status(500).send({ message: "Error fetching top players", error });
    }
});


// Blackjack game functions
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
    if (!Array.isArray(hand)) {
        console.error("hand is not an array:", hand);
        return 0;
    }

    const cardValues = {
        'j': 10,
        'q': 10,
        'k': 10,
        'a': 11
    };

    let total = 0;
    let aces = 0;

    for (let card of hand) {
        if (card.value === 'a') {
            total += cardValues[card.value];
            aces++;
        } else if (["j", "q", "k"].includes(card.value)) {
            total += cardValues[card.value];
        } else {
            total += card.value;
        }
    }

    // If total is over 21 and we have Aces, reduce total by 10 for each Ace
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

function dealerPlay(dealerHand, deck) {
    while (calculateTotal(dealerHand) < 17) {
        dealerHand.push(getRandomCard(deck));
    }
    return dealerHand;
}


function determineWinner(playerHand, dealerHand) {
    const playerTotal = calculateTotal(playerHand);
    const dealerTotal = calculateTotal(dealerHand);
    

    if (playerTotal > 21) return "Dealer"; // Player busts
    if (dealerTotal > 21) return "Player"; // Dealer busts

    // Draw should be the last condition checked
    if (playerTotal === dealerTotal) return "Draw"; 

    return playerTotal > dealerTotal ? "Player" : "Dealer";
}


module.exports = router;
