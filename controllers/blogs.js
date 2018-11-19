const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  let blog = new Blog(request.body)

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

const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter