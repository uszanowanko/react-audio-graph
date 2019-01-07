import React from 'react';
import { render } from 'react-dom';
import MyComponent from '../../src';
import test from "./test.mp3"

const getAudioBuffer = (path, context) => {
	return fetch(path)
		.then((response) => {
			return response.arrayBuffer()
		}).then((audioData) => {
			return new Promise((resolve, reject) => {
				context.decodeAudioData(audioData, (buffer) => {
					return resolve(buffer);
				});
			});
		})
};
/**
 * Get window audio context
 */
const getContext = () => {

	window.AudioContext =
		window.AudioContext ||
		window.webkitAudioContext ||
		window.mozAudioContext ||
		window.oAudioContext;
	const context = new AudioContext();
	return context;
};

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			buffer: null,
			startTime: 0
		}
	}
	componentDidMount() {
		this.getFile();
	}
	getFile(path = test) {
		const context = getContext();
		getAudioBuffer(path, context).then((buffer) => this.setState({ buffer }))

	};
	onHandleButtonClick() {
		this.setState({
			startTime: this.state.startTime+1
		})
	}
	render() {
		return (
			<div>
				<button onClick={this.onHandleButtonClick.bind(this)}> Text </button>
				{this.state.buffer ? <MyComponent buffer={this.state.buffer} startTime={this.state.startTime}/> : "Loading example audio..."}
				{this.state.width}
			</div>
		)
	}

}
render(<App />, document.getElementById("root"));