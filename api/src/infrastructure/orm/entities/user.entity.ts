import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

@Table({ tableName: 'users' })
export class UserEntity extends Model {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    field: 'first_name',
  })
  firstName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    field: 'last_name',
  })
  lastName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    field: 'middle_name',
  })
  middleName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    field: 'email',
  })
  email: string;

  @Column({
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    field: 'phone',
  })
  phone: string;

  @Column({
    type: DataTypes.STRING,
    field: 'password',
  })
  password: string;

  @Column({
    type: DataTypes.ENUM(...Object.values(Gender)),
    allowNull: true,
    field: 'gender',
  })
  gender: string;

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
    field: 'dateOfBirth',
  })
  dateOfBirth: Date;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    field: 'profile_picture',
  })
  image: string;
}