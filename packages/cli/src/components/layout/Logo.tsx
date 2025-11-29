import { Box, Text } from "ink"
import Gradient from "ink-gradient"
import { type ReactNode, useEffect, useState } from "react"

const GlitchBox = ({ children }: { children: (glitched: boolean) => ReactNode }) => {
  const [glitched, setGlitched] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setGlitched(Math.random() > 0.8)
    }, 100)
    const timer2 = setTimeout(() => {
      clearInterval(timer)
    }, 3000)
    return () => {
      clearInterval(timer)
      clearTimeout(timer2)
      setGlitched(false)
    }
  }, [])

  return <>{children(glitched)}</>
}

export default function Logo() {
  const bigColor = "rainbow"
  const smallColor = "cristal"
  const smallerColor = "blue"

  return (
    <Box flexDirection="column" alignItems="center">
      <Box>
        <Box>
          <GlitchBox>
            {glitched =>
              glitched ? (
                <Text color={smallerColor}>
                  {/* @ts-ignore */}
                  <Text text="ke" spaceless={true} bold />
                </Text>
              ) : (
                <Gradient name={smallColor}>
                  {/* @ts-ignore */}
                  <Text text="ke" spaceless={true} bold />
                </Gradient>
              )
            }
          </GlitchBox>
        </Box>
        <Box>
          <Gradient name={bigColor}>
            {/* @ts-ignore */}
            <Text text="LL" spaceless={true} bold />
          </Gradient>
        </Box>
        <Box>
          <GlitchBox>
            {glitched =>
              glitched ? (
                <Text color="black">
                  {/* @ts-ignore */}
                  <Text text="e" spaceless={true} dimColor bold />
                </Text>
              ) : (
                <Gradient name={smallColor}>
                  {/* @ts-ignore */}
                  <Text text="e" spaceless={true} dimColor bold />
                </Gradient>
              )
            }
          </GlitchBox>
        </Box>
        <Box>
          <Gradient name={bigColor}>
            {/* @ts-ignore */}
            <Text text="M" spaceless={true} bold />
          </Gradient>
        </Box>
        <Box>
          <GlitchBox>
            {glitched =>
              glitched ? (
                <Text color="black">
                  {/* @ts-ignore */}
                  <Text text="es" spaceless={true} dimColor bold />
                </Text>
              ) : (
                <Gradient name={smallColor}>
                  {/* @ts-ignore */}
                  <Text text="es" spaceless={true} dimColor bold />
                </Gradient>
              )
            }
          </GlitchBox>
        </Box>
      </Box>
      <Gradient name="fruit">
        <Text dimColor>LLM Tweaker CLI - v{process.env.npm_package_version ?? "?.?.?"}</Text>
      </Gradient>
    </Box>
  )
}
