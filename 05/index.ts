import fs from 'fs/promises'
import path from 'path'

const readLines = async (fileName: string) =>
  (await fs.readFile(path.resolve('05', fileName), 'utf8'))
    .split('\n')
    .map((l) => l.split(' -> ').map((s) => s.split(',').map(Number)))

function processPoint(point: string, points: Set<string>, dupes: Set<string>) {
  if (points.has(point)) {
    if (!dupes.has(point)) {
      dupes.add(point)
    }
  } else {
    points.add(point)
  }
}

const part1 = async (fileName: string) => {
  const points = new Set<string>()
  const dupes = new Set<string>()
  const data = await readLines(fileName)

  data
    .filter(([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2)
    .map(([[x1, y1], [x2, y2]]) => {
      const diffX = Math.abs(x2 - x1)
      const diffY = Math.abs(y2 - y1)
      if (diffX !== 0) {
        let x_1 = x1 < x2 ? x1 : x2
        let x_2 = x1 < x2 ? x2 : x1
        for (let i = 0; i < diffX; i++) {
          let point = [x_1 + i, y1].join(',')
          processPoint(point, points, dupes)
        }
        let point = [x_2, y1].join(',')
        processPoint(point, points, dupes)
      }
      if (diffY !== 0) {
        let y_1 = y1 < y2 ? y1 : y2
        let y_2 = y1 < y2 ? y2 : y1
        for (let i = 0; i < diffY; i++) {
          let point = [x1, y_1 + i].join(',')
          processPoint(point, points, dupes)
        }
        let point = [x1, y_2].join(',')
        processPoint(point, points, dupes)
      }

      return [
        [x1, y1],
        [x2, y2],
      ]
    })
  return { points, dupes }
}

const part2 = async (fileName: string) => {
  const data = await readLines(fileName)

  const { points, dupes } = await part1(fileName)

  data
  .filter(([[x1, y1], [x2, y2]]) => !(x1 === x2 || y1 === y2))
  .map(([[x1, y1], [x2, y2]]) => {
    const dX = Math.abs(x2 - x1)
    const dY = Math.abs(y2 - y1)
    const isDiagonal = dX === dY && dX !== 0 && dY !== 0
    const isAscending = (x1 > x2 && y1 > y2) || (x1 < x2 && y1 < y2)

    if (isDiagonal) {
      let x_1 = x1 < x2 ? x1 : x2
      let y_1 = y1 < y2 ? y1 : y2
      let delta = dX
      if (isAscending) {
        for (let i = 0; i <= delta; i++) {
          let point = [x_1 + i, y_1 + i].join(',')
          processPoint(point, points, dupes)
        }
      } else {
        if (x1 < x2) {
          for (let i = 0; i <= delta; i++) {
            let point = [x1 + i, y1 - i].join(',')
            processPoint(point, points, dupes)
          }
        } else {
          for (let i = 0; i <= delta; i++) {
            let point = [x1 - i, y1 + i].join(',')
            processPoint(point, points, dupes)
          }
        }
      }
    }

    return [
      [x1, y1],
      [x2, y2],
    ]
  })
  return { points, dupes }
}

type Result = { points: Set<string>; dupes: Set<string> }

const run = async (result: Promise<Result>): Promise<number> => {
  const { dupes } = await result
  console.log(dupes.size)
  return dupes.size
}

run(part1('example.txt'))
run(part1('input.txt'))
run(part2('example.txt'))
run(part2('input.txt'))
