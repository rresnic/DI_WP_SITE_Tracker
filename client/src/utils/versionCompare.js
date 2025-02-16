import semver from 'semver';

/**
 * Determines if the installedVersion is within the given affected range.
 *
 * @param {string} installedVersion - The version installed (expected in semver format, e.g. "4.3.2").
 * @param {string} rangeStr - The affected version range (e.g. "* - 4.3.5" or "[4.1.0, 4.1.34)" ).
 * @returns {boolean} - True if installedVersion is affected; false otherwise.
 */
export function isVersionAffected(installedVersion, rangeStr) {
  let lowerBound, upperBound;
  let lowerInclusive = true;
  let upperInclusive = true;

  // If the range string contains bracket notation
  if (rangeStr.startsWith('[') || rangeStr.startsWith('(')) {
    // Determine inclusiveness from the first and last character
    lowerInclusive = rangeStr.startsWith('[');
    upperInclusive = rangeStr.endsWith(']');
    // Remove the outer brackets/parentheses
    const inner = rangeStr.slice(1, -1);
    const parts = inner.split(',').map(part => part.trim());
    // For the lower bound, treat "*" as 0.0.0
    lowerBound = parts[0] === '*' ? '0.0.0' : parts[0];
    upperBound = parts[1];
  }
  // If the range uses a hyphen notation (e.g. "* - 4.3.5" or "1.2.0 - 2.3.4")
  else if (rangeStr.includes('-')) {
    const parts = rangeStr.split('-').map(part => part.trim());
    lowerBound = parts[0] === '*' ? '0.0.0' : parts[0];
    upperBound = parts[1];
    // For a simple hyphen notation, we'll assume both bounds are inclusive
    lowerInclusive = true;
    upperInclusive = true;
  }
  // If the range does not contain any range separator,
  // then assume it's a single version and compare directly.
  else {
    // For single-number versions, flag as affected only if exactly equal
    return installedVersion === rangeStr;
  }

  // Validate that the bounds are proper semver strings.
  // (If they aren't, you might need custom logic.)
  if (!semver.valid(installedVersion) || !semver.valid(lowerBound) || !semver.valid(upperBound)) {
    // For this example, if any version doesn't conform to semver,
    // we'll default to strict equality.
    return installedVersion === lowerBound && installedVersion === upperBound;
  }

  // Compare lower bound
  const lowerCheck = lowerInclusive ? semver.gte(installedVersion, lowerBound) : semver.gt(installedVersion, lowerBound);
  // Compare upper bound
  const upperCheck = upperInclusive ? semver.lte(installedVersion, upperBound) : semver.lt(installedVersion, upperBound);

  return lowerCheck && upperCheck;
}
