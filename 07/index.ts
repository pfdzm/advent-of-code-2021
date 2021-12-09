import fs from 'fs/promises'
import path from 'path'

const readLines = async (fileName: string): Promise<string> =>
  await fs.readFile(path.resolve('07', fileName), 'utf8')

const main = async (fileName: string) => {
  const input = await readLines(fileName)
  let parsedInput: Record<number, number> = {}
  let matches = input.match(new RegExp(`\\b\\d\+\\b`, 'g'))
  if (matches !== null) {
    for (let i = 0; i < matches.length; i++) {
      parsedInput[parseInt(matches[i])] =
        (parsedInput[parseInt(matches[i])] || 0) + 1
    }
  }
  let keys = Object.keys(parsedInput)
  let lowestMoves: number | null = null
  keys.forEach((key) => {
    let offsetSum = 0
    keys
      .filter((inner_key) => inner_key !== key)
      .forEach((inner_key) => {
        let sum =
          Math.abs(parseInt(inner_key) - parseInt(key)) *
          parsedInput[parseInt(inner_key)]
        offsetSum += sum
      })
    lowestMoves =
      lowestMoves === null || offsetSum < lowestMoves ? offsetSum : lowestMoves
    offsetSum = 0
  })
  return lowestMoves
}

await main('example.txt').then((d) => console.log(d))
await main('input.txt').then((d) => console.log(d))
