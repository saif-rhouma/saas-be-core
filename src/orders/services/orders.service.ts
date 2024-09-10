/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Order, OrderStatus } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
import { ProductService } from 'src/products/services/products.service';
import { ApplicationsService } from 'src/applications/services/applications.service';
import { CustomersService } from 'src/customers/services/customers.service';
import { MSG_EXCEPTION } from 'src/common/constants/messages';
import { ProductOrderService } from './product-order.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    private usersService: UsersService,
    private customersService: CustomersService,
    private applicationsService: ApplicationsService,
    private productOrderService: ProductOrderService,
    private productsService: ProductService,
  ) {}

  async createOrder(orderData: CreateOrderDto, userId: number, applicationId: number) {
    if (!userId || !applicationId) {
      return null;
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException(MSG_EXCEPTION.NOT_FOUND_USER);
    }

    const customer = await this.customersService.findOne(orderData.customer);
    if (!customer) {
      throw new UnauthorizedException(MSG_EXCEPTION.NOT_FOUND_CUSTOMER);
    }

    const application = await this.applicationsService.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_APPLICATION);
    }

    const productsIds = orderData.products.map((product) => product.id);

    const products = await this.productsService.findByIds(applicationId, productsIds);
    if (!products) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_PRODUCT);
    }
    let totalAmount = 0;

    products.forEach((prod) => {
      const prd = orderData.products.find((prd) => prd.id === prod.id);
      if (prd) {
        totalAmount += prod.price * prd.quantity;
      }
    });

    const order = new Order();

    order.orderDate = orderData.orderDate;
    order.application = application;
    order.createdBy = user;
    order.customer = customer;
    order.totalOrderAmount = totalAmount;

    const preOrder = this.repo.create({ ...order });
    const resOrder = await this.repo.save(preOrder);

    await this.productOrderService.assignProductToOrder(preOrder, orderData.products, products);

    return resOrder;
  }

  findAllByApplication(appId: number) {
    if (!appId) {
      return null;
    }
    const orders = this.repo.find({
      where: { application: { id: appId } },
      relations: ['productToOrder', 'productToOrder.product', 'customer'],
    });
    if (!orders) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return orders;
  }

  async findOneByApplication(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    const order = await this.repo.findOne({
      where: { id, application: { id: appId } },
      relations: ['productToOrder', 'productToOrder.product', 'customer', 'payments'],
    });
    if (!order) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return order;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    const order = this.repo.findOneBy({ id });
    return order;
  }

  async update(id: number, appId: number, attrs: Partial<UpdateOrderDto>) {
    const order = await this.findOneByApplication(id, appId);
    Object.assign(order, attrs);
    return this.repo.save(order);
  }

  async remove(id: number, appId: number) {
    if (!id || !appId) {
      return null;
    }
    await this.productOrderService.remove(id);
    const order = await this.findOneByApplication(id, appId);
    if (!order) {
      throw new NotFoundException(MSG_EXCEPTION.NOT_FOUND_ORDER);
    }
    return this.repo.remove(order);
  }

  async addAmount(order: Order, amount: number) {
    order.orderPaymentAmount += amount;
    await this.repo.save(order);
  }
  async subAmount(order: Order, amount: number) {
    order.orderPaymentAmount -= amount;
    await this.repo.save(order);
  }

  async updateAmount(order: Order) {
    const [{ total }] = await this.repo.manager.query(
      `SELECT SUM(p.amount) as total
      FROM "order" o LEFT JOIN payment p 
      ON p.orderId = o.id
      WHERE o.id = ${order.id};`,
    );

    if (total) {
      order.orderPaymentAmount = total;
      await this.repo.save(order);
    }
  }

  async analytics(appId: number) {
    if (!appId) {
      return null;
    }
    const analytics = await this.repo.manager.query(
      `select SUM(CASE WHEN status = '${OrderStatus.Ready}' THEN 1 ELSE 0 END) As Ready,
      SUM(CASE WHEN status = '${OrderStatus.Delivered}' THEN 1 ELSE 0 END) AS Delivered,
      SUM(CASE WHEN status = '${OrderStatus.InProcess}' THEN 1 ELSE 0 END) AS InProcess from 'order'
      where applicationId = ${appId};`,
    );
    const inProcessLastSixMonth = await this.repo.manager.query(
      `SELECT  COUNT(id) AS ClaimsPerMonth,
        (strftime('%m', orderDate)) AS inMonth,
        (strftime('%Y', orderDate)) AS inYear  FROM 'order'
        WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.InProcess}' and applicationId = ${appId}
        GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
        ORDER BY inYear, inMonth`,
    );
    const deliveredLastSixMonth = await this.repo.manager.query(
      `SELECT  COUNT(id) AS ClaimsPerMonth,
        (strftime('%m', orderDate)) AS inMonth,
        (strftime('%Y', orderDate)) AS inYear  FROM 'order'
        WHERE orderDate >= DATE('now', '-7 months') and status = '${OrderStatus.Delivered}' and applicationId = ${appId}
        GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
        ORDER BY inYear, inMonth`,
    );
    const lastSixMonth = await this.repo.manager.query(
      `SELECT  COUNT(id) AS ClaimsPerMonth,
        (strftime('%m', orderDate)) AS inMonth,
        (strftime('%Y', orderDate)) AS inYear  FROM 'order'
        WHERE orderDate >= DATE('now', '-7 months') and applicationId = ${appId}
        GROUP BY strftime('%Y', orderDate), strftime('%m', orderDate)
        ORDER BY inYear, inMonth`,
    );
    return { analytics: analytics[0], lastSixMonth, deliveredLastSixMonth, inProcessLastSixMonth };
  }
}
