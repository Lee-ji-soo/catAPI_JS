const API_KEY = "bd9aba9c-ee14-4106-800f-fd5b82d9c6eb";
const API_ENDPOINT = `https://api.thecatapi.com/v1`;

const api = {
    fetchCats: async (data) => {
        const res = await
            fetch(`${API_ENDPOINT}/images/search?limit=3&page=${data.page}&currentPage=${data.page}&order=Desc`);
        return await res.json()
    },

    fetchMoreCat: async (data, state) => {
        const newState = () => {
            if (state.onCategory === true) {
                return `category_ids=${data.category}`
            } else if (state.onBreed === true) {
                return `breed_id=${data.breed}`
            } else if (state.onNone === true) {
                return ''
            }
        }
        const res = await
            fetch(`${API_ENDPOINT}/images/search?${newState()}&limit=3&page=${data.page}&currentPage=${data.page}&order=Desc`, {
                method: 'GET',
                headers: {
                    "x-api-key": API_KEY
                }
            });
        return await res.json();
    },

    fetchInitialBreeds: async () => {
        const res = await
            fetch(`${API_ENDPOINT}/breeds/`, {
                method: 'GET',
                headers: {
                    "x-api-key": API_KEY
                }
            });
        return await res.json();
    },

    fetchInitialCategories: async () => {
        const res = await
            fetch(`${API_ENDPOINT}/categories/`, {
                method: 'GET',
                headers: {
                    "x-api-key": API_KEY
                }
            })
        return await res.json();
    },

    fetchCategory: async (category) => {
        const res = await
            fetch(`${API_ENDPOINT}/images/search?category_ids=${category}&limit=12&page=10`, {
                method: 'GET',
                headers: {
                    "x-api-key": API_KEY
                }
            });
        return await res.json();
    },

    fetchBreed: async (breed) => {
        console.log(breed);
        const res = await
            fetch(`${API_ENDPOINT}/images/search?breed_id=${breed}&limit=12&page=10`, {
                method: 'GET',
                headers: {
                    "x-api-key": API_KEY
                }
            });
        return await res.json();
    },

    fetchRandom: async () => {
        const res = await
            fetch(`${API_ENDPOINT}/images/search`);
        return await res.json()
    },

    fetchPostVote: async (data) => {
        const res = await fetch(`${API_ENDPOINT}/favourites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-api-key": API_KEY
            },
            body: JSON.stringify({
                "image_id": data.id,
                "sub_id": data.user
            })
        });
        return await res.json();
    },

    fetchGetVote: async (user) => {
        const res = await
            fetch(`${API_ENDPOINT}/favourites?sub_id=${user}`, {
                method: 'GET',
                headers: {
                    "x-api-key": API_KEY
                }
            });
        return await res.json()
    },

    fetchDeleteVote: async (id) => {
        const res = await
            fetch(`${API_ENDPOINT}/favourites/${id}`, {
                method: 'DELETE',
                headers: {
                    "x-api-key": API_KEY
                }
            });
        return await res.json()
    }
};

export { api };

