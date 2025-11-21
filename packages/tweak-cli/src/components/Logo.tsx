import { Box, Text } from "ink"
import BigText from "ink-big-text"
import Gradient from "ink-gradient"

export default function Logo() {
  return (
    <Box flexDirection="column" alignItems="center" borderStyle="round" borderColor="pink" padding={0}>
      {/* @ts-ignore */}
      <BigText text="keLLeMes" font="slick" colors={["red", "cyan"]} spaceless={true} />
      <Gradient name="passion">
        <Text dimColor>LLM Parameter Tweak CLI - v{process.env.npm_package_version ?? "?.?.?"}</Text>
      </Gradient>
    </Box>
  )
}
