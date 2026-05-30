name: Bug Report
description: Report a bug or issue
labels: ["bug"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to report a bug! Please fill in the details below to help us investigate.

  - type: textarea
    id: description
    attributes:
      label: Describe the bug
      description: A clear and concise description of what the bug is
      placeholder: |
        What happened?
    validations:
      required: true

  - type: textarea
    id: reproduce
    attributes:
      label: Steps to reproduce
      description: Steps to reproduce the behavior
      placeholder: |
        1. Go to '...'
        2. Click on '...'
        3. See error
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
      description: What should happen instead?
      placeholder: The page should load correctly

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots
      description: Add screenshots if applicable

  - type: dropdown
    id: browser
    attributes:
      label: Browser
      options:
        - Chrome
        - Firefox
        - Safari
        - Edge
        - Other
    validations:
      required: true

  - type: textarea
    id: logs
    attributes:
      label: Browser console errors
      description: Any error messages from the browser console
      render: bash

  - type: textarea
    id: additional
    attributes:
      label: Additional context
      description: Any other context about the problem
