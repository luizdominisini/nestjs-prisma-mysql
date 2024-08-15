import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({ name, email, password, birthAt, role }: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      throw new ForbiddenException('Email ja existe');
    }

    const hashPass = await hash(password, 8);

    return this.prisma.user.create({
      data: { name, email, password: hashPass, birthAt, role },
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number) {
    await this.exists(id);
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updatePut(
    id: number,
    { name, email, password, birthAt, role }: CreateUserDto,
  ) {
    await this.prisma.user.findUnique({ where: { id } });
    const hashPass = await hash(password, 8);
    return this.prisma.user.update({
      data: {
        name,
        email,
        password: hashPass,
        birthAt: birthAt ? new Date(birthAt) : null,
        role,
      },
      where: { id },
    });
  }

  async updatePatch(
    id: number,
    { name, email, password, birthAt, role }: CreateUserDto,
  ) {
    await this.exists(id);
    const data: any = {};
    if (birthAt) {
      data.birthAt = new Date(birthAt);
    }

    if (name) {
      data.name = name;
    }

    if (email) {
      data.email = email;
    }

    if (password) {
      password = await hash(password, 8);
    }

    if (role) {
      data.role = role;
    }
    return this.prisma.user.update({
      data: {
        name,
        email,
        password,
        birthAt,
      },
      where: { id },
    });
  }

  async remove(id: number) {
    if (!(await this.show(id))) {
      throw new NotFoundException({ message: 'user do not exists' });
    }

    return this.prisma.user.delete({ where: { id } });
  }

  async exists(id: number) {
    const exist = await this.prisma.user.count({ where: { id } });
    if (!exist) {
      throw new NotFoundException(`usuário com id: ${id} não existe`);
    }
  }
}
