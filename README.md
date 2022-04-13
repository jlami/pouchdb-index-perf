# Pouchdb indexed db adapater performance test in Ember

This is a performance test program for PouchDB Indexed db indexes on the old and new adapter

Press 'Fill' to seed the databases with 50 authors with 100 posts each
The process is done when 'filled' appears in the console
This process is also timed in the console for each adapter
The timing is always first the old adapter and then the new one

Pressing 'Go' will do 10 runs of getting the first author and loading the corresponding 100 posts
The id of the author that is used is printed to the console as an indicator for the separate runs

If you see `posts 0` for the second run, you have to apply this PR to your `node_modules\pouchdb-adapter-indexeddb\lib\index.es.js` file: https://github.com/pouchdb/pouchdb/pull/8389/files
On line 178 of index.es.js you have to apply the change to see `      if (['_id', '_rev', '_deleted', '_attachments'].includes(field)) {
`
But you also have to change `naturalIndexName` to use a new name for the index, or your change wil not be applied. So change that to `'_find_idx2/'`

Finally press the 'Remove databases' to clean up, or try from a fresh start. (You might notice that the old adapter also takes significantly longer on the first use of the index after filling. This is due to the extra index needing to be filled)

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd my-app`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
