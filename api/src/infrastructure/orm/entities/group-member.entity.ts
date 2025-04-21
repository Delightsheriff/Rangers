import {
  Table,
  Model,
  Column,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { UserEntity } from './user.entity';
import { GroupEntity } from './group.entity';

@Table({ tableName: 'user_groups', timestamps: false, underscored: true })
export class GroupMemberEntity extends Model {
  @Column({
    type: DataType.UUIDV4,
    autoIncrement: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => GroupEntity)
  @Column({ type: DataType.UUID })
  groupId: string;
}
