import Bouncer from '@ioc:Adonis/Addons/Bouncer'

import Course from 'App/Models/Course'
import User from 'App/Models/User'

export const { actions } = Bouncer.define('updateUser', (user: User, updateUser: User) => {
  return user.username === updateUser.username
})
  .define('updateCourse', (user: User, updateCourse: Course) => {
    return user.username === updateCourse.ownerId
  })
  .define('deleteCourse', (user: User, updateCourse: Course) => {
    return user.username === updateCourse.ownerId
  })
  .define('buyCourse', (buyerUser: User, course: Course) => {
    return buyerUser.username !== course.ownerId
  })

export const { policies } = Bouncer.registerPolicies({})
