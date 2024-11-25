# Performance of Streaming VS Cable

## Introduction and Methodology

In chrome on a Windows 11 device with intel i7 core 13th gen CPU, using the lighthouse report, we performed an analysis on a viewport of 1280x752 with fast 4G throttle and gathered some critical information about our app performance.

### Before changes
![Lighthouse report 1](images/image8.png)
![Lighthouse report 2](images/image9.png)
![WhatDoesMySiteCost report](images/image10.png)

<!-- Also report overall impact on whatdoesmysitecost results before and after all your changes -->

## Baseline Performance

The tool seemed to detect most of the visible performances, which make the website load visibly slower.

Through lighthouse, we observed some render-blocking JS and CSS, as well as some cross reference requests being made to other places, causing more DNS lookups and therefore lower performance.

Through whatdoesmysitecost, we observed the highest price point to be in Canada, at 0.22$.

## Areas to Improve

Because we already worked on performance in previous milestones, there wasnt much we were able to do to improve performance. As seen above, our before performance started off as a 94 already. After discussion, we agreed to remove the @import from the css file in order to remove that extra request. We also decided to seperate the more critical CSS with non-critical css to improve performance. Lastly, we implemented server-side and browser-side caching to further improve the constant querying of the database, as our dataset is very static.

In the last milestone, we also decided to use lazy imports for the graphs. More details below about the impacts of this change.

## Summary of Changes 

### @import Removal
Lead: Adam Winter
This did cause an increase in performace. Seeing as it was one of the more major issues pointed out by lighthouse, with a blocking time of 260ms, removing it did improve our performance a lot.

### Lazy imports for Plotly
Lead: Bianca Rossetti
Plotly is already a heavy library altogether, and because we only needed it later, we decided keeping it for the initial render was unnecessary. As such, we decided to use lazy imports. Once this change was implemented, it was clear the load time of our page decreased dramatically as we no longer relied the fairly heavy library for the initial load of our page.

### Elimination of blocking js
Lead: Prabhjot Aulakh
This did improve the performance of our frontend website. when the website was initially loaded, all calculations were being made synchronously for the summary and other calculation methods. these were all converted to asynchronous and reduced the amount of render blocking javascript on our main thread!

### Use of critical css
Lead: Bianca Rossetti
Although our lighthouse score no longer showed "Eliminate render blocking resources", we found that it didnt really improve the score, nor did it reduce it. Depending on the device, it either had a very minor positive impact, or no impact on the lighthouse score.

### Server and browser caching

## Conclusion

<!-- Summarize which changes had the greatest impact, note any surprising results and list 2-3 main 
things you learned from this experience. -->