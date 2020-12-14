/**
 * This library modifies the diff-patch-match library by Neil Fraser
 * by removing the patch and match functionality and certain advanced
 * options in the diff function. The original license is as follows:
 *
 * ===
 *
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class DiffString {
  /**
   * The data structure representing a diff is an array of tuples:
   * [[DIFFDELETE, 'Hello'], [DIFFINSERT, 'Goodbye'], [DIFFEQUAL, ' world.']]
   * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
   */
  public static DIFFDELETE = -1;
  public static DIFFINSERT = 1;
  public static DIFFEQUAL = 0;

  /**
   * Find the differences between two texts.  Simplifies the problem by stripping
   * any common prefix or suffix off the texts before diffing.
   * @param {string} text1 Old string to be diffed.
   * @param {string} text2 New string to be diffed.
   * @return {Array} Array of diff tuples.
   */
  diffMain(text1: any, text2: any): any {
    // Check for equality (speedup).
    if (text1 === text2) {
      if (text1) {
        return [[DiffString.DIFFEQUAL, text1]];
      }
      return [];
    }

    // Trim off common prefix (speedup).
    let commonlength = this.diffCommonPrefix(text1, text2);
    const commonprefix = text1.substring(0, commonlength);
    text1 = text1.substring(commonlength);
    text2 = text2.substring(commonlength);

    // Trim off common suffix (speedup).
    commonlength = this.diffCommonSuffix(text1, text2);
    const commonsuffix = text1.substring(text1.length - commonlength);
    text1 = text1.substring(0, text1.length - commonlength);
    text2 = text2.substring(0, text2.length - commonlength);

    // Compute the diff on the middle block.
    const diffs = this.diffCompute_(text1, text2);

    // Restore the prefix and suffix.
    if (commonprefix) {
      diffs.unshift([DiffString.DIFFEQUAL, commonprefix]);
    }
    if (commonsuffix) {
      diffs.push([DiffString.DIFFEQUAL, commonsuffix]);
    }
    this.diffCleanupMerge(diffs);
    return diffs;
  }


  /**
   * Find the differences between two texts.  Assumes that the texts do not
   * have any common prefix or suffix.
   * @param {string} text1 Old string to be diffed.
   * @param {string} text2 New string to be diffed.
   * @return {Array} Array of diff tuples.
   */
  private diffCompute_(text1: any, text2: any) {
    let diffs: any;

    if (!text1) {
      // Just add some text (speedup).
      return [[DiffString.DIFFINSERT, text2]];
    }

    if (!text2) {
      // Just delete some text (speedup).
      return [[DiffString.DIFFDELETE, text1]];
    }

    const longtext = text1.length > text2.length ? text1 : text2;
    const shorttext = text1.length > text2.length ? text2 : text1;
    const i = longtext.indexOf(shorttext);
    if (i !== -1) {
      // Shorter text is inside the longer text (speedup).
      diffs = [[DiffString.DIFFINSERT, longtext.substring(0, i)],
        [DiffString.DIFFEQUAL, shorttext],
        [DiffString.DIFFINSERT, longtext.substring(i + shorttext.length)]];
      // Swap insertions for deletions if diff is reversed.
      if (text1.length > text2.length) {
        diffs[0][0] = diffs[2][0] = DiffString.DIFFDELETE;
      }
      return diffs;
    }

    if (shorttext.length === 1) {
      // Single character string.
      // After the previous speedup, the character can't be an equality.
      return [[DiffString.DIFFDELETE, text1], [DiffString.DIFFINSERT, text2]];
    }

    // Check to see if the problem can be split in two.
    const hm = this.diffHalfMatch_(text1, text2);
    if (hm) {
      // A half-match was found, sort out the return data.
      const text1A = hm[0];
      const text1B = hm[1];
      const text2A = hm[2];
      const text2B = hm[3];
      const midCommon = hm[4];
      // Send both pairs off for separate processing.
      const diffsA = this.diffMain(text1A, text2A);
      const diffsB = this.diffMain(text1B, text2B);
      // Merge the results.
      return diffsA.concat([[DiffString.DIFFEQUAL, midCommon]], diffsB);
    }

    return this.diffBisect_(text1, text2);
  }

  /**
   * Find the 'middle snake' of a diff, split the problem in two
   * and return the recursively constructed diff.
   * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
   * @param {string} text1 Old string to be diffed.
   * @param {string} text2 New string to be diffed.
   * @return {Array} Array of diff tuples.
   * @private
   */
  private diffBisect_(text1: any, text2: any) {
    // Cache the text lengths to prevent multiple calls.
    const text1Length = text1.length;
    const text2Length = text2.length;
    const maxD = Math.ceil((text1Length + text2Length) / 2);
    const vOffset = maxD;
    const vLength = 2 * maxD;
    const v1 = new Array(vLength);
    const v2 = new Array(vLength);
    // Setting all elements to -1 is faster in Chrome & Firefox than mixing
    // integers and undefined.
    for (let x = 0; x < vLength; x++) {
      v1[x] = -1;
      v2[x] = -1;
    }
    v1[vOffset + 1] = 0;
    v2[vOffset + 1] = 0;
    const delta = text1Length - text2Length;
    // If the total number of characters is odd, then the front path will collide
    // with the reverse path.
    const front = (delta % 2 !== 0);
    // Offsets for start and end of k loop.
    // Prevents mapping of space beyond the grid.
    let k1start = 0;
    let k1end = 0;
    let k2start = 0;
    let k2end = 0;
    for (let d = 0; d < maxD; d++) {
      // Walk the front path one step.
      for (let k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
        const k1Offset = vOffset + k1;
        let x1: any;
        if (k1 === -d || (k1 !== d && v1[k1Offset - 1] < v1[k1Offset + 1])) {
          x1 = v1[k1Offset + 1];
        } else {
          x1 = v1[k1Offset - 1] + 1;
        }
        let y1 = x1 - k1;
        while (x1 < text1Length && y1 < text2Length &&
          text1.charAt(x1) === text2.charAt(y1)) {
          x1++;
          y1++;
        }
        v1[k1Offset] = x1;
        if (x1 > text1Length) {
          // Ran off the right of the graph.
          k1end += 2;
        } else if (y1 > text2Length) {
          // Ran off the bottom of the graph.
          k1start += 2;
        } else if (front) {
          const k2Offset = vOffset + delta - k1;
          if (k2Offset >= 0 && k2Offset < vLength && v2[k2Offset] !== -1) {
            // Mirror x2 onto top-left coordinate system.
            const x2 = text1Length - v2[k2Offset];
            if (x1 >= x2) {
              // Overlap detected.
              return this.diffBisectSplit_(text1, text2, x1, y1);
            }
          }
        }
      }

      // Walk the reverse path one step.
      for (let k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
        const k2Offset = vOffset + k2;
        let x2: number;
        if (k2 === -d || (k2 !== d && v2[k2Offset - 1] < v2[k2Offset + 1])) {
          x2 = v2[k2Offset + 1];
        } else {
          x2 = v2[k2Offset - 1] + 1;
        }
        let y2 = x2 - k2;
        while (x2 < text1Length && y2 < text2Length &&
          text1.charAt(text1Length - x2 - 1) ===
          text2.charAt(text2Length - y2 - 1)) {
          x2++;
          y2++;
        }
        v2[k2Offset] = x2;
        if (x2 > text1Length) {
          // Ran off the left of the graph.
          k2end += 2;
        } else if (y2 > text2Length) {
          // Ran off the top of the graph.
          k2start += 2;
        } else if (!front) {
          const k1Offset = vOffset + delta - k2;
          if (k1Offset >= 0 && k1Offset < vLength && v1[k1Offset] !== -1) {
            const x1 = v1[k1Offset];
            const y1 = vOffset + x1 - k1Offset;
            // Mirror x2 onto top-left coordinate system.
            x2 = text1Length - x2;
            if (x1 >= x2) {
              // Overlap detected.
              return this.diffBisectSplit_(text1, text2, x1, y1);
            }
          }
        }
      }
    }
    // Diff took too long and hit the deadline or
    // number of diffs equals number of characters, no commonality at all.
    return [[DiffString.DIFFDELETE, text1], [DiffString.DIFFINSERT, text2]];
  }


  /**
   * Given the location of the 'middle snake', split the diff in two parts
   * and recurse.
   * @param {string} text1 Old string to be diffed.
   * @param {string} text2 New string to be diffed.
   * @param {number} x Index of split point in text1.
   * @param {number} y Index of split point in text2.
   * @return {Array} Array of diff tuples.
   */
  private diffBisectSplit_(text1: any, text2: any, x: any, y: any) {
    const text1a = text1.substring(0, x);
    const text2a = text2.substring(0, y);
    const text1b = text1.substring(x);
    const text2b = text2.substring(y);

    // Compute both diffs serially.
    const diffs = this.diffMain(text1a, text2a);
    const diffsb = this.diffMain(text1b, text2b);

    return diffs.concat(diffsb);
  }


  /**
   * Determine the common prefix of two strings.
   * @param {string} text1 First string.
   * @param {string} text2 Second string.
   * @return {number} The number of characters common to the start of each
   *     string.
   */
  private diffCommonPrefix(text1: any, text2: any) {
    // Quick check for common null cases.
    if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
      return 0;
    }
    // Binary search.
    // Performance analysis: http://neil.fraser.name/news/2007/10/09/
    let pointermin = 0;
    let pointermax = Math.min(text1.length, text2.length);
    let pointermid = pointermax;
    let pointerstart = 0;
    while (pointermin < pointermid) {
      if (text1.substring(pointerstart, pointermid) ===
        text2.substring(pointerstart, pointermid)) {
        pointermin = pointermid;
        pointerstart = pointermin;
      } else {
        pointermax = pointermid;
      }
      pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
    }
    return pointermid;
  }


  /**
   * Determine the common suffix of two strings.
   * @param {string} text1 First string.
   * @param {string} text2 Second string.
   * @return {number} The number of characters common to the end of each string.
   */
  private diffCommonSuffix(text1: any, text2: any) {
    // Quick check for common null cases.
    if (!text1 || !text2 ||
      text1.charAt(text1.length - 1) !== text2.charAt(text2.length - 1)) {
      return 0;
    }
    // Binary search.
    // Performance analysis: http://neil.fraser.name/news/2007/10/09/
    let pointermin = 0;
    let pointermax = Math.min(text1.length, text2.length);
    let pointermid = pointermax;
    let pointerend = 0;
    while (pointermin < pointermid) {
      if (text1.substring(text1.length - pointermid, text1.length - pointerend) ===
        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
        pointermin = pointermid;
        pointerend = pointermin;
      } else {
        pointermax = pointermid;
      }
      pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
    }
    return pointermid;
  }

/**
*     Does a substring of shorttext exist within longtext such that the substring
*     is at least half the length of longtext?
*     Closure, but does not reference any external variables.
*     @param {string} longtext Longer string.
*     @param {string} shorttext Shorter string.
*     @param {number} i Start index of quarter length substring within longtext.
*     @return {Array.<string>} Five element Array, containing the prefix of
*         longtext, the suffix of longtext, the prefix of shorttext, the suffix
*         of shorttext and the common middle.  Or null if there was no match.
*     @private
*/
  private diffHalfMatchI_(longtext: any, shorttext: any, i: any) {
    // Start with a 1/4 length substring at position i as a seed.
    const seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    let j = -1;
    let bestCommon = '';
    let bestLongtextA: any, bestLongtextB: any, bestShorttextA: any, bestShorttextB: any;
    while ((j = shorttext.indexOf(seed, j + 1)) !== -1) {
      const prefixLength = this.diffCommonPrefix(longtext.substring(i),
        shorttext.substring(j));
      const suffixLength = this.diffCommonSuffix(longtext.substring(0, i),
        shorttext.substring(0, j));
      if (bestCommon.length < suffixLength + prefixLength) {
        bestCommon = shorttext.substring(j - suffixLength, j) +
          shorttext.substring(j, j + prefixLength);
        bestLongtextA = longtext.substring(0, i - suffixLength);
        bestLongtextB = longtext.substring(i + prefixLength);
        bestShorttextA = shorttext.substring(0, j - suffixLength);
        bestShorttextB = shorttext.substring(j + prefixLength);
      }
    }
    if (bestCommon.length * 2 >= longtext.length) {
      return [bestLongtextA, bestLongtextB,
        bestShorttextA, bestShorttextB, bestCommon];
    } else {
      return null;
    }
  }

  /**
   * Do the two texts share a substring which is at least half the length of the
   * longer text?
   * This speedup can produce non-minimal diffs.
   * @param {string} text1 First string.
   * @param {string} text2 Second string.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     text1, the suffix of text1, the prefix of text2, the suffix of
   *     text2 and the common middle.  Or null if there was no match.
   */
  private diffHalfMatch_(text1: any, text2: any) {
    const longtext = text1.length > text2.length ? text1 : text2;
    const shorttext = text1.length > text2.length ? text2 : text1;
    if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
      return null;  // Pointless.
    }

    // First check if the second quarter is the seed for a half-match.
    const hm1 = this.diffHalfMatchI_(longtext, shorttext,
      Math.ceil(longtext.length / 4));
    // Check again based on the third quarter.
    const hm2 = this.diffHalfMatchI_(longtext, shorttext,
      Math.ceil(longtext.length / 2));
    let hm: any;
    if (!hm1 && !hm2) {
      return null;
    } else if (!hm2) {
      hm = hm1;
    } else if (!hm1) {
      hm = hm2;
    } else {
      // Both matched.  Select the longest.
      hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
    }

    // A half-match was found, sort out the return data.
    let text1A: any, text1B: any, text2A: any, text2B: any;
    if (text1.length > text2.length) {
      text1A = hm[0];
      text1B = hm[1];
      text2A = hm[2];
      text2B = hm[3];
    } else {
      text2A = hm[0];
      text2B = hm[1];
      text1A = hm[2];
      text1B = hm[3];
    }
    const midCommon = hm[4];
    return [text1A, text1B, text2A, text2B, midCommon];
  }

  /**
   * Reorder and merge like edit sections.  Merge equalities.
   * Any edit section can move as long as it doesn't cross an equality.
   * @param {Array} diffs Array of diff tuples.
   */
  private diffCleanupMerge(diffs: any) {
    diffs.push([DiffString.DIFFEQUAL, '']);  // Add a dummy entry at the end.
    let pointer = 0;
    let countDelete = 0;
    let countInsert = 0;
    let textDelete = '';
    let textInsert = '';
    let commonlength: any;
    while (pointer < diffs.length) {
      switch (diffs[pointer][0]) {
        case DiffString.DIFFINSERT:
          countInsert++;
          textInsert += diffs[pointer][1];
          pointer++;
          break;
        case DiffString.DIFFDELETE:
          countDelete++;
          textDelete += diffs[pointer][1];
          pointer++;
          break;
        case DiffString.DIFFEQUAL:
          // Upon reaching an equality, check for prior redundancies.
          if (countDelete + countInsert > 1) {
            if (countDelete !== 0 && countInsert !== 0) {
              // Factor out any common prefixies.
              commonlength = this.diffCommonPrefix(textInsert, textDelete);
              if (commonlength !== 0) {
                if ((pointer - countDelete - countInsert) > 0 &&
                  diffs[pointer - countDelete - countInsert - 1][0] ===
                  DiffString.DIFFEQUAL) {
                  diffs[pointer - countDelete - countInsert - 1][1] +=
                    textInsert.substring(0, commonlength);
                } else {
                  diffs.splice(0, 0, [DiffString.DIFFEQUAL,
                    textInsert.substring(0, commonlength)]);
                  pointer++;
                }
                textInsert = textInsert.substring(commonlength);
                textDelete = textDelete.substring(commonlength);
              }
              // Factor out any common suffixies.
              commonlength = this.diffCommonSuffix(textInsert, textDelete);
              if (commonlength !== 0) {
                diffs[pointer][1] = textInsert.substring(textInsert.length -
                  commonlength) + diffs[pointer][1];
                textInsert = textInsert.substring(0, textInsert.length -
                  commonlength);
                textDelete = textDelete.substring(0, textDelete.length -
                  commonlength);
              }
            }
            // Delete the offending records and add the merged ones.
            if (countDelete === 0) {
              diffs.splice(pointer - countInsert,
                countDelete + countInsert, [DiffString.DIFFINSERT, textInsert]);
            } else if (countInsert === 0) {
              diffs.splice(pointer - countDelete,
                countDelete + countInsert, [DiffString.DIFFDELETE, textDelete]);
            } else {
              diffs.splice(pointer - countDelete - countInsert,
                countDelete + countInsert, [DiffString.DIFFDELETE, textDelete],
                [DiffString.DIFFINSERT, textInsert]);
            }
            pointer = pointer - countDelete - countInsert +
              (countDelete ? 1 : 0) + (countInsert ? 1 : 0) + 1;
          } else if (pointer !== 0 && diffs[pointer - 1][0] === DiffString.DIFFEQUAL) {
            // Merge this equality with the previous one.
            diffs[pointer - 1][1] += diffs[pointer][1];
            diffs.splice(pointer, 1);
          } else {
            pointer++;
          }
          countInsert = 0;
          countDelete = 0;
          textDelete = '';
          textInsert = '';
          break;
      }
    }
    if (diffs[diffs.length - 1][1] === '') {
      diffs.pop();  // Remove the dummy entry at the end.
    }

    // Second pass: look for single edits surrounded on both sides by equalities
    // which can be shifted sideways to eliminate an equality.
    // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
    let changes = false;
    pointer = 1;
    // Intentionally ignore the first and last element (don't need checking).
    while (pointer < diffs.length - 1) {
      if (diffs[pointer - 1][0] === DiffString.DIFFEQUAL &&
        diffs[pointer + 1][0] === DiffString.DIFFEQUAL) {
        // This is a single edit surrounded by equalities.
        if (diffs[pointer][1].substring(diffs[pointer][1].length -
          diffs[pointer - 1][1].length) === diffs[pointer - 1][1]) {
          // Shift the edit over the previous equality.
          diffs[pointer][1] = diffs[pointer - 1][1] +
            diffs[pointer][1].substring(0, diffs[pointer][1].length -
              diffs[pointer - 1][1].length);
          diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
          diffs.splice(pointer - 1, 1);
          changes = true;
        } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ===
          diffs[pointer + 1][1]) {
          // Shift the edit over the next equality.
          diffs[pointer - 1][1] += diffs[pointer + 1][1];
          diffs[pointer][1] =
            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
            diffs[pointer + 1][1];
          diffs.splice(pointer + 1, 1);
          changes = true;
        }
      }
      pointer++;
    }
    // If shifts were made, the diff needs reordering and another shift sweep.
    if (changes) {
      this.diffCleanupMerge(diffs);
    }
  }

}
