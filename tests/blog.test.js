const listHelper = require('../utils/list_helper')
const testBlogs = require('./test_blogs')

describe('total likes', () => {
  const listWithOneBlog = [testBlogs[1]]

  test('of an empty list equals 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('of a list with only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a list with many blogs is calculated right', () => {
    const result = listHelper.totalLikes(testBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {

  test('is found correctly', () => {
    const result = listHelper.favoriteBlog(testBlogs)
    expect(result.title).toEqual('Canonical string reduction')
    expect(result.author).toEqual('Edsger W. Dijkstra')
    expect(result.likes).toBe(12)
  })

  test('is found correctly from empty list', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
  })
})

describe('author with most blogs', () => {

  test('is found correctly', () => {
    const result = listHelper.mostBlogs(testBlogs)
    expect(result.author).toEqual('Robert C. Martin')
    expect(result.blogs).toBe(3)
  })

  test('is found correctly from empty list', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBe(null)
  })
})

describe('author with most likes', () => {

  test('is found correctly', () => {
    const result = listHelper.mostLikes(testBlogs)
    expect(result.author).toEqual('Edsger W. Dijkstra')
    expect(result.likes).toBe(17)
  })

  test('is found correctly from empty list', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBe(null)
  })
})
