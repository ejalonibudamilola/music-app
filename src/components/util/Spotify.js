const clientId ="91ab777d7a4f42289046f59463a0eeee";
const redirectUri = "http://localhost:3000";
let accessToken;

const Spotify={
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }
        console.log("logging accesstoken "+window.location.href);
        // const accessTokenMatch= window.location.href.match(/access_token=([^g]*)/);
        // const expiresInMatch=window.location.href.match(/expires_in=([^g]*)/);
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        console.log("Access Token is "+accessTokenMatch+ " and expires is "+expiresInMatch);
        if(accessTokenMatch && expiresInMatch){
            accessToken=accessTokenMatch[1];
            const expiresIn=Number(expiresInMatch[1]);
            window.setTimeout(() => (accessToken=""),expiresIn * 1000);
            window.history.pushState("Access Token", null, "/");
            return accessToken;
        }else{
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location=accessUrl;
        }
    },

    async search(term) {
        console.log("I got here");
        const accessToken = await Spotify.getAccessToken();
        console.log("Second one "+accessToken);
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    .then(response => {
        return response.json();
    })
    .then(jsonResponse => {
        if (!jsonResponse.tracks) {
            return[];
        }
        console.log("JSON "+jsonResponse.tracks);  
        
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    });

    },

    savePlaylist(name, trackUris){
        if(!name || !trackUris.length){
            return;
        }   
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` }; 
        let userId;

        
        return fetch("https://api.spotify.com/v1/me", { headers: headers })
        .then(response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ name: name })
            })
            .then(response => response.json())
            .then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(
                    `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                    {
                        headers: headers,
                        method: "POST",
                        body: JSON.stringify({urls : trackUris})
                    }
                );
            });
        });
    }
};

export default Spotify;