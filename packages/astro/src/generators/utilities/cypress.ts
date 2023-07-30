export async function importNrwlCypress(): Promise<
  typeof import('@nx/cypress')
> {
  try {
    return await import('@nx/cypress');
  } catch {
    throw new Error(
      `The "@nx/cypress" package is missing and it's required to generate an E2E project. Please install it and try again.`
    );
  }
}
