// This file contains code to retrieve a random quote, and returns the quote.

const url = 'https://api.api-ninjas.com/v1/quotes?category=';
const options = {
	method: 'GET',
	headers: {
		'X-Api-Key': 'KldHmxcMnnC3yMMMOngBhw==2sZBuuQfhFUuWGIV'
	}
};

module.exports = {
    getQuote: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(url, options);
                const json = await response.json();
                resolve(json[0].quote);
    
            } catch (err) {
                console.log(err);
                console.log("sum ting wong")
                reject('Cool quote here');
            }
        })
    }
}