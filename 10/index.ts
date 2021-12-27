import { readLines } from '../lib/readLines.js'

const example = await readLines('10', 'example.txt')
const input = await readLines('10', 'input.txt')

const log = (...args: any[]) => console.log(...args)

const part1 = (input: string): [number, number] => {
  const lines = input.split('\n')
  const offenders: string[] = []
  const autocompleted: number[] = []

  for (const line of lines) {
    let brackets: string[] = []
    const chars = line.split('')
    for (const char of chars) {
      if (isOpeningBracket(char)) {
        brackets.push(char)
        continue
      } else {
        if (brackets.length === 0) {
          break
        } else if (isClosingBracket(char)) {
          const lastBracket = brackets.pop()
          if (lastBracket && !isMatchingBracket(char, lastBracket)) {
            brackets = []
            offenders.push(char)
            break
          } else if (lastBracket && isMatchingBracket(char, lastBracket)) {
            continue
          }
        }
      }
    }
    if (brackets.length) {
      let autocompletePairs = []

      for (const bracket of brackets) {
        autocompletePairs.push(getMatchingClosingBracket(bracket))
      }
      autocompletePairs.reverse()
      autocompleted.push(tallyAutocompletePoints(autocompletePairs))
    }
  }
  return [tallyPoints(offenders), getMedian(autocompleted)]
}

function tallyAutocompletePoints(autocompletePairs: string[]) {
  let points = 0
  for (const pair of autocompletePairs) {
    switch (pair) {
      case ')':
        points *= 5
        points += 1
        break
      case ']':
        points *= 5
        points += 2
        break
      case '}':
        points *= 5
        points += 3
        break
      case '>':
        points *= 5
        points += 4
        break
    }
  }
  return points
}

function getMatchingClosingBracket(char: string): string {
  switch (char) {
    case '(':
      return ')'
    case '[':
      return ']'
    case '{':
      return '}'
    case '<':
      return '>'
    default:
      throw new Error('Invalid char')
  }
}

function getMedian(numbers: number[]) {
    const sorted = numbers.sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)
    return sorted[middle]
}

function isOpeningBracket(char: string) {
  return char === '(' || char === '[' || char === '{' || char === '<'
}

function isClosingBracket(char: string) {
  return char === ')' || char === ']' || char === '}' || char === '>'
}

function isMatchingBracket(char: string, lastChar: string) {
  return (
    (char === ')' && lastChar === '(') ||
    (char === ']' && lastChar === '[') ||
    (char === '}' && lastChar === '{') ||
    (char === '>' && lastChar === '<')
  )
}

function tallyPoints(offenders: string[]): number {
  let points = 0
  for (const offender of offenders) {
    switch (offender) {
      case ')':
        points += 3
        break
      case ']':
        points += 57
        break
      case '}':
        points += 1197
        break
      case '>':
        points += 25137
        break
    }
  }
  return points
}

log(JSON.stringify(part1(example), null, 2))
log(JSON.stringify(part1(input), null, 2))
