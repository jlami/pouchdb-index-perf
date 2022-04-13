import { Adapter } from 'ember-pouch';
import PouchDB from 'ember-pouch/pouchdb';
import indexeddb from 'pouchdb-adapter-indexeddb';
//const { getOwner } = Ember;
import { next } from '@ember/runloop';

//use real simple inflector, since this is only to communicate with Pouch in JS internally, no need for 'grammatical correctness'
import Inflector from 'ember-inflector';
import systemInflector from 'ember-inflector/lib/system/inflector';

let inflector = systemInflector.inflector = new Inflector();
inflector.plural(/$/, 's');
inflector.singular(/s$/i, '');

PouchDB.plugin(indexeddb);

//PouchDB.debug.enable('pouchdb:find');

const emberRunloop = () => new Promise(resolve => {
  next(() => {
    resolve();
  });
});

export default Adapter.extend({  
  oldDb: null,
  newDb: null,
  
  async clearDb() {
    this.get('store').unloadAll();//TODO: wait for completion?
    await emberRunloop();
  },
  
  async testOld() {
    await this.clearDb();
    this.set('db', this.oldDb);
    if (!this.newDb.rel) delete this._schema;
  },
  
  async testNew() {
    await this.clearDb();
    
    this.set('db', this.newDb);
    if (!this.newDb.rel) delete this._schema;
  },
  
  init() {
    this._super(...arguments);
    
    let localDb = 'index-perf-';
	
	  this.oldDb = new PouchDB(localDb + 'old');
	  this.newDb = new PouchDB(localDb + 'new', {adapter: 'indexeddb', revs_limit: 500});

    this.set('db', this.oldDb);
  },
  
  unloadedDocumentChanged: function(obj) {
    //var appController = getOwner(this).lookup("controller:application");
    //appController.send('kickSpin');
      
    let store = this.get('store');
    let recordTypeName = this.getRecordTypeName(store.modelFor(obj.type));
    this.get('db').rel.find(recordTypeName, obj.id).then(function(doc) {
      store.pushPayload(recordTypeName, doc);
    });
  },
});
