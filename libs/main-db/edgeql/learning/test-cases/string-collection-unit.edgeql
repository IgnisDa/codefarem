# create a new string collection unit
INSERT learning::StringCollectionUnit {
    string_collection_value := str_split(<str>$0, ",")
};
