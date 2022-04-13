import DS from "ember-data";
const {attr, belongsTo} = DS;
import Model from "ember-pouch/model";

export default Model.extend({
	name: attr('string'),
	author: belongsTo('author'),
});
