import fs from 'fs/promises'
import path from 'path'

const readLines = async (fileName: string): Promise<string> =>
  await fs.readFile(path.resolve('08', fileName), 'utf8')

const main = async (fileName: string) => {
  const input = (await readLines(fileName))
    .split('\n')
    .map((line) => line.split('').map(Number))

    let risk_level = 0
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const cell = input[y][x]

      const neighbors = [
        x === 0 ? Number.MAX_SAFE_INTEGER : input[y][x - 1],
        x === input[y].length - 1 ? Number.MAX_SAFE_INTEGER : input[y][x + 1],
        y === 0 ? Number.MAX_SAFE_INTEGER : input[y - 1][x],
        y === input.length - 1 ? Number.MAX_SAFE_INTEGER : input[y + 1][x],
        // input[y - 1][x - 1],
        // input[y - 1][x + 1],
        // input[y + 1][x - 1],
        // input[y + 1][x + 1],
      ]

      const isMinimum = neighbors.every((n) => n > cell)
      if (isMinimum) {
        risk_level += cell + 1
      }
      // console.log(`${y} ${x} ${cell} ${neighbors} ${isMinimum}`)
    }
  }
  return risk_level
}

await main('example.txt').then((d) => console.log(d))
await main('input.txt').then((d) => console.log(d))
