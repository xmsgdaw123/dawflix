import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { renderFile } from 'ejs'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import routes from './routes/index.js'
import authorizedMiddleware from './middlewares/authorized.js'
import { getFeaturedMovies } from './repositories/movie.repository.js'
import { getFeaturedSeries } from './repositories/serie.repository.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_SECRET]
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use((req, res, next) => {
  res.locals.user = req.session?.user || null
  next()
})

app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'html')
app.engine('html', renderFile)

app.get('/', authorizedMiddleware, async (req, res) => {
  const featuredMovies = await getFeaturedMovies()
  const featuredSeries = await getFeaturedSeries()
  res.render('home.ejs', {
    featuredMovies,
    featuredSeries
  })
})

app.get('/login', (req, res) => res.render('login.ejs'))
app.get('/register', (req, res) => res.render('register.ejs'))

app.use('/movies', routes.movies)
app.use('/api/auth', routes.auth)

const port = process.env.SERVER_PORT
app.listen(port)
console.log(`Servidor iniciado en el puerto ${port}`)