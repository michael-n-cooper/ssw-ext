import * as ext from "../src/index.js";
import * as core from "../node_modules/@sutton-signwriting/core/core.mjs";
import * as ttf from "../node_modules/@sutton-signwriting/font-ttf/index.mjs";
import { symbolSwapHands, symbolSwapPerspective, symbolSwapSides } from "../src/font-ttf/fsw/fsw-symbol-swap.js";
import "../config/alphabet.js";

window.addEventListener("load", windowLoaded);

async function windowLoaded() {
	document.querySelector("#symbolFsw").addEventListener("change", showSymbol);
	document.querySelectorAll("#symbolDemo button").forEach((button) => button.addEventListener("click", modifySymbol));
	document.querySelector("#signFsw").addEventListener("change", showSign);
	document.querySelectorAll("#signDemo button").forEach((button) => button.addEventListener("click", modifySign));
}

function renderSymbol(fswSym) {
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) return ttf.fsw.symbolSvg(parsed.symbol);
	return "";
}
function renderSign(fswSign) {
	const parsed = core.fsw.parse.sign(fswSign);
	if (parsed.spatials) return ttf.fsw.signSvg(fswSign);
	return "";
}

function showSymbol(event) {
	const fswSym = document.querySelector("#symbolFsw").value;
	const parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		document.querySelector("#symbolDemo .renderArea").innerHTML = renderSymbol(event.target.value);

		let info = "<ul>";
		info += "<li>Left hand: " + ext.ttf.fsw.isLeftHand(parsed.symbol) + "</li>";
		info += "<li>Right hand: " + ext.ttf.fsw.isRightHand(parsed.symbol) + "</li>";
		info += "<li>Both hands: " + ext.ttf.fsw.isBothHand(parsed.symbol) + "</li>";
		info += "<li>Floor plane: " + ext.ttf.fsw.isFloorPlane(parsed.symbol) + "</li>";
		info += "<li>Wall plane: " + ext.ttf.fsw.isWallPlane(parsed.symbol) + "</li>";
		info += "<li>Diagonal plane: " + ext.ttf.fsw.isDiagonalPlane(parsed.symbol) + "</li>";
		info += "</ul>";
		document.querySelector("#symbolInfo .outputArea").innerHTML = info;

		document.querySelector("#symbolDesc .outputArea").textContent = ext.ttf.fsw.describeSymbol(parsed.symbol);

		let newSym = ext.ttf.fsw.symbolMirror(fswSym);
		document.querySelector("#symbolMirror .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolMirror .outputArea").innerText = newSym;
			
		newSym = symbolSwapHands(fswSym);
		document.querySelector("#symbolHands .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolHands .outputArea").innerText = newSym;

		newSym = symbolSwapPerspective(fswSym);
		document.querySelector("#symbolPerspective .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolPerspective .outputArea").innerText = newSym;

		newSym = symbolSwapSides(fswSym);
		document.querySelector("#symbolSides .renderArea").innerHTML = renderSymbol(newSym);
		document.querySelector("#symbolSides .outputArea").innerText = newSym;
	}
}

function modifySymbol(event) {
	event.preventDefault();
	let fswSym = document.querySelector("#symbolFsw").value;
	let parsed = core.fsw.parse.symbol(fswSym);
	if (parsed.symbol) {
		if (event.target.value == "hands") fswSym = symbolSwapHands(fswSym);
		if (event.target.value == "sides") fswSym = symbolSwapSides(fswSym);
		if (event.target.value == "mirror") fswSym = ext.ttf.fsw.symbolMirror(fswSym);
		if (event.target.value == "perspective") fswSym = symbolSwapPerspective(fswSym);                
		document.querySelector("#symbolFsw").value = fswSym;
		document.querySelector("#symbolFsw").dispatchEvent(new Event("change"));
	}
}

function generateSignInfo(signObj) {
	const result = { "rightHand": 0, "leftHand": 0, "leftMovement": 0, "rightMovement": 0, "bothMovement": 0, "dynamic": 0, "head": 0, "trunk": 0, "limb": 0, "location": 0, "punctuation": 0 };
	signObj.spatials.forEach((symbol) => {
		if (core.fsw.isType(symbol.symbol, "hand")) {
			if (ext.ttf.fsw.isRightHand(symbol.symbol)) result.rightHand++;
			if (ext.ttf.fsw.isLeftHand(symbol.symbol)) result.leftHand++;
		}
		if (core.fsw.isType(symbol.symbol, "movement")) {
			if (ext.ttf.fsw.isRightHand(symbol.symbol)) result.rightMovement++;
			if (ext.ttf.fsw.isLeftHand(symbol.symbol)) result.leftMovement++;
			if (ext.ttf.fsw.isBothHand(symbol.symbol)) result.bothMovement++;
		}
		if (core.fsw.isType(symbol.symbol, "dynamic")) result.dynamic++;
		if (core.fsw.isType(symbol.symbol, "head")) result.head++;
		if (core.fsw.isType(symbol.symbol, "trunk")) result.trunk++;
		if (core.fsw.isType(symbol.symbol, "limb")) result.limb++;
		if (core.fsw.isType(symbol.symbol, "location")) result.location++;
		if (core.fsw.isType(symbol.symbol, "punctuation")) result.punctuation++;
	});
	return result;
}
function showSign(event) {
	const fswSign = document.querySelector("#signFsw").value;
	const parsed = core.fsw.parse.sign(fswSign);
	if (parsed.spatials) {
		document.querySelector("#signDemo .renderArea").innerHTML = renderSign(event.target.value);
		//"dynamic", "head", "trunk", "limb", "location", "punctuation"
		const signInfo = generateSignInfo(parsed);
		let info = "<ul>";
		info += "<li>Right Hand: " + signInfo.rightHand + "</li>";
		info += "<li>Left Hand: " + signInfo.leftHand + "</li>";
		info += "<li>Right Movement: " + signInfo.rightMovement + "</li>";
		info += "<li>Left Movement: " + signInfo.leftMovement + "</li>";
		info += "<li>Both Movement: " + signInfo.bothMovement + "</li>";
		info += "<li>Dynamic: " + signInfo.dynamic + "</li>";
		info += "<li>Head: " + signInfo.head + "</li>";
		info += "<li>Trunk: " + signInfo.trunk + "</li>";
		info += "<li>Limb: " + signInfo.limb + "</li>";
		info += "<li>Location: " + signInfo.location + "</li>";
		info += "<li>Punctuation: " + signInfo.punctuation + "</li>";
		info += "</ul>";
		document.querySelector("#signInfo .outputArea").innerHTML = info;

		document.querySelector("#signDesc .outputArea").textContent = ext.ttf.fsw.describeSign(parsed);

		document.querySelector("#signSequence .renderArea").innerHTML = "";
		if (parsed.sequence) {
			parsed.sequence.forEach((symbol) => document.querySelector("#signSequence .renderArea").innerHTML += renderSymbol(symbol));
		}

		let newSign = ext.ttf.fsw.fswSignFlipX(parsed);
		document.querySelector("#signMirror .renderArea").innerHTML = renderSign(core.fsw.compose.sign(newSign));
		document.querySelector("#signMirror .outputArea").innerText = core.fsw.compose.sign(newSign);

		newSign = ext.ttf.fsw.fswSignFlipXZ(parsed);
		document.querySelector("#signPerspective .renderArea").innerHTML = renderSign(core.fsw.compose.sign(newSign));
		document.querySelector("#signPerspective .outputArea").innerText = core.fsw.compose.sign(newSign);
	}
}

function modifySign(event) {
	event.preventDefault();
	let fswSign = document.querySelector("#signFsw").value;
	if (event.target.value == "flipX") fswSign = ext.ttf.fsw.fswSignFlipX(fswSign);
	if (event.target.value == "flipZ") fswSign = ext.ttf.fsw.fswSignFlipZ(fswSign);
	if (event.target.value == "flipXZ") fswSign = ext.ttf.fsw.fswSignFlipXZ(fswSign);
	if (event.target.value == "sequence") fswSign = ext.ttf.fsw.generateTemporalIdx(fswSign) + fswSign;
	document.querySelector("#signFsw").value = fswSign;
	document.querySelector("#signFsw").dispatchEvent(new Event("change"));
}

/* function showMirrors() {
	const mirrorArea = document.querySelector("#mirrorArea");
	Object.values(window.alphabet).forEach((group) => {
		group.forEach((sym) => {
			sym = sym.slice(0, 4) + "01";
			let fswSec = document.createElement("div");
			let origSec = document.createElement("div");
			let mirrorSec = document.createElement("div");
			let handSec = document.createElement("div");

			fswSec.textContent = sym;
			origSec.innerHTML = ttf.fsw.symbolSvg(sym);
			mirrorSec.innerHTML = ttf.fsw.symbolSvg(ext.ttf.fsw.symbolMirror(sym));
			handSec.innerHTML = ttf.fsw.symbolSvg(ext.ttf.fsw.symbolSwapHands(sym));

			mirrorArea.append(fswSec, origSec, mirrorSec, handSec);
		});
	});
} */