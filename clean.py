import os
import shutil


def remove_suffix(path: str, suffix: str):
    """Remove files, dirs ending with given suffix recursively."""
    for root, dirs, files in os.walk(path):
        for dir in dirs:
            if dir.endswith(f"{suffix}"):
                egg_info_path = os.path.join(root, dir)
                safe_remove(egg_info_path)
    print(f"Removed: {suffix}")

def safe_remove(path):
    if os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.remove(path)
        print(f"Removed: {path}")
    else:
        print(f"Skipped: {path} (not found)")

def main():
    paths = [".ruff_cache", ".venv", "tmp", "uv.lock"]
    for path in paths:
        safe_remove(path)
    remove_suffix(".", ".egg-info")
    remove_suffix(".", "__pycache__")


if __name__ == "__main__":
    main()
