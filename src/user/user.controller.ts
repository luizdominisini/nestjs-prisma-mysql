import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';

@Controller('users')
export class UserController {
  @Post()
  async create(@Body() { email, name, password }: CreateUserDto) {
    return { email, name, password };
  }

  @Get()
  async read() {
    return { users: [] };
  }

  @Get(':id')
  async readOne(@Param('id', ParseIntPipe) id) {
    return { user: [], id };
  }

  @Put(':id')
  async update(
    @Body() { email, name, password }: UpdateUserDto,
    @Param('id', ParseIntPipe) id,
  ) {
    return {
      method: 'PUT',
      email,
      name,
      password,
      id,
    };
  }

  @Patch(':id')
  async partialPatch(
    @Body() { name, email, password }: UpdatePatchUserDto,
    @Param('id', ParseIntPipe) id,
  ) {
    return {
      method: 'patch',
      name,
      email,
      password,
      id,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id) {
    return {
      id,
    };
  }
}
