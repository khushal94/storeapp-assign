const express = require('express');
const bodyParser = require('body-parser');
const clearBitApi = "https://logo.clearbit.com/";
const app = express();
const PORT = process.env.PORT || 3000;
const helper = require('./helpers/functions');

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function (req, res) {
    res.render('index.html');
});

app.post('/getInfo', async (req, res) => {
    const input = req.body.input.trim();

    if (!input) {
        return res.status(400).json({ error: 'Input is required' });
    }

    let result = {};

    if (helper.isValidEmail(input)) {
        const gravatarURL = helper.getGravatarURL(input);
        result = { type: 'email', info: input, avatarURL: gravatarURL };
    } else if (helper.isValidDomain(input)) {
        console.log('inside domain valid');
        try {
            const fullPath = clearBitApi + input;
            result = { type: 'website', info: input, logoURL: fullPath };
        } catch (error) {
            result = { type: 'website', info: input };
        }
    } else {
        return res.status(400).json({ error: 'Invalid input format' });
    }

    res.json(result);
});

app.post('/autocomplete', async (req, res) => {

    let stringVal = req.body.value;
    if (stringVal && stringVal.length >= 3) {
        const domains = await helper.getDomains(stringVal);
        console.log(domains, 'domains');
        result = { type: 'website', matched: domains.data };
        res.json(result);
    } else {
        return res.status(400).json({ error: 'invalid string input' });
    }

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

