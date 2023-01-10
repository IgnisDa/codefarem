# create a new number collection unit
INSERT learning::NumberCollectionUnit {
    number_collection_value := <array<float64>>str_split(<str>$0, ",")
};
