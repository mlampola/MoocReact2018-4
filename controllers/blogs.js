const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
  let blog = new Blog(request.body)

  try {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.BLOG_SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (blog.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }

    if (blog.author === undefined) {
      return response.status(400).json({ error: 'author missing' })
    }

    if (blog.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }

    if (blog.likes === undefined) {
      blog.likes = 0;
    }

    const user = await User.findById(decodedToken.id)

    blog.user = user._id
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(Blog.format(savedBlog))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Blog: something went wrong...' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndRemove(id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const blog = request.body

  try {
    const savedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.json(Blog.format(savedBlog))
  } catch (error) {
    console.log(error)
    response.status(400).end()
  }
})

module.exports = blogsRouter