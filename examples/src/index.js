import React from 'react';
import { render } from 'react-dom';
import AudioGraph from '../../src';
import testFile from "./test.mp3"

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
	getFile(path = testFile) {
		const context = getContext();
		getAudioBuffer(path, context).then((buffer) => this.setState({ buffer }))

	};
	render() {
		return (
			<div>
				<h1>react-audio-graph component demo</h1>
				{this.state.buffer ? <AudioGraph buffer={this.state.buffer} /> : "Loading example audio..."}
			</div>
		)
	}

}
render(<App />, document.getElementById("root"));