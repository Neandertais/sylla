import Route from '@ioc:Adonis/Core/Route'

export default function coursesRoutes() {
  Route.group(() => {
    Route.get('', 'CoursesController.list')
    Route.post('', 'CoursesController.create').middleware('auth')
    Route.get('/search', 'CoursesController.search')
    Route.get('/:id', 'CoursesController.find')
    Route.route('/:id', ['PATCH', 'PUT'], 'CoursesController.update').middleware('auth')
    Route.delete('/:id', 'CoursesController.delete').middleware('auth')
    Route.post('/:id/buy', 'CoursesController.buy').middleware('auth')
  })
    .prefix('courses')
    .where('id', /^[a-zA-Z0-9_-]+$/)
    .namespace('App/Modules/Courses')
}
