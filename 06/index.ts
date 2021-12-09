import fs from 'fs/promises'
import path from 'path'

const parseDay = (input: Record<number, number>) => {
  let result: Record<number, number> = {}
  for (let i = 0; i < 10; i++) {
    if (i === 0) {
      result[6] = input[0]
      result[8] = input[0]
    } else {
      result[i - 1] = (input[i] || 0) + (result[i - 1] || 0)
    }
  }

  return result
}

const readLines = async (fileName: string): Promise<string> =>
  await fs.readFile(path.resolve('06', fileName), 'utf8')

const main = async (fileName: string, n: number) => {
  const input = await readLines(fileName)

  let parsedInput: Record<number, number> = {}

  for (let i = 0; i < 10; i++) {
    parsedInput[i] = input.match(new RegExp(`\\b${i}\\b`, 'g'))?.length || 0
  }

  let result = parseDay(parsedInput)
  for (let i = 1; i < n; i++) {
    result = parseDay(result)
  }

  return `--${fileName}--\nAfter ${n} days: ${Object.values(result).reduce(
    (acc, curr) => acc + curr,
    0
  )}\n${Object.values(result)}\n`
}

await main('example.txt', 80).then((d) => console.log(d))
await main('example.txt', 256).then((d) => console.log(d))
await main('input.txt', 80).then((d) => console.log(d))
await main('input.txt', 256).then((d) => console.log(d))
