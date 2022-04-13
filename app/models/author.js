import DS from "ember-data";
const {attr, /*belongsTo,*/ hasMany} = DS;
import Model from "ember-pouch/model";

export default Model.extend({
  posts: hasMany('posts'),
  
  name: attr('string'),
});
