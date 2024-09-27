async function fetchRandomBreeds() {
    try {
        //fetch all breeds from cat api
        const breedsResponse = await fetch("https://api.thecatapi.com/v1/breeds?api_key=live_I2qywVN5qig2F4dQDfd3WmqGKojJpbYIV2WRWu6W4Ds2ZaaxIkAWUTKcsNjTTGi6");
          //check if network request was successful 
        if (!breedsResponse.ok) {
            throw new Error(`Network response was not ok: ${breedsResponse.status}`);
        }
        const breeds = await breedsResponse.json();
        //check if breed data is invalid 
        if (!breeds || breeds.length === 0) {
            throw new Error('No breeds data found or data is empty');
        }
        console.log(breeds);
        //randomly select 9 unique breeds
        const selectedBreeds = [];
        while (selectedBreeds.length < 9) {
            const randomIndex = Math.floor(Math.random() * breeds.length)
            const randomBreed = breeds[randomIndex];
    
            //avoid duplicate breed selection
            if (!selectedBreeds.includes(randomBreed)) {
                selectedBreeds.push(randomBreed);
            }
        }
        //fetch images for each selected breed
        const breedImagePromises = selectedBreeds.map(async (breed) => {
            const imageResponse = await fetch(`https://api.thecatapi.com/v1/images/search?limit=1&breed_ids=${breed.id}&api_key=live_I2qywVN5qig2F4dQDfd3WmqGKojJpbYIV2WRWu6W4Ds2ZaaxIkAWUTKcsNjTTGi6`);
            //check if network request was successful 
            if(!imageResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const imageData = await imageResponse.json();
            //check if image data is invalid
            if(!imageData || imageData === 0) {
                throw new Error("No image data found or data is empty")
            }
            return { 
                breed, 
                imageUrl: imageData[0].url 
            };
        });

        //wait for all image fetches to complete 
        const results = await Promise.all(breedImagePromises);
        //check if results are invalid
        if (!results || results.length === 0) {
            throw new Error('No breed images were returned');
        }
        //display 9 cats in a grid with flip card animation
        const cardGrid = document.querySelector(".card-grid");

        results.forEach(result => {
            const {breed, imageUrl} = result;

            const card = document.createElement("div");
            card.classList.add("card");

            const cardInner = document.createElement("div");
            cardInner.classList.add("card-inner");

            const cardFront = document.createElement("div");
            cardFront.classList.add("card-front");

            const cardBack = document.createElement("div");
            cardBack.classList.add("card-back");

            //Front cat image
            const img = document.createElement("img");
            img.src = imageUrl;
            cardFront.appendChild(img);

            //Back cat information (breed name and description)
            const breedName = document.createElement("h3");
            breedName.textContent = breed.name;

            const breedDescription = document.createElement("p");
            breedDescription.textContent = breed.description || "No Description Available";

            cardBack.appendChild(breedName);
            cardBack.appendChild(breedDescription);

            //append front and back to cardInner
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);

            //append cardInner to card
            card.appendChild(cardInner);

            //append card to grid
            cardGrid.appendChild(card);
        });
    } catch (error) {
        console.error("There was an error:", error);
    }
};


//call function to fetch and display cats 
fetchRandomBreeds();