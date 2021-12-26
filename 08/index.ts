import { readLines } from '../lib/readLines.js'

const example1 = await readLines('08', 'example.txt')
const input1 = await readLines('08', 'input.txt')

function part1(input: string): number {
  const lines = input
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('|'))

  let signals: Record<number, number> = {}

  for (const line of lines) {
    let [signalPatterns, outputValue]: (string | string[])[] = line
    signalPatterns = signalPatterns.split(' ').filter(Boolean)
    outputValue = outputValue.split(' ').filter(Boolean)
    outputValue.map((val) => {
      switch (val.length) {
        case 2:
          signals[1] = (signals[1] || 0) + 1
          break
        case 4:
          signals[4] = (signals[4] || 0) + 1
          break
        case 3:
          signals[7] = (signals[7] || 0) + 1
          break
        case 7:
          signals[8] = (signals[8] || 0) + 1
          break
      }
    })
  }
  return Object.values(signals).reduce((a, b) => a + b, 0)
}

// 1 -> 2 signals
// 4 -> 4 signals
// 7 -> 3 signals
// 8 -> 7 signals

console.log(JSON.stringify(part1(example1), null, 2))
console.log(JSON.stringify(part1(input1), null, 2))
