import {
  BaseModel,
  BelongsTo,
  HasMany,
  beforeCreate,
  belongsTo,
  column,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'

import Course from 'App/Models/Course'
import Video from 'App/Models/Video'

export default class Section extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public position: number

  @column({ serializeAs: null })
  public courseId: string

  @belongsTo(() => Course, { serializeAs: null })
  public course: BelongsTo<typeof Course>

  @hasMany(() => Video)
  public videos: HasMany<typeof Video>

  @beforeCreate()
  public static async randomID(section: Section) {
    section.id = nanoid()
  }
}
