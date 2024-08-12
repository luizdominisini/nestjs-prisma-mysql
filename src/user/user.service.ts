import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({ name, email, password }: CreateUserDto) {
    return this.prisma.user.create({
      data: { name, email, password },
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async show(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updatePut(
    id: number,
    { name, email, password, birthAt }: CreateUserDto,
  ) {
    await this.prisma.user.findUnique({ where: { id } });
    return this.prisma.user.update({
      data: {
        name,
        email,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
      },
      where: { id },
    });
  }

  async updatePatch(
    id: number,
    { name, email, password, birthAt }: CreateUserDto,
  ) {
    const data: any = {};
    if (birthAt) {
      data.birthAt = new Date(birthAt);
    }

    if (name) {
      data.name = new Date(name);
    }

    if (email) {
      data.email = new Date(email);
    }

    if (password) {
      data.password = new Date(password);
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
}
