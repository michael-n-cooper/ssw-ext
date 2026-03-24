/**
 * FSW
 * @module ext/ttf/fsw
 */

import { signDescribe } from "./fsw-sign-description.js";
import { signFlipX, signFlipZ, signFlipXZ } from "./fsw-sign-flip.js";
import { signGenerateTemporalIdx } from "./fsw-sign-generate-sequence.js";
import { symbolDescribe } from "./fsw-symbol-description.js";
import { symbolSwapHands, symbolSwapPerspective, symbolSwapSides, symbolMirror } from "./fsw-symbol-swap.js";
import { isLeftHand, isRightHand, isBothHand, isFloorPlane, isWallPlane, isDiagonalAway, isDiagonalTowards, isDiagonalPlane, getHandOrientation } from "./fsw-symbol-variant.js";

export { signDescribe as describeSign, signFlipX, signFlipXZ, signFlipZ, signGenerateTemporalIdx as generateTemporalIdx, symbolDescribe as describeSymbol, symbolSwapHands, symbolSwapPerspective, symbolSwapSides, symbolMirror, isLeftHand, isRightHand, isBothHand, isFloorPlane, isWallPlane, isDiagonalAway, isDiagonalTowards, isDiagonalPlane, getHandOrientation };
