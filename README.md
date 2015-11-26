# public-html

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.0.0-rc8.

## Free Code Camp - Basejump: Chart the Stock Market

### User Stories (US)
1. As a user, I can view a graph displaying the recent trend lines for each added stock.
2. As a user, I can add new stocks by their symbol name.
3. As a user, I can remove stocks.
4. As a user, I can see changes in real-time when any other user adds or removes a stock.

### Notes
* Example app http://stockstream.herokuapp.com/ freezes when a bad stock symbol is entered
* API info for stocks http://stackoverflow.com/questions/27794418/free-json-formatted-stock-quote-api-live-or-historical
* This project seems way too simple - what can we do to spice it up? 
  * What if we took the basic ideas of this project and tracked FCC members progress in real time?

### Task
100. ~~Add favicon.ico, set meta tag description, set title~~
200. ~~Remove nav bar - I do not see a need for it at this time but will leave the component in place just in case~~
300. Update footer directive and html - want to make a generic reusable footer for future FCC projects
400. Add service to pull stock data and provide it to controllers
500. (US 1-4) Build basic view
  1. Need a graph using angularcharts.js - Note: consider D3.js due to hide/show bug with chart.js which angularchart.js uses
  2. Need a nav list with a self remove button for each item - using generated things api
  3. Need an add new input and button - using generated things api
  4. Update or remove the tool tip from existing things list
  5. Enable adding/removing stocks in real time
  6. Prevent duplicate entries and ignore case
  
  Note: Task 500.2 and 500.3 are basically done using the generated things api.
6. Deploy to Heroku



