import { USER_ROLES, UserRole } from '../models/user.model';

export function roleLabel(role: UserRole | string | null | undefined): string {
  const match = USER_ROLES.find((item) => item.value === role);
  return match?.label ?? String(role ?? '—');
}
