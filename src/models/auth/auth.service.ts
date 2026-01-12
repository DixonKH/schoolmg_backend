import { PrismaClient, User } from "../../generated/prisma";
import { LoginDTO, RegisterDTO } from "../../types/auth.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async register(data: RegisterDTO): Promise<User> {
    const { username, email, password, role } = data;

    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });
    console.log("User created: ",user);
    return user;
  }

  async login(data: LoginDTO): Promise<{ user: User; token: string }> {
    const { username, password } = data;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return { user, token };
  }

  async getStudents() {
    
  }
}
