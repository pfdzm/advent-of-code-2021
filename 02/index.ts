import fs from "fs/promises";
import path from "path";

type IDirections = [horizontal: number, depth: number, aim: number];
type IParser = (line: string, aim: number, rules: IRule) => IDirections;
type IRule = {
  up: (x: number) => IDirections;
  down: (x: number) => IDirections;
  forward: (x: number, aim: number) => IDirections;
};

const main = async (lines: string[], parser: IParser, rules: IRule) => {
  return lines.filter(Boolean).reduce(
    (acc, line) => {
      return parser(line, acc[2], rules).map(
        (dir, idx) => dir + acc[idx]
      ) as IDirections;
    },
    [0, 0, 0]
  );
};

const parser: IParser = (line: string, aim: number, rules: IRule) => {
  let dir = line.split(" ");
  switch (dir[0]) {
    case "up":
      return rules.up(parseInt(dir[1]));
    case "down":
      return rules.down(parseInt(dir[1]));
    case "forward":
      return rules.forward(parseInt(dir[1]), aim);
    default:
      return [0, 0, 0];
  }
};

const readLines = async (fileName: string) =>
  (await fs.readFile(path.resolve("02", fileName), "utf8")).split("\n");

const example = await readLines("example.txt");
const input = await readLines("input.txt");

const rules_part1: IRule = {
  up: (x: number) => [0, -x, 0],
  down: (x: number) => [0, x, 0],
  forward: (x: number, _: number) => [x, 0, 0],
};

const rules_part2: IRule = {
  up: (x: number) => [0, 0, -x],
  down: (x: number) => [0, 0, x],
  forward: (x: number, diff: number) => [x, x * diff, 0],
};

const part1 = async (input: string[]) =>
  (await main(input, parser, rules_part1))
    .slice(0, 2)
    .reduce((prev, curr) => prev * curr);

const part2 = async (input: string[]) =>
  (await main(input, parser, rules_part2))
    .slice(0, 2)
    .reduce((prev, curr) => prev * curr);

part1(example).then(console.log);
part1(input).then(console.log);

part2(example).then(console.log);
part2(input).then(console.log);
