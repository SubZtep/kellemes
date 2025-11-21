import { Box, Text } from "ink"
import BigText from "ink-big-text"
import Gradient from "ink-gradient"

export default function Logo() {
  const bigColor = "rainbow"
  const smallColor = "cristal"

  return (
    <Box flexDirection="column" alignItems="center">
      <Box>
        <Box>
          <Gradient name={smallColor}>
            {/* @ts-ignore */}
            <BigText text="ke" font="tiny" spaceless={true} />
          </Gradient>
        </Box>
        <Box>
          <Gradient name={bigColor}>
            {/* @ts-ignore */}
            <BigText text="LL" font="tiny" spaceless={true} />
          </Gradient>
        </Box>
        <Box>
          <Gradient name={smallColor}>
            {/* @ts-ignore */}
            <BigText text="e" font="tiny" spaceless={true} dimColor />
          </Gradient>
        </Box>
        <Box>
          <Gradient name={bigColor}>
            {/* @ts-ignore */}
            <BigText text="M" font="tiny" spaceless={true} />
          </Gradient>
        </Box>
        <Box>
          <Gradient name={smallColor}>
            {/* @ts-ignore */}
            <BigText text="es" font="tiny" spaceless={true} dimColor />
          </Gradient>
        </Box>
      </Box>
      <Gradient name="fruit">
        <Text dimColor>LLM Tweaker CLI - v{process.env.npm_package_version ?? "?.?.?"}</Text>
      </Gradient>
    </Box>
  )
}
