/**
 * FSW
 * @module ext/ttf/fsw
 */

import { describeSign } from "./fsw-sign-description.js";
import { fswSignFlipX, fswSignFlipZ, fswSignFlipXZ } from "./fsw-sign-flip.js";
import { generateTemporalIdx } from "./fsw-sign-generate-sequence.js";
import { describeSymbol } from "./fsw-symbol-description.js";
import { symbolSwapHands, symbolSwapPerspective, symbolSwapSides, symbolMirror } from "./fsw-symbol-swap.js";

export { describeSign, fswSignFlipX, fswSignFlipXZ, fswSignFlipZ, generateTemporalIdx, describeSymbol, symbolSwapHands as symbolSwapHands, symbolSwapPerspective as symbolSwapPerspective, symbolSwapSides as symbolSwapSides, symbolMirror };
