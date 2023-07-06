import { BankAccountsRepository } from '../../../shared/database/repositories/bank-accounts.repositories';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ValidateBankAccountOwnerService {
  constructor(
    private readonly bankAccountsRepository: BankAccountsRepository,
  ) {}

  async validate(userId: string, bankAccountId: string) {
    const isOwner = await this.bankAccountsRepository.findFirst({
      where: { userId, id: bankAccountId },
    });

    if (!isOwner) {
      throw new NotFoundException('Bank account not found');
    }
  }
}
