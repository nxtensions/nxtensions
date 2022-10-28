export async function importNrwlCypress(): Promise<
  typeof import('@nrwl/cypress')
> {
  try {
    return await import('@nrwl/cypress');
  } catch {
    throw new Error(
      `The "@nrwl/cypress" package is missing and it's required to generate an E2E project. Please install it and try again.`
    );
  }
}
