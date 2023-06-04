import Section from 'App/Models/Section'
import Factory from '@ioc:Adonis/Lucid/Factory'

import CourseFactory from 'Database/factories/CourseFactory'
import VideoFactory from './VideoFactory'

export default Factory.define(Section, ({ faker }) => {
  return {
    name: faker.name.jobTitle(),
    position: Number(faker.random.numeric()),
  }
})
  .relation('videos', () => VideoFactory)
  .relation('course', () => CourseFactory)
  .build()
