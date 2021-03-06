import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import PrivateFile from '../../files/entities/privateFile.entity';
import PublicFile from '../../files/entities/publicFile.entity';
import Post from '../../post/entities/post.entity';
import Address from './address.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(() => PublicFile, { eager: true, nullable: true })
  @JoinColumn()
  public avatar?: PublicFile;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address?: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts?: Post[];

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  public files: PrivateFile[];

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;
}

export default User;
