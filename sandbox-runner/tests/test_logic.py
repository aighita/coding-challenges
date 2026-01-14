"""
Unit tests for Sandbox Runner - Code execution logic.
Isolated tests that don't require external connections.
"""
import pytest
import os
import subprocess
import tempfile
import time
import re


def extract_function_name(code: str) -> str:
    """Extract function name from Python code."""
    match = re.search(r"def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(", code)
    return match.group(1) if match else None


def create_driver_code(code: str, func_name: str) -> str:
    """Create driver code that executes the function with inputs."""
    driver = f"""
import sys
if __name__ == "__main__":
    try:
        input_data = sys.stdin.read().strip()
        if input_data:
            scope = {{}}
            exec(input_data, {{}}, scope)
            result = {func_name}(**scope)
            print(repr(result))
        else:
            print({func_name}())
    except Exception as e:
        print(f"Error: {{e}}", file=sys.stderr)
        sys.exit(1)
"""
    return code + driver


def execute_python_code(code: str, stdin_input: str, timeout: int = 5) -> tuple:
    """
    Execute Python code with given input.
    Returns (success, stdout, stderr).
    """
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        temp_file = f.name
    
    try:
        result = subprocess.run(
            ['python3', temp_file],
            input=stdin_input,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        return result.returncode == 0, result.stdout.strip(), result.stderr.strip()
    except subprocess.TimeoutExpired:
        return False, "", "Timeout"
    except Exception as e:
        return False, "", str(e)
    finally:
        os.unlink(temp_file)


def run_test_case(code: str, test_input: str, expected_output: str) -> tuple:
    """
    Run a single test case.
    Returns (passed, actual_output, message).
    """
    func_name = extract_function_name(code)
    if not func_name:
        return False, "", "Could not find function definition"
    
    full_code = create_driver_code(code, func_name)
    success, stdout, stderr = execute_python_code(full_code, test_input)
    
    if not success:
        return False, stderr, "Runtime error"
    
    # Compare output
    actual = stdout.strip()
    expected = expected_output.strip()
    
    if actual == expected:
        return True, actual, "Passed"
    else:
        return False, actual, f"Expected {expected}, got {actual}"


class TestFunctionNameExtraction:
    """Tests for function name extraction."""
    
    def test_simple_function(self):
        """Test extracting simple function name."""
        code = "def add(a, b):\n    return a + b"
        assert extract_function_name(code) == "add"
    
    def test_function_with_underscore(self):
        """Test extracting function with underscore."""
        code = "def my_function():\n    pass"
        assert extract_function_name(code) == "my_function"
    
    def test_function_with_numbers(self):
        """Test extracting function with numbers."""
        code = "def solution123():\n    pass"
        assert extract_function_name(code) == "solution123"
    
    def test_no_function(self):
        """Test with no function definition."""
        code = "x = 5\ny = 10"
        assert extract_function_name(code) is None
    
    def test_multiple_functions(self):
        """Test that first function is extracted."""
        code = "def first():\n    pass\ndef second():\n    pass"
        assert extract_function_name(code) == "first"


class TestDriverCodeGeneration:
    """Tests for driver code generation."""
    
    def test_creates_valid_python(self):
        """Test that generated driver code is valid Python."""
        code = "def add(a, b):\n    return a + b"
        driver = create_driver_code(code, "add")
        
        # Should compile without errors
        compile(driver, '<string>', 'exec')
    
    def test_includes_original_code(self):
        """Test that driver includes original code."""
        code = "def add(a, b):\n    return a + b"
        driver = create_driver_code(code, "add")
        
        assert "def add(a, b):" in driver
        assert "return a + b" in driver
    
    def test_includes_stdin_handling(self):
        """Test that driver includes stdin handling."""
        code = "def solution():\n    pass"
        driver = create_driver_code(code, "solution")
        
        assert "sys.stdin.read()" in driver


class TestCodeExecution:
    """Tests for code execution."""
    
    def test_simple_addition(self):
        """Test executing simple addition."""
        code = "def add(a, b):\n    return a + b"
        
        passed, output, msg = run_test_case(code, "a=1\nb=2", "3")
        assert passed is True
    
    def test_string_return(self):
        """Test function returning string."""
        code = "def greet(name):\n    return f'Hello, {name}!'"
        
        passed, output, msg = run_test_case(code, "name='World'", "'Hello, World!'")
        assert passed is True
    
    def test_list_return(self):
        """Test function returning list."""
        code = "def double_list(nums):\n    return [x * 2 for x in nums]"
        
        passed, output, msg = run_test_case(code, "nums=[1, 2, 3]", "[2, 4, 6]")
        assert passed is True
    
    def test_wrong_answer(self):
        """Test detecting wrong answer."""
        code = "def add(a, b):\n    return a"  # Bug
        
        passed, output, msg = run_test_case(code, "a=1\nb=2", "3")
        assert passed is False
        assert "Expected" in msg
    
    def test_syntax_error(self):
        """Test detecting syntax error."""
        code = "def broken(\n    pass"  # Missing closing paren
        
        passed, output, msg = run_test_case(code, "", "")
        assert passed is False


class TestVerdictDetermination:
    """Tests for verdict determination logic."""
    
    def determine_verdict(self, test_results: list) -> str:
        """Determine overall verdict from test results."""
        if not test_results:
            return "PASSED"  # No tests
        
        for passed, output, msg in test_results:
            if "Runtime error" in msg or "Timeout" in msg:
                return "RUNTIME_ERROR"
            if not passed:
                return "WRONG_ANSWER"
        
        return "PASSED"
    
    def test_all_passed(self):
        """Test all tests passed."""
        results = [(True, "3", "Passed"), (True, "5", "Passed")]
        assert self.determine_verdict(results) == "PASSED"
    
    def test_one_failed(self):
        """Test one test failed."""
        results = [(True, "3", "Passed"), (False, "4", "Expected 5, got 4")]
        assert self.determine_verdict(results) == "WRONG_ANSWER"
    
    def test_runtime_error(self):
        """Test runtime error."""
        results = [(False, "", "Runtime error")]
        assert self.determine_verdict(results) == "RUNTIME_ERROR"
    
    def test_empty_tests(self):
        """Test no test cases."""
        results = []
        assert self.determine_verdict(results) == "PASSED"


class TestSecurityValidation:
    """Tests for security validation of code."""
    
    def has_dangerous_imports(self, code: str) -> bool:
        """Check for dangerous imports."""
        dangerous = ['os', 'subprocess', 'sys', 'socket', 'requests']
        for module in dangerous:
            if f"import {module}" in code:
                return True
            if f"from {module}" in code:
                return True
        return False
    
    def has_file_operations(self, code: str) -> bool:
        """Check for file operations."""
        patterns = ['open(', 'write(', 'read(', '__file__']
        return any(p in code for p in patterns)
    
    def test_clean_code(self):
        """Test that clean code passes."""
        code = "def add(a, b):\n    return a + b"
        assert self.has_dangerous_imports(code) is False
        assert self.has_file_operations(code) is False
    
    def test_os_import(self):
        """Test detection of os import."""
        code = "import os\ndef evil():\n    os.system('rm -rf /')"
        assert self.has_dangerous_imports(code) is True
    
    def test_subprocess_import(self):
        """Test detection of subprocess import."""
        code = "import subprocess\ndef run():\n    subprocess.run(['ls'])"
        assert self.has_dangerous_imports(code) is True
    
    def test_file_open(self):
        """Test detection of file operations."""
        code = "def read_file():\n    with open('/etc/passwd') as f:\n        return f.read()"
        assert self.has_file_operations(code) is True


class TestInputParsing:
    """Tests for input parsing."""
    
    def parse_input(self, input_str: str) -> dict:
        """Parse input string into variables."""
        scope = {}
        exec(input_str, {}, scope)
        return scope
    
    def test_simple_variables(self):
        """Test parsing simple variables."""
        result = self.parse_input("a=5\nb=10")
        assert result["a"] == 5
        assert result["b"] == 10
    
    def test_list_variable(self):
        """Test parsing list variable."""
        result = self.parse_input("nums=[1, 2, 3]")
        assert result["nums"] == [1, 2, 3]
    
    def test_string_variable(self):
        """Test parsing string variable."""
        result = self.parse_input("s='hello'")
        assert result["s"] == "hello"
    
    def test_complex_expression(self):
        """Test parsing complex expression."""
        result = self.parse_input("data={'a': 1, 'b': [1, 2]}")
        assert result["data"] == {'a': 1, 'b': [1, 2]}
