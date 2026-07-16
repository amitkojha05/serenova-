export function isAdminEmail(email?: string | null) {
  if (!email) return false

  const rawList = process.env.ADMIN_EMAILS ?? ''
  const allowlist = rawList
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)

  return allowlist.includes(email.toLowerCase())
}
