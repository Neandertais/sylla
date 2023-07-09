import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  beforeCreate,
  belongsTo,
  column,
  computed,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import { nanoid } from 'nanoid'

import User from 'App/Models/User'
import Section from 'App/Models/Section'
import CourseRating from './CourseRating'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public price: number

  @column({
    prepare: (value) => value.toString(),
    consume: (value) => (value ? value.split(',') : value),
  })
  public keywords: string[]

  @column({
    serializeAs: 'willLearn',
    prepare: (value) => JSON.stringify(value),
    consume: (value) => JSON.parse(value),
  })
  public willLearn: string[]

  @column({
    serializeAs: 'bannerUrl',
    serialize: (value) => (value ? `${Env.get('DOMAIN')}/uploads/${value}` : value),
  })
  public banner: string

  @column({ serializeAs: null })
  public ownerId: string

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
    localKey: 'username',
  })
  public owner: BelongsTo<typeof User>

  @hasMany(() => Section, { foreignKey: 'courseId' })
  public sections: HasMany<typeof Section>

  @column.dateTime({ serializeAs: null, autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: null, autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async randomID(course: Course) {
    course.id = nanoid()
  }
}
