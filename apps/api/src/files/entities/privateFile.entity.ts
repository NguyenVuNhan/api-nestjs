import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../../user/entities/user.entity';

@Entity()
export class PrivateFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public fileName: string;

  @ManyToOne(() => User, (owner: User) => owner.files)
  public owner: User;
}

export default PrivateFile;
