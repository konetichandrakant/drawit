const express = require('express');
const router = express.Router();

const listOfCreatedGameRooms = {};
const listOfStartedGameRooms = {};

router.post('/new', tokenVerification, (req, res) => {
    const _id = req.id;
    listOfCreatedGameRooms.add(id);
})

router.post('/enter/:id', tokenVerification, (req, res) => {

})

router.post('/exit/:id', tokenVerification, (req, res) => {

})

router.post('/', tokenVerification, (req, res) => {

})

router.post('/', tokenVerification, (req, res) => {

})

router.get('/:id', tokenVerification, (req, res) => {

})

export default router;