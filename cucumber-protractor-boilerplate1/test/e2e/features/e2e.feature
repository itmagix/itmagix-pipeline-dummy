Feature: As a user I want to save and retrieve my user preferences

    @checkApi
    Scenario: checking multiple attributes in array of elements
        Given I am on the url "http://192.168.2.120:8080"
        When I click on element "link" on page "general"
        Then the element "text" contains text "VUL IN" on the page "pipeline"




