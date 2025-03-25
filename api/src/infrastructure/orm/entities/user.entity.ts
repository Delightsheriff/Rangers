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
    type: DataTypes.UUIDV4,
    primaryKey: true,
    autoIncrement: true,
  })
  id: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
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
    field: 'user_name',
  })
  username: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'email',
  })
  email: string;

  @Column({
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
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
    field: 'dob',
  })
  dateOfBirth: Date;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    field: 'image',
  })
  image: string;
}
