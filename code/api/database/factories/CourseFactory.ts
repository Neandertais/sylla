import Course from 'App/Models/Course'
import Factory from '@ioc:Adonis/Lucid/Factory'

import UserFactory from 'Database/factories/UserFactory'

export default Factory.define(Course, ({ faker }) => {
  return {
    name: faker.animal.dog(),
    description: faker.lorem.sentence(),
    price: Number(faker.random.numeric()),
    banner: faker.random.word(),
  }
})
  .relation('owner', () => UserFactory)
  .build()
