import seriesRepository from '../repositories/serie.repository.js'

export const getSerieById = async (req, res) => {
  const serieId = Number(req.params.id)
  const savedSeries = await seriesRepository.getSavedSeries(req.session.user.id)
  const serie = await seriesRepository.getSerieById(serieId)
  const scores = await seriesRepository.getScores(serieId)
  const averageScore = await seriesRepository.getAverageScore(serieId)

  res.render('serie.ejs', {
    serie,
    savedSeries,
    scores,
    averageScore
  })
}

export const saveSerieById = async (req, res) => {
  const userId = req.session.user.id
  const serieId = Number(req.params.id)
  const serie = await seriesRepository.getSerieById(serieId)
  if (!serie) {
    return res.status(400).send({
      status: 'error',
      message: 'La serie solicitada no existe'
    })
  }

  const alreadySaved = await seriesRepository.getSavedSerie(userId, serieId)
  if (alreadySaved) {
    return res.status(400).send({
      status: 'error',
      message: 'Ya has guardado esta serie'
    })
  }

  const savedAt = Date.now()
  await seriesRepository.saveSerie(userId, serieId, savedAt)

  res.send({ status: 'success' })
}

export const removeSavedSerieById = async (req, res) => {
  const userId = req.session.user.id
  const serieId = Number(req.params.id)
  const serie = await seriesRepository.getSerieById(serieId)
  if (!serie) {
    return res.status(400).send({
      status: 'error',
      message: 'La serie solicitada no existe'
    })
  }

  await seriesRepository.removeSavedSerie(userId, serieId)

  res.send({ status: 'success' })
}

export const renderSeriesPage = async (req, res) => {
  const series = await seriesRepository.getAllSeries()

  res.render('series.ejs', {
    series
  })
}

export const sendScore = async (req, res) => {
  const userId = req.session.user.id
  const serieId = Number(req.params.id)

  if (!req.body?.stars || !req.body.text) {
    return res.status(400).send({
      status: 'error',
      message: 'Body incorrecto'
    })
  }

  const { stars, text } = req.body
  await seriesRepository.saveScore(stars, text, userId, serieId)

  res.send({ status: 'success' })
}