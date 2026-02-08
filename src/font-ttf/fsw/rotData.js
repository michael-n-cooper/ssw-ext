import labels from "../../../config/descMessages.json" with { type: "json" };

/**
 * Sets of names for symbol rotations
 * @memberof ext/ttf/fsw
 * @private
 */
export const rotData = {
	"orientations": {
		"names": {
			"wall": [labels.orientation.wall.N, labels.orientation.wall.NW, labels.orientation.wall.W, labels.orientation.wall.SW, labels.orientation.wall.S, labels.orientation.wall.SE, labels.orientation.wall.E, labels.orientation.wall.NE],
			"floor": [labels.orientation.floor.N, labels.orientation.floor.NW, labels.orientation.floor.W, labels.orientation.floor.SW, labels.orientation.floor.S, labels.orientation.floor.SE, labels.orientation.floor.E, labels.orientation.floor.NE]
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
			"wall": [labels.curves.wall.anti.N, labels.curves.wall.anti.NW, labels.curves.wall.anti.W, labels.curves.wall.anti.SW, labels.curves.wall.anti.S, labels.curves.wall.anti.SE, labels.curves.wall.anti.E, labels.curves.wall.anti.NE, labels.curves.wall.clock.N, labels.curves.wall.clock.NE, labels.curves.wall.clock.E, labels.curves.wall.clock.SE, labels.curves.wall.clock.S, labels.curves.wall.clock.SW, labels.curves.wall.clock.W, labels.curves.wall.clock.NW]
		},
		"sequences": [],
		"patterns": []
	},
	"twists": {
		"names": {
			"over": [labels.twists.over.left, labels.twists.over.right],
			"under": [labels.twists.under.left, labels.twists.under.right]
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
			"wall": [labels.circles.types.wall.clock, labels.circles.types.wall.anti],
			"floor": [labels.circles.types.floor.clock, labels.circles.types.floor.anti]
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
			"wall": [labels.circles.starts.wall.N, labels.circles.starts.wall.NW, labels.circles.starts.wall.W, labels.circles.starts.wall.SW, labels.circles.starts.wall.S, labels.circles.starts.wall.SE, labels.circles.starts.wall.E, labels.circles.starts.wall.NE],
			"floor": [labels.circles.starts.floor.S, labels.circles.starts.floor.N]
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
			"floor": [labels.circles.directions.wall.N, labels.circles.directions.wall.NW, labels.circles.directions.wall.W, labels.circles.directions.wall.SW, labels.circles.directions.wall.S, labels.circles.directions.wall.SE, labels.circles.directions.wall.E, labels.circles.directions.wall.NE]
		},
		"sequences": [
			[[0x2e3, 0x2ec], [0, 1, 2, 3, 4, 5, 6, 7, 0, 7, 6, 5, 4, 3, 2, 1]]
		],
		"patterns": [
			[[0x2e3, 0x2ec], [0]]
		]
	}
}
