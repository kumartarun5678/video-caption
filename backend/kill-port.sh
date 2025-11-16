
PORT=${PORT:-8000}
lsof -ti:$PORT | xargs kill -9 2>/dev/null
echo "Port $PORT cleared"

