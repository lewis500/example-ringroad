import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import _ from 'lodash';
import './style/main.scss';
import {
	NUM_CARS, COLORS
}
from './constants.js';
import {
	square, diff, calc_acc
}
from './utils.js';
const {
	pow, sqrt, min, max
} = Math;

const CARS = _.range(NUM_CARS)
	.map(() => Math.random() * 360)
	.sort((a, b) => a - b)
	.map((x) => ({
		id: _.uniqueId(),
		x,
		v: 0,
		fill: _.sample(COLORS)
	}));

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

const Road = React.createClass({
	radius: 200,
	padding: 10,
	makeCar(car) {
		return (<rect className='car' key={car.id} fill={car.fill} transform={`rotate(${car.x}) translate(${this.radius},0)`} />);
	},
	render() {
		let {
			radius, props, height, width, makeCar, padding
		} = this;
		return (
			<svg width={2*(radius+padding)} height={2*(radius+padding)}>
				<g transform={`translate(${radius+padding},${radius+padding})`}>
				<path fill="none" stroke="#000000" stroke-miterlimit="10" d="M10.3-31.1L10.3-31.1c2,4.5,6.6,7.2,11.5,6.6l0,0	c9.7-1.1,16,9.9,10.3,17.8l0,0c-2.9,3.9-2.9,9.3,0,13.3l0,0c5.8,7.9-0.6,18.8-10.3,17.8l0,0c-4.9-0.5-9.5,2.2-11.5,6.6l0,0	C6.3,40-6.3,40-10.3,31.1l0,0c-2-4.5-6.6-7.2-11.5-6.6l0,0c-9.7,1.1-16-9.9-10.3-17.8l0,0c2.9-3.9,2.9-9.3,0-13.3l0,0	c-5.8-7.9,0.6-18.8,10.3-17.8l0,0c4.9,0.5,9.5-2.2,11.5-6.6l0,0C-6.3-40,6.3-40,10.3-31.1z"/>
					<circle className='road' r={radius}/>
					<g className='g-cars'>
						{
							_.map(props.cars, makeCar)
						}
					</g>
				</g>
			</svg>
		);
	}
});


const Slider = React.createClass({
	onChange(e) {
			this.props.onChange(+e.target.value, this.props.name)
		},
		render() {
			return (<input type='range' step={this.props.step} onChange={this.onChange} value={this.props.value} max={this.props.max} />);
		}
});

const initialParams = {
	B_MAX: 3,
	A_MAX: 1,
	SPACE_MIN: .5,
	TIME_HEADWAY: .65,
	V_MAX: 30,
	GAMMA: 4
};

const App = React.createClass({
	getInitialState() {
			return {
				cars: CARS,
				paused: true,
				last: 0,
				params: initialParams
			}
		},
		onClick() {
			let paused;
			this.setState({
				paused: (paused = !this.state.paused),
				last: 0
			});
			if (!paused) this.startTimer();
		},
		startTimer() {
			d3.timer((elapsed) => {
				let dt = elapsed - this.state.last;
				if (this.state.paused) return true;
				this.setState({
					cars: reduceCars(this.state.cars, dt / 200, this.state.params),
					last: elapsed
				});
			});
		},
		changeParam(value, name) {
			this.setState({
				params: {
					...this.state.params, [name]: value
				}
			});
		},
		render() {
			return (
				<div>
					<Slider onChange={this.changeParam} name='GAMMA' max={5} step={.1}/>
					<button onClick={this.onClick}>{this.state.paused ? 'play': 'pause'}</button>
					<br/>

					<Road cars={this.state.cars}/>
				</div>
			);
		}
});


ReactDOM.render(<App />, document.getElementById('root'));
