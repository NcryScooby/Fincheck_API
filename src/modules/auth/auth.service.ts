import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/signin';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signin(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.usersRepository.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordIsValid = await compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user.id);

    return { token };
  }

  async signup(signUpDto: SignUpDto) {
    const { name, email, password } = signUpDto;

    const emailAlreadyExists = await this.usersRepository.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (emailAlreadyExists) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      data: {
        name,
        email,
        password: hashedPassword,
        categories: {
          createMany: {
            data: [
              // Income
              { name: 'Salário', icon: 'salary', type: 'INCOME' },
              { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
              { name: 'Outro', icon: 'other', type: 'INCOME' },
              // Expense
              { name: 'Casa', icon: 'home', type: 'EXPENSE' },
              { name: 'Alimentação', icon: 'food', type: 'EXPENSE' },
              { name: 'Educação', icon: 'education', type: 'EXPENSE' },
              { name: 'Lazer', icon: 'fun', type: 'EXPENSE' },
              { name: 'Mercado', icon: 'grocery', type: 'EXPENSE' },
              { name: 'Roupas', icon: 'clothes', type: 'EXPENSE' },
              { name: 'Transporte', icon: 'transport', type: 'EXPENSE' },
              { name: 'Viagem', icon: 'travel', type: 'EXPENSE' },
              { name: 'Outro', icon: 'other', type: 'EXPENSE' },
            ],
          },
        },
      },
    });

    const token = await this.generateToken(user.id);

    return { token };
  }

  private async generateToken(userId: string) {
    return this.jwtService.sign({ sub: userId });
  }
}
