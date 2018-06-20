import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import blue from './react.blue.svg';
import red from './react.red.svg';
import green from './react.green.svg';
import yellow from './react.yellow.svg';
import './App.css';

let defaultState = {
  reactImages: [
    { id: 0, name: 'blue', src: blue, class: '', disabled: true },
    { id: 1, name: 'red', src: red, class: '', disabled: true },
    { id: 2, name: 'green', src: green, class: '', disabled: true },
    { id: 3, name: 'yellow', src: yellow, class: '', disabled: true },
  ],
  turn: 0,
  attempt: 0,
  history: [],
  started: false
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.start = this.start.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  setImages(images) {
    this.setState(() => ({reactImages: images}));
  };

  restart() {
    this.setState({
      reactImages: [
        { id: 0, name: 'blue', src: blue, class: '', disable: true },
        { id: 1, name: 'red', src: red, class: '', disable: true },
        { id: 2, name: 'green', src: green, class: '', disable: true },
        { id: 3, name: 'yellow', src: yellow, class: '', disable: true },
      ],
      turn: 0,
      attempt: 0,
      isAttempt: false,
      history: [],
      started: false
    });
  }

  async handleClick(e) {
    if (this.state.isAttempt) {
      e.preventDefault();

      let id = parseInt(e.target.id, 10);
      let turn = this.state.turn;
      let attempt = this.state.attempt;
      let history = this.state.history;
      let image = this.state.reactImages[history[attempt]];

      await this.blink(image.id);

      if (attempt === turn && image.id === id) {
        this.setState(prevState => ({
          turn: prevState.turn + 1,
          isAttempt: !prevState.isAttempt,
          attempt: 0
        }));

        this.play();

      } else if (image.id === id) {
        this.setState(prevState => ({
          attempt: prevState.attempt + 1
        }));
      } else {
        this.restart();
      }
    }
  }

  async delay() {
    return new Promise(r => setTimeout(r, 800));
  }

  async blink(turn) {
    let images = this.state.reactImages;
    images.map(image => image.id === turn ? image.class = 'App-chosen' : image.class = '');

    this.setImages(images);

    await this.delay();

    images.map(image => image.class = '');

    this.setImages(images);

    await this.delay();
  }

  async showHistory() {
    let history = this.state.history;
    for (let t = 0; t < history.length; t++) {
      await this.blink(history[t]);
    }
  }

  async play() {
    await this.showHistory();

    let random = Math.floor(Math.random() * (100 - 1)) + 1;

    let newNumber = Math.floor(random / 25);

    let history = this.state.history;

    history.push(newNumber);

    this.blink(newNumber);

    this.setState(prevState => ({
      history: history,
      isAttempt: !prevState.isAttempt
    }));
  }

  async start(e) {
    e.preventDefault();

    this.play();

    this.setState(prevState => ({
      started: !prevState.started
      }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {
            this.state.reactImages.map(image =>
              <img key={image.id}
                className={`App-logo ${image.class}`}
                src={image.src}
                id={image.id}
                alt={image.name}
                onClick={this.handleClick}/>
            )
          }

          <h1 className="App-title">Can you remember the sequence?</h1>
        </header>

        <hr />

        <p className="App-intro">
          To get started, click on the button bellow
        </p>
        <p>
          <button
            className="btn btn-primary"
            disabled={this.state.started}
            onClick={this.start}>
              Get Started
          </button>
        </p>
      </div>
    );
  }
}

export default App;
