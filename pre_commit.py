import subprocess
import sys

def run_checks():
    print("Running Pre-commit Checks...")

    # 1. Build check
    print("1. Running Build...")
    build_result = subprocess.run(["npm", "run", "build"], capture_output=True, text=True)
    if build_result.returncode != 0:
        print("Build failed!")
        print(build_result.stderr)
        return False
    print("Build passed!")

    # 2. Test check
    print("2. Running Tests...")
    test_result = subprocess.run(["npm", "run", "test", "--", "--watchAll=false"], capture_output=True, text=True)
    if test_result.returncode != 0:
        print("Tests failed!")
        print(test_result.stderr)
        return False
    print("Tests passed!")

    return True

if __name__ == "__main__":
    success = run_checks()
    if not success:
        sys.exit(1)
