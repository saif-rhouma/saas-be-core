/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from './products/products.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Permission } from './users/entities/permission.entity';
import { Role } from './users/entities/role.entity';
import { RefreshToken } from './auth/entities/token.entity';
import { Product } from './products/entities/product.entity';

import { ApplicationsModule } from './applications/applications.module';
import { Application } from './applications/entities/application.entity';
import { PlansModule } from './plans/plans.module';
import { Plan } from './plans/entities/plan.entity';
import { CustomersModule } from './customers/customers.module';
import { Customer } from './customers/entities/customer.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { ProductToOrder } from './orders/entities/product_order.entity';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { TicketsModule } from './tickets/tickets.module';
import { Ticket } from './tickets/entities/ticket.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('ACCESS_TOKEN_SECRET'),
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [
            User,
            RefreshToken,
            Permission,
            Role,
            Product,
            Application,
            Plan,
            Customer,
            Order,
            ProductToOrder,
            Payment,
            Ticket,
          ],
        };
      },
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    ApplicationsModule,
    PlansModule,
    CustomersModule,
    OrdersModule,
    PaymentsModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
