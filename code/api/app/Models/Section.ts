import { BaseModel, BelongsTo, beforeCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'

import Course from 'App/Models/Course'

export default class Section extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public position: number

  @column({ serializeAs: null })
  public courseId: string

  @belongsTo(() => Course, { serializeAs: null })
  public course: BelongsTo<typeof Course>

  @beforeCreate()
  public static async generateId(section: Section) {
    section.id = nanoid()
  }
}
