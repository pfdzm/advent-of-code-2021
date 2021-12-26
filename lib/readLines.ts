import fs from 'fs/promises'
import path from 'path'

const readLines = async (
  day: string,
  fileName: string
): Promise<string> => await fs.readFile(path.resolve(day, fileName), 'utf8')


export {
  readLines
}