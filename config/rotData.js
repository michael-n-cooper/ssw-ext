/**
 * Sets of names for symbol rotations
 */
export const rotData = {
	"orientations": {
		"names": {
			"wall": ["Up", "Up Left", "Left", "Down Left", "Down", "Down Right", "Right", "Up Right"],
			"floor": ["Forward", "Forward Left", "Left", "Back Left", "Back", "Back Right", "Right", "Forward Right"],
			"diagonal": ["Up", "Up Left", "Down Left", "Down", "Down Right", "Up Right"]
		},
		"sequences": [
			[[0x231, 0x232], [0, 1, 2, 3, 4, 5, 6, 7, 4, 3, 2, 1, 0, 7, 6, 5]],
			[[0x100, 0x500], [0, 1, 2, 3, 4, 5, 6, 7, 0, 7, 6, 5, 4, 3, 2, 1]]
		],
		"patterns": [
			[[[0x100, 0x204], [0x22a, 0x230], [0x234, 0x235], [0x24b, 0x254], [0x265, 0x26b], [0x26f, 0x270], [0x281, 0x287]], [0]],
			[[[0x231, 0x232], [0x26c, 0x26d]], [4, 0]],
			[[[0x233, 0x233], [0x26e, 0x26e]], [2, 0]],
			[[[0x236, 0x237], [0x271, 0x272]], [0, 4, 0]],
			[[[0x238, 0x23a], [0x273, 0x273]], [1, 0]],
			[[[0x23b, 0x23d], [0x274, 0x276]], [2, 0]],
			[[0x23e, 0x23e], [6, 4]],
			[[[0x23f, 0x241], [0x277, 0x277]], [3, 0]],
			[[[0x242, 0x244], [0x278, 0x27a]], [4, 2, 0]],
			[[[0x245, 0x247], [0x27b, 0x27d]], [0, 3, 0]],
			[[0x248, 0x24a], [7, 1, 7, 1]],
			[[0x27e, 0x280], [5, 0, 5, 0]]
		]
	},
	"curves": {
		"names": {
			"wall": ["Up & Right", "Right Down Diagonal", "Right & Down", "Down Diagonal Left", "Down & Left", "Up Diagonal Left", "Left & Up", "Up Diagonal Left", "Up & Left", "Left Down Diagonal", "Left & Down", "Down Diagonal Right", "Down & Right", "Up Diagonal Right", "Right & Up", "Up Diagonal Right"]
		},
		"sequences": [],
		"patterns": []
	},
	"twists": {
		"names": {
			"over": ["Over Left", "Over Right"],
			"under": ["Under Left", "Under Right"]
		},
		"sequences": [
			[[[0x23e, 0x23e], [0x24b, 0x24c], [0x24e, 0x24f], [0x281, 0x282], [0x284, 0x285], [0x24d, 0x24d], [0x250, 0x250], [0x283, 0x283], [0x286, 0x286], [0x2a2, 0x2a5]], [0, 1]]
		],
		"patterns": [
			[[[0x23e, 0x23e], [0x24b, 0x24c], [0x24e, 0x24f], [0x281, 0x282], [0x284, 0x285], [0x2a2, 0x2a3]], [0]],
			[[[0x24d, 0x24d], [0x250, 0x250], [0x283, 0x283], [0x286, 0x286], [0x2a4, 0x2a4]], [0, 1]],
		]
	},
	"circleTypes": {
		"names": {
			"wall": ["Anti-clockwise", "Clockwise"],
			"floor": ["Forward-Back", "Back-Forward"]
		},
		"sequences": [
			[[0x2e3, 0x2ec], [0, 1]]
		],
		"patterns": [
			[[0x2e3, 0x2ec], [0]]
		]
	},
	"circleStarts": {
		"names": {
			"wall": ["High", "High-Diagonal-Left", "Left Side", "Low-Diagonal-Left", "Low", "Low-Diagonal-Right", "Right Side", "High-Diagonal-Right"],
			"floor": ["Near", "Away"]
		},
		"sequences": [
			[[0x2e3, 0x2ec], [0, 1, 2, 3, 4, 5, 6, 7, 0, 7, 6, 5, 4, 3, 2, 1]]
		],
		"patterns": [
			[[0x2e3, 0x2ec], [0]]
		]
	},
	"circleDirections": {
		"names": {
			"wall": [],
			"floor": ["Parallel with Side Wall", "Left High Diagonal", "Parallel with Floor", "Left Low Diagonal", "Parallel with Side Wall", "Right Low Diagonal", "Parallel with Floor", "Right High Diagonal"]
		},
		"sequences": [
			[[0x2e3, 0x2ec], [0, 1, 2, 3, 4, 5, 6, 7, 0, 7, 6, 5, 4, 3, 2, 1]]
		],
		"patterns": [
			[[0x2e3, 0x2ec], [0]]
		]
	}
}
