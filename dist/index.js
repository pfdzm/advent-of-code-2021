import path from "path";
import fs from "fs/promises";
function part1(lines) {
    // let prev: number;
    return lines.reduce((prev, curr) => {
        if (!prev[0] || prev[0] < curr) {
            return [curr, ...prev];
        }
        return prev;
    }, []).length;
    // return lines
    //   .map((curr) => {
    //     return prev
    //       ? prev < curr
    //         ? ((prev = curr), 1)
    //         : ((prev = curr), 0)
    //       : ((prev = curr), 0);
    //   })
    //   .filter(Boolean).length;
}
function part2(lines) {
    let groups = lines.reduce((prev, _, idx, arr) => {
        const items = arr.slice(idx, idx + 3);
        if (items.length === 3) {
            prev.push(items.reduce((prev, curr) => prev + curr, 0));
        }
        return prev;
    }, []);
    return part1(groups);
}
const lines = (await fs.readFile(path.join(process.cwd(), "01", "input.txt"), "utf-8"))
    .split("\n")
    .map((line) => (console.log(line), Number(line)));
const example = (await fs.readFile(path.join(process.cwd(), "01", "example.txt"), "utf-8"))
    .split("\n")
    .map((line) => (console.log(line), Number(line)));
console.log("example: ", part1(example));
// console.log("part1: ", part1(lines));
// console.log("part2: ", part2(lines));
