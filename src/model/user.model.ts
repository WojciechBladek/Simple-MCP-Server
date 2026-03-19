import z from "zod";

export const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const addressSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  stateCode: z.string(),
  postalCode: z.string(),
  coordinates: coordinatesSchema,
  country: z.string(),
});

export const hairSchema = z.object({
  color: z.string(),
  type: z.string(),
});

export const bankSchema = z.object({
  cardExpire: z.string(),
  cardNumber: z.string(),
  cardType: z.string(),
  currency: z.string(),
  iban: z.string(),
});

export const companySchema = z.object({
  department: z.string(),
  name: z.string(),
  title: z.string(),
  address: addressSchema,
});

export const cryptoSchema = z.object({
  coin: z.string(),
  wallet: z.string(),
  network: z.string(),
});

export const userRoleSchema = z.enum(["admin", "moderator", "user"]);

export const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  maidenName: z.string(),
  age: z.number(),
  gender: z.string(),
  email: z.string(),
  phone: z.string(),
  username: z.string(),
  password: z.string(),
  birthDate: z.string(),
  image: z.string(),
  bloodGroup: z.string(),
  height: z.number(),
  weight: z.number(),
  eyeColor: z.string(),
  hair: hairSchema,
  ip: z.string(),
  address: addressSchema,
  macAddress: z.string(),
  university: z.string(),
  bank: bankSchema,
  company: companySchema,
  ein: z.string(),
  ssn: z.string(),
  userAgent: z.string(),
  crypto: cryptoSchema,
  role: userRoleSchema,
});

export const usersListSchema = z.object({
  users: z.array(userSchema),
});

export const userSummarySchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  role: userRoleSchema,
  company: z.object({
    name: z.string(),
    department: z.string(),
    title: z.string(),
  }),
});

export const usersSummaryListSchema = z.object({
  users: z.array(userSummarySchema),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Hair = z.infer<typeof hairSchema>;
export type Bank = z.infer<typeof bankSchema>;
export type Company = z.infer<typeof companySchema>;
export type Crypto = z.infer<typeof cryptoSchema>;
export type User = z.infer<typeof userSchema> & Record<string, unknown>;
export type UserSummary = z.infer<typeof userSummarySchema>;
export type UsersResponse = z.infer<typeof usersListSchema>;
