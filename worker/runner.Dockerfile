FROM alpine:latest

# Install build dependencies and valgrind
RUN apk add --no-cache build-base valgrind python3 bash

# Create a non-root user
RUN adduser -D -u 1000 benchmark

# Set working directory
WORKDIR /app

# Default to running as the benchmark user is handled at runtime 
# to allow volume mounting permissions if needed, 
# but we can set it here if we ensure permissions are correct.
# For now, we leave it to the caller (worker) to specify user if needed, 
# or we can enforce it here.
# Enforcing it here is safer.
USER benchmark

