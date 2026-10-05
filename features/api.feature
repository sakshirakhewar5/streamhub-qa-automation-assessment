Feature: Assessment API
  As a QA engineer
  I want to validate the assessment API
  So that valid and invalid requests return the correct status and response shape

  Background:
    Given the assessment API is available

  Scenario: Health endpoint returns service status
    When I request the health endpoint
    Then the response status should be 200
    And the response field "status" should be "UP"

  Scenario: Get products with filtering sorting and pagination
    When I request products with category "electronics", sort "price_asc", page 1 and limit 2
    Then the response status should be 200
    And the response should contain 2 products
    And the response products should be sorted by ascending price

  Scenario: Search products by name
    When I search products for "phone"
    Then the response status should be 200
    And every returned product should match the search term

  Scenario: Get a product by id
    When I request product id 2
    Then the response status should be 200
    And the product id should be 2

  Scenario: Unknown product returns 404
    When I request product id 999
    Then the response status should be 404
    And the response field "error" should be "Product not found"

  Scenario: Invalid page parameter returns 400
    When I request products with page 0
    Then the response status should be 400
    And the response should contain an error message

  Scenario: Unsupported sort parameter returns 400
    When I request products with sort "random_sort"
    Then the response status should be 400
    And the response should contain an error message
