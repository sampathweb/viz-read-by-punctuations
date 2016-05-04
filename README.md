# Read Books through Punctuations

## Stack

* Flask server app to render index page
* D3.js for visualizing the data
* JQuery to bind visual elements
* Deployed via gunicorn on AWS

## Good Parts

App is functional with all the expected functionality.

* Select from the pre-defined books
* Navigate between punctuation and color legend
* Hover over legend to highlight the location of punctuation
* Generate Share Link

# Bad Parts

* What started as a server rendered page, quickly became JQuery spagetti
* App has some brittle parts because of dom element references in JavaScript
* App uses SVG elements to render the punctuations.  It currently creates 625 g, rect and text elements for left and right visual.
This choice may need to be evaluated if we expand to showing all the punctuations and not just the first 625.
* Server sends all the data on page load which will be problematic if we have too many books
* Legend may not render well on Mobile

# Extending to additional books

* At the minimum, need to convert the book data load into Ajax call before we can add lots of books
* Since the inventory of books is enormous, we need to convert dropdown to a search / filter via Ajax
* Convert the process of loading texts into memory into on-demand with ability to cache values for improve performance on repeated use
* Since some books could be really big and we are only reading in the first 625 punctuations, it might be better to read file in chunks and not load the entire book text

# Next Steps

* Convert the Server rendered page into a Single Page app using possibly ReactJS to avoid JQuery spagetti
