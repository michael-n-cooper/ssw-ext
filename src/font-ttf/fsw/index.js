/**
 * FSW
 * @module ext/ttf/fsw
 */

import { describeSign } from "./fsw-sign-description.js";
import { fswSignFlipX, fswSignFlipZ, fswSignFlipXZ } from "./fsw-sign-flip.js";
import { generateTemporalIdx } from "./fsw-sign-generate-sequence.js";
import { describeSymbol } from "./fsw-symbol-description.js";
import { symbolSwapHands, symbolSwapPerspective, symbolSwapSides, symbolMirror } from "./fsw-symbol-swap.js";
import { isLeftHand, isRightHand, isBothHand, isFloorPlane, isWallPlane, isDiagonalAway, isDiagonalTowards, isDiagonalPlane } from "./fsw-symbol-variant.js";

export { describeSign, fswSignFlipX, fswSignFlipXZ, fswSignFlipZ, generateTemporalIdx, describeSymbol, symbolSwapHands, symbolSwapPerspective, symbolSwapSides, symbolMirror, isLeftHand, isRightHand, isBothHand, isFloorPlane, isWallPlane, isDiagonalAway, isDiagonalTowards, isDiagonalPlane };
