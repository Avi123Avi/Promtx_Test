import os
import subprocess
import sys
from typing import Any, List

import tomllib


def main():
    config_path = os.path.join(os.path.dirname(__file__), "..", "pyproject.toml")

    with open(config_path, "rb") as file:
        toml_dict: dict[str, Any] = tomllib.load(file)

    app_list: List[str] = toml_dict["tool"]["uv"]["workspace"]["members"]
    app_list = [service for service in app_list if service.startswith("apps/")]
    app_list = [service.replace("apps/", "") for service in app_list]
    app_list.sort()
    services = {}

    print("Select a service to build container:")
    for index, app_name in enumerate(app_list, start=1):
        services[index] = app_name
        services[app_name] = app_name
        print(f"{index}) {app_name}")

    choice = input(f"Enter your choice (0-{len(app_list)}): ").strip().lower()
    tag = input("Enter container tag: ").strip()

    if choice in services:
        service = services[choice]
        print("-----------------")
        print(f"Starting service: {service}")
        subprocess.run(["docker", "build", "-f", f"docker/{service}.Dockerfile", "-t", f"promptxpy.azurecr.io/{service}-srv:{tag}", "."], check=False)
    else:
        print("Invalid choice")
        sys.exit(1)

if __name__ == "__main__":
    main()
