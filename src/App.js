import React, { Component } from 'react';
import BigImage from './BigImage'
import PopularTerms from './PopularTerms'
import './App.css';


const APi_key = process.env.REACT_APP_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      data: [],
      inputValue: '',
      url: `https://api.giphy.com/v1/gifs/trending?api_key=${APi_key}&limit=12&rating=R&offset=0`,
      offset: 12,
      BigImageSrc: {},
      timeout: null,
    };

    window.onscroll = () => {
      if ((Math.ceil(window.innerHeight) + Math.ceil(document.documentElement.scrollTop) + 20) > document.documentElement.offsetHeight) {

        if (this.state.inputValue !== '') {

          let checkUrl = `https://api.giphy.com/v1/gifs/search?api_key=${APi_key}&q=${this.state.inputValue}&limit=12&offset=${this.state.offset}`

          fetch(checkUrl)
            .then(response => response.json())
            .then(result => this.setState({
              data: [...this.state.data, ...result.data],
              isLoading: false,
              offset: this.state.offset + 12
            }))
            .then(
              this.setState(function(prevState, props){
                return {offset: prevState.offset + 12}
             })
            );

        } else {

          fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${APi_key}&limit=12&rating=R&offset=${this.state.offset}`)
            .then(response => response.json())
            .then(result => this.setState({
              data: [...this.state.data, ...result.data],
              isLoading: false,
            }))
            .then(
              this.setState(function(prevState, props){
                return {offset: prevState.offset + 12}
             })
            );


        }

      }
    };

  }

componentDidMount() {
  this.fetchData();
}

fetchData = () => {
  this.setState({ isLoading: true });

  fetch(this.state.url)
    .then(response => response.json())
    .then(result => this.setState({ data: result.data, isLoading: false }));
}

handleInputChange = (e) => {
  e.persist();
  this.setState(() => ({ inputValue: e.target.value, offset: 12, data: [], }));
  clearTimeout(this.timeout);
  this.timeout = setTimeout( () => this.fetchDataWordSearch(e.target.value), 400);
}

handlePopularTermSearch = (e) =>{
  let poplarTerm = e.target.value;
  this.setState(() => ({ inputValue: poplarTerm, offset: 12, data: [], }));
  this.fetchDataWordSearch(poplarTerm)
}

fetchDataWordSearch = (word) => {

  this.setState({ isLoading: true });

  let wordSearchUrl = '';

  if(word.length === 0){
    wordSearchUrl = `https://api.giphy.com/v1/gifs/trending?api_key=${APi_key}&limit=12&rating=R`
  } else {
    wordSearchUrl = `https://api.giphy.com/v1/gifs/search?api_key=${APi_key}&q=${word}&limit=12&offset=0`
  }

  
  fetch(wordSearchUrl)
    .then(response => response.json())
    .then(result => this.setState({ data: result.data, isLoading: false }));
}

handleOnMouseEnter = (e) => {

    let imageOptions = {
      src: e.target.dataset.big_image_link,
      position:{
        positionX: Number(e.target.getBoundingClientRect().x.toFixed()),
        positionY: Number(e.target.getBoundingClientRect().y.toFixed()),
      }

    }
    
    this.setState({BigImageSrc: imageOptions})

  }

handleOnMouseLeave = () => {
  this.setState({BigImageSrc: {}})
  }

handleSubmit = (e) => {
    e.preventDefault();
    this.fetchDataWordSearch(this.state.inputValue);
  }


  render() {

    return (
      <div className="App">
        <BigImage src={this.state.BigImageSrc} />
        <form className="form" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Search hear" className="form__input" value={this.state.inputValue} onChange={this.handleInputChange} />
          <button className="form__button">Search</button>
        </form>
        <PopularTerms clickHandler={this.handlePopularTermSearch}/>
        {this.state.data.length === 0 ?
          (<div><img src="https://media2.giphy.com/media/26tPcVAWvlzRQtsLS/giphy.gif?cid=29caca7596d57f8dd17e2ba660c842dc2e72f42d04a4067f&rid=giphy.gif" alt="" /></div>) :
          (<ul className="items-list">
            {this.state.data.map((item, index) =>
              <li key={index} >
                <img src={item.images.preview_gif.url ? item.images.preview_gif.url : item.images.original.url} alt={item.title} data-big_image_link={item.images.original.url} onMouseOver={this.handleOnMouseEnter} onMouseOut={this.handleOnMouseLeave} />
                <div>
                <button onClick={() => { navigator.clipboard.writeText(item.images.downsized.url) }}>Copy Link</button>
                
                </div>
              </li>)}
          </ul>
          )}
      </div>
    );
  }
}

export default App;
