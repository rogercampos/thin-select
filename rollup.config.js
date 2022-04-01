import pluginTypescript from "@rollup/plugin-typescript";
import pluginCommonjs from "@rollup/plugin-commonjs";
import pluginNodeResolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import * as path from "path";
import pkg from "./package.json";

export default [

    // ES
    {
        input: "src/index.ts",
        output: [
            {
                file: pkg.main,
                format: "es",
                sourcemap: "inline",
                exports: "named",
            },
        ],
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.devDependencies || {}),
        ],
        plugins: [
            pluginTypescript(),
            pluginCommonjs({
                extensions: [".js", ".ts"],
            }),
            babel({
                babelHelpers: "bundled",
                configFile: path.resolve(__dirname, ".babelrc.js"),
                exclude: 'node_modules/**',
            }),
            pluginNodeResolve({
                browser: false,
            }),
        ],
    },
];
