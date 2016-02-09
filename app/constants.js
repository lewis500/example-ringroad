import col from 'material-colors/dist/colors.js';
export const COLORS = _.values(col).map(d => d['500']);
export const ROAD_LENGTH = 360;
export const NUM_CARS = 100;

export const CARS = _.range(NUM_CARS)
	.map(() => Math.random() * 360)
	.sort((a, b) => a - b)
	.map((x) => ({
		id: _.uniqueId(),
		x,
		v: 0,
		fill: _.sample(COLORS)
	}));
