import figlet from "figlet"
import { Box, Text } from "ink"
import { useEffect, useState } from "react"

export default function Logo({ font = "Santa Clara", text = "keLLeMes" }: { font?: string; text?: string }) {
  const [logo, setLogo] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const logo = await figlet.text(text, { font })
        setLogo(logo)
      } catch {
        setLogo(`keLLeMes\n...\n${process.env.npm_package_name}\n...`)
      }
    })()
  }, [])

  return (
    <Box>
      <Text>{logo}</Text>
      <Text color="gray">v{process.env.npm_package_version ?? "?.?.?"}</Text>
    </Box>
  )
}
