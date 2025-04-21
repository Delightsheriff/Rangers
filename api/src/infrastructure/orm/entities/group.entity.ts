import {
  Table,
  Model,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserEntity } from './user.entity';
import { GroupMemberEntity } from './group-member.entity';

@Table({ tableName: 'groups', timestamps: true, underscored: true })
export class GroupEntity extends Model {
  @Column({
    type: DataType.UUIDV4,
    autoIncrement: true,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @BelongsToMany(() => UserEntity, () => GroupMemberEntity)
  members: UserEntity[];
}
