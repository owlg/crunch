# > crunch

![Data happiness, guaranteed!](http://i.imgur.com/As3wTMC.gif)

> In-browser SQL querying for CSV files. No backend database required - just import and start querying.

**[Want to start querying? Use the hosted app @ https://ummjackson.github.io/crunch/#editor](https://ummjackson.github.io/crunch/#editor)**

### Developing:

```
npm install
npm run compile
npm start
```

This will pre-compile the Nunjucks templates and start a local development server on port 8080. Navigate to [http://localhost:8080/#editor](http://localhost:8080/#editor) to use the app.

### Deploying

```
npm run deploy
```

Deployment uses the gh-pages module to automatically clone the *public/* directory, overwrite the gh-pages branch of the repo and then publish it back to Github. Make sure you've already published your forked repo to Github prior to deploying. 

**Note:** Deployment is releatively quick/dirty and isn't fully tested, so your mileage may very.

### TBD (not yet implemented):

View the [Enhancements tracker](https://github.com/ummjackson/crunch/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement) - any additional feedback/enhancement requests appreciated!

## The MIT License (MIT)
Copyright (c) 2016 Jackson Palmer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
