import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Address from 'src/user/entities/address.entity';
import User from '../user/entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Address]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
