import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name contains invalid characters"),

  email: z
    .string()
    .email("Invalid email address")
    .max(120, "Email too long")
    .toLowerCase(),

  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(120, "Subject too long"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message too long"),

  projectType: z
    .enum(["Web App", "Mobile App", "UI/UX Design", "API/Backend", "Data Analytics", "Other", ""])
    .optional(),

  priority: z
    .enum(["Low", "Medium", "High", "Urgent", ""])
    .optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
