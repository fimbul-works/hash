import { faker } from "@faker-js/faker";

/**
 * Generates a sequence of integers from start to end (exclusive).
 */
export function* generateSequence(start: number, end: number): Generator<number> {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

/**
 * Generates a list of random route paths using faker.
 */
export function generatePaths(count: number): string[] {
  const paths: string[] = [];
  const templates = ["/", "/user", "/user/:id", "/posts/:id", "/category/:slug", "/api/v1/resource"];

  for (let i = 0; i < count; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    let path = template;

    if (path.includes(":id")) {
      path = path.replace(":id", faker.string.uuid());
    }
    if (path.includes(":slug")) {
      path = path.replace(":slug", faker.lorem.slug());
    }

    // Ensure uniqueness even for templates without placeholders
    path += (path.includes("?") ? "&" : "?") + `_t=${i}`;

    // Add some random query params or subpaths
    if (Math.random() > 0.7) {
      path += `&val=${faker.lorem.word()}`;
    }

    paths.push(path);
  }
  return paths;
}

/**
 * Pre-calculates a batch of mixed data for benchmark stability.
 */
export function getBenchmarkData(count: number) {
  return {
    numbers: Array.from({ length: count }, (_, i) => i + 1),
    paths: generatePaths(count),
    uuids: Array.from({ length: count }, () => faker.string.uuid()),
  };
}
