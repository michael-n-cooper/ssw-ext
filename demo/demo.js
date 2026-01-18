import * as ext from "../src/index.js";
import * as core from "../node_modules/@sutton-signwriting/core/core.mjs";
import * as ttf from "../node_modules/@sutton-signwriting/font-ttf/index.mjs";

window.addEventListener("load", windowLoaded);

async function windowLoaded() {
	document.querySelector("#symbolFsw").addEventListener("change", showSymbol);
	document.querySelector("#symbolInfo").addEventListener("change", showSymbolInfo);
}

function showSymbol(event) {
	document.querySelector("#symbolDemo .renderArea").innerHTML = ttf.fsw.symbolSvg(event.target.value);
}

function showSymbolInfo(event) {
	let info;
	let symbol = document.querySelector("#symbolFsw").value;
	if (event.target.value == "left") info = ext.core.fsw.isLeftHand(symbol);
	if (event.target.value == "right") info = ext.core.fsw.isRightHand(symbol);
	if (event.target.value == "both") info = ext.core.fsw.isBothHand(symbol);
	if (event.target.value == "floor") info = ext.core.fsw.isFloorPlane(symbol);
	if (event.target.value == "wall") info = ext.core.fsw.isWallPlane(symbol);
	if (event.target.value == "diagonal") info = ext.core.fsw.isDiagonalPlane(symbol);
	document.querySelector("#symbolDemo .outputArea").innerText = info;
}
