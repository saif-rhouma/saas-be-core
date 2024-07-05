/* eslint-disable prettier/prettier */
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from '../../auth/entities/token.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

export enum AccountType {
  Free = 'Free',
  Basic = 'Basic',
  Standard = 'Standard',
  Premium = 'Premium',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Column('text', { default: AccountType.Free })
  accountType: AccountType;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column('simple-json', {
    nullable: true,
  })
  applicationThemeSetting: {
    appearance: { darkMode: boolean; contrast: boolean; compact: boolean; rightToLeft: boolean };
    navBar: { layout: string; color: string };
    presetsColor: string;
  };

  @Column('simple-json', {
    nullable: true,
  })
  address: {
    country: string;
    state: string;
    city: string;
    zipCode: string;
    street: string;
  };

  // @Column('simple-json')
  // applicationFinanceSetting: { currencySymbol: string; taxPercentage: number };

  // @Column('simple-json')
  // applicationSetting: { printerPOS: PrintPOSType };

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Permission, (permission) => permission.users)
  permissions: Permission[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  tokens: RefreshToken[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }
}

// enum NavLayoutType {
//   Default = 'Default',
//   TopBar = 'TopBar',
//   Small = 'Small',
// }

// enum NavColor {
//   Integrate = 'Integrate',
//   Apparent = 'Apparent',
// }

// enum PresetsColor {
//   Preset01,
//   Preset02,
//   Preset03,
//   Preset04,
//   Preset05,
//   Preset06,
// }

// enum PrintPOSType {
//   A4 = 'A4',
//   Thermal = 'Thermal',
// }
