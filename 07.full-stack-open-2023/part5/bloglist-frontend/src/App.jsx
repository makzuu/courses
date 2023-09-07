import { useState, useEffect } from 'react'

import Blogs from './components/Blogs'
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Error from './components/Error'

import blogService from './services/blogs'
import loginService from './services/login'

import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const userInfo = window.localStorage.getItem('userInfo')
    if (userInfo) {
      const userObject = JSON.parse(userInfo)
      setUser(userObject)
      blogService.setToken(userObject.token)
    }
  }, [])

  const login = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('userInfo', JSON.stringify(user))
      blogService.setToken(user.token)
    } catch (error) {
      console.error(error.response.data.error)
      setError('wrong username or password')
      setTimeout(() => {
        setError(null)
      }, 5000);
    }
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('userInfo')
    blogService.setToken(null)
  }

  const newBlog = async (e) => {
    e.preventDefault()

    try {
      const newBlog = await blogService.create({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogs([...blogs, newBlog])
      setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000);
    } catch (error) {
      console.error(error.response.data.error)
    }
  }

  if (!user) {
    return (
      <div>
        <h1>log in to application</h1>
        { error && <Error error={error}/> }
        <Login username={username} password={password} 
          handleUsername={(e) => {setUsername(e.target.value)}} 
          handlePassword={(e) => {setPassword(e.target.value)}} 
          login={login} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      { notification && <Notification message={notification}/> }
      {user.name} logged in <button onClick={logout}>log out</button>
      <h2>create new</h2>
      <BlogForm title={title} author={author} url={url}
        changeTitle={(e) => setTitle(e.target.value)}
        changeAuthor={(e) => setAuthor(e.target.value)}
        changeUrl={(e) => setUrl(e.target.value)}
        saveBlog={newBlog}
      />
      <Blogs blogs={blogs}/>
    </div>
  )
}

export default App
