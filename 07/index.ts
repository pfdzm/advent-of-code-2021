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
  let keys = Object.keys(parsedInput).map(Number)
  let lowestMoves: number | null = null

  for (let index = 0; index < Math.max(...keys); index++) {
    let offsetSum = 0
    keys
      .filter((inner_key) => inner_key !== index)
      .forEach((inner_key) => {
        let sum = 0
        let diff = Math.abs(inner_key - index)
        for (let index = 0; index < diff; index++) {
          sum += diff - index
        }
        sum *= parsedInput[inner_key]
        offsetSum += sum
//         console.log(`
// outer: ${index}
// inner: ${inner_key}
// val: ${parsedInput[inner_key]}
// total: ${offsetSum}
// `)
      })
    lowestMoves =
      lowestMoves === null || offsetSum < lowestMoves ? offsetSum : lowestMoves
  }
  return lowestMoves
}

await main('example.txt').then((d) => console.log(d))
await main('input.txt').then((d) => console.log(d))
