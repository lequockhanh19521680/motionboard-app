export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly password: string,
    public readonly image?: string,
    public readonly phone?: string,
    public readonly isDeleted: boolean = false,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(
    username: string,
    email: string,
    fullName: string,
    password: string,
    image?: string,
    phone?: string
  ): Omit<User, 'id'> {
    return new User(
      0, // ID will be set by repository
      username,
      email,
      fullName,
      password,
      image,
      phone,
      false,
      new Date()
    );
  }

  updateProfile(updates: {
    username?: string;
    email?: string;
    fullName?: string;
    image?: string;
    phone?: string;
  }): User {
    return new User(
      this.id,
      updates.username ?? this.username,
      updates.email ?? this.email,
      updates.fullName ?? this.fullName,
      this.password,
      updates.image ?? this.image,
      updates.phone ?? this.phone,
      this.isDeleted,
      this.createdAt
    );
  }

  toSafeUser(): {
    id: number;
    username: string;
    email: string;
    fullName: string;
    image?: string;
    phone?: string;
    isDeleted: boolean;
    createdAt: Date;
  } {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      image: this.image,
      phone: this.phone,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt
    };
  }
}