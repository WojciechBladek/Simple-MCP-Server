import { ApiEndpoint } from "@utils/api.util.js";
import type { User, UserSummary, UsersResponse } from "@model/user.model.js";

let usersCache: User[] | null = null;

export async function fetchUsers(): Promise<User[]> {
  if (usersCache) {
    return usersCache;
  }

  const response = await fetch(ApiEndpoint.Users);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch users: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as UsersResponse;
  usersCache = data.users;

  return data.users;
}

export function formatUserName(
  user: Pick<User, "firstName" | "lastName">,
): string {
  return `${user.firstName} ${user.lastName}`;
}

export function findUserByName(
  users: User[],
  userName: string,
): User | undefined {
  const normalizedUserName = userName.trim().toLowerCase();

  return users.find((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

    return fullName.includes(normalizedUserName);
  });
}

export function toUserSummary(user: User): UserSummary {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    company: {
      name: user.company.name,
      department: user.company.department,
      title: user.company.title,
    },
  };
}

export function formatUserSummary(summary: UserSummary): string {
  return `${summary.firstName} ${summary.lastName} | ${summary.email} | ${summary.role} | ${summary.company.title} at ${summary.company.name}`;
}
