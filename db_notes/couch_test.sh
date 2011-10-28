DB=http://127.0.0.1:5984/tagshot
DOC_NUM=1000
MAX_TUPLES=20

python gen.py $DOC_NUM $MAX_TUPLES > rand_data.json

time curl -H "Content-Type: application/json" -d @rand_data.json -X POST $DB/_bulk_docs

echo "Uploaded $(du -h rand_data.json) to couchdb"
echo "Bulk inserted $DOC_NUM documents with up to $MAX_TUPLES tuples"
