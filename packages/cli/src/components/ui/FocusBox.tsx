import { Box, type BoxProps, Text } from "ink"

export default function FocusBox({
  isFocused,
  title,
  borderStyle = "round",
  children,
  ...props
}: {
  isFocused: boolean
  title: string
  children: React.ReactNode
} & BoxProps) {
  return (
    <Box flexDirection="column">
      <Box>
        <Box width={2} borderBottom={false} borderStyle={borderStyle} borderRight={false} borderDimColor={!isFocused} />
        <Text dimColor={!isFocused}>{title}</Text>
        <Box
          flexGrow={1}
          minWidth={1}
          borderBottom={false}
          borderStyle={borderStyle}
          borderLeft={false}
          borderDimColor={!isFocused}
        />
      </Box>
      <Box
        borderStyle={borderStyle}
        borderTop={false}
        flexDirection="column"
        borderDimColor={!isFocused}
        flexGrow={1}
        {...props}
      >
        {children}
      </Box>
    </Box>
  )
}
