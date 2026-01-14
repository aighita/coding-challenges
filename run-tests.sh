#!/bin/bash
# Test Runner Script for Coding Challenges Platform
# Runs all unit and integration tests for backend services and frontend

set -e

echo "========================================"
echo "Coding Challenges - Test Suite Runner"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track test results
FAILED_TESTS=()

setup_venv() {
    local service=$1
    local service_dir=$2
    
    echo -e "${YELLOW}Setting up venv for ${service}...${NC}"
    
    cd "$service_dir"
    
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    # Install requirements and upgrade pytest to satisfy pytest-asyncio (suppress warnings)
    pip install -q -r requirements.txt 2>/dev/null
    pip install -q --upgrade "pytest>=8.2" pytest-asyncio==0.24.0 pydantic[email] 2>/dev/null
    deactivate
    
    cd - > /dev/null
}

run_test() {
    local service=$1
    local test_dir=$2
    
    echo ""
    echo "----------------------------------------"
    echo -e "${YELLOW}Running tests for: ${service}${NC}"
    echo "----------------------------------------"
    
    if [ -d "$test_dir" ]; then
        cd "$test_dir"
        
        if [ -f "requirements.txt" ]; then
            # Activate venv and run tests
            source venv/bin/activate
            if python -m pytest tests/ -v --tb=short 2>&1; then
                echo -e "${GREEN}✓ ${service} tests passed${NC}"
            else
                echo -e "${RED}✗ ${service} tests failed${NC}"
                FAILED_TESTS+=("$service")
            fi
            deactivate
        fi
        
        cd - > /dev/null
    else
        echo -e "${YELLOW}⚠ No test directory found for ${service}${NC}"
    fi
}

run_frontend_tests() {
    echo ""
    echo "----------------------------------------"
    echo -e "${YELLOW}Running tests for: Frontend${NC}"
    echo "----------------------------------------"
    
    cd frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    
    if npm test -- --passWithNoTests 2>&1; then
        echo -e "${GREEN}✓ Frontend tests passed${NC}"
    else
        echo -e "${RED}✗ Frontend tests failed${NC}"
        FAILED_TESTS+=("Frontend")
    fi
    
    cd - > /dev/null
}

# Setup virtual environments first
echo ""
echo "========================================"
echo "Setting up Python Virtual Environments"
echo "========================================"

setup_venv "Challenges Service" "challenges"
setup_venv "Users Service" "users"
setup_venv "Gateway" "gateway"
setup_venv "Sandbox Runner" "sandbox-runner"

# Run backend tests
echo ""
echo "========================================"
echo "Backend Service Tests (Python/pytest)"
echo "========================================"

run_test "Challenges Service" "challenges"
run_test "Users Service" "users"
run_test "Gateway" "gateway"
run_test "Sandbox Runner" "sandbox-runner"

# Run frontend tests
echo ""
echo "========================================"
echo "Frontend Tests (Jest)"
echo "========================================"

run_frontend_tests

# Summary
echo ""
echo "========================================"
echo "Test Summary"
echo "========================================"

if [ ${#FAILED_TESTS[@]} -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Failed tests:${NC}"
    for test in "${FAILED_TESTS[@]}"; do
        echo -e "  ${RED}✗ ${test}${NC}"
    done
    exit 1
fi
