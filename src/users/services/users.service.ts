/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccountType, User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { PermissionsService } from './permissions.service';
import { hashPassword } from 'src/common/helpers/hash-password.func';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private rolesService: RolesService,
    private permissionsService: PermissionsService,
  ) {}

  createSimpleUser(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async createUser(userData: Partial<CreateUserDto>) {
    const user = this.repo.create({ ...userData });
    if (userData.role) {
      const [role] = await this.rolesService.findByName(userData.role);
      if (user.roles) {
        user.roles.push(role);
      } else {
        user.roles = [role];
      }
    }
    return this.repo.save(user);
  }

  async assignRole(userId: number, roleName: string) {
    if (!userId) {
      return null;
    }
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    const [role] = await this.rolesService.findByName(roleName);
    if (!role) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ROLE);
    }
    if (user.roles) {
      user.roles.push(role);
    } else {
      user.roles = [role];
    }
    return this.repo.save(user);
  }

  async assignPermission(userId: number, permissionSlug: string) {
    if (!userId) {
      return null;
    }
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    const [permission] = await this.permissionsService.findBySlug(permissionSlug);
    if (!permission) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PERMISSION);
    }
    if (user.permissions) {
      user.permissions.push(permission);
    } else {
      user.permissions = [permission];
    }
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const user = this.repo.findOneBy({ id });
    return user;
  }

  find(email: string) {
    return this.repo.find({ where: { email }, relations: { roles: true, userOwnedApps: true } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    if (attrs.password) {
      const hashedPassword = await hashPassword(attrs.password);
      attrs.password = hashedPassword;
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async upgradeUser(id: number, accountType: AccountType) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_USER);
    }
    user.accountType = accountType;
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }

  async hasPermission(id: number, slugs: string[]) {
    const [userWithPermission] = await this.repo
      .createQueryBuilder('user')
      .where('(user.id = :id) AND (permission.slug IN (:...slugs))', {
        id: id,
        slugs: slugs,
      })
      .leftJoinAndSelect('user.permissions', 'permission')
      .execute();

    return userWithPermission;
  }
}
