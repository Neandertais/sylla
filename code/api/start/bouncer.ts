import Bouncer from '@ioc:Adonis/Addons/Bouncer'

import Course from 'App/Models/Course'
import Section from 'App/Models/Section'
import User from 'App/Models/User'
import Video from 'App/Models/Video'

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
  .define('createSection', (user: User, course: Course) => {
    return user.username === course.ownerId
  })
  .define('updateSection', (user: User, course: Course) => {
    return user.username === course.ownerId
  })
  .define('deleteSection', (user: User, course: Course) => {
    return user.username === course.ownerId
  })
  .define('createVideo', (user: User, section: Section) => {
    return user.username === section.course.ownerId
  })
  .define('updateVideo', (user: User, video: Video) => {
    return user.username === video.section.course.ownerId
  })
  .define('deleteVideo', (user: User, video: Video) => {
    return user.username === video.section.course.ownerId
  })

export const { policies } = Bouncer.registerPolicies({})
