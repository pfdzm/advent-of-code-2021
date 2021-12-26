import { readLines } from '../lib/readLines.js'

const main = async (fileName: string) => {
  const input = await readLines('07', fileName)
  let parsedInput: Record<number, number> = {}
  let matches = input.match(new RegExp(`\\b\\d\+\\b`, 'g'))
  if (matches !== null) {
    for (let i = 0; i < matches.length; i++) {
      parsedInput[parseInt(matches[i])] =
        (parsedInput[parseInt(matches[i])] || 0) + 1
    }
  }
  let max = 0
  let keys = Object.keys(parsedInput).map(
    (n: number | string) => (
      (max = Number(n) > max ? Number(n) : max), Number(n)
    )
  )
  let lowestMoves: number | null = null

  for (let index = 0; index < max; index++) {
    let offsetSum = 0
    keys.forEach((inner_key) => {
      const diff = Math.abs(inner_key - index)
      offsetSum += ((diff * (diff + 1)) / 2) * parsedInput[inner_key]
    })
    console.log(`
outer: ${index}
total: ${offsetSum}
`)
    lowestMoves =
      lowestMoves === null || offsetSum < lowestMoves ? offsetSum : lowestMoves
  }
  return lowestMoves
}

await main('example.txt').then((d) => console.log(d))
await main('input.txt').then((d) => console.log(d))
