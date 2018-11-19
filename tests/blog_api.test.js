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

describe('blog API', () => {
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
  })})

afterAll(() => {
  server.close()
})