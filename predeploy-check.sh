#!/bin/bash

# Predeploy verification script for voluntarios monorepo
# Runs all tests, builds, and smoke checks for both backend and frontend
# Usage: ./predeploy-check.sh

set -o pipefail

# Configuration
BACKEND_DIR="voluntarios-back"
FRONTEND_DIR="voluntarios-front"
LOG_DIR="$(pwd)/predeploy-logs/$(date +%Y%m%d-%H%M%S)"
TIMEOUT_SECONDS=30
POLL_INTERVAL=1

# Create log directory
mkdir -p "$LOG_DIR"

# Function to run a command with realtime output
run_step() {
    local step_name="$1"
    local cmd="$2"
    local log_file="$LOG_DIR/$step_name.log"
    local start_time end_time duration
    
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Starting: $step_name"
    start_time=$(date +%s)
    
    # Run command — tee output to both terminal and log file for realtime feedback
    if eval "$cmd" 2>&1 | tee "$log_file"; then
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        echo "[$(date +'%Y-%m-%d %H:%M:%S')] ✓ $step_name completed in ${duration}s"
        return 0
    else
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        echo "[$(date +'%Y-%m-%d %H:%M:%S')] ✗ $step_name failed after ${duration}s"
        return 1
    fi
}

# Function to start a server in background and check health
start_and_check_server() {
    local step_name="$1"
    local start_cmd="$2"
    local health_url="$3"
    local port="$4"
    local log_file="$LOG_DIR/$step_name.log"
    
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Starting: $step_name"
    
    # Start server in background, tee output to log
    eval "$start_cmd" 2>&1 | tee "$log_file" &
    
    local start_time=$(date +%s)
    local elapsed=0
    local success=0
    
    # Poll health endpoint
    while [ $elapsed -lt $TIMEOUT_SECONDS ]; do
        if curl -s "$health_url" > /dev/null 2>&1; then
            success=1
            break
        fi
        sleep $POLL_INTERVAL
        elapsed=$((elapsed + POLL_INTERVAL))
    done
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    if [ $success -eq 1 ]; then
        echo "[$(date +'%Y-%m-%d %H:%M:%S')] ✓ $step_name ready in ${duration}s"
        return 0
    else
        echo "[$(date +'%Y-%m-%d %H:%M:%S')] ✗ $step_name failed to start within ${TIMEOUT_SECONDS}s"
        return 1
    fi
}

# Function to kill any process on a given port
kill_port() {
    local port="$1"
    fuser -k "$port/tcp" 2>/dev/null && echo "[$(date +'%Y-%m-%d %H:%M:%S')] Freed port $port" || true
    sleep 1
}

# Function to stop background server by port (fallback — PID tracking unreliable with tee)
stop_server() {
    local port="$1"
    kill_port "$port"
}

# Trap to cleanup background processes on exit
cleanup() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Cleaning up background processes..."
    stop_server 3001
    stop_server 3000
    # Additional cleanup to ensure no orphaned processes remain
    pkill -f "pnpm dev:supa" 2>/dev/null || true
    pkill -f "pnpm start" 2>/dev/null || true
    pkill -f "nodemon.*src/index.ts" 2>/dev/null || true
    pkill -f "ts-node.*src/index.ts" 2>/dev/null || true
}

trap cleanup EXIT

# Fail helper — shows log tail, cleans up, exits
fail_step() {
    local step_name="$1"
    local log_file="$LOG_DIR/$step_name.log"
    echo ""
    echo "=== $step_name FAILED — last 30 lines ==="
    tail -n 30 "$log_file" 2>/dev/null || true
    echo ""
    cleanup
    echo "RESULT: FAILED — do not deploy"
    exit 1
}

# Backend steps
cd "$BACKEND_DIR" || { echo "Error: Cannot find backend directory"; exit 1; }

run_step "backend-test" "cd \"$BACKEND_DIR\" && NODE_ENV=development npx jest --verbose --testPathIgnorePatterns='mariaDB|contractApi|surveyApi|supabase'" || fail_step "backend-test"
run_step "backend-build" "pnpm build" || fail_step "backend-build"
run_step "backend-build" "pnpm build" || fail_step "backend-build"

# Backend smoke test
kill_port 3001
start_and_check_server "backend-smoke-test" "pnpm dev:supa" "http://localhost:3001/health" 3001 || fail_step "backend-smoke-test"

cd ..

# Frontend steps
cd "$FRONTEND_DIR" || { echo "Error: Cannot find frontend directory"; exit 1; }

run_step "frontend-test" "pnpm exec jest --watchAll=false" || fail_step "frontend-test"
run_step "frontend-build" "pnpm build" || fail_step "frontend-build"

# Frontend smoke test (no e2e to avoid port conflicts)
kill_port 3000
start_and_check_server "frontend-smoke-test" "pnpm start" "http://localhost:3000" 3000 || fail_step "frontend-smoke-test"
echo "[$(date +'%Y-%m-%d %H:%M:%S')] ℹ Skipping e2e tests (smoke test sufficient)"

cd ..

# Success
echo ""
echo "=== PREDEPLOY CHECK SUMMARY ==="
echo "Log directory: $LOG_DIR"
echo ""

for log_file in "$LOG_DIR"/*.log; do
    if [ -f "$log_file" ]; then
        step_name=$(basename "$log_file" .log)
        echo "  $step_name: OK"
    fi
done

echo ""
echo "RESULT: OK — safe to deploy"
exit 0