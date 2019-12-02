import React, { useState, useEffect } from 'react';
//import CountrySelect from './CountrySelect'
import BigImage from './BigImage'
import './App.css';

const APi_key = process.env.REACT_APP_API_KEY;

function App() {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [BigImageSrc, setSrc] = useState({});
  const [itemLimit, setLimit] = useState(12);
  const [offset, setOffsetQuery] = useState(12);
  const [url, setUrl] = useState(
    `https://api.giphy.com/v1/gifs/trending?api_key=${APi_key}&limit=${itemLimit}&rating=R`,
  );

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    
    const result = await fetch(url);
    result
      .json()
      .then(result => setData(result.data))
      .then(() => setIsLoading(false));    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput)
    
  }

  const handleInputChange = (e) => {
    e.persist();
    setSearchInput(e.target.value);
    setOffsetQuery(12)
    setUrl(`https://api.giphy.com/v1/gifs/search?api_key=${APi_key}&q=${searchInput}&limit=${itemLimit}&offset=${offset}`)
    setTimeout(() => setSearch(searchInput), 500)
  }

  const handleOnMouseEnter = (e) => {
    let imageOptions = {
      src: e.target.dataset.big_image_link,
      position:{
        positionX: Number(e.target.getBoundingClientRect().x.toFixed()),
        positionY: Number(e.target.getBoundingClientRect().y.toFixed()),
      }

    }
    setSrc(imageOptions)

  }

  const handleOnMouseLeave = () => {
    setSrc('');
  }

  const  handleScroll = () => {
    if (Math.ceil(window.innerHeight) + Math.ceil(document.querySelector('html').scrollTop) !== document.querySelector('html').offsetHeight) return;
    setIsLoading(true)
  }

  useEffect(() => {
    if (!isLoading) return;
 
    fetchMoreListItems();
  }, [isLoading]);


  const fetchMoreListItems = async () => {
    
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${APi_key}&q=${searchInput}&limit=${itemLimit}&offset=${offset}`
    const result = await fetch(url);
    result
      .json()
      .then(result => setData(data.concat(result.data)))
      .then(() => setIsLoading(false))
      .then(()=> setOffsetQuery(offset + 12) )
  };


  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
       <BigImage src={BigImageSrc} />
       
      <form onSubmit={handleSubmit} className="form">
        <input type="text" placeholder="Search hear" className="form__input" value={searchInput} onChange={handleInputChange}/>
        <button className="form__button">Search</button>
      </form>
      {console.log(data)}
      {data.length === 0 ? 
      (<div><img src="https://thumbs.gfycat.com/GenuineIllinformedEmu-size_restricted.gif" alt=""/></div>) : 
      (   <ul className="items-list">
          {data.map(item =>
            <li key={item.id} >
              <img src={item.images.preview_gif.url} alt={item.title} data-big_image_link={item.images.original.url} onMouseOver={handleOnMouseEnter} onMouseOut={handleOnMouseLeave}/>
              <button onClick={() => {navigator.clipboard.writeText(item.images.downsized.url)}}>Copy URL</button>
            </li>)}
          </ul>
      )} 
    </div>
  );
}

export default App;
