import { User } from '@domain/entities/User';

describe('User Domain Entity', () => {
  describe('User.create', () => {
    it('should create a new user with correct properties', () => {
      const userData = User.create(
        'testuser',
        'test@example.com',
        'Test User',
        'hashedpassword'
      );

      expect(userData.username).toBe('testuser');
      expect(userData.email).toBe('test@example.com');
      expect(userData.fullName).toBe('Test User');
      expect(userData.password).toBe('hashedpassword');
      expect(userData.isDeleted).toBe(false);
      expect(userData.createdAt).toBeInstanceOf(Date);
    });

    it('should create user with optional fields', () => {
      const userData = User.create(
        'testuser',
        'test@example.com',
        'Test User',
        'hashedpassword',
        'profile.jpg',
        '1234567890'
      );

      expect(userData.image).toBe('profile.jpg');
      expect(userData.phone).toBe('1234567890');
    });
  });

  describe('User.updateProfile', () => {
    it('should update user profile correctly', () => {
      const user = new User(
        1,
        'olduser',
        'old@example.com',
        'Old User',
        'password',
        undefined,
        undefined,
        false,
        new Date()
      );

      const updatedUser = user.updateProfile({
        username: 'newuser',
        email: 'new@example.com',
        fullName: 'New User',
        image: 'new.jpg'
      });

      expect(updatedUser.username).toBe('newuser');
      expect(updatedUser.email).toBe('new@example.com');
      expect(updatedUser.fullName).toBe('New User');
      expect(updatedUser.image).toBe('new.jpg');
      expect(updatedUser.password).toBe('password'); // Should remain unchanged
      expect(updatedUser.id).toBe(1); // Should remain unchanged
    });

    it('should only update provided fields', () => {
      const user = new User(
        1,
        'olduser',
        'old@example.com',
        'Old User',
        'password',
        'old.jpg',
        '123',
        false,
        new Date()
      );

      const updatedUser = user.updateProfile({
        username: 'newuser'
      });

      expect(updatedUser.username).toBe('newuser');
      expect(updatedUser.email).toBe('old@example.com'); // Should remain unchanged
      expect(updatedUser.fullName).toBe('Old User'); // Should remain unchanged
      expect(updatedUser.image).toBe('old.jpg'); // Should remain unchanged
      expect(updatedUser.phone).toBe('123'); // Should remain unchanged
    });
  });

  describe('User.toSafeUser', () => {
    it('should return user data without password', () => {
      const user = new User(
        1,
        'testuser',
        'test@example.com',
        'Test User',
        'secretpassword',
        'profile.jpg',
        '1234567890',
        false,
        new Date()
      );

      const safeUser = user.toSafeUser();

      expect(safeUser).toHaveProperty('id', 1);
      expect(safeUser).toHaveProperty('username', 'testuser');
      expect(safeUser).toHaveProperty('email', 'test@example.com');
      expect(safeUser).toHaveProperty('fullName', 'Test User');
      expect(safeUser).toHaveProperty('image', 'profile.jpg');
      expect(safeUser).toHaveProperty('phone', '1234567890');
      expect(safeUser).toHaveProperty('isDeleted', false);
      expect(safeUser).toHaveProperty('createdAt');
      expect(safeUser).not.toHaveProperty('password');
    });
  });
});