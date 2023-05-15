import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CourseStudent extends BaseModel {
  @column({ isPrimary: true })
  public userId: string

  @column({ isPrimary: true })
  public courseId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
