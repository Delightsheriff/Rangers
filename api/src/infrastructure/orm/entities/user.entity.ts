import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { BelongsToMany } from 'sequelize-typescript';
import { GroupEntity } from './group.entity';
import { GroupMemberEntity } from './group-member.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class UserEntity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'last_name',
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'middle_name',
  })
  middleName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
    field: 'user_name',
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'email',
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
    field: 'phone',
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    field: 'password',
  })
  password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
    allowNull: true,
    field: 'gender',
  })
  gender: Gender;

  @BelongsToMany(() => GroupEntity, () => GroupMemberEntity)
  groups: GroupEntity[];
}
