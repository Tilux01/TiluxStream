let topDataArray = []
let playlistArray = []
let libraryArray = []
const api = async () => {


const main = document.querySelector("main")
let navigatorCount = 0
let navMax = 0


try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa('95428a3211534b27878fc8893c0e3232:9338f7297c544f5a8fd91c9fda4fc952')
      },
      body: 'grant_type=client_credentials'
    });
    
    if (!tokenResponse.ok) throw new Error('Token request failed');
    const tokenData = await tokenResponse.json();
    console.log("Token:", tokenData);

    

    // Search for tracks

    const searchSongBtn = document.getElementById("searchSong")
    window.search = async()=>{
      try {
        const searchForSong = document.getElementById("searchForSong").value
        const searchTracks = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchForSong)}&type=track`, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}` 
          }
        });
        const tracksData = await searchTracks.json();
        const result = tracksData.tracks.items
        console.log(result);
        const searchResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(result[0].artists[0].name)}&type=artist`,{
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
          }
        );
        const artistData = await searchResponse.json();
        const artistResult = artistData.artists.items
        console.log(artistResult);
        document.querySelector(".searchResultParent").style.display = "initial"
        const topResult = document.getElementById("topResult")
        const otherSongs = document.getElementById("searchSongs")
        const allResult = document.getElementById("allResult")
        const relatedArtist =document.getElementById("relatedArtist")
        topResult.innerHTML =  `
            <h2>Top Result</h2>
            <div class="topBox">
                <img src="${result[0].album.images[0].url}" alt="">
                <h1>${result[0].name}</h1>
                <p onclick="showArtist('${result[0].artists[0].id}')"><small>song</small class="artistName"> . ${result[0].artists[0].name}</p>
                <div><img src="images/play-buttton.png" alt=""></div>
            </div>
        `
        otherSongs.innerHTML = ""
        for (let index = 0; index < 4; index++) {
          otherSongs.innerHTML += `
          <div class="songT">
              <img src="${result[index].album.images[0].url}" alt="">
              <div>
                  <h2>${result[index].name}</h2>
                  <small class="artistName" onclick="showArtist('${result[index].artists[0].id}')">${result[index].artists[0].name}</small>
                  <div class="option">
                      <div></div>
                      <div></div>
                      <div></div>
                  </div>
                  <select name="" id="tt" class="ff" onclick="option(value,'${result[index].album.images[0].url}','${result[index].name}','${result[index].artists[0].id}','${result[index].artists[0].name}')">
                      <option value="playlist">Add to Playlist</option>
                      <option value="library" >Add to Library</option>
                  </select>
              </div>
          </div>
          ` 
          console.log(index);
          
          allResult.innerHTML = ""
          for (let index = 0; index < result.length; index++) {
            allResult.innerHTML +=  `
            <div>
                <img src="${result[index].album.images[0].url}" alt="">
                <h4>${result[index].name}</h4>
                <p class="artistName" onclick="showArtist('${result[index].artists[0].id}')">${result[index].artists[0].name}</p>
            </div>
            `
          }
          relatedArtist.innerHTML = ""

          artistResult.map((output,index)=>{
            try {
              relatedArtist.innerHTML += `
              <div onclick="showArtist('${output.id}')">
                  <img src="${output.images[0].url}" alt="">
                  <h4 class="artistName">${output.name}</h4>
              </div>
              `
            } catch (error) {
              if(error == "ndn"){
                output.images[0].url = ""
                return
              }
            }
          })

          // for (let index = 0; index < artistResult.length; index++) {
          //   relatedArtist.innerHTML += `
          //   <div>
          //       <img src="${artistResult[index].images[0].url}" alt="">
          //       <h4>${artistResult[index].name}</h4>
          //   </div>
          //   `
            
          // }
        }
        navigatorCount++
        navMax++
        sessionStorage.setItem(JSON.stringify(navigatorCount),main.innerHTML)
      } catch (error) {
        console.log(error);
        return []
      }
    }

    window.showArtist = async(params) => {
      const artistId = await fetch(`https://api.spotify.com/v1/artists/${params}/albums?include_groups=album,single&limit=50`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      const artistResult = await artistId.json();
      artistSongs = artistResult.items
      console.log(artistSongs);

      const detail = await fetch(`https://api.spotify.com/v1/artists/${params}`,{ 
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}` } }
      );
      const artistDetail = await detail.json()
      console.log(artistDetail);
      

      const followersCount = artistDetail.followers.total
      let convert = JSON.stringify(followersCount)
      let t;
      if(convert.length = 8){
        t = convert[0] +"."+ convert[1]+'m'
      }
      else if(convert.length = 7){
        t = convert[0]+'million'
      }
      else if(convert.length = 6){
        t = convert[0]+convert[1]+convert[2]+'K'
      }
      else if(convert.length = 5){
        t = convert[0]+convert[1]+'K'
      }
      else if(convert.length = 4){
        t = convert[0]+'K'
      }
      else{
        t =convert
      }
      console.log(t);
      
      document.querySelector("main").innerHTML = `
      <div class="artistHeader">
            <div class="playButton">
                <img src="images/play-buttton.png" alt="" >
            </div>
            <h2>${artistDetail.name}</h2>
            <div class="Artistarrow">
                <img src="images/down-arrow-white.png" alt="" onclick="back()">
                <img src="images/down-arrow-white.png" alt="" onclick="forward">
            </div>
        </div>
        <div class="profile">
            <div class="index">
                <img src="${artistDetail.images[0].url}" alt="">
                <div class="prof">
                    <img src="${artistDetail.images[0].url}" alt="">
                    <div>
                        <p><img src="images/icon-star.svg" alt="" class="verified">Verified Artist</p>
                        <h1>${artistDetail.name}</h1>
                        <bold>${t} followers</bold>
                    </div>
                </div>
            </div>
            <div class="artistSongs">
                <div class="spaceBet">
                    <h1>Songs</h1>
                    <p>Show all</p>
                </div>
                <div id="displayArtistSongs">
                </div>
            </div>
        </div>
      `
      const displaySongs = document.getElementById("displayArtistSongs")
      displaySongs.innerHTML = ""
      artistSongs.map((output,index)=>{
        displaySongs.innerHTML += `
        <div class="songT">
            <img src="${output.images[0].url}" alt="">
            <div>
                <h2>${output.name}</h2>
                <small onclick="showArtist('${output.artists[0].id}')">${output.artists[0].name}</small>
                <div class="option">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <select name="" id="" class="ff" onclick="option(value,'${output.images[0].url}','${output.name}','${output.artists[0].id}','${output.artists[0].name}')">
                    <option value="playlist">Add to Playlist</option>
                    <option value="library" >Add to Library</option>
                </select>
            </div>
        </div>
        `
      })
      navigatorCount++
      navMax++
      sessionStorage.setItem(JSON.stringify(navigatorCount),main.innerHTML)
    }


    // Browse All
    const topTracks = await fetch(`https://api.spotify.com/v1/browse/categories?&limit=10`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    const topTracksDataParse = await topTracks.json();
    const topTracksData = topTracksDataParse.categories.items
    console.log(topTracksData);
    const topArtistsDisplay = document.getElementById("artists")
    topArtistsDisplay.innerHTML = ""
    topTracksData.map((output,index)=>{
      topArtistsDisplay.innerHTML +=  `
      <div onclick="genreSongs('${output.name}','${output.icons[0].url}')">
          <img src="${output.icons[0].url}" alt="">
          <h4>${output.name}</h4>
      </div>
      `
    });

    window.browseAllCat = async()=>{
      const topTracks = await fetch(`https://api.spotify.com/v1/browse/categories?`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      const topTracksDataParse = await topTracks.json();
      const topTracksData = topTracksDataParse.categories.items
      console.log(topTracksData);
      const topArtistsDisplay = document.getElementById("artists")
      topArtistsDisplay.innerHTML = ""
      topTracksData.map((output,index)=>{
        topArtistsDisplay.innerHTML +=  `
        <div>
            <img src="${output.icons[0].url}" alt="">
            <h4>${output.name}</h4>
        </div>
        `
      });
    }

    // Top Albums
    const topTracksAlbum = await fetch(`https://api.spotify.com/v1/browse/new-releases?country=NG&limit=10`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    const topTracksDataParseAlbum = await topTracksAlbum.json();
    const topTracksDataAlbum = topTracksDataParseAlbum.albums.items
    console.log(topTracksDataAlbum);
    const topAlbumsDisplay = document.getElementById("topAlbumsDisplay")
    topAlbumsDisplay.innerHTML = ""
    topTracksDataAlbum.map((output,index)=>{
      topAlbumsDisplay.innerHTML +=  `
      <div onclick="getAlbum('${output.id}','${output.images[0].url}','${output.name}','${output.artists[0].name}','${output.release_date}','${output.artists[0].id}')">
          <img src="${output.images[0].url}" alt="">
          <h4>${output.name}</h4>
      </div>
      `
    });
    window.browseAllAlbum = async()=>{
      const topTracksAlbum = await fetch(`https://api.spotify.com/v1/browse/new-releases?country=NG`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      const topTracksDataParseAlbum = await topTracksAlbum.json();
      const topTracksDataAlbum = topTracksDataParseAlbum.albums.items
      console.log(topTracksDataAlbum);
      const topAlbumsDisplay = document.getElementById("topAlbumsDisplay")
      topAlbumsDisplay.innerHTML = ""
      topTracksDataAlbum.map((output,index)=>{
        topAlbumsDisplay.innerHTML +=  `
        <div>
            <img src="${output.images[0].url}" alt="">
            <h4>${output.name}</h4>
        </div>
        `
      });
    }

    window.getAlbum = async(params,image,name,artistName,date,artistID) =>{
      const getAlbum = await fetch(`https://api.spotify.com/v1/albums/${params}/tracks?limit=50`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      const albumResult = await getAlbum.json()
      console.log(albumResult);
      
      const albumFinalResult = albumResult.items
      main.innerHTML =  `
      <div class="artistHeader">
            <div class="playButton">
                <img src="images/play-buttton.png" alt="" >
            </div>
            <h2>Album</h2>
            <div class="Artistarrow">
                <img src="images/down-arrow-white.png" alt="" onclick="back()">
                <img src="images/down-arrow-white.png" alt="" onclick=forward()>
            </div>
        </div>
        <div class="profile">
            <div class="index">
                <img src="${image}" alt="">
                <div class="prof">
                    <img src="${image}" alt="" class="profImg">
                    <div>
                        <p><img src="images/icon-star.svg" alt="" class="verified">Album</p>
                        <h1>${name}</h1>
                        <p>By <span><small class="artistName smallUp" onclick="showArtist('${artistID}')">${artistName}</small>, ${date}</p>
                    </div>
                </div>
            </div>
            <div class="artistSongs">
                <div class="spaceBet">
                    <h1>Songs</h1>
                    <p>Show all</p>
                </div>
                <div id="displayAlbum">
                    <div class="songT">
                        <img src="images/Alex.jpeg" alt="">
                        <div>
                            <h2>Carrebian blue</h2>
                            <small>Lanal Del Rey</small>
                            <div class="option">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <select name="" id="" class="ff">
                                <option value="">Add to Playlist</option>
                                <option value="">Add to Library</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `
      const displaySongs = document.getElementById("displayAlbum")
      displaySongs.innerHTML = ""
      albumFinalResult.map((output,index)=>{
        displaySongs.innerHTML += `
        <div class="songT">
            <img src="${image}" alt="">
            <div>
                <h2>${output.name}</h2>
                <small onclick="showArtist('${output.artists[0].id}')">${output.artists[0].name}</small>
                <div class="option">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <select name="" id="" class="ff" onclick="option(value,'${image}','${output.name}','${output.artists[0].id}','${output.artists[0].name}')">
                    <option value="playlist">Add to Playlist</option>
                    <option value="library" >Add to Library</option>
                </select>
            </div>
        </div>
        `
      })
      navigatorCount++
      navMax++
      sessionStorage.setItem(JSON.stringify(navigatorCount),main.innerHTML)
    }

    sessionStorage.setItem(JSON.stringify(navigatorCount),main.innerHTML)
    
    window.genreSongs = async(params,image) =>{
      const genre = await fetch(`https://api.spotify.com/v1/search?q=genre:${params}&type=track&limit=50`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      const genreResult = await genre.json()
      const genreFinalResult = genreResult.tracks.items
      console.log(genreFinalResult);
      
      main.innerHTML =  `
      <div class="artistHeader">
            <div class="playButton">
                <img src="images/play-buttton.png" alt="" >
            </div>
            <h2>Genre</h2>
            <div class="Artistarrow">
                <img src="images/down-arrow-white.png" alt="" onclick="back()">
                <img src="images/down-arrow-white.png" alt="" onclick=forward()>
            </div>
        </div>
        <div class="profile">
            <div class="index">
                <img src="${image}" alt="">
                <div class="prof">
                    <img src="${image}" alt="">
                    <div>
                        <p><img src="images/icon-star.svg" alt="" class="verified">Genre</p>
                        <h1>${params}</h1>
                    </div>
                </div>
            </div>
            <div class="artistSongs">
                <div class="spaceBet">
                    <h1>Songs</h1>
                    <p>Show all</p>
                </div>
                <div id="displayGenre">
                    <div class="songT">
                        <img src="images/Alex.jpeg" alt="">
                        <div>
                            <h2>Carrebian blue</h2>
                            <small>Lanal Del Rey</small>
                            <div class="option">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <select name="" id="" class="ff">
                                <option value="">Add to Playlist</option>
                                <option value="">Add to Library</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `

      const displayGenre = document.getElementById("displayGenre")
      displayGenre.innerHTML = ""
      genreFinalResult.map((output,index)=>{
        displayGenre.innerHTML += `
        <div class="songT">
            <img src="${output.album.images[0].url}" alt="">
            <div>
                <h2>${output.name}</h2>
                <small onclick="showArtist('${output.artists[0].id}')">${output.artists[0].name}</small>
                <div class="option">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <select name="" id="" class="ff" onclick="option(value,'${output.album.images[0].url}','${output.name}','${output.artists[0].id}','${output.artists[0].name}')">
                    <option value="playlist">Add to Playlist</option>
                    <option value="library" >Add to Library</option>
                </select>
            </div>
        </div>
        `
      })
      navigatorCount++
      navMax++
      sessionStorage.setItem(JSON.stringify(navigatorCount),main.innerHTML)
    }

    window.back = () =>{
      navigatorCount = navigatorCount - 1
      if(sessionStorage.getItem(JSON.stringify(navigatorCount)) != null){
        main.innerHTML = sessionStorage.getItem(JSON.stringify(navigatorCount))
      }
    }
    window.forward = () =>{
      navigatorCount = navigatorCount + 1
      if(sessionStorage.getItem(JSON.stringify(navigatorCount)) != null){
        main.innerHTML = sessionStorage.getItem(JSON.stringify(navigatorCount))
      }
    }
    window.option = (value,songImg,songName,artistId,artistName) =>{
      if (value == "library"){
        const libraryObj = {
          value,
          songImg,
          songName,
          artistId,
          artistName
        }
        libraryArray.push(libraryObj)
        console.log(libraryArray);
        
      }
    }
    window.libarySection = () =>{
      main.innerHTML = `
        <div class="artistHeader">
            <div class="playButton">
                <img src="images/play-buttton.png" alt="" >
            </div>
            <h2>LIBRARY</h2>
            <div class="Artistarrow">
                <img src="images/down-arrow-white.png" alt="" onclick="back()">
                <img src="images/down-arrow-white.png" alt="" onclick=forward()>
            </div>
        </div>
        <div class="profile">
            <div class="index">
                <img src="images/w3.jpg" alt="">
                <div class="prof">
                    <img src="images/w3.jpg" alt="">
                    <div>
                        <p><img src="images/icon-star.svg" alt="" class="verified">Explore your library</p>
                        <h1>Library Playlist</h1>
                        <small>You have total of ${libraryArray.length} songs in library</small>
                    </div>
                </div>
            </div>
            <div class="artistSongs">
                <div class="spaceBet">
                    <h1>Songs</h1>
                    <p>Show all</p>
                </div>
                <div id="libarySongs">
                    <div class="songT">
                        <img src="images/Alex.jpeg" alt="">
                        <div>
                            <h2>Carrebian blue</h2>
                            <small>Lanal Del Rey</small>
                            <div class="option">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <select name="" id="" class="ff">
                                <option value="">Remove from Library</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `
      libMap()
    }
    window.removeLib =(value,index) =>{
      if(value == "removeLib"){
        libraryArray.splice(index,1)
        libarySection()
      }
    }
    window.libMap = () =>{
      let libSec = document.getElementById("libarySongs")
      libSec.innerHTML =""
      libraryArray.map((output,index)=>{
        libSec.innerHTML +=`
        <div class="songT">
            <img src="${output.songImg}" alt="">
            <div>
                <h2>${output.songName}</h2>
                <small onclick="showArtist('${output.artistId}')">${output.artistName}</small>
                <div class="option">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <select name="" id="" class="ff" onclick="removeLib(value,'${index}')">
                    <option value="wait"></option>
                    <option value="removeLib">Remove from Library</option>
                </select>
            </div>
        </div>
        `
      })
      navigatorCount++
      navMax++
      sessionStorage.setItem(JSON.stringify(navigatorCount),main.innerHTML)
    }
  } 
    

  catch (error) {
    console.error("API Error:", error);
  }
  
};

api();
