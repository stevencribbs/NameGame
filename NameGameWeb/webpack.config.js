"use strict";
const path = require('path');

module.exports = {
    mode: "development", // "production" | "development" | "none"
    //entry: path.resolve("./index.js"),
    entry: "./src/index.js",
    output: {
        //path: path.resolve(__dirname, "dist"),
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                exclude: [
                    /node_modules/, /\.css$/
                ],
                enforce: "pre",
                enforce: "post",
                // flags to apply these rules, even if they are overridden (advanced option)
                loader: "babel-loader",
                options: {
                    presets: ["react", "es2015"]
                },
            },
        ]
    }
};