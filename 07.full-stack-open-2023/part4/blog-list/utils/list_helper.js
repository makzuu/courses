const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((acc, el) => acc + el.likes, 0)

module.exports = { dummy, totalLikes }
