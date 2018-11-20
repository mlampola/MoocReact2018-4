const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const testBlogs = require('./test_blogs')

beforeAll(async () => {
  await Blog.remove({})

  const blogs = testBlogs.map(blog => new Blog(blog))
  const promises = blogs.map(blog => blog.save())
  await Promise.all(promises)
})

describe('blog API - GET', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are 6 blogs', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(6)
  })

  test('the first note is about React patterns', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body[0].title).toEqual('React patterns')
  })
})

describe('blog API - POST', () => {

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'How to post blogs',
      author: "Markus Lampola",
      url: "http://google.com/",
      likes: 0
    }

    const intialBlogs = await api
      .get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body.length).toBe(intialBlogs.body.length + 1)
    expect(titles).toContain(newBlog.title)
  })

  test('blog without title is not added ', async () => {
    const newBlog = {
      author: "Markus Lampola",
      url: "http://google.com/",
      likes: 0
    }

    const intialBlogs = await api
      .get('/api/blogs')

      await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(intialBlogs.body.length)
  })

  test('blog without author is not added ', async () => {
    const newBlog = {
      title: 'How to post blogs',
      url: "http://google.com/",
      likes: 0
    }

    const intialBlogs = await api
      .get('/api/blogs')

      await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(intialBlogs.body.length)
  })

  test('blog without url is not added ', async () => {
    const newBlog = {
      title: 'How to post blogs',
      author: "Markus Lampola",
       likes: 0
    }

    const intialBlogs = await api
      .get('/api/blogs')

      await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(intialBlogs.body.length)
  })
})

describe('posting a blog without likes', () => {
  test('the blog can be added and likes is initialized', async () => {
    const newBlog = {
      title: 'How to post blogs, part 2',
      author: "Markus Lampola",
      url: "http://google.com/",
    }

    const intialBlogs = await api
      .get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body.length).toBe(intialBlogs.body.length + 1)
    expect(titles).toContain(newBlog.title)
    expect(response.body.find(b => b.title === newBlog.title).likes).toBe(0)
  })
})

afterAll(() => {
  server.close()
})