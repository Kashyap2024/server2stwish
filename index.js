const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// server name is Stream Wish

// Middleware to parse incoming HTML data
app.use(bodyParser.text({ type: 'text/html' }));

// Route to handle POST requests
app.post('/api/html', async (req, res) => {
    try {
        const videoPageContent = req.body;
        // console.log(videoPageContent);

        // Initialize variables
        let fileLink = '';
        let baseUrl = '';
        let newPattern = '';
        let langValue = '';
        let valueBeforeM3u8 = '';
        let dataValue = '';
        let srvValue = '';
        let fileIdValue = '';
        let cValue = '';
        let asnValue = '';
        let spValue = '';
        let pallValue = '';
        let cookieFileIdValue = '';
        let lanmatchvaluepipe = '';

        // All Regular Expressions
        const baseUrlRegular = /\|([^|]+)\|sources\|/;
        const draftbaseUrlRegular = /\|([^|]+)\|jpg\|/;
        const newPatternRegular = /\|kind(?:\|[^|]*)?\|(\d{5})\|(\d{2})\|/;
        const newPatternRegular3 = /\|([^|]+)\|([^|]+)\|hls2\|/;
        const langValueRegular = /\|master\|([^|]+)\|/;
        const valueBeforeM3u8Regular = /\|129600\|([^|]+(?:\|[^|]+)*)\|m3u8\|/;
        const dataValueRegular = /\|data\|([^|]+)\|/;
        const srvValueRegular = /\|srv\|([^|]+)\|/;
        const fileIdRegular = /file_id',\s*'([^']+)/;
        const cValueRegular = /ab:\[{[^]*?([0-9]+\.[0-9])&/;
        const asnValueRegular = /\|([^|]+)\|asn\|/;
        const spValueRegular = /\|([^|]+)\|sp\|/;
        const pallValueRegular = /file\|([^|]+)\|([^|]+)/;
        const cookieValueRegular = /\$.cookie\('file_id',\s*'([^']+)/;

        // Processing the HTML content with regex matches
        const baseMatch = videoPageContent.match(baseUrlRegular);
        const draftbaseMatch = videoPageContent.match(draftbaseUrlRegular);
        const newPatternMatch = videoPageContent.match(newPatternRegular);
        const langMatch = videoPageContent.match(langValueRegular);
        const m3u8Match = videoPageContent.match(valueBeforeM3u8Regular);
        const dataMatch = videoPageContent.match(dataValueRegular);
        const srvMatch = videoPageContent.match(srvValueRegular);
        const fileIdMatch = videoPageContent.match(fileIdRegular);
        const cMatch = videoPageContent.match(cValueRegular);
        const asnMatch = videoPageContent.match(asnValueRegular);
        const spMatch = videoPageContent.match(spValueRegular);
        const pallMatch = videoPageContent.match(pallValueRegular);
        const cookieMatch = videoPageContent.match(cookieValueRegular);

        if (baseMatch) {
            const reversedSegments = `${baseMatch[1]}`;
            const draft2baseurl = draftbaseMatch ? `${draftbaseMatch[1]}` : '';
            baseUrl = `${reversedSegments}.${draft2baseurl}.com`;
            console.log(baseUrl);
        } else {
            console.error('Base URL match not found.');
        }

        if (newPatternMatch) {
            const reversebefore = `${newPatternMatch[1]}|${newPatternMatch[2]}|hls2`;
            newPattern = reversebefore.split('|').reverse().join('/');
        } else {
            const newPatternmatch2 = videoPageContent.match(newPatternRegular3);
            if (newPatternmatch2) {
                const reversebefore2 = `${newPatternmatch2[1]}|${newPatternmatch2[2]}|hls2`;
                newPattern = reversebefore2.split('|').reverse().join('/');
            } else {
                console.error('New Pattern match not found.');
            }
            console.log(newPattern);
        }

        if (langMatch) {
            lanmatchvaluepipe = langMatch[1];
            langValue = `${lanmatchvaluepipe}`;
            console.log(langValue);
        } else {
            console.error('Language match not found.');
        }

        if (m3u8Match) {
            const valueBeforeM3u8pipe = m3u8Match[1];
            const parts = valueBeforeM3u8pipe.split('|');
            
            if (parts.length === 1) {
                valueBeforeM3u8 = parts[0];
            } else if (parts.length === 2) {
                // Check if parts[1] is a number
                if (!isNaN(parts[0])) {
                    valueBeforeM3u8 = parts[1];
                } else {
                    valueBeforeM3u8 = `${parts[1]}-${parts[0]}`;
                }
            } else {
                console.error('Unexpected parts length for m3u8 match.');
            }
            console.log(valueBeforeM3u8);
        } else {
            console.error('m3u8 match not found.');
        }

        if (dataMatch) {
            dataValue = dataMatch[1];
            console.log(dataValue);
        } else {
            console.error('Data match not found.');
        }

        if (srvMatch) {
            srvValue = srvMatch[1];
            console.log(srvValue);
        } else {
            console.error('SRV match not found.');
        }

        if (fileIdMatch) {
            fileIdValue = fileIdMatch[1];
            console.log(fileIdValue);
        } else {
            console.error('File ID match not found.');
        }

        if (cMatch) {
            const fullCValue = cMatch[0];
            cValue = fullCValue;
            console.log(cValue);
        } else {
            console.error('C Value match not found.');
        }

        if (asnMatch) {
            asnValue = asnMatch[1];
            console.log(asnValue);
        } else {
            console.error('ASN match not found.');
        }

        if (spMatch) {
            spValue = spMatch[1];
            console.log(spValue);
        } else {
            console.error('SP match not found.');
        }

        if (pallMatch) {
            const firstValue = pallMatch[1];
            const secondValue = pallMatch[2];
            if (isNaN(firstValue)) {
                pallValue = firstValue;
            } else {
                pallValue = secondValue;
            }
            console.log(pallValue);
        } else {
            console.error('Pall match not found.');
        }

        if (cookieMatch) {
            cookieFileIdValue = cookieMatch[1];
            console.log(cookieFileIdValue);
        } else {
            console.error('Cookie match not found.');
        }

        // Construct the m3u8 link
        const makeurl = `https://${baseUrl}/${newPattern}/${langValue}/master.m3u8?t=${valueBeforeM3u8}&s=${dataValue}&e=${srvValue}&f=${fileIdValue}&srv=${pallValue}&i=0.0&sp=${spValue}&p1=${pallValue}&p2=${pallValue}&asn=${asnValue}`;
        
        fileLink = makeurl;
        console.log('Constructed m3u8 link:', fileLink);

        // Fetch the m3u8 link
        const response = await fetch(fileLink);
        console.log('Fetch response status:', response.status);
        return res.json({
            type: 'embed',
            source: fileLink,
            message: 'm3u8 link generated successfully'
        });

        // if (response.ok) {
        //     // const responseData = await response.text(); 
        // } else {
        //     console.error('Failed to fetch m3u8 link, status:', response.status);
        //     return res.status(response.status).json({ error: 'Failed to fetch m3u8 link' });
        // }
    } catch (error) {
        console.error('Error during processing:', error.message);
        return res.status(500).json({ error: 'Error during processing: ' + error.message });
    }
});

// Start the server
const PORT = 4500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
