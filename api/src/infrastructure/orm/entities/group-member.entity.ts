import { Table, Model, Column, ForeignKey, DataType } from 'sequelize-typescript';
import { UserEntity } from './user.entity';
import { GroupEntity } from './group.entity';

@Table({ tableName: 'user_groups', timestamps: false, underscored: true })
export class GroupMemberEntity extends Model {
  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => GroupEntity)
  @Column({ type: DataType.INTEGER })
  groupId: number;
}
