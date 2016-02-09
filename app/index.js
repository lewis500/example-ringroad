import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import _ from 'lodash';
import './style/main.scss';
import {
	CARS
}
from './constants.js';
import {
	square, diff, calc_acc
}
from './utils.js';
const {
	rect
} = React.DOM;

const initialParams = {
	B_MAX: 3,
	A_MAX: 1,
	SPACE_MIN: .5,
	TIME_HEADWAY: .65,
	V_MAX: 30,
	GAMMA: 4,
	PARAMS: 200
};

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
	radius: 250,
	padding: 10,
	renderCars() {
		return _.map(this.props.cars, (car) => {
			return rect({
				className: 'car',
				fill: car.fill,
				key: car.id,
				transform: `rotate(${car.x}) translate(${this.radius},0)`
			});
		});
	},
	render() {
		let {
			radius, padding
		} = this;
		return (
			<svg width={2 * (radius + padding)} height={2 * (radius + padding)}>
				<g transform={`translate(${radius + padding},${radius + padding})`}>
					<circle className='road' r={radius} />
					{this.renderCars()}
				</g>
			</svg>
		);
	}
});

const App = React.createClass({
	name: 'app',
	getInitialState() {
		return {
			cars: CARS,
			paused: true,
			params: initialParams
		}
	},
	onClick() {
		let paused = !this.state.paused
		this.setState({
			paused
		});
		if (!paused) this.fire()
	},
	fire() {
		let last = 0;
		d3.timer((elapsed) => {
			if (this.state.paused) return true;
			let dt = elapsed - last,
				params = this.state.params,
				cars = reduceCars(this.state.cars, dt/100, params);
			last = elapsed;
			this.setState({
				cars
			});
		})
	},
	render() {
		return (
			<div>
      	<Road cars={this.state.cars}/>
      	<br/>
      	<br/>
      	<button 
      		onClick={this.onClick}
      	>{this.state.paused ? 'play' : 'pause'}</button>
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('root'));
