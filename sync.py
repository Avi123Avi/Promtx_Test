import asyncio
import os
import subprocess
from typing import Any, List

import tomllib


async def sync(package:str):
    subprocess.run(["uv", "sync", "--package", package], check=False)

async def main():
    config_path = os.path.join(os.path.dirname(__file__), "..", "pyproject.toml")
    with open(config_path, "rb") as file:
        toml_dict: dict[str, Any] = tomllib.load(file)

    app_list: List[str] = toml_dict["tool"]["uv"]["workspace"]["members"]
    for app in app_list:
        if app.split('/') == "apps":
            app_list.append(str(app.split('/')[-1])+"svc")
        else:
            app_list.append(app.split('/')[-1])

    
    subprocess.run(["uv", "sync"], check=False)
    tasks = [sync(package) for package in app_list]
    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
