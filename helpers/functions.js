const axios = require('axios');
const crypto = require('crypto');

module.exports = {

    async getRequest(url) {
        return new Promise(function (resolve, reject) {
            axios.get(
                url
            ).then((dataRes) => {
                resolve(dataRes);
            }).catch((err) => {
                console.log(err.body, 'err--------get request');
                reject(err);
            });

        })

    },


    isValidEmail(input) {
        var re = /\S+@\S+\.\S+/;
        return re.test(input);
    },

    isValidDomain(input) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + 
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
            '((\\d{1,3}\\.){3}\\d{1,3}))' + 
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
            '(\\?[;&a-z\\d%_.~+=-]*)?' + 
            '(\\#[-a-z\\d_]*)?$', 'i'); 
        return !!pattern.test(input);
    },

    async getLogoURL(domain) {

        let apiUrl = "https://logo.clearbit.com/" + domain;
        let response = await this.getRequest(apiUrl);
        console.log(response, 'response');
        return response;
    },

    async getDomains(domain){

        let apiUrl = "https://autocomplete.clearbit.com/v1/companies/suggest?query="+domain;
        let response = await this.getRequest(apiUrl);
        return response;
    },

    getGravatarURL(email) {
        const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
        return `https://www.gravatar.com/avatar/${hash}?s=200`;
    }


}