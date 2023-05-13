import { DateTime } from 'luxon'
import SocialLinks from 'App/Models/SocialLinks'
import { BaseModel, HasOne, beforeCreate, beforeSave, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public username: string

  @column()
  public name: string

  @column()
  public avatar: string

  @column()
  public biography: string

  @column()
  public profession: string

  @column()
  public cash: number

  @hasOne(() => SocialLinks, { foreignKey: 'username' })
  public socialLinks: HasOne<typeof SocialLinks>

  @column({ serializeAs: null })
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static async assignInitialValues(user: User) {
    user.cash = 50
  }
}
