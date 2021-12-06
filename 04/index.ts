import fs from 'fs/promises'
import path from 'path'

const readInput = async (fileName: string) =>
  (await fs.readFile(path.resolve('04', fileName), 'utf8'))
    .split('\n\n')
    .map((l) => l.split('\n'))

const calculateCardSum = (card: (number | null)[][]) =>
  card.reduce<number>(
    (acc, line2) =>
      acc + line2.reduce<number>((acc, n) => (n ? acc + n : acc), 0),
    0
  )

function parseInput(input: string[][]) {
  let header = input[0][0].split(',').map((s) => parseInt(s))
  let body = input
    .slice(1)
    .map((card) =>
      card.map((line) => [...line.matchAll(/\d+/g)].map((m) => parseInt(m[0])))
    )

  return { header, body }
}

let giantSquid = (fileName: string) =>
  readInput(fileName)
    .then(parseInput)
    .then(({ header, body }) => {
      let newBody: ((number | null)[][] | 'bingo')[] = body
      let bingo = false
      /**
       * Two dimensional array of numbers representing a BINGO card
       * @example [1, 2, 11, 22, 10]
       *          [100, 4, null, 22, 10]
       *          [null, 6, 102, 12, 87]
       *          [99, 33, null, null, null]
       *          [null, 55, 17, null, 48]
       */
      let wCard: (number | null)[][] | undefined
      let wNum: number | undefined
      let winners: {
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
                    if (newLine.every((n) => n === null)) {
                      bingo = true
                    }
                    return newLine
                  })
                : card

            if (
              newCard !== 'bingo' &&
              newCard.some((line, idx) =>
                line.some(
                  () =>
                    newCard !== 'bingo' &&
                    newCard.every((line) => line[idx] === null)
                )
              )
            ) {
              bingo = true
            }

            if (bingo && newCard !== 'bingo') {
              wCard = newCard
              wNum = current_number
              let sum = calculateCardSum(newCard)

              // announce winner!
              console.log('\n\n<--*-BINGO-START-*-->\n')
              console.log(`BINGO! ${current_number}`)
              console.log('--------------')
              console.log(`card: ${newCard}`)
              console.log(`number: ${current_number}`)
              console.log(`sum: ${sum}`)
              console.log(`total: ${sum * current_number}`)
              console.log('\n<--*-BINGO-END-*-->\n\n')

              winners.push({
                card: wCard,
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

      return { wCard, wNum, winners }
    })
    .then(({ wCard, wNum, winners }) => {
      if (!wCard?.length || typeof wNum === 'undefined') {
        throw new Error('No valid solution found.')
      }
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
      return {
        sum: calculateCardSum(wCard),
        wNum,
        total: wNum * calculateCardSum(wCard),
      }
    })

await giantSquid('example.txt')
await giantSquid('input.txt')
