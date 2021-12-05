import fs from "fs/promises";
import path from "path";

const readLines = async (fileName: string) =>
  (await fs.readFile(path.resolve("03", fileName), "utf8"))
    .split("\n")
    .filter(Boolean);

readLines("example.txt")
  .then((lines) => {
    let [out] = lines.map((l) =>
      l
        .split("")
        .map(Number)
        .map((_, i) => {
          return lines.reduce((prev, curr) => {
            return prev + Number(curr.charAt(i));
          }, 0);
        })
    );

    let most_common = out.map((n) => Math.round(n / lines.length)).join("");
    let least_common = out
      .map((n) => Math.round(Math.abs(lines.length - n) / lines.length))
      .join("");

    return [parseInt(most_common, 2), parseInt(least_common, 2)];
  })
  .then(([gamma_rate, epsilon_rate]) => gamma_rate * epsilon_rate)
  .then(console.log);

readLines("input.txt")
  .then((lines) => {
    let [out] = lines.map((l) =>
      l
        .split("")
        .map(Number)
        .map((_, i) => {
          return lines.reduce((prev, curr) => {
            return prev + Number(curr.charAt(i));
          }, 0);
        })
    );

    let most_common = out.map((n) => Math.round(n / lines.length)).join("");
    let least_common = out
      .map((n) => Math.round(Math.abs(lines.length - n) / lines.length))
      .join("");

    return [parseInt(most_common, 2), parseInt(least_common, 2)];
  })
  .then(([gamma_rate, epsilon_rate]) => gamma_rate * epsilon_rate)
  .then(console.log);

const getSignificantBit = (col: string[]) =>
  col.reduce((prev, curr) => {
    return prev + Number(curr);
  }, 0) / col.length;

const getMostSignificantBit = (col: string[]) => {
  return getSignificantBit(col) >= 0.5 ? "1" : "0";
};

const getLeastSignificantBit = (col: string[]) => {
  return getSignificantBit(col) >= 0.5 ? "0" : "1";
};

function getGeneratorRatings(
  O2: string[],
  CO2: string[],
  col_num: number = 0
): [string, string] {
  const isO2Ready = O2.length === 1;
  const isCO2Ready = CO2.length === 1;
  if (isO2Ready && isCO2Ready) {
    return [O2[0], CO2[0]];
  }

  const first_col_o2 = O2.map((l) => l.charAt(col_num));
  const most_significant_bit = getMostSignificantBit(first_col_o2);

  const first_col_co2 = CO2.map((l) => l.charAt(col_num));
  const least_significant_bit = getLeastSignificantBit(first_col_co2);

  return getGeneratorRatings(
    isO2Ready
      ? O2
      : O2.filter((l) => l.charAt(col_num) === most_significant_bit),
    isCO2Ready
      ? CO2
      : CO2.filter((l) => l.charAt(col_num) === least_significant_bit),
    ++col_num
  );
}

const example = await readLines("example.txt");
const data_example = getGeneratorRatings(example, example);
console.log(
  data_example,
  parseInt(data_example[0], 2) * parseInt(data_example[1], 2)
);

const input = await readLines("input.txt");
const data_input = getGeneratorRatings(input, input);
console.log(
  data_input,
  parseInt(data_input[0], 2) * parseInt(data_input[1], 2)
);
