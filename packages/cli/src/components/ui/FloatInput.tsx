import { useInput } from "ink"
import TextInput from "ink-text-input"

export default function FloatInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  useInput((_input, key) => {
    if (key.upArrow) {
      onChange(Math.round((value + 0.1) * 10) / 10)
    } else if (key.downArrow) {
      onChange(Math.round((value - 0.1) * 10) / 10)
    }
  })

  return <TextInput value={value.toString()} onChange={value => onChange(Number.parseFloat(value))} />
}
