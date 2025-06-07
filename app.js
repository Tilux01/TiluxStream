// For development only - use a backend proxy in production
let topDataArray = []
const api = async () => {
  try {
    // 1. Get access token first
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

    // 2. Search for tracks (example)
    const searchTracks = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent('ultraviolence')}&type=track&limit=5`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}` 
      }
    });
    const tracksData = await searchTracks.json();
    console.log("Tracks:", tracksData);

    // 3. Search for artist (fixed string interpolation)
    const artistName = 'Rema';
    const searchArtist = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    const artistData = await searchArtist.json();
    console.log("Artist Search:", artistData);

    // 4. Get artist's top tracks (if artist found)
    if (artistData.artists.items.length > 0) {
      const artistId = artistData.artists.items[0].id;
      const topTracks = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      const topTracksData = await topTracks.json();
      const list = topTracksData.tracks
      console.log(list);
      
      list.map((output,index)=>{
        console.log(output[index]);
        show.innerHTML = `
        <div>${output.name}</div>
        `
      })
    } else {
      console.log("Artist not found");
    }
    
  } catch (error) {
    console.error("API Error:", error);
    
    // For CORS errors during development only:
    if (error.message.includes('CORS')) {
      console.error(`
        CORS Error Solution:
        1. Install a CORS browser extension temporarily, OR
        2. Create a backend proxy (recommended)
        
        For production, you MUST use a backend server.
        Never expose client secrets in frontend code.
      `);
    }
  }
  
  
};

api();

// const mapping = () =>{
//   // show.innerHTMl = topDataArray.
// }