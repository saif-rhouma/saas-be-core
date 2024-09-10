import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { Inject } from '@nestjs/common';
import { OrdersService } from 'src/orders/services/orders.service';

@EventSubscriber()
export class PaymentSubscriber implements EntitySubscriberInterface<Payment> {
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private ordersService: OrdersService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Payment;
  }

  /**
   * Called after entity update.
   */
  async afterUpdate(event: UpdateEvent<any>) {
    await this.ordersService.updateAmount(event.entity.order);
  }
}
