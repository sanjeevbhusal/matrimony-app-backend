import { Test } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';

it('can create a instance of authentication service', async () => {
  // This creates a module with the AuthenticationService as a provider.

  const prismaService = {};
  const passwordService = {};
  const jwtService = {};
  const mailService = {};

  const module = await Test.createTestingModule({
    providers: [AuthenticationService],
  }).compile();

  const service = module.get(AuthenticationService);

  expect(service).toBeDefined();
});
