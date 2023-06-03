import Section from 'App/Models/Section'
import Factory from '@ioc:Adonis/Lucid/Factory'

import CourseFactory from 'Database/factories/CourseFactory'

export default Factory.define(Section, ({ faker }) => {
  return {
    name: faker.name.jobTitle(),
    position: Number(faker.random.numeric()),
  }
})
  .relation('course', () => CourseFactory)
  .build()
