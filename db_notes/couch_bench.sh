echo "Fetching tag 'wheel' with its count (unique_tags index)"
time curl -H "Content-Type: application/json" -X POST 'localhost:5984/tagshot/_design/tagshot/_view/unique_tags?group=true' -d'{"keys": [ "wheels"]}' 2>/dev/null 1> /dev/null

echo "Fetching all urls with tag 'wheel' (tags_to_url index)"
time curl 'localhost:5984/tagshot/_design/tagshot/_view/tags_to_url?key="wheel"' 2> /dev/null 1>/dev/null

echo "Fetching all tags one for one (50 000) and their corresponding url (tags_to_url index)"
time curl 'localhost:5984/tagshot/_design/tagshot/_view/tags_to_url' 2> /dev/null 1>/dev/null
