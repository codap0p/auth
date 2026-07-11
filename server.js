const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

let licenses = {};

if (fs.existsSync("licenses.json")) {
    licenses = JSON.parse(fs.readFileSync("licenses.json"));
}

function save() {
    fs.writeFileSync("licenses.json", JSON.stringify(licenses, null, 4));
}

app.post("/auth", (req, res) => {

    const { license, hwid } = req.body;

    if (!license || !hwid) {
        return res.json({
            success: false,
            message: "Missing fields"
        });
    }

    if (!licenses[license]) {
        return res.json({
            success: false,
            message: "Invalid license"
        });
    }

    // First login
    if (!licenses[license].hwid) {

        licenses[license].hwid = hwid;

        save();

        return res.json({
            success: true,
            message: "HWID Registered"
        });
    }

    if (licenses[license].hwid !== hwid) {
        return res.json({
            success: false,
            message: "HWID Mismatch"
        });
    }

    return res.json({
        success: true,
        message: "Authenticated"
    });

});

app.get("/", (req,res)=>{
    res.send("HWID Auth Running");
});

app.listen(PORT, () => {
    console.log("Server running");
});
