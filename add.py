import subprocess


def run_uv_add_command(package: str, dependency: str):
    """Run the 'uv add --package <package> <dependency>' command."""
    try:
        # Run the command and capture the output
        result = subprocess.run(["uv", "add", "--package", package, dependency], check=False)
        print(f"Command output:\n{result.stdout}")
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while running the command: {e.stderr}")

def main():
    package = input("Package: ")
    dependency = input("Dependency: ")

    run_uv_add_command(package, dependency)

if __name__ == "__main__":
    main()
