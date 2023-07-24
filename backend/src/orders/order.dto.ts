import { OrderType } from '@prisma/client';

export class initTransactionDto {
  asset_id: string;
  wallet_id: string;
  shares: number;
  price: number;
  type: OrderType;
}
