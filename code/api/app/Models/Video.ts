import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, beforeCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Env from '@ioc:Adonis/Core/Env'
import { nanoid } from 'nanoid'

import Section from 'App/Models/Section'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public position: number

  @column({
    serializeAs: 'thumbnailUrl',
    serialize: (value) => (value ? `${Env.get('DOMAIN')}/uploads/${value}` : value),
  })
  public thumbnail: string

  @column()
  public duration: number

  @column({
    prepare: (value) => value.toString(),
    consume: (value) => (value ? value.split(',') : value),
  })
  public qualities: string[]

  @column()
  public status: 'processing' | 'sexualContent' | 'published' | 'error'

  @column()
  public processingProgress: number

  @column({ serializeAs: null })
  public sectionId: string

  @belongsTo(() => Section, { serializeAs: null })
  public section: BelongsTo<typeof Section>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @beforeCreate()
  public static async randomID(video: Video) {
    video.id = nanoid()
  }
}
