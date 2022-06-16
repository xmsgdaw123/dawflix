const fetchAPI = async (path, method, body) => {
  const headers = body ? {
    'Content-Type': 'application/json'
  } : undefined
  const response = await fetch(path, {
    method,
    headers,
    body,
    credentials: 'include'
  })
  const json = await response.json()
  return json
}

const errorNotification = message => {
  Toastify({
    text: message,
    duration: 2000,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'left',
    stopOnFocus: true,
    style: {
      background: '#dd7373',
    }
  }).showToast()
}

document.addEventListener('DOMContentLoaded', () => {
  const authName = document.getElementById('auth-name')
  const authEmail = document.getElementById('auth-email')
  const authPassword = document.getElementById('auth-password')
  const authPasswordRepeated = document.getElementById('auth-password-repeated')
  const loginForm = document.getElementById('login-form')
  const registerForm = document.getElementById('register-form')
  const saveMovie = document.getElementById('save-movie-btn')
  const removeMovie = document.getElementById('remove-movie-btn')
  const saveSerie = document.getElementById('save-serie-btn')
  const removeSerie = document.getElementById('remove-serie-btn')
  const updateProfileForm = document.getElementById('update-profile-form')
  const inputCurrentPassword = document.getElementById('current-password')
  const inputUpdatedPassword = document.getElementById('updated-password')
  const starContainer = document.getElementById('star-container')
  const movieScoreForm = document.getElementById('movie-score-form')
  const movieTextValoration = document.getElementById('movie-text-valoration')
  const serieScoreForm = document.getElementById('serie-score-form')
  const serieTextValoration = document.getElementById('serie-text-valoration')

  loginForm?.addEventListener('submit', async evt => {
    evt.preventDefault()
    const email = authEmail.value
    const password = authPassword.value
    const body = JSON.stringify({ email, password })

    const res = await fetchAPI('/api/auth/login', 'POST', body)
    if (res.status === 'error') return errorNotification(res.message)
    location.href = '/'
  })

  registerForm?.addEventListener('submit', async evt => {
    evt.preventDefault()
    const name = authName.value
    const email = authEmail.value
    const password = authPassword.value
    const repeatedPassword = authPasswordRepeated.value

    if (password !== repeatedPassword) return errorNotification('Las contraseñas no coinciden')

    const body = JSON.stringify({ name, email, password })

    const res = await fetchAPI('/api/auth/register', 'POST', body)
    if (res.status === 'error') return errorNotification(res.message)
    location.href = '/'
  })

  saveMovie?.addEventListener('click', async () => {
    const movieId = window.movie.id
    const res = await fetchAPI(`/movies/${movieId}/save`, 'POST')
    if (res.status === 'error') return errorNotification(res.message)
    location.reload()
  })

  removeMovie?.addEventListener('click', async () => {
    const movieId = window.movie.id
    const res = await fetchAPI(`/movies/${movieId}/remove`, 'POST')
    if (res.status === 'error') return errorNotification(res.message)
    location.reload()
  })

  saveSerie?.addEventListener('click', async () => {
    const serieId = window.serie.id
    const res = await fetchAPI(`/series/${serieId}/save`, 'POST')
    if (res.status === 'error') return errorNotification(res.message)
    location.reload()
  })

  removeSerie?.addEventListener('click', async () => {
    const serieId = window.serie.id
    const res = await fetchAPI(`/series/${serieId}/remove`, 'POST')
    if (res.status === 'error') return errorNotification(res.message)
    location.reload()
  })

  updateProfileForm?.addEventListener('submit', async evt => {
    evt.preventDefault()
    const name = authName.value
    const email = authEmail.value
    const currentPassword = inputCurrentPassword.value
    const updatedPassword = inputUpdatedPassword.value
    
    const body = JSON.stringify({ name, email, currentPassword, updatedPassword })

    const res = await fetchAPI('/api/user/update-profile', 'POST', body)
    if (res.status === 'error') return errorNotification(res.message)
    console.log(res)
    location.reload()
  })

  let stars = null
  starContainer?.addEventListener('click', evt => {
    const value = Number(evt.target.getAttribute('data-value'))
    if (!value) return
    stars = value

    // quitar todas las estrellas
    for (let i = 0; i < starContainer.children.length; i++) {
      starContainer.children.item(i).classList.remove('star-selected')
    }

    // añadir las estrellas seleccionadas
    for (let i = 0; i < stars; i++) {
      starContainer.children.item(i).classList.add('star-selected')
    }
  })

  movieScoreForm?.addEventListener('submit', async evt => {
    evt.preventDefault()
    const text = movieTextValoration.value
    if (!stars) return errorNotification('Debes seleccionar tu valoración en las estrellas')
    if (!text || text.length < 10) return errorNotification('El texto debe tener más de 10 carácteres')
    const body = JSON.stringify({ text, stars })
    const movieId = window.movie.id
    const res = await fetchAPI(`/movies/${movieId}/send-score`, 'POST', body)
    if (res.status === 'error') return errorNotification(res.message)
    location.reload()
  })

  serieScoreForm?.addEventListener('submit', async evt => {
    evt.preventDefault()
    const text = serieTextValoration.value
    if (!stars) return errorNotification('Debes seleccionar tu valoración en las estrellas')
    if (!text || text.length < 10) return errorNotification('El texto debe tener más de 10 carácteres')
    const body = JSON.stringify({ text, stars })
    const serieId = window.serie.id
    const res = await fetchAPI(`/series/${serieId}/send-score`, 'POST', body)
    if (res.status === 'error') return errorNotification(res.message)
    location.reload()
  })
})