import fs from "fs";
import esbuild from "esbuild";

// Step 1: Read the HTML file
const htmlContent = fs.readFileSync('./demo/index.html', 'utf8');


// Step 3: Bundle and minify the scripts
let result = esbuild.buildSync({
	entryPoints: ["demo/demo.js"],
	bundle: true,
	minify: true,
	outfile: "build/demo.js",
	allowOverwrite: true
});
console.log(result);

fs.copyFileSync("node_modules/van11y-accessible-tab-panel-aria/dist/van11y-accessible-tab-panel-aria.min.js", "build/van11y-accessible-tab-panel-aria.min.js");
fs.copyFileSync("demo/demo.css", "build/demo.css");

// Step 4: Replace script tags with bundled script
const newHtmlContent = htmlContent.replace("../node_modules/van11y-accessible-tab-panel-aria/dist/", '');
// Step 5: Write the new HTML file
fs.writeFileSync('./build/index.html', newHtmlContent);
