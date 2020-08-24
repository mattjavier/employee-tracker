const router = require('express').Router()

router.use('/api', require('./employeeRoutes.js'))

module.exports = router