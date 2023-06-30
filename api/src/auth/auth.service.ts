import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne(username);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return null;
      }
      const { password: pw, ...result } = user;
      return result as User;
    }

    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async signup(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user) throw new HttpException('Username taken', HttpStatus.BAD_REQUEST);

    const hash = await bcrypt.hash(password, saltOrRounds);
    const newUser = await this.usersService.create(username, hash);
    return { id: newUser.id };
  }
}
