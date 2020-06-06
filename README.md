
> :warning: **This is an unmaintained proof-of-concept for a junior-level high school project.** I would strongly discourage attempts to use it in lieu of other spell-checking chrome extensions Grammarly or the Microsoft Editor.

# StudyWords

StudyWords is the spell checker that helps you improve your spelling, not just correct it. Install the chrome extension to find and practice the words you struggle with most, and self-host the node api for maximum control.

## Quick Installation Guide
### Installing the Chrome Extension 
In `chrome://extensions/` enable Developer mode and load the unpacked extension by selecting the 'extension' folder (after navigating to the root directory in the file browser). 
### Using the API
In the 'api' directory, you will need to modify the `data.json` file. First, obtain a [Bing Spell Check](https://azure.microsoft.com/en-us/services/cognitive-services/spell-check/) API key, and add to `data.json` as the value to the `Bing_Spell_Check_API_Key` property. Similarly, you will also need a [ResponsiveVoice](https://responsivevoice.org/) API key, to add under the `ResponsiveVoice_API_Key` property.

To start the server, you can simply double click `start_server.bat` on windows, or type in `nodemon server.js` to the terminal. Note, for the greatest ease-of-use, you will need [Node.js](https://nodejs.org/en/) and the node packages [Express.js](https://expressjs.com/) and [nodemon](https://nodemon.io/).

## Acknowledgements

The project was built on the hard work of:
* Microsoft's [Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/)
* [howler.js](https://github.com/goldfire/howler.js/)
* [Font Awesome 5](https://fontawesome.com/)
* [responsivevoice.com](https://responsivevoice.org/)
