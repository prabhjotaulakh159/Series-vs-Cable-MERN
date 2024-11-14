# TV Networks vs Streaming platforms

## Data

We will be working with 'The TVDB' API/Dataset. It includes information about movies and series,
including information about their score/awards, air time, and the original network or streaming service they
were aired under. It also includes additional information such as artworks, actors, country of origin,
and many other fields and lists pertaining to the movie or series. Using this information, we will make a
general comparison between the overall quality of work from both streaming and TV networks all accross the world.
We may reduce our data to include movies/series from the 2000's onwards, and we may restrict to North American
movies and shows. With this comparison, the user can decide if subscribing to a streaming service is a worthy
investment, or should they rather opt for classical TV networks for their entertainement.

Link to the API GitHub page: <https://github.com/thetvdb/v4-api>  
Link to the website: <https://thetvdb.com/api-information>

## API

GET /api/series/{id} - This endpoint will fetch data for a single series  
GET /api/series?name={name}?year={year}?type={cable || streaming} - This will fetch information for all relevant series/shows in the USA/Canada using the optional query parameters  
GET /api/companies/ - Gets information for all companies (TV Networks and Streaming services)  
GET /api/company/{id} - Get information for a specific company

## Visualizations

We will be using charts and graphs to give the user a sense of the quality of series between streaming services and cable networks.
We will do so by demonstrating the air time of streaming services vs cable, and the relative score of a series of cable vs streaming services.
By visualizing this data on a graph, the user will see the major difference of consumer culture over the years as companies have gotten more
greedy and cut show funding. They can also see information about a specific series. such as the art work, the number of seasons, actors, title,
year, etc. Users can also view cabl eand streaming companies, including individual company information. The graphs will be line graphs on the x and y axis,
where x is the year, y is either air-time, awards or scores, and there will be 2 lines on each graph, 1 for cable and 1 for streaming services.
Under each graph, we will show the top contestants for the criteria of that chart, including company and or show/series.

## Views

See [our wireframe pdf document](screenshots/wireframe.pdf) for details about the view.  
The title, navbar and the general image are above the fold.  
All graphs are below the fold in order to give them extra time to finish up loading before being displayed
to the user.

Note: The 'FILTER' boxes in the navbar will simply link to the three different graphs for easier navigation.

## Functionality

When the user hovers on a peak on a line on the graph, it will show the average air time, score or awards for cable and streaming (seperate)
for that year.  
We might add a feature to search a series or company in a search bar.

## Features and Priorities

Core features/priorities:

- The graphs
- Loading (suspense)
- API endpoints
- Data filtering on the backend
- Hover over line graph peaks to show extra information mentionned above

Secondary features/priorities:

- Showing best contestants under each graph
- Performance (prevent re-renders)

Ternary features/priorities:

- Searching tv shows and information

## Dependencies

- React plotly to graph our data: <https://plotly.com/javascript/react/>
- react-loading-skeleton for displaying visually appealing loading animations: <https://www.npmjs.com/package/react-loading-skeleton>
- Bootstrap for easierr styling: <https://www.npmjs.com/package/bootstrap>
- React router & react router dom for internal page links: <https://www.npmjs.com/package/react-router> <https://www.npmjs.com/package/react-router-dom>
- React icons for our burger menu icon: <https://www.npmjs.com/package/react-icons>
