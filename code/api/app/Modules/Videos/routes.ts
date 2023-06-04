import Route from '@ioc:Adonis/Core/Route'

export default function videosRoutes() {
  Route.group(() => {
    Route.post('/sections/:section/videos', 'VideosController.create').middleware('auth')
    Route.get('/sections/:section/videos', 'VideosController.list')
  })
    .where('section', /^[a-zA-Z0-9_-]+$/)
    .namespace('App/Modules/Videos')

  Route.group(() => {
    Route.get('/:id', 'VideosController.find')
    Route.route('/:id', ['PATCH', 'PUT'], 'VideosController.update').middleware('auth')
    Route.delete('/:id', 'VideosController.delete').middleware('auth')
    Route.patch('/:id/order', 'VideosController.updateOrder').middleware('auth')
  })
    .prefix('videos')
    .where('id', /^[a-zA-Z0-9_-]+$/)
    .namespace('App/Modules/Videos')
}
