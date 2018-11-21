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
    response.json(savedBlog)
  } catch (error) {
    console.log(error)
    response.status(400).end()
  }
})

module.exports = blogsRouter