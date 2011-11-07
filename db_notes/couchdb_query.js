{
	"_id": "_design/tagshot",
	"_rev": "19-91a05a19160538acc7b451cded4739c3",
  "language": "javascript",
   "views": {
       "tags_to_url": {
           "map": "function(doc) {if (doc.iptc.tag) {iptc = doc.iptc; iptc.tags.forEach(function(tag) {emit(tag, [iptc.stars.nr, iptc.tag]);});}}"
       },
       "unique_tags": {
           "map": "function(doc) {if (doc.tags) {doc.tags.forEach(function(tag) {emit(tag, 1);});}}",
           "reduce": "function(keys, vals) {return sum(vals);}"
       },
       "all": {
           "map": "function(doc) {emit(null,doc)}"
       }
   }
}
'curl localhost:5984/tagshot/_design/tagshot/_view/tags/?key=\"hasso\"'

curl -H "Content-Type: application/json" -X POST 'localhost:5984/tagshot/_design/tagshot/_view/unique_tags?group=true' -d'{"keys": ["meinel", "hasso"]}'


{
   "_id": "68cc90f41bd52e98c2d5d4cb100021cc",
   "language": "javascript",
   "views": { 
		"tags": {
			"map": "function(doc) {emit(doc.tags, doc)}"
		}
    }
}
