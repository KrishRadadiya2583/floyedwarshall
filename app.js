const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Floyd–Warshall Algorithm
function floydWarshall(graph) {
    let n = graph.length;
    let dist = graph.map(row => [...row]);

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    return dist;
}

// Home page
app.get("/", (req, res) => {
    res.render("index");
});

// Handle form
app.post("/calculate", (req, res) => {
    const size = parseInt(req.body.size);
    const rawMatrix = req.body.matrix;

    if (!rawMatrix) {
        return res.redirect("/");
    }

    let matrix = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            let val = rawMatrix[i][j] ? rawMatrix[i][j].trim().toLowerCase() : "";

            if (val === "" || val === "inf" || val === "∞") {
                row.push(i === j ? 0 : Infinity);
            } else {
                row.push(Number(val));
            }
        }
        matrix.push(row);
    }

    let result = floydWarshall(matrix);
    res.render("result", { result });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
