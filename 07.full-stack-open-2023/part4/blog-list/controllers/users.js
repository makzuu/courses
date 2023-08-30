const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body

    if (password === undefined) {
        return next({
            name: "ValidationError",
            message: "User validation failed: password: Path `password` is required."
        })
    }

    if (password.length < 3) {
        return next({
            name: "ValidationError",
            message: `User validation failed: password: Path \`password\` (\`${password}\`) is shorter than the minimum allowed length (3).`
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({ username, name, passwordHash })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find()

    response.json(users)
})

module.exports = usersRouter
