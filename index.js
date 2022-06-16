import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { renderFile } from 'ejs'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import routes from './routes/index.js'
import authorizedMiddleware from './middlewares/authorized.js'
import adminMiddleware from './middlewares/admin.js'
import moviesRepository from './repositories/movie.repository.js'
import seriesRepository from './repositories/serie.repository.js'

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
  const featuredMovies = await moviesRepository.getFeaturedMovies()
  const featuredSeries = await seriesRepository.getFeaturedSeries()
  const actionMovies = await moviesRepository.getActionMovies()
  const comedySeries = await seriesRepository.getComedySeries()
  res.render('home.ejs', {
    featuredMovies,
    featuredSeries,
    actionMovies,
    comedySeries
  })
})

app.get('/saved', authorizedMiddleware, async (req, res) => {
  const savedMovies = await moviesRepository.getSavedMoviesDetailed(req.session.user.id)
  const savedSeries = await seriesRepository.getSavedSeriesDetailed(req.session.user.id)
  res.render('saved-list.ejs', {
    savedMovies,
    savedSeries,
  })
})

app.get('/admin', adminMiddleware, async (req, res) => {
  const movies = await moviesRepository.getAllMovies()
  const series = await seriesRepository.getAllSeries()

  res.render('admin.ejs', {
    movies,
    series,
  })
})

app.get('/login', (req, res) => res.render('login.ejs'))
app.get('/register', (req, res) => res.render('register.ejs'))
app.get('/profile', (req, res) => res.render('profile.ejs'))

app.use('/movies', routes.movies)
app.use('/series', routes.series)
app.use('/api/auth', routes.auth)
app.use('/api/user', routes.user)

const port = process.env.SERVER_PORT
app.listen(port)
console.log(`Servidor iniciado en el puerto ${port}`)