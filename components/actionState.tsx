import { FormState } from "@/interfaces"

interface Props {
  state: FormState
}

export default function ActionState({ state }: Props) {
  return (
    <>
      {state.message && <p className={state.success ? "text-green-700" : "text-red-700" } aria-live="polite">{state.message}</p>}
    </>
  )
}
