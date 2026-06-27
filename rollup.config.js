import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/ups-card.ts",
    output: {
        file: "dist/ups-card.js",
        format: "es"
    },
    plugins: [
        resolve(),
        typescript()
    ]
};
