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
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() { email, name, password, birthAt }: CreateUserDto) {
    return this.userService.create({ name, email, password, birthAt });
  }

  @Get()
  async read() {
    return this.userService.list();
  }

  @Get(':id')
  async readOne(@Param('id', ParseIntPipe) id) {
    return this.userService.show(id);
  }

  @Put(':id')
  async update(
    @Body() data: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updatePut(id, data);
  }

  @Patch(':id')
  async partialPatch(
    @Body() data: UpdatePatchUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updatePatch(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id) {
    return this.userService.remove(id);
  }
}
