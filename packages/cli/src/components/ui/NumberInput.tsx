import { useInput } from "ink"
import TextInput from "ink-text-input"

export default function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  useInput((_input, key) => {
    if (key.upArrow) {
      onChange(value + 1)
    } else if (key.downArrow) {
      onChange(value - 1)
    }
  })

  return (
    <TextInput
      value={value.toString()}
      onChange={value => {
        let newValue = Number(value)
        if (Number.isNaN(newValue)) {
          newValue = 0
        }
        onChange(newValue)
      }}
    />
  )
}
