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

  saveMovie?.addEventListener('click', () => {
    const movieId = window.movie.id
    const res = await fetchAPI(`/movies/${movieId}/save`, 'POST', body)
    if (res.status === 'error') return errorNotification(res.message)
    location.reload()
  })
})