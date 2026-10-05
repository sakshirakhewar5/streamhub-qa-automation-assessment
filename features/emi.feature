Feature: EMI Calculator validation
  As a QA engineer
  I want to validate EMI calculations and charts
  So that the calculator produces correct financial outputs

  Scenario Outline: Validate Home Loan EMI pie chart
    Given I open the EMI calculator
    When I select the "Home Loan" tab
    And I enter home loan amount "<amount>", interest rate "<rate>" and tenure "<years>" years
    Then the displayed EMI should match my independently calculated EMI within 2 rupees
    And the EMI pie chart should be visible
    And both pie chart values should be greater than zero

    Examples:
      amount : rate : years 
      2500000 : 10  : 10    
      5000000 : 7.5 : 15    

  Scenario: Validate Personal Loan EMI bar chart
    Given I open the EMI calculator
    When I select the "Personal Loan" tab
    And I set personal loan amount to 1000000, interest rate to 12 and tenure to 5 years
    And I modify the schedule start month
    Then the EMI bar chart should be visible
    And the EMI bar chart should contain at least one bar
    And a bar tooltip should contain a positive numeric value
