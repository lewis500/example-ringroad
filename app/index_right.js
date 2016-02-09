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

const PPP =`
M52.2-157.9L52.2-157.9c10,22.8,33.7,36.4,58.4,33.7l0,0
	c49.3-5.4,81.5,50.4,52.2,90.5l0,0c-14.7,20.1-14.7,47.4,0,67.4l0,0c29.3,40-2.9,95.8-52.2,90.5l0,0c-24.7-2.7-48.4,10.9-58.4,33.7
	l0,0c-20,45.4-84.4,45.4-104.4,0l0,0c-10-22.8-33.7-36.4-58.4-33.7l0,0c-49.3,5.4-81.5-50.4-52.2-90.5l0,0
	c14.7-20.1,14.7-47.4,0-67.4l0,0c-29.3-40,2.9-95.8,52.2-90.5l0,0c24.7,2.7,48.4-10.9,58.4-33.7l0,0
	C-32.2-203.3,32.2-203.3,52.2-157.9z
`

const Road = React.createClass({
	radius: 200,
	padding: 10,
	getInitialState() {
		return {
			mounted: false,
		};
	},
	makeCar(car) {
		if (!this.state.mounted) return null;
		let percent = car.x / 360;
		let p = this.refs.road.getPointAtLength(this.state.road_length * percent),
			p1 = this.refs.road.getPointAtLength(this.state.road_length * (percent + 0.002)),
			angle = 180 / Math.PI * Math.atan2(p.y - p1.y, p.x - p1.x);
		return (
			<rect className='car' 
				key={car.id} 
				fill={car.fill} 
				transform={`translate(${p.x},${p.y}) rotate(${angle})`}
			/>
		);
	},
	componentDidMount() {
		this.setState({
			mounted: true,
			road_length: this.refs.road.getTotalLength()
		});
	},
	render() {
		let {
			radius, props, height, width, makeCar, padding
		} = this;
		return (
			<svg width={2*(radius+padding)} height={2*(radius+padding)}>
				<g transform={`translate(${radius+padding},${radius+padding})`}>
					{
						<path className='myRoad'  ref='road' d={PPP}/>
						// <circle r={radius} className='road'  ref='road'/>
					}
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
