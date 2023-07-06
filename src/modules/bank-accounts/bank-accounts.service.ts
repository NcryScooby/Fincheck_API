import { BankAccountsRepository } from './../../shared/database/repositories/bank-accounts.repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAccountsRepository: BankAccountsRepository,
  ) {}

  create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { name, initialBalance, type, color } = createBankAccountDto;

    return this.bankAccountsRepository.create({
      data: {
        userId,
        name,
        initialBalance,
        type,
        color,
      },
    });
  }

  findAllById(userId: string) {
    return this.bankAccountsRepository.findMany({
      where: {
        userId,
      },
    });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const isOwner = await this.bankAccountsRepository.findFirst({
      where: { userId, id: bankAccountId },
    });

    if (!isOwner) {
      throw new NotFoundException('Bank account not found');
    }

    const { name, initialBalance, type, color } = updateBankAccountDto;

    return this.bankAccountsRepository.update({
      where: {
        id: bankAccountId,
      },
      data: {
        name,
        initialBalance,
        type,
        color,
      },
    });
  }

  async remove(userId: string, bankAccountId: string) {
    const isOwner = await this.bankAccountsRepository.findFirst({
      where: { userId, id: bankAccountId },
    });

    if (!isOwner) {
      throw new NotFoundException('Bank account not found');
    }

    await this.bankAccountsRepository.delete({
      where: {
        id: bankAccountId,
      },
    });

    return null;
  }
}
