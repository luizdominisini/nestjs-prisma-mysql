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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptores/log.interceptor';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  async create(
    @Body() { email, name, password, birthAt, role }: CreateUserDto,
  ) {
    return this.userService.create({ name, email, password, birthAt, role });
  }

  @Roles(Role.Admin)
  @Get()
  async read() {
    return this.userService.list();
  }

  @Roles(Role.Admin)
  @Get(':id')
  async readOne(@ParamId() id: number) {
    console.log({ id });
    return this.userService.show(id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(
    @Body() data: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updatePut(id, data);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async partialPatch(
    @Body() data: UpdatePatchUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updatePatch(id, data);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id) {
    return this.userService.remove(id);
  }
}
