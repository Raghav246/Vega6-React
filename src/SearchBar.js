import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ fetchImages,images,selectedImage,setSelectedImage }) {
  const [query, setQuery] = useState('');
 const navigate=useNavigate();
  

  const handleSearch = (event) => {
    event.preventDefault();
    if (query) {
      fetchImages(query);
    }
  };

  const captionclickHandler=(image)=>{
    setSelectedImage(image)
    navigate('/add-caption')
  }
  return (
    <>
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images..." className='search-input'
        />
        <button type="submit" style={{marginLeft:'12px'}}>Search</button>
      </form>
    </div>
    <div className="image-gallery">
        {images.map((image) => (
          <div key={image.id} className="image-item" onClick={() => setSelectedImage(image)}>
            <img src={image.urls.small} alt={image.alt_description} />
            <button onClick={()=>captionclickHandler(image)}>Add Captions</button>
          </div>
        ))}
      </div>
      </>
  );
}
