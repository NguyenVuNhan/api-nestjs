import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from '../../category/entities/category.entity';
import Comment from '../../comment/entities/comment.entity';
import User from '../../user/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Index('post_authorId_index')
  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  public categories: Category[];

  @Column('text', { array: true })
  public paragraphs: string[];

  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  public comments: Comment[];
}

export default Post;
