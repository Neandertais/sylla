import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SocialLinks extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public username: number

  @column()
  public website: string

  @column()
  public youtube: string

  @column()
  public instagram: string

  @column()
  public twitter: string

  @column()
  public facebook: string

  @column()
  public linkedin: string

  @column()
  public tiktok: string
}
