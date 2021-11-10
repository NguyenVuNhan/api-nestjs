import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PublicFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public fileName: string;
}

export default PublicFile;
