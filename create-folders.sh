#!/bin/bash

# Create the main docs directory
mkdir -p docs

# Create the planning directory and files
mkdir -p docs/01-planning
touch docs/01-planning/project-brief.md
touch docs/01-planning/requirements.md
touch docs/01-planning/user-stories.md
touch docs/01-planning/user-personas.md

# Create the architecture directory and files
mkdir -p docs/02-architecture
touch docs/02-architecture/architecture-diagram.png
touch docs/02-architecture/tech-stack.md
touch docs/02-architecture/data-flow.png
touch docs/02-architecture/database-schema.md

# Create the design directory and files
mkdir -p docs/03-design/wireframes
touch docs/03-design/style-guide.md
touch docs/03-design/prototype-links.md
touch docs/03-design/user-journeys.md

# Create the development directory and files
mkdir -p docs/04-development
touch docs/04-development/coding-standards.md
touch docs/04-development/git-workflow.md
touch docs/04-development/component-library.md
touch docs/04-development/api-docs.md

# Create the testing directory and files
mkdir -p docs/05-testing
touch docs/05-testing/test-plan.md
touch docs/05-testing/test-cases.md
touch docs/05-testing/qa-checklist.md

# Create the deployment directory and files
mkdir -p docs/06-deployment
touch docs/06-deployment/deployment-strategy.md
touch docs/06-deployment/environment-variables.md
touch docs/06-deployment/monitoring.md

# Create the user guides directory and files
mkdir -p docs/07-user-guides
touch docs/07-user-guides/user-manual.md
touch docs/07-user-guides/admin-guide.md
touch docs/07-user-guides/faq.md

# Add basic headers to each markdown file
for file in $(find docs -name "*.md"); do
  filename=$(basename "$file" .md)
  title=$(echo $filename | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1')
  echo "# $title" > "$file"
  echo "" >> "$file"
  echo "## Overview" >> "$file"
  echo "" >> "$file"
  echo "*This document is part of the Tender Track 360 project documentation.*" >> "$file"
done

echo "Documentation structure has been created successfully!"