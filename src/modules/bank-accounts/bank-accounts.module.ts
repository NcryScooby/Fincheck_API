import { Module } from '@nestjs/common';
import { BankAccountsService } from './services/bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { ValidateBankAccountOwnerService } from './services/validate-bank-account-owner.service';

@Module({
  controllers: [BankAccountsController],
  providers: [BankAccountsService, ValidateBankAccountOwnerService],
  exports: [ValidateBankAccountOwnerService],
})
export class BankAccountsModule {}
