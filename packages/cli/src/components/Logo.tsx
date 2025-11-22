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
    }, 1000)
    return () => {
      clearInterval(timer)
      clearTimeout(timer2)
    }
  }, [])

  return <>{children(glitched)}</>
}

export default function Logo() {
  const bigColor = "rainbow"
  const smallColor = "cristal"

  return (
    <Box flexDirection="column" alignItems="center">
      <Box>
        <Box>
          <GlitchBox>
            {glitched =>
              glitched ? (
                <Text color="black">
                  {/* @ts-ignore */}
                  <BigText text="ke" font="tiny" spaceless={true} />
                </Text>
              ) : (
                <Gradient name={smallColor}>
                  {/* @ts-ignore */}
                  <BigText text="ke" font="tiny" spaceless={true} />
                </Gradient>
              )
            }
          </GlitchBox>
        </Box>
        <Box>
          <Gradient name={bigColor}>
            {/* @ts-ignore */}
            <BigText text="LL" font="tiny" spaceless={true} />
          </Gradient>
        </Box>
        <Box>
          <GlitchBox>
            {glitched =>
              glitched ? (
                <Text color="black">
                  {/* @ts-ignore */}
                  <BigText text="e" font="tiny" spaceless={true} dimColor />
                </Text>
              ) : (
                <Gradient name={smallColor}>
                  {/* @ts-ignore */}
                  <BigText text="e" font="tiny" spaceless={true} dimColor />
                </Gradient>
              )
            }
          </GlitchBox>
        </Box>
        <Box>
          <Gradient name={bigColor}>
            {/* @ts-ignore */}
            <BigText text="M" font="tiny" spaceless={true} />
          </Gradient>
        </Box>
        <Box>
          <GlitchBox>
            {glitched =>
              glitched ? (
                <Text color="black">
                  {/* @ts-ignore */}
                  <BigText text="es" font="tiny" spaceless={true} dimColor />
                </Text>
              ) : (
                <Gradient name={smallColor}>
                  {/* @ts-ignore */}
                  <BigText text="es" font="tiny" spaceless={true} dimColor />
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
