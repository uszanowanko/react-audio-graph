import React from 'react';
import PropTypes from 'prop-types';
import "./styles.css"

const propTypes = {
	label: PropTypes.string,
	width: PropTypes.number,
	height: PropTypes.number,
	zoom: PropTypes.number,
	maxDuration: PropTypes.number,
	sampleThreeshold: PropTypes.number,
	buffer: PropTypes.object.isRequired,
	onChange: PropTypes.func,
	styles: PropTypes.object,
	color: PropTypes.string,
	startTime: PropTypes.number
}

const defaultProps = {
	styles: {
		label: {
			fontFamily: 'Comic Sans MS',
			color: 'green'
		},
		input: {
			background: '#ddd',
			border: '1px solid red'
		}
	},
	height: 400,
	width:1500,
	maxDuration: 10,
	sampleThreeshold: 5,
	zoom: 1,
	color: "black",
	startTime: 0,
}

class MyComponent extends React.Component {
	componentDidMount() {
		this.samples = this._prepareSamples();
		this._drawWaveformAlt();
	}
		
	componentDidUpdate(prevProps) {
		if(prevProps.maxDuration != this.props.maxDuration || prevProps.width != this.props.width || prevProps.buffer != this.props.buffer) {
			this.samples = this._prepareSamples();
		}
		this._drawWaveformAlt();
	}

	_drawWaveformAlt() {
		var middle = this.props.height / 2;
		var canvas = this.refs.canvas;
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = this.props.color;
		var sampleStep = Math.ceil(this.props.maxDuration * this.props.buffer.sampleRate / this.props.width);
		var samplePerSecond = Math.round(this.props.buffer.sampleRate / sampleStep)
		var timeThreeshold = this.props.startTime*samplePerSecond;
		for(var i = 0; i<this.samples.length; i+=1) {
			var sample = this.samples[i+timeThreeshold]
			ctx.fillRect(i, middle-sample*middle, 1, sample*this.props.height);
		}

	}

	_prepareSamples() {
		var sampleStep = Math.ceil(this.props.maxDuration * this.props.buffer.sampleRate / this.props.width);
		var sampleThreeshold = this.props.sampleThreeshold;
		var data = this.props.buffer.getChannelData(0);
		var samples = [];
		var currentIndex = 0;
		var channelDataLength = data.length;
		var sampleThreesholdStep = Math.ceil(sampleStep/(sampleThreeshold+2));
		do {
			samples.push(this._calculateAvgSample(data, currentIndex, sampleStep, sampleThreeshold, sampleThreesholdStep));
			currentIndex += sampleStep;
		} while(currentIndex < channelDataLength)
		return samples;
	}

	_calculateAvgSample(data, currentIndex, sampleStep, sampleThreeshold, sampleThreesholdStep) {
		var sum = 0;
		var sampleCount = 0;
		for(var i = -sampleThreeshold - 1; i <= sampleThreeshold + 1; i+=1) {
			var currentSample = data[currentIndex + i*sampleThreeshold];
			if (currentSample != undefined) {
				sum += currentSample;
				sampleCount += 1;
			}
		}
		return sum/sampleCount;
	}

	render() {
		const styles = this.props.styles || {};

		return (
			<div>
				<h1>Component demo</h1>
				{this.props.label && <label style={styles.label}>{this.props.label}</label>}
				<canvas
					ref="canvas"
					width={this.props.width * this.props.zoom}
					height={this.props.height} />
			</div>
		);
	}
}

MyComponent.propTypes = propTypes;
MyComponent.defaultProps = defaultProps;

export default MyComponent;