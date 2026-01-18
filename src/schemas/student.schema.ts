import {email, z} from "zod";

export const updateUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    fullName: z.string().min(6, "Full name must be at least 6 characters long"),
    phoneNumber: z.string().min(9, "Phone number must be at least 9 characters long"),
    address: z.string().min(3, "Address must be at least 3 characters long"),
    
})