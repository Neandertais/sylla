import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CourseRating extends BaseModel {
  @column({ isPrimary: true })
  public userId: string

  @column({ isPrimary: true })
  public courseId: string

  @column()
  public rate: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
