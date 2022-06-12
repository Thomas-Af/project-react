import { useState, useEffect } from "react";
import GameList from './GameList';
import Filters from './Filters';
import popUpGame from './PopUpGame';

import fetchData from '../utils/fetchData';

export function Homepage() {
 const [data, setData] = useState([]);
 const [favorite, setFavorite] = useState([]);
 const [genre, setGenre] = useState();
//  let [removeOrLike, setRemoveOrLike] = useState('like');



 useEffect(() => {
  fetchData('games')
  .then(response => {
   document.getElementById('loader').style.display = 'none';
   setData(response.results);
   console.log('setData', data)
  });
 }, []);

 useEffect(() => {
   const s = localStorage.getItem('favs')
   let favoriteLocal = s === undefined ? [] : JSON.parse(s)
   
   if (favoriteLocal) {
      setFavorite(favoriteLocal)
   } 
  }, []);




   function AddRemoveFavorite(data) {

      const newFavorite = {...data}
      const s = localStorage.getItem('favs')

      if (favorite.find(element => element.id === newFavorite.id)) {
         setFavorite(prevFavorite => {
            let newFavs = s === undefined ? [] : JSON.parse(s)

            newFavs = prevFavorite.filter(item=>item.id !== newFavorite.id )

           localStorage.setItem('favs', JSON.stringify(newFavs))

           
           return newFavs
         })
      } else {
         setFavorite(prevFavorite => {
            let newFavs = s === undefined ? [] : JSON.parse(s)
            
            newFavs = [...prevFavorite, newFavorite]
            localStorage.setItem('favs', JSON.stringify(newFavs))
            
            return newFavs
         })
      }
   }
   
   const filteredGames = genre ? data.filter(games => games.genres.find(t => t.name === genre))
   : data;

   function filter(name) {
      setGenre(prevGenre => (prevGenre === name ? null : name))
    }
 
 return (
  <>
  <div class="loader" id="loader"></div>
  <Filters data={data} filter={filter} />
   <GameList data={filteredGames} like={AddRemoveFavorite} remove={AddRemoveFavorite} removeOrLike={'like'}/>    
  </>
   )
}

