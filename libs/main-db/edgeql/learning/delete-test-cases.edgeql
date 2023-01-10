# delete all test cases for a question
DELETE learning::TestCase
FILTER .question.id = <uuid>$0
