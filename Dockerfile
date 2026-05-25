# Use the official lightweight Bun image
FROM oven/bun:alpine

# Set the working directory
WORKDIR /app

# Copy dependency files first to cache them
COPY package.json bun.lock ./

# Install dependencies (production-focused if needed, but here we just install everything based on the lockfile)
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port your Express app runs on
EXPOSE 3000

# Run the application directly with Bun (which natively supports TypeScript)
CMD ["bun", "run", "src/index.ts"]
