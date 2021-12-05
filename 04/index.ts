import fs from "fs/promises";
import path from "path";

const readLines = async (fileName: string) =>
  (await fs.readFile(path.resolve("04", fileName), "utf8")).split("\n");

const example = readLines("example.txt");

function giantSquid(input: string[]) {
  return input.forEach((line) => console.log(line));
}

example.then(giantSquid);
