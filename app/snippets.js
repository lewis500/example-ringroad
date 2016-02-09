
renderCars() {
	return _.map(this.props.cars, (car) => {
		return rect({
			className: 'car',
			fill: car.fill,
			key: car.id,
			transform: `rotate(${car.x}) translate(${radius},0)`
		});
	});
},

const PPP = `
M52.2-157.9L52.2-157.9c10,22.8,33.7,36.4,58.4,33.7l0,0
	c49.3-5.4,81.5,50.4,52.2,90.5l0,0c-14.7,20.1-14.7,47.4,0,67.4l0,0c29.3,40-2.9,95.8-52.2,90.5l0,0c-24.7-2.7-48.4,10.9-58.4,33.7
	l0,0c-20,45.4-84.4,45.4-104.4,0l0,0c-10-22.8-33.7-36.4-58.4-33.7l0,0c-49.3,5.4-81.5-50.4-52.2-90.5l0,0
	c14.7-20.1,14.7-47.4,0-67.4l0,0c-29.3-40,2.9-95.8,52.2-90.5l0,0c24.7,2.7,48.4-10.9,58.4-33.7l0,0
	C-32.2-203.3,32.2-203.3,52.2-157.9z
`

const reduceCars = (cars, dt, params) => {
	return _.map(cars, (car, i) => {
			let next = cars[(i + 1) % cars.length],
				a = calc_acc(car, next, params),
				v = Math.max(car.v + a * dt, 0),
				x = (car.x + v * dt) % 360;

			return {
				...car,
				x,
				v
			};
		})
		.sort((a, b) => (a.x - b.x));
};
