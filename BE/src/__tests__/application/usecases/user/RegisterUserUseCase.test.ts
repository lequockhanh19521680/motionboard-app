import { RegisterUserUseCase } from '@application/usecases/user/RegisterUserUseCase';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User';

// Mock implementation of UserRepository
class MockUserRepository implements IUserRepository {
  private users: User[] = [];
  private nextId = 1;

  async findAll(): Promise<User[]> {
    return this.users.filter(u => !u.isDeleted);
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id && !u.isDeleted) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find(u => u.username === username && !u.isDeleted) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email && !u.isDeleted) || null;
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<User | null> {
    return this.users.find(u => 
      (u.username === username || u.email === email) && !u.isDeleted
    ) || null;
  }

  async isEmailUnique(email: string, excludeUserId?: number): Promise<boolean> {
    return !this.users.some(u => 
      u.email === email && u.id !== excludeUserId && !u.isDeleted
    );
  }

  async isUsernameUnique(username: string, excludeUserId?: number): Promise<boolean> {
    return !this.users.some(u => 
      u.username === username && u.id !== excludeUserId && !u.isDeleted
    );
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const user = new User(
      this.nextId++,
      userData.username,
      userData.email,
      userData.fullName,
      userData.password,
      userData.image,
      userData.phone,
      userData.isDeleted,
      userData.createdAt
    );
    this.users.push(user);
    return user;
  }

  async update(id: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const userIndex = this.users.findIndex(u => u.id === id && !u.isDeleted);
    if (userIndex === -1) return null;

    const user = this.users[userIndex];
    const updatedUser = new User(
      user.id,
      updates.username ?? user.username,
      updates.email ?? user.email,
      updates.fullName ?? user.fullName,
      updates.password ?? user.password,
      updates.image ?? user.image,
      updates.phone ?? user.phone,
      updates.isDeleted ?? user.isDeleted,
      user.createdAt
    );

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async delete(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;

    this.users[userIndex] = new User(
      this.users[userIndex].id,
      this.users[userIndex].username,
      this.users[userIndex].email,
      this.users[userIndex].fullName,
      this.users[userIndex].password,
      this.users[userIndex].image,
      this.users[userIndex].phone,
      true,
      this.users[userIndex].createdAt
    );
    return true;
  }
}

describe('RegisterUserUseCase', () => {
  let userRepository: MockUserRepository;
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    registerUserUseCase = new RegisterUserUseCase(userRepository);
    
    // Mock JWT_SECRET for testing
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('should successfully register a new user', async () => {
    const registerRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User'
    };

    const result = await registerUserUseCase.execute(registerRequest);

    expect(result.user.username).toBe('testuser');
    expect(result.user.email).toBe('test@example.com');
    expect(result.user.fullName).toBe('Test User');
    expect(result.user.id).toBe(1);
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('string');
    
    // Verify password is not included in response
    expect(result.user).not.toHaveProperty('password');
  });

  it('should throw error when user already exists', async () => {
    // First registration
    await registerUserUseCase.execute({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User'
    });

    // Second registration with same username
    await expect(registerUserUseCase.execute({
      username: 'testuser',
      email: 'different@example.com',
      password: 'password123',
      fullName: 'Another User'
    })).rejects.toThrow('Username or email already exists');

    // Second registration with same email
    await expect(registerUserUseCase.execute({
      username: 'differentuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Another User'
    })).rejects.toThrow('Username or email already exists');
  });

  it('should hash the password before storing', async () => {
    const registerRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'plainpassword',
      fullName: 'Test User'
    };

    await registerUserUseCase.execute(registerRequest);
    
    // Check that password is hashed in repository
    const storedUser = await userRepository.findByUsername('testuser');
    expect(storedUser?.password).not.toBe('plainpassword');
    expect(storedUser?.password).toMatch(/^\$2[aby]?\$/); // bcrypt hash pattern
  });

  it('should throw error when JWT_SECRET is not set', async () => {
    delete process.env.JWT_SECRET;

    const registerRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User'
    };

    await expect(registerUserUseCase.execute(registerRequest))
      .rejects.toThrow('JWT_SECRET environment variable is not set');
  });
});