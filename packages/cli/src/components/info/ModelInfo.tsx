import { formatDistanceToNowStrict } from "date-fns"
import { Box, Text } from "ink"

export default function ModelInfo({ model, expiresAt }: { model: string; expiresAt: Date | null }) {
  return (
    <Box marginTop={1} flexDirection="column">
      <Text color="cyan">Highlighted model:</Text>
      <Text bold>{model}</Text>
      <Box gap={1}>
        <ModelInfoContent expiresAt={expiresAt} />
      </Box>
    </Box>
  )
}

function ModelInfoContent({ expiresAt }: { expiresAt: Date | null }) {
  return (
    <Box gap={1}>
      <Text dimColor strikethrough={!expiresAt}>
        Suspending in
      </Text>
      <Text dimColor>{expiresAt ? formatDistanceToNowStrict(expiresAt!) : "(-.-)Zzz"}</Text>
    </Box>
  )
}
