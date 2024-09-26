fetch("https://api.thecatapi.com/v1/images/search?limit=1&breed_ids=asho&api_key=live_I2qywVN5qig2F4dQDfd3WmqGKojJpbYIV2WRWu6W4Ds2ZaaxIkAWUTKcsNjTTGi6")
.then(response => {
    if(!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    console.log(data);
    const section = document.querySelector('section');
    //iterate through array for image and descriptions 
    for (let i = 0; i < data.length; i++) {
    const img = document.createElement('img');
    //display image
    img.src = data[i].url;
    section.appendChild(img);

    const breedDescription = document.createElement('p');
    //access the description property if available
    breedDescription.textContent = data[i].breeds[0]?.description || 'No description available'; 
    section.appendChild(breedDescription);
    }
})
.catch(error => {
    console.error('There was an error', error); 
});