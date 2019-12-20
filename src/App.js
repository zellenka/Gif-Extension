import React, { useState, useEffect, Component } from 'react';
//import CountrySelect from './CountrySelect'
import BigImage from './BigImage'
import './App.css';


const APi_key = process.env.REACT_APP_API_KEY;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      data: [],
      inputValue: '',
      url: `https://api.giphy.com/v1/gifs/trending?api_key=${APi_key}&limit=12&rating=R`,
      offset: 12
    };

    window.onscroll = () => {
      if ((Math.ceil(window.innerHeight) + Math.ceil(document.documentElement.scrollTop)) === document.documentElement.offsetHeight) {
        if(this.state.inputValue !== ''){

          let checkUrl = `https://api.giphy.com/v1/gifs/search?api_key=${APi_key}&q=${this.state.inputValue}&limit=12&offset=${this.state.offset}`
          
          fetch(checkUrl)
          .then(response => response.json())
          .then(result => this.setState({
            data: [...this.state.data, ...result.data],
            isLoading: false,
            offset: this.state.offset + 12
          }));
          
        } else {

          fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${APi_key}&limit=12&rating=R&offset=${this.state.offset}`)
          .then(response => response.json())
          .then(result => this.setState({
            data: [...this.state.data, ...result.data],
            isLoading: false,
            offset: this.state.offset + 12
          }));
        }

      }
    };


  }

  componentWillMount() {
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
    this.fetchDataWordSearch(e.target.value);
  }

  fetchDataWordSearch = (word) => {

    this.setState({ isLoading: true });

    let wordSearchUrl = `https://api.giphy.com/v1/gifs/search?api_key=${APi_key}&q=${word}&limit=12&offset=0`
    
    fetch(wordSearchUrl)
      .then(response => response.json())
      .then(result => this.setState({ data: result.data, isLoading: false }));
  }


  render() {
    //console.log(this.state.inputValue)
    return (
      <div className="App">
        {/* <BigImage src={BigImageSrc} /> */}
        <form className="form">
          <input type="text" placeholder="Search hear" className="form__input" value={this.state.inputValue} onChange={this.handleInputChange} />
          <button className="form__button">Search</button>
        </form>
        {this.state.data.length === 0 ?
          (<div><img src="https://thumbs.gfycat.com/GenuineIllinformedEmu-size_restricted.gif" alt="" /></div>) :
          (<ul className="items-list">
            {this.state.data.map(item =>
              <li key={item.id} >
                <img src={item.images.preview_gif.url ? item.images.preview_gif.url : item.images.original.url} alt={item.title} data-big_image_link={item.images.original.url} />
                <button onClick={() => { navigator.clipboard.writeText(item.images.downsized.url) }}>Copy URL</button>
              </li>)}
          </ul>
          )}
      </div>
    );
  }
}

// function App() {

//   const [url, setUrl] = useState(
//     `https://api.giphy.com/v1/gifs/trending?api_key=${APi_key}&limit=${itemLimit}&rating=R`,
//   );





//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   setSearch(searchInput)
//   // }

//   useEffect(() => {
//     //if(searchInput === '') return
//     setOffsetQuery(offset + 12)
//     setUrl(`https://api.giphy.com/v1/gifs/search?api_key=${APi_key}&q=${searchInput}&limit=${itemLimit}&offset=${offset}`)
//     setTimeout(() => fetchData(), 500)
//   }, [searchInput]);

//   useEffect(() => {
//     //if(searchInput !== '') return
//     fetchData();
//   }, [url]);

//   const handleInputChange = (e) => {
//     e.persist();
//     setSearchInput(e.target.value);

//   }

//   const handleOnMouseEnter = (e) => {
//     let imageOptions = {
//       src: e.target.dataset.big_image_link,
//       position:{
//         positionX: Number(e.target.getBoundingClientRect().x.toFixed()),
//         positionY: Number(e.target.getBoundingClientRect().y.toFixed()),
//       }

//     }
//     setSrc(imageOptions)

//   }

//   const handleOnMouseLeave = () => {
//     setSrc('');
//   }

//   // const  handleScroll = () => {
//   //   if (Math.ceil(window.innerHeight) + Math.ceil(document.querySelector('html').scrollTop) !== document.querySelector('html').offsetHeight) return;
//   //   fetchMoreListItems()
//   // }

//   // useEffect(() => {
//   //   if (!isLoading) return;
//   //   fetchMoreListItems();
//   // }, [isLoading]);


//   // const fetchMoreListItems = async () => {

//   //   if(searchInput !== ''){
//   //     setUrl(`https://api.giphy.com/v1/gifs/search?api_key=${APi_key}&q=${searchInput}&limit=${itemLimit}&offset=${offset}`)
//   //   } else {
//   //     setUrl(`https://api.giphy.com/v1/gifs/trending?api_key=${APi_key}&limit=${itemLimit}&offset=${offset}&rating=R`);
//   //   }
//   //   console.log(url)
//   //   const result = await fetch(url);
//   //   result
//   //     .json()
//   //     .then(result => setData(data.concat(result.data)))
//   //     .then(()=> setOffsetQuery(offset + 12) );
//   // };


//   // useEffect(() => {
//   //   window.addEventListener('scroll', handleScroll);
//   //   return () => window.removeEventListener('scroll', handleScroll);
//   // }, []);

//   return (
//     <div className="App">
//        <BigImage src={BigImageSrc} />
//       <form className="form">
//         <input type="text" placeholder="Search hear" className="form__input" value={searchInput} onChange={handleInputChange}/>
//         <button className="form__button">Search</button>
//       </form>
//       {console.log(data)}
//       {data.length === 0 ? 
//       (<div><img src="https://thumbs.gfycat.com/GenuineIllinformedEmu-size_restricted.gif" alt=""/></div>) : 
//       ( <ul className="items-list">
//           {data.map(item =>
//             <li key={item.id} >
//               <img src={item.images.preview_gif.url} alt={item.title} data-big_image_link={item.images.original.url} onMouseOver={handleOnMouseEnter} onMouseOut={handleOnMouseLeave}/>
//               <button onClick={() => {navigator.clipboard.writeText(item.images.downsized.url)}}>Copy URL</button>
//             </li>)}
//         </ul>
//       )} 
//     </div>
//   );
// }

export default App;
