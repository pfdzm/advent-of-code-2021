import fs from 'fs/promises'
import path from 'path'

const readInput = async (fileName: string) =>
  (await fs.readFile(path.resolve('04', fileName), 'utf8'))
    .split('\n\n')
    .map((l) => l.split('\n'))

const parseInput = (input: string[][]) => {
  const header = input[0][0].split(',').map((s) => parseInt(s))
  const body = input
    .slice(1)
    .map((card) =>
      card.map((line) => [...line.matchAll(/\d+/g)].map((m) => parseInt(m[0])))
    )
  return { header, body }
}

const calculateCardSum = (card: (number | null)[][]) =>
  card.reduce<number>(
    (acc, line2) =>
      acc + line2.reduce<number>((acc, n) => (n ? acc + n : acc), 0),
    0
  )

const findBingo_col = (newCard: (number | null)[][]) =>
  newCard.some((line, idx) =>
    line.some(() => newCard.every((line) => line[idx] === null))
  )

const findBingo_row = (line: (number | null)[]) => line.every((n) => n === null)

const announceBingo = ({
  current_number,
  newCard,
  sum,
}: {
  current_number: number
  newCard: (number | null)[][]
  sum: number
}) => {
  // announce each BINGO!
  console.log('\n\n<--*-BINGO-START-*-->\n')
  console.log(`BINGO! ${current_number}`)
  console.log('--------------')
  console.log(`card: ${newCard}`)
  console.log(`number: ${current_number}`)
  console.log(`sum: ${sum}`)
  console.log(`total: ${sum * current_number}`)
  console.log('\n<--*-BINGO-END-*-->\n\n')
}

/**
 * Two dimensional array of numbers representing a BINGO card
 * @example [1, 2, 11, 22, 10]
 *          [100, 4, null, 22, 10]
 *          [null, 6, 102, 12, 87]
 *          [99, 33, null, null, null]
 *          [null, 55, 17, null, 48]
 */
const giantSquid = (fileName: string) =>
  readInput(fileName)
    .then(parseInput)
    .then(({ header, body }) => {
      let newBody: ((number | null)[][] | 'bingo')[] = body
      let bingo = false
      const winners: {
        [key: string]: number | (number | null)[][]
        card: (number | null)[][]
        number: number
        sum: number
        total: number
      }[] = []
      header.reduce((current_number, next_number) => {
        newBody = newBody
          .map((card) => {
            let newCard =
              !bingo && card !== 'bingo'
                ? card.map((line) => {
                    let newLine = line.map((n) =>
                      n === current_number ? null : n
                    )
                    if (findBingo_row(newLine)) {
                      bingo = true
                    }
                    return newLine
                  })
                : card

            if (newCard !== 'bingo' && findBingo_col(newCard)) {
              bingo = true
            }

            if (bingo && newCard !== 'bingo') {
              const sum = calculateCardSum(newCard)
              announceBingo({
                current_number,
                newCard,
                sum,
              })
              winners.push({
                card: newCard,
                number: current_number,
                sum,
                total: sum * current_number,
              })
              bingo = false
              return 'bingo'
            }

            return newCard
          })
          .filter((c) => {
            return c !== 'bingo'
          })
        return next_number
      })

      return { winners }
    })
    .then(({ winners }) => {
      console.log(
        `\nFirst BINGO:\n${Object.keys(winners[0])
          .map((k) => `${k}: ${winners[0][k]}`)
          .join('\n')}`
      )
      console.log(
        `\nLast BINGO:\n${Object.keys(winners[winners.length - 1])
          .map((k) => `${k}: ${winners[winners.length - 1][k]}`)
          .join('\n')}`
      )
      return winners
    })

await giantSquid('example.txt')
await giantSquid('input.txt')
