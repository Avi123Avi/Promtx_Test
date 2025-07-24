import os
import subprocess
import sys
from typing import Any, List, Optional
 
import tomllib
 
 
def main():
    config_path = os.path.join(os.path.dirname(__file__), "..", "pyproject.toml")
 
    with open(config_path, "rb") as file:
        toml_dict: dict[str, Any] = tomllib.load(file)
 
    app_list: List[str] = toml_dict["tool"]["uv"]["workspace"]["members"]
    app_list = [service for service in app_list if service.startswith("apps/")]
    app_list = [service.replace("apps/", "") for service in app_list ]
    app_list.sort()
    services = { "docs": "docs", "0": "docs" }

    print("Select a service to start:")
    for index, app_name in enumerate(app_list, start=1):
        services[str(index)] = app_name
        services[app_name] = app_name
        print(f"{index}) {app_name}")
    print("0) docs")

    choice: str = ""
    if len(sys.argv) > 1:
        print("Your choice: ", sys.argv[1])
        choice = sys.argv[-1]
    else:
        choice = input(f"Enter your choice (0-{len(app_list)}): ").strip().lower()
    service: Optional[str] = services.get(choice)
    if service:
        print("-----------------")
        print(f"Starting service: {service}")
 
        if service == "docs":
            subprocess.run(["uv", "run", "--package", "docs", "mkdocs", "serve", "--config-file", "docs/config.yaml"], check=False)
        else:
            subprocess.run(["uv", "run", "--package", f"{service}", f"apps/{service}/main.py"], check=False)
    else:
        print("Invalid choice")
        sys.exit(1)
 
if __name__ == "__main__":
    main()