DOC_NUM=1000
MAX_TAGS=20

python gen.py $DOC_NUM $MAX_TAGS> rand_data.json

time python mongo_insert.py rand_data.json

echo "Inserted $(du -h rand_data.json) to MongoDB"
echo "Bulk inserted $DOC_NUM documents with up to $MAX_TAGS tuples"
