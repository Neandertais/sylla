import Env from "@ioc:Adonis/Core/Env";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  BaseModel,
  HasOne,
  afterCreate,
  beforeCreate,
  beforeSave,
  column,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'

import SocialLinks from 'App/Models/SocialLinks'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public username: string

  @column()
  public name: string

  @column({
    serializeAs: 'avatarUrl',
    serialize: (value) => (value ? `${Env.get('DOMAIN')}/uploads/${value}` : value),
  })
  public avatar: string

  @column()
  public biography: string

  @column({
    serialize: (value) => `${Env.get("DOMAIN")}/uploads/${value}`,
  })
  public avatar: string;

  @column({
    prepare: (value) => JSON.stringify(value),
  })
  public socialLinks: SocialLink[];

  @column()
  public cash: number

  @hasOne(() => SocialLinks, { foreignKey: 'username' })
  public socialLinks: HasOne<typeof SocialLinks>

  @column({ serializeAs: null })
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ serializeAs: null, autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: null, autoCreate: true, autoUpdate: true })
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

  @afterCreate()
  public static async createTableSocialLinks(user: User) {
    await user.related('socialLinks').create({})
  }
}
