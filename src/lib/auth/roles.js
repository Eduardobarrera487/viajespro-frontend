import "server-only";

const ADMIN_ROLE_NAMES = new Set([
  "admin",
  "administrador",
  "administrator",
]);

export function normalizeRoleName(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function hasAdminRole(usuario) {
  if (!usuario) return false;

  const roleName = normalizeRoleName(usuario.Rol ?? usuario.rol ?? usuario.role ?? usuario.Role);

  if (ADMIN_ROLE_NAMES.has(roleName)) {
    return true;
  }

  const rolId = Number(usuario.RolId ?? usuario.rolId ?? usuario.roleId);

  return Number.isFinite(rolId) && rolId === 1;
}
