import Route from '@ioc:Adonis/Core/Route'

export default function sectionsRoutes() {
  Route.group(() => {
    Route.post('/courses/:course/sections', 'SectionsController.create').middleware('auth')
    Route.get('/courses/:course/sections', 'SectionsController.list')
  })
    .where('course', /^[a-zA-Z0-9_-]+$/)
    .namespace('App/Modules/Sections')

  Route.group(() => {
    Route.get('/:id', 'SectionsController.find')
    Route.route('/:id', ['PATCH', 'PUT'], 'SectionsController.update').middleware('auth')
    Route.delete('/:id', 'SectionsController.delete').middleware('auth')
    Route.patch('/:id/order', 'SectionsController.updateOrder').middleware('auth')
  })
    .prefix('sections')
    .where('id', /^[a-zA-Z0-9_-]+$/)
    .namespace('App/Modules/Sections')
}
