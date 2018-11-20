const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, blogsInDb } = require('./test_helper')

beforeAll(async () => {
  await Blog.remove({})

  const blogs = initialBlogs.map(blog => new Blog(blog))
  await Promise.all(blogs.map(blog => blog.save()))
})

describe('blog API - GET', () => {
  test('all blogs are returned as json', async () => {
    const blogsInDatabase = await blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const titles = response.body.map(blog => blog.title)
    blogsInDatabase.forEach(blog => expect(titles).toContain(blog.title))
  })
})

describe('blog API - POST', () => {

  test('a valid blog can be added ', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      title: 'How to post blogs',
      author: "Markus Lampola",
      url: "http://google.com/",
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

    const titles = blogsAfterOperation.map(r => r.title)
    expect(titles).toContain(newBlog.title)
  })

  test('blog without title is not added ', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      author: "Markus Lampola",
      url: "http://google.com/",
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
  })

  test('blog without author is not added ', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      title: 'How to post blogs',
      url: "http://google.com/",
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
  })

  test('blog without url is not added ', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      title: 'How to post blogs',
      author: "Markus Lampola",
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
  })
})

describe('posting a blog without likes', () => {
  test('the blog can be added and likes is initialized', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      title: 'How to post blogs, part 2',
      author: "Markus Lampola",
      url: "http://google.com/",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOperation = await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

    const titles = blogsAfterOperation.map(blog => blog.title)
    expect(titles).toContain(newBlog.title)

    expect(blogsAfterOperation.find(b => b.title === newBlog.title).likes).toBe(0)
  })
})

afterAll(() => {
  server.close()
})