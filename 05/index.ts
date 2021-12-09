import fs from 'fs/promises'
import path from 'path'

const readLines = async (fileName: string) =>
  (await fs.readFile(path.resolve('05', fileName), 'utf8'))
    .split('\n')
    .map((l) => l.split(' -> ').map((s) => s.split(',').map(Number)))

const main = async (fileName: string) => {
  const points: string[] = []
  ;(await readLines(fileName))
    .filter(([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2)
    .map(([[x1, y1], [x2, y2]]) => {
      // console.log(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`)
      const diffX = Math.abs(x2 - x1)
      const diffY = Math.abs(y2 - y1)

      points.push([x1, y1].join(','))
      if (diffX !== 0) {
        for (let i = 1; i < diffX; i++) {
          points.push([x1 < x2 ? x1 + i : x2 + i, y1].join(','))
        }
      }
      points.push([x2, y2].join(','))
      if (diffY !== 0) {
        for (let i = 1; i < diffY; i++) {
          points.push([x1, y1 < y2 ? y1 + i : y2 + i].join(','))
        }
      }

      return [
        [x1, y1],
        [x2, y2],
      ]
    })
  const duplicates = new Set(points)
  return points.length - duplicates.size
}

await main('example.txt').then(console.log)
await main('input.txt').then(console.log)
