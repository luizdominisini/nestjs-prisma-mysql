import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import { compare, hash } from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly JwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
  ) {}

  async createToken(user: User) {
    return {
      accessToken: this.JwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7d',
          subject: String(user.id),
          issuer: 'login',
          audience: 'users',
        },
      ),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkToken(token: string) {
    try {
      const dados = this.JwtService.verify(token, {
        audience: 'users',
        issuer: 'login',
      });
      return dados;
    } catch (err) {
      throw new BadRequestException('Token invalido: ' + err.message);
    }
  }

  isValidToken(token: string) {
    try {
      const valid = this.checkToken(token);
      if (valid) return true;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Login inválido');
    }
    const checkPass = await compare(password, user.password);

    if (!checkPass) {
      throw new UnauthorizedException('Senha invalida');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email inválido');
    }

    const token = this.JwtService.sign(
      { id: user.id },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: 'users',
      },
    );

    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: 'ti@gmail.com',
      template: 'forget',
      context: {
        name: user.name,
        token: token,
      },
    });

    return true;
  }

  async reset(password: string, token: string) {
    try {
      await this.JwtService.verify(token, {
        audience: 'users',
        issuer: 'forget',
      });

      const { id } = this.JwtService.decode(token);

      password = await hash(password, 10);

      const user = await this.prisma.user.update({
        where: { id },
        data: {
          password,
        },
      });

      return this.createToken(user);
    } catch (err) {
      throw new BadRequestException('Token invalido: ' + err.message);
    }
  }

  async register(data: AuthRegisterDto) {
    const user = await this.userService.create(data);

    return this.createToken(user);
  }
}
