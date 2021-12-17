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
      console.log(`dupe: ${point}`)
    }
  } else {
    points.add(point)
  }
}

const main = async (fileName: string) => {
  const points = new Set<string>()
  const dupes = new Set<string>()
  const data = await readLines(fileName)

  data
    .filter(([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2)
    .map(([[x1, y1], [x2, y2]]) => {
      // console.log(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`)
      const diffX = Math.abs(x2 - x1)
      const diffY = Math.abs(y2 - y1)

      // points.push([x1, y1].join(','))
      // points.push([x2, y2].join(','))

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
  return dupes.size
}

await main('example.txt').then(console.log)
await main('input.txt').then(console.log)
