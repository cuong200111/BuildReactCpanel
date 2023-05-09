const express = require('express');
const router = express.Router()

router.get('/logout', (req, res) => {
    res.cookie('online', 0, { httpOnly: true })

    res.redirect('/')
})
module.exports = router