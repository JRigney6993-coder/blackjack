const express = require('express');
const router = express.Router();

// Load deck and user model
const deck = require('../data/deck.js');
let workingDeck = [...deck];
const User = require('../models/user');

// Simple in-memory storage of dealer and player hands
let dealerCards = [];
let playerCards = [];

router.get('/play', (req, res) => {
    res.render('pages/table', {
        user: req.user
    });
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


router.get('/start', (req, res) => {
    dealerCards = [];
    playerCards = [];
    
    dealerCards.push(drawCard(deck), drawCard(deck));
    playerCards.push(drawCard(deck), drawCard(deck));
    
    res.json({
        dealerCards: dealerCards,
        playerCards: playerCards
    });
});

router.get('/hit', async (req, res) => {
    if (playerCards.length < 5) {
        playerCards.push(drawCard(deck));
    }

    if (calculatePoints(playerCards) > 21) {
        await updatePlayerRecord(req.user._id, 'loss');
        return res.json({
            playerCards: playerCards,
            message: 'Player busts! Dealer wins!'
        });
    } else if (playerCards.length === 5) {
        return res.json({
            playerCards: playerCards,
            message: 'Player automatically wins with 5 cards!'
        });
    }

    return res.json({ playerCards: playerCards });

});

router.get('/stand', async (req, res) => {
    while (calculatePoints(dealerCards) <= 16) {
        dealerCards.push(drawCard(deck));
    }

    const playerPoints = calculatePoints(playerCards);
    const dealerPoints = calculatePoints(dealerCards);
    let result = 'draw';
    let message = "It's a draw!";

    if (playerPoints > 21 || (dealerPoints <= 21 && dealerPoints > playerPoints)) {
        result = 'dealer';
        message = 'Dealer wins!';
        await updatePlayerRecord(req.user._id, 'loss');
    } else if (dealerPoints > 21 || playerPoints > dealerPoints) {
        result = 'player';
        message = 'Player wins!';
        await updatePlayerRecord(req.user._id, 'win');
    }

    res.json({
        dealerCards: dealerCards,
        result: result,
        message: message
    });
});

router.get('/newGame', (req, res) => {
    const gameData = newGame();
    res.json(gameData);
});

// Game logic stuff yay!

function drawCard() {
    if (workingDeck.length === 0) {
        workingDeck = [...deck];
    }
    return workingDeck.splice(Math.floor(Math.random() * workingDeck.length), 1)[0];
}


function calculatePoints(cards) {
    let total = 0;
    let aces = 0; 

    for (const card of cards) {
        if (Array.isArray(card.value)) {  
            total += 11;
            aces++;
        } else if (typeof card.value === 'string') {  
            total += 10;
        } else {
            total += card.value; 
        }
    }

    // Convert aces from 11 to 1 if total is over 21
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

async function updatePlayerRecord(userId, outcome) {
    try {
        if (outcome === 'win') {
            await User.findByIdAndUpdate(userId, { $inc: { wins: 1 } });
        } else if (outcome === 'loss') {
            await User.findByIdAndUpdate(userId, { $inc: { losses: 1 } });
        }
    } catch (error) {
        console.error("Error updating player record:", error);
    }
}


function newGame() {
    dealerCards = [];
    playerCards = [];
    
    dealerCards.push(drawCard(deck), drawCard(deck));
    playerCards.push(drawCard(deck), drawCard(deck));
    
    return {
        dealerCards: [{
            ...dealerCards[0],
            hidden: true
        }, dealerCards[1]],
        playerCards: playerCards
    };
}


module.exports = router;
