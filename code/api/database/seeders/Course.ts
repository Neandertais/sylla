import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CourseFactory from 'Database/factories/CourseFactory'

export default class extends BaseSeeder {
  public async run() {
    await CourseFactory.with('owner')
      .with('sections', 3, (section) => section.with('videos', 5))
      .createMany(2)
  }
}
