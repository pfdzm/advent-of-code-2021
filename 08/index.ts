import { readLines } from '../lib/readLines.js'

const example = await readLines('08', 'example.txt')
const input = await readLines('08', 'input.txt')

type ValidLetter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'
const isValidKey = (x: string): x is ValidLetter => {
  if (
    x === 'a' ||
    x === 'b' ||
    x === 'c' ||
    x === 'd' ||
    x === 'e' ||
    x === 'f' ||
    x === 'g'
  ) {
    return true
  } else return false
}

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

// 2,3,5 -> 5 signals
// 0,6,9 -> 6 signals

/**
 *   
  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
 */

/**
 * a -> not in 1,4
 * b -> not in 1,2,3,7
 * c -> not in 5,6
 * d -> not in 0,1,7
 * e -> not in 1,3,4,7
 * f -> not in 2
 * g -> not in 1,4,7
 */

/**
 * known: 1,4,7,8,2
 */
console.log(JSON.stringify(part1(example), null, 2))
console.log(JSON.stringify(part1(input), null, 2))

function part2(input: string): number {
  const lines = input
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('|'))

  let signals: Record<number, string> = {}

  let results: number[] = []

  for (const line of lines) {
    let [signalPatterns, outputValue]: (string | string[])[] = line
    signalPatterns = signalPatterns.split(' ').filter(Boolean)
    outputValue = outputValue.split(' ').filter(Boolean)
    outputValue.map((val) => {
      switch (val.length) {
        case 2:
          signals[1] = val
          break
        case 4:
          signals[4] = val
          break
        case 3:
          signals[7] = val
          break
        case 7:
          signals[8] = val
          break
      }
    })

    let f_canon: string | null = null
    let letters = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 }
    signalPatterns.map((pattern) => {
      pattern.split('').map((val) => {
        if (!isValidKey(val)) throw new Error('invalid key')
        letters[val] += 1
      })

      switch (pattern.length) {
        case 2:
          signals[1] = pattern
          break
        case 4:
          signals[4] = pattern
          break
        case 3:
          signals[7] = pattern
          break
        case 7:
          signals[8] = pattern
          break
      }
    })

    for (const key in letters) {
      if (!isValidKey(key)) throw new Error('invalid key')
      if (letters[key] === 9) {
        f_canon = key
      }
    }

    signalPatterns.map((pattern) => {
      if (!pattern.includes(f_canon!)) {
        signals[2] = pattern
      }
      if (pattern.length === 6) {
        // 0,6,9
        const isSix =
          !signals[1].split('').every((l) => pattern.includes(l)) &&
          !signals[7].split('').every((l) => pattern.includes(l))
        if (isSix) {
          signals[6] = pattern
        }
      }

      if (pattern.length === 5) {
        // 3,5
        const isTwo = pattern === signals[2]
        const isFive =
          signals[6] && pattern.split('').every((l) => signals[6].includes(l))

        if (isFive && !isTwo) {
          signals[5] = pattern
        }
      }
    })

    signalPatterns.map((pattern) => {
      if (pattern.length === 5) {
        // 3,5
        const isTwo = pattern === signals[2]
        const isFive =
          signals[6] && pattern.split('').every((l) => signals[6].includes(l))

        if (isFive && !isTwo) {
          signals[5] = pattern
        }
      }
    })

    signalPatterns.map((p) => {
      if (p.length === 5) {
        const isThree =
          signals[2] && signals[5] && p !== signals[2] && p !== signals[5]
        if (isThree) {
          signals[3] = p
        }
      }
    })

    signalPatterns.map((p) => {
      if (p.length === 6) {
        // 0,9
        const isNine =
          signals[3] &&
          signals[3].split('').every((l) => p.includes(l)) &&
          signals[6] &&
          p !== signals[6]

        if (isNine) {
          signals[9] = p
        } else {
          signals[0] = p
        }
      }
    })

    // we have all the signals now
    let hashMap: Record<string, Set<string>> = {}
    for (const [key, val] of Object.entries(signals)) {
      if (!isNaN(Number(key))) {
        hashMap[Number(key)] = new Set(val.split(''))
      }
    }

    let result = ''

    outputValue.map((value) => {
      result += number(value, hashMap)
    })
    results.push(Number(result))
  }
  return results.reduce((acc, val) => acc + val, 0)
}

const number = (value: string, signals: Record<string, Set<string>>) => {
  const set = new Set(value.split(''))
  let result = 0
  for (const [key, val] of Object.entries(signals)) {
    if (set.size === val.size && [...val].every((l) => set.has(l))) {
      result += Number(key)
    }
  }
  return result
}

const exampleSimple = await readLines('08', 'exampleSimple.txt')
console.log(part2(exampleSimple))
console.log(part2(example))
console.log(part2(input))
