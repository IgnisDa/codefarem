CREATE MIGRATION m12lfohbokk2si3cupyofqkusb5wystpya5wnoqkrcgc7wimx6gvzq
    ONTO m1fzzoaapgp6vmafrqcdu2cb6z2zqysuihht3ygr2wkayumywgv4za
{
  ALTER TYPE learning::CommonCaseUnit {
      CREATE PROPERTY normalized_data := (SELECT
          (std::array_join(.data[IS learning::StringCollectionUnit].string_collection_value, ',') IF (.data IS learning::StringCollectionUnit) ELSE (std::array_join(<array<std::str>>.data[IS learning::NumberCollectionUnit].number_collection_value, ',') IF (.data IS learning::NumberCollectionUnit) ELSE (<std::str>.data[IS learning::NumberUnit].number_value IF (.data IS learning::NumberUnit) ELSE .data[IS learning::StringUnit].string_value)))
      );
  };
};
