import path from "path";
import fs from "fs/promises";

function part1(lines: string[]) {
  let prevLine: string;

  return lines
    .map((currLine) => {
      const curr = parseInt(currLine);
      const prev = parseInt(prevLine);
      return prevLine
        ? prev < curr
          ? ((prevLine = currLine), 1)
          : ((prevLine = currLine), 0)
        : ((prevLine = currLine), 0);
    })
    .filter(Boolean).length;
}

function part2(lines: string[]) {
  let groups = lines.reduce<number[]>((prev, _, idx, arr) => {
    const items = arr.slice(idx, idx + 3).map((n) => Number(n));
    if (items.length === 3) {
      prev.push(items.reduce((prev, curr) => prev + curr, 0));
    }
    return prev;
  }, []);

  return part1(groups.map(String));
}

const lines: string[] = (
  await fs.readFile(path.join(process.cwd(), "01", "input.txt"), "utf-8")
).split("\n");
console.log("part1: ", part1(lines));
console.log("part2: ", part2(lines));
