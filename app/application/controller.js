import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

const emberRunloop = () => new Promise(resolve => {
  next(() => {
    resolve();
  });
});

export default Controller.extend({
	store: service(),
	
	async createDocs() {
	  let store = this.get('store');
	  let postCount = 0;
	  
	  let maxAuthors = 50;
	  let postsPerAuthor = 100;
	  
	  for (let i=0; i<maxAuthors; i++) {
	    let author = store.createRecord('author', {name: 'Author' + i});
	    await author.save();
	    
	    for (let j=0; j<postsPerAuthor; j++) {
	      let post = store.createRecord('post', {name: 'Post' + (postCount++), author});
	      await post.save();
	    }
	    console.log(i);
	  }
	},
	
  async fill() {
    console.log('filling');
    this.filled = true;
    
    let adapter = this.get('store').adapterFor('application');
        
    console.time();
    await this.createDocs();
    console.timeEnd();
    
    await adapter.testNew();
    
    console.time();
    await this.createDocs();
    console.timeEnd();
    
    await adapter.testOld();
  },
  
  async testHasmany(id) {
		let store = this.get('store');

    let author = await store.findRecord('author', id);
    
    let posts = await author.get('posts');
    console.log('posts', posts.length);
  },
  
	actions: {
	  async fill() {
		  if (!this.filled) await this.fill();
		  
		  console.log('filled');
		},
		
		async destroy() {
		  let store = this.get('store');
  		let adapter = store.adapterFor('application');
  		
  		await adapter.oldDb.destroy();
  		await adapter.newDb.destroy();
		},
		
		async go() {		  
			console.log('starting performance test');
  		let store = this.get('store');
  		let adapter = store.adapterFor('application');
			
			let db = 0;
			while (db <= 1) {
			  let authors = await store.findAll('author');
			  let id = authors.firstObject.id;
 			  console.log('id', id);
			  console.log('id', id);
        console.log('id', id);
			  
  			for (let i=0; i<10; i++) {
    			await store.unloadAll();
    			await emberRunloop();
    			
    			console.time();
      		await this.testHasmany(id);
      		console.timeEnd();
    		}
    		
    		if (db) {
    		  await adapter.testOld();
    		} else {
    		  await adapter.testNew();
    		}
    		
    		db++;
    	}
		},
	},
	
});
