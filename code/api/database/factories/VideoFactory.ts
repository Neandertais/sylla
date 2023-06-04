import Video from 'App/Models/Video'
import Factory from '@ioc:Adonis/Lucid/Factory'

import SectionFactory from 'Database/factories/SectionFactory'

export default Factory.define(Video, ({ faker }) => {
  return {
    name: faker.vehicle.vehicle(),
    description: faker.lorem.paragraph(),
    position: Number(faker.random.numeric()),
  }
})
  .relation('section', () => SectionFactory)
  .build()
