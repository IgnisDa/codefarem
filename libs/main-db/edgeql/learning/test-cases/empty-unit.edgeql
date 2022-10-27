# This is a workaround because the server supplies one parameter while the
# insert itself requires none, so we do a fake select first to get rid of the
# parameter.
SELECT <str>$0;
INSERT learning::EmptyUnit;
