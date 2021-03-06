import authRoute from './auth.route.js'
import moviesRoute from './movies.route.js'
import seriesRoute from './series.route.js'
import userRoute from './user.route.js'

export default {
  auth: authRoute,
  movies: moviesRoute,
  user: userRoute,
  series: seriesRoute
}