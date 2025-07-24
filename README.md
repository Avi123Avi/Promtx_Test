**L**ayered **U**nified **M**odel for **Y**ielding **N**arratives
---

## Project Overview

Lumyn is a Python project utilizing the `uv` workspace management tool to organize multiple applications and libraries in a monorepo structure.

## Prerequisites

- Python 3.10+
- [uv](https://github.com/astral-sh/uv) - Python packaging and dependency management tool
- Node.Js - For running scripts
- AWS CLI

## Project Structure

```
Project
│
├── apps/                # Application directories
│   ├── aws/
│   ├── generation/
│   └── community/
│
├── libs/
│   ├── core/
│   ├── shared/
│   │   ├── cache/
│   │   ├── evaluation/
│   │   └── gaurdrail/
│   ├── backend/
│   ├── generation/
│   ├── object-storage/
│   ├── opensearch/
│   ├── secrets/
│   └── shared/
│
├── test/
│   ├── intergation/
│   └── performance/
│
├── scripts/
├── docs/
├── Makefile
├── pyproject.toml       # Workspace configuration
├── uv.toml              # uv-specific configuration
└── README.md            # Project documentation
```

## Setup and Installation

### 1. Install uv

Installation Guide: https://docs.astral.sh/uv/getting-started/installation/

### 2. Clone the Repository

```bash
git clone https://PrivateLLM@dev.azure.com/PrivateLLM/PrivateLLMwithAdvancedRAG/_git/lumyn
cd lumyn
```

### 3. Sync dependencies

```bash
uv sync
```

## Workspace Management

### Managing Dependencies

#### Add Workspace-wide Dependencies
```bash
uv add requests      # Adds to pyproject.toml
```

#### Add Dependencies to Specific App/Lib
```bash
uv add --package aws fastapi
uv add --package vectorstore sqlalchemy
```

```bash
uv add --package aws black --dev # Adding Dev Dependency
```

#### Remove Dependencies to Specific App/Lib
```bash
uv remove --package aws fastapi
uv remove --package vectorstore sqlalchemy
```

## Running Applications

### Webapp
```bash
npm run server
# or
uv run scripts/server.py
```

## View Documentation

1. Run this command on terminal : `npm run sever`.
2. Enter `docs` in terminal
2. Open [localhost:8000/](http://127.0.0.1:8000/)

---

### Common Fixes for Python Monorepo Projects

#### 1. Module Import Errors

Module import errors are prevalent in Python monorepo projects, often due to structural or configuration inconsistencies. Here's how to address them:

**a. Adherence to Python Best Practices**
   - Ensure your project adheres to Python's best practices for directory and module organization.
   - Check if any recent changes in your code follow linting rules but break your project's specific structural guidelines.

**b. Correct Import Paths**
   - Libraries should be imported relative to the directory containing the `src/` folder. For example:
     ```
     library-name/
     ├── src/
     │   ├── library_name/
     │       ├── dir1/
     │           └── file.py
     │       ├── dir2/
     ```
     Correct import:
     ```python
     from library_name.dir1.file import <object/func/class>
     ```

**c. Intra-Service Imports**
   - When working within a service (e.g., a backend service inside `apps/`), ensure intra-app imports start with `src`. For example:
     ```
     apps/
     ├── my_service/
     │   ├── src/
     │       ├── controller.py
     │       ├── service/
     │           └── application_service.py
     ```
     Correct import:
     ```python
     from src.controller import ApplicationController
     ```
  
**d. Re-sync Project Dependencies**  

1. Delete the `.venv/` directory and `uv.lock` from the root of your project.  

2. Open a terminal and run `npm run sync`.

3. Close your code editor (e.g., VSCode) and restart your computer.

4. Take a short coffee break to recharge.  

5. Reopen the project and try again.

By following these fixes, you'll resolve most import errors and streamline development in Python monorepo projects.
