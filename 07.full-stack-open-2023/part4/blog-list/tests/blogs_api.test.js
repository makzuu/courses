const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany()

    const blogs = helper.blogs.map(blog => new Blog(blog))
    const promises = blogs.map(blog => blog.save())
    await Promise.all(promises)
})

test('all blogs are returned as json', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.blogs.length)
})

test('the blog unique identifier is named id, not _id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).not.toBeDefined()
})

test('a new blog can be added', async () => {
    const newBlog = helper.blogs[0]

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsInDb = await helper.blogsInDb()

    expect(blogsInDb).toHaveLength(helper.blogs.length + 1)
    delete response.body.id
    expect(response.body).toEqual(newBlog)
})

test('blog\'s likes property defaults to 0', async () => {
    const blogWithoutLikes = helper.blogWithoutLikes

    const response = await api
        .post('/api/blogs')
        .send(blogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
})

test('blog\'s title property is required', async () => {
    const blogWithoutTitle = helper.blogWithoutTitle

    await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400)
})

test('blog\'s url property is required', async () => {
    const blogWithoutUrl = helper.blogWithoutUrl

    await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400)
})

afterAll(async () => {
    await mongoose.connection.close()
})
