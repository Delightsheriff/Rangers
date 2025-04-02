import { DataTypes } from 'sequelize';
import { Column, Model, Table, DataType } from 'sequelize-typescript';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

@Table({ tableName: 'users',
         timestamps: true,
         underscored: true
 })
export class UserEntity extends Model {
  @Column({
    type: DataTypes.NUMBER,
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
    type: DataType.STRING,
    allowNull: true,
    field: 'gender',
  })
  gender: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'dob',
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'image',
  })
  image: string;
}
