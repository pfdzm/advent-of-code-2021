import path from "path";
import fs from "fs/promises";

function part1(lines: number[]) {
  return lines.reduce<number>(
    (prev, curr, idx, arr) =>
      idx !== 0 && arr[idx - 1] < curr ? ++prev : prev,
    0
  );
}

function part2(lines: number[]) {
  let groups = lines.reduce<number[]>((prev, _, idx, arr) => {
    const items = arr.slice(idx, idx + 3);
    if (items.length === 3) {
      prev.push(items.reduce((prev, curr) => prev + curr, 0));
    }
    return prev;
  }, []);

  return part1(groups);
}

export const readFileAndParseLinesAsNumbers = async (
  fileName: string,
  folderName = "01"
) =>
  (await fs.readFile(path.join(process.cwd(), folderName, fileName), "utf-8"))
    .split("\n")
    .map(Number);

const lines = await readFileAndParseLinesAsNumbers("input.txt");
const example = await readFileAndParseLinesAsNumbers("example.txt");

console.log("example: ", part1(example));
console.log("part1: ", part1(lines));
console.log("part2: ", part2(lines));
