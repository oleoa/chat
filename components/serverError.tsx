interface Props {
  message: string
}

export default function ServerError({ message }:Props) {
  return (
    <main className="justify-center">
      <p className="text-red-600 text-9xl">500</p>
      <h3 className="text-red-600">{message}</h3>
    </main>
  )
}
