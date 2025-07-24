import subprocess


def main():
    subprocess.run(["uvx", "--from" , "commitizen", "cz", "commit"], check=False)
if __name__ == "__main__":
    main()
