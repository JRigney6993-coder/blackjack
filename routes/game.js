const express = require('express');
const router = express.Router();
const deckData = require('../data/deck');
const User = require('../models/user');

let deck = [];
const setupDeck = () => [...deckData];

// 

router.get('/setupDeck', (req, res) => {
    resetDeck(deck);
    res.send({ message: "Deck setup completed", deck: deck });
});

router.get('/deal', (req, res) => {
    const { player, dealer } = deal(deck);
    res.send({ player, dealer });
});

router.post('/hit', (req, res) => {
    const { hand } = req.body;
    try {
        hit(hand, deck);
    } catch {
        resetDeck(deck);
        hit(hand, deck);
    }
    res.send(hand);
});

router.post('/determineWinner', async (req, res) => {
    const { playerHand, dealerHand } = req.body;
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
    const cardValues = {
        'j': 10,
        'q': 10,
        'k': 10,
    };

    let total = 0;
    let aces = 0;

    for (let card of hand) {
        if (Array.isArray(card.value)) {
            total += 11;
            aces++;
        } else {
            total += cardValues[card.value] || card.value;
        }
    }

    while (total > 21 && aces--) {
        total -= 10;
    }

    return total;
}

function determineWinner(playerHand, dealerHand) {
    const playerTotal = calculateTotal(playerHand);
    const dealerTotal = calculateTotal(dealerHand);

    if (playerTotal > 21 || (dealerTotal <= 21 && dealerTotal >= playerTotal)) {
        return "Dealer";
    }

    if (dealerTotal > 21 || playerTotal > dealerTotal) {
        return "Player";
    }

    return "Draw";
}

module.exports = router;
