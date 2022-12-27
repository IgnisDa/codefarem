# create a new number unit
INSERT learning::NumberUnit {
    number_value := to_float64(<str>$0)
};
