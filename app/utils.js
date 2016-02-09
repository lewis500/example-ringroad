const {
	pow, sqrt, min
} = Math;
export const square = v => pow(v, 2);
export const diff = (a, b) => {
	let δ = b - a;
	return δ < 0 ? δ + 360 : δ;
};

export const calc_acc = (car, next, params) => {
	let sstar = params.SPACE_MIN +
		car.v * params.TIME_HEADWAY +
		car.v * (car.v - next.v) / (2 * sqrt(params.A_MAX * params.B_MAX));
	let a = params.A_MAX *
		(1 -
			pow(car.v / params.V_MAX, params.GAMMA) -
			square(sstar / (diff(car.x, next.x) - params.SPACE_MIN)));
	return a;
};

