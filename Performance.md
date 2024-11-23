# Performance of Streaming VS Cable

## Introduction and Methodology

In chrome on a Windows 11 device with intel i7 core 13th gen CPU, using the lighthouse report, we performed an analysis on a viewport of 1280x752 with fast 4G throttle and gathered some critical information about our app performance.

![alt text](images/image6.png)

<!-- Also report overall impact on whatdoesmysitecost results before and after all your changes -->

## Baseline Performance

The tool seemed to detect most of the visible performances, which make the website load visibly slower.

Through lighthouse, we observed some render-blocking JS and CSS, as well as some main thread work that was taking up a lot of the load time.

As for WhatDoesMySiteCost? We could not get the report to load because the page kept freezing on us. We tried on all our computers on several browsers with no success.

## Areas to Improve

We need to improve where we execute our heavy js calculations (and offload them asynchronously) as well as focus on rendering only the critical CSS first and the non-critical css later. We will also remove the imports for fonts and download them instead, as this was causing problems as well.

## Summary of Changes 

<!-- Briefly describe each change and the impact it had on performance (be specific). If there
was no performance improvement, explain why that might be the case -->

### <!-- Change 1 -->

Lead: <!-- name of main contributor to this change -->

...

### <!-- Change n -->

Lead: <!-- name of main contributor to this change -->

## Conclusion

<!-- Summarize which changes had the greatest impact, note any surprising results and list 2-3 main 
things you learned from this experience. -->