const User = require('../../../lib/yellow_enterprise_business_rules/entities/User');
const UserRepository = require('../../../lib/red_application_business_rules/repositories/UserRepository');
const mockUserRepository = new UserRepository();
const GetUser = require('../../../lib/red_application_business_rules/use_cases/GetUser');

test('should resolve with the corresponding persisted user entity', async () => {
  // given
  const correspondingUser = new User(123, 'John', 'Doe', 'john.doe@email.com', 'P@s$W0rD');
  mockUserRepository.get = jest.fn((userId) => correspondingUser);

  // when
  const user = await GetUser(123, { userRepository: mockUserRepository });

  // then
  expect(mockUserRepository.get).toHaveBeenCalledWith(123);
  expect(user).toEqual(correspondingUser);
});
