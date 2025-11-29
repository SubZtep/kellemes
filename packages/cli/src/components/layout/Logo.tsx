import { Box, Text } from "ink"
import BigText from "ink-big-text"
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
                  <BigText text="ke" spaceless={true} />
                </Text>
              ) : (
                <Gradient name={smallColor}>
                  {/* @ts-ignore */}
                  <BigText text="ke" spaceless={true} />
                </Gradient>
              )
            }
          </GlitchBox>
        </Box>
        <Box>
          <Gradient name={bigColor}>
            {/* @ts-ignore */}
            <BigText text="LL" spaceless={true} />
          </Gradient>
        </Box>
        <Box>
          <GlitchBox>
            {glitched =>
              glitched ? (
                <Text color="black">
                  {/* @ts-ignore */}
                  <BigText text="e" spaceless={true} dimColor />
                </Text>
              ) : (
                <Gradient name={smallColor}>
                  {/* @ts-ignore */}
                  <BigText text="e" spaceless={true} dimColor />
                </Gradient>
              )
            }
          </GlitchBox>
        </Box>
        <Box>
          <Gradient name={bigColor}>
            {/* @ts-ignore */}
            <BigText text="M" spaceless={true} />
          </Gradient>
        </Box>
        <Box>
          <GlitchBox>
            {glitched =>
              glitched ? (
                <Text color="black">
                  {/* @ts-ignore */}
                  <BigText text="es" spaceless={true} dimColor />
                </Text>
              ) : (
                <Gradient name={smallColor}>
                  {/* @ts-ignore */}
                  <BigText text="es" spaceless={true} dimColor />
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
