const express = require('express')
const path = require('path')
const cors = require('cors');
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const {ACCESS_TOKEN} = process.env;
let Rollbar = require('rollbar');
let rollbar = new Rollbar({
  accessToken: '09d84a3b89844145b55526f8531e7681',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})


app.get('/styles', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public/index.css'));
    } catch (error) {
        console.log('ERROR GETTING CSS', error)
        res.sendStatus(400)
    }
})

app.get('/js', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public/index.js'));
    } catch (error) {
        console.log('ERROR GETTING JS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots', (req, res) => {
    try {
        rollbar.log('See All Bots requested')
        res.status(200).send(bots)
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        rollbar.log('Draw clicked')
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        rollbar.log('Duel initiated')
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
        } else {
            playerRecord.wins++
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
        rollbar.error('Error Getting Player Stats')
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})

app.get('/api/reset', (req, res) => {
        playerRecord.wins = 0;
        playerRecord.losses = 0;
        res.status(200).send(playerRecord);
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})