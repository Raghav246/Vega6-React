import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import SearchBar from './SearchBar';
import Canvas from './Canvas';
import {BrowserRouter,Routes,Route} from "react-router-dom"


function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
 

  const fetchImages = async (query) => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: {
          query,
          client_id: 'rqPKEXXkN3rEtJtsuEnOvJEQxGHVlWLek-JNvVejmMQ', // Replace with your Unsplash API key
        },
      });
      setImages(response.data.results);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  

  return (
    <div className="App">
    <div>
    <h1>Name:Raghav Chauhan</h1>
    <h1>Email:raghavchauhan235@gmail.com</h1>
    </div>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<SearchBar fetchImages={fetchImages} images={images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}/>
        <Route path="/add-caption" element={<Canvas image={selectedImage?.urls?.full} />}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
