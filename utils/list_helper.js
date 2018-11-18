const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length == 0) {
    return null;
  } else {
    const reducer = (favorite, item) => {
      return favorite.likes < item.likes ? item : favorite
    }

    const favoriteBlog = blogs.reduce(reducer, blogs[0])

    const formattedBlog = {
      title: favoriteBlog.title,
      author: favoriteBlog.author,
      likes: favoriteBlog.likes
    }

    return formattedBlog
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length == 0) {
    return null;
  } else {
    let blogCounts = {}

    blogs.forEach(blog => blogCounts[blog.author] = blogCounts[blog.author] ? blogCounts[blog.author] + 1 : 1)

    let topAuthor = {
      author: "",
      blogs: 0
    }

    for (let author in blogCounts) {
      if (blogCounts[author] >= topAuthor.blogs) {
        topAuthor.author = author
        topAuthor.blogs = blogCounts[author]
      }
    }

    return topAuthor
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}