/**
 * Format bytes as MB or GB
 * @param bytes - The number of bytes to format
 * @returns The formatted bytes as a string
 */
export function formatBytes(bytes: number) {
  const mb = bytes / 1024 / 1024
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`
}
