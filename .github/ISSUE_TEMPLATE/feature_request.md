name: Feature Request
description: Suggest a new feature
labels: ["enhancement"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        Thanks for suggesting a new feature! Please describe your idea below.

  - type: textarea
    id: description
    attributes:
      label: Feature description
      description: Describe the feature you'd like to see
      placeholder: |
        What would you like to add or improve?
    validations:
      required: true

  - type: textarea
    id: use-case
    attributes:
      label: Use case
      description: Explain how this feature would be useful
      placeholder: This would help users to...

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives considered
      description: Any alternative solutions or features you've considered?

  - type: textarea
    id: additional
    attributes:
      label: Additional context
      description: Any other context or screenshots
