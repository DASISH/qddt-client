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
   * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
   * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
   */
  public static DIFF_DELETE: number = -1;
  public static DIFF_INSERT: number = 1;
  public static DIFF_EQUAL: number = 0;

  /**
   * Find the differences between two texts.  Simplifies the problem by stripping
   * any common prefix or suffix off the texts before diffing.
   * @param {string} text1 Old string to be diffed.
   * @param {string} text2 New string to be diffed.
   * @return {Array} Array of diff tuples.
   */
  diff_main(text1: any, text2: any) :any {
    // Check for equality (speedup).
    if (text1 === text2) {
      if (text1) {
        return [[DiffString.DIFF_EQUAL, text1]];
      }
      return [];
    }

    // Trim off common prefix (speedup).
    var commonlength = this.diff_commonPrefix(text1, text2);
    var commonprefix = text1.substring(0, commonlength);
    text1 = text1.substring(commonlength);
    text2 = text2.substring(commonlength);

    // Trim off common suffix (speedup).
    commonlength = this.diff_commonSuffix(text1, text2);
    var commonsuffix = text1.substring(text1.length - commonlength);
    text1 = text1.substring(0, text1.length - commonlength);
    text2 = text2.substring(0, text2.length - commonlength);

    // Compute the diff on the middle block.
    var diffs = this.diff_compute_(text1, text2);

    // Restore the prefix and suffix.
    if (commonprefix) {
      diffs.unshift([DiffString.DIFF_EQUAL, commonprefix]);
    }
    if (commonsuffix) {
      diffs.push([DiffString.DIFF_EQUAL, commonsuffix]);
    }
    this.diff_cleanupMerge(diffs);
    return diffs;
  }


  /**
   * Find the differences between two texts.  Assumes that the texts do not
   * have any common prefix or suffix.
   * @param {string} text1 Old string to be diffed.
   * @param {string} text2 New string to be diffed.
   * @return {Array} Array of diff tuples.
   */
  private diff_compute_(text1: any, text2: any) {
    var diffs: any;

    if (!text1) {
      // Just add some text (speedup).
      return [[DiffString.DIFF_INSERT, text2]];
    }

    if (!text2) {
      // Just delete some text (speedup).
      return [[DiffString.DIFF_DELETE, text1]];
    }

    var longtext = text1.length > text2.length ? text1 : text2;
    var shorttext = text1.length > text2.length ? text2 : text1;
    var i = longtext.indexOf(shorttext);
    if (i !== -1) {
      // Shorter text is inside the longer text (speedup).
      diffs = [[DiffString.DIFF_INSERT, longtext.substring(0, i)],
        [DiffString.DIFF_EQUAL, shorttext],
        [DiffString.DIFF_INSERT, longtext.substring(i + shorttext.length)]];
      // Swap insertions for deletions if diff is reversed.
      if (text1.length > text2.length) {
        diffs[0][0] = diffs[2][0] = DiffString.DIFF_DELETE;
      }
      return diffs;
    }

    if (shorttext.length === 1) {
      // Single character string.
      // After the previous speedup, the character can't be an equality.
      return [[DiffString.DIFF_DELETE, text1], [DiffString.DIFF_INSERT, text2]];
    }

    // Check to see if the problem can be split in two.
    var hm = this.diff_halfMatch_(text1, text2);
    if (hm) {
      // A half-match was found, sort out the return data.
      var text1_a = hm[0];
      var text1_b = hm[1];
      var text2_a = hm[2];
      var text2_b = hm[3];
      var mid_common = hm[4];
      // Send both pairs off for separate processing.
      var diffs_a = this.diff_main(text1_a, text2_a);
      var diffs_b = this.diff_main(text1_b, text2_b);
      // Merge the results.
      return diffs_a.concat([[DiffString.DIFF_EQUAL, mid_common]], diffs_b);
    }

    return this.diff_bisect_(text1, text2);
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
  private diff_bisect_(text1: any, text2: any) {
    // Cache the text lengths to prevent multiple calls.
    var text1_length = text1.length;
    var text2_length = text2.length;
    var max_d = Math.ceil((text1_length + text2_length) / 2);
    var v_offset = max_d;
    var v_length = 2 * max_d;
    var v1 = new Array(v_length);
    var v2 = new Array(v_length);
    // Setting all elements to -1 is faster in Chrome & Firefox than mixing
    // integers and undefined.
    for (var x = 0; x < v_length; x++) {
      v1[x] = -1;
      v2[x] = -1;
    }
    v1[v_offset + 1] = 0;
    v2[v_offset + 1] = 0;
    var delta = text1_length - text2_length;
    // If the total number of characters is odd, then the front path will collide
    // with the reverse path.
    var front = (delta % 2 !== 0);
    // Offsets for start and end of k loop.
    // Prevents mapping of space beyond the grid.
    var k1start = 0;
    var k1end = 0;
    var k2start = 0;
    var k2end = 0;
    for (var d = 0; d < max_d; d++) {
      // Walk the front path one step.
      for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
        var k1_offset = v_offset + k1;
        var x1: any;
        if (k1 === -d || (k1 !== d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
          x1 = v1[k1_offset + 1];
        } else {
          x1 = v1[k1_offset - 1] + 1;
        }
        var y1 = x1 - k1;
        while (x1 < text1_length && y1 < text2_length &&
          text1.charAt(x1) === text2.charAt(y1)) {
          x1++;
          y1++;
        }
        v1[k1_offset] = x1;
        if (x1 > text1_length) {
          // Ran off the right of the graph.
          k1end += 2;
        } else if (y1 > text2_length) {
          // Ran off the bottom of the graph.
          k1start += 2;
        } else if (front) {
          var k2_offset = v_offset + delta - k1;
          if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] !== -1) {
            // Mirror x2 onto top-left coordinate system.
            var x2 = text1_length - v2[k2_offset];
            if (x1 >= x2) {
              // Overlap detected.
              return this.diff_bisectSplit_(text1, text2, x1, y1);
            }
          }
        }
      }

      // Walk the reverse path one step.
      for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
        let k2_offset = v_offset + k2;
        // let x2: number;
        if (k2 === -d || (k2 !== d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
          x2 = v2[k2_offset + 1];
        } else {
          x2 = v2[k2_offset - 1] + 1;
        }
        var y2 = x2 - k2;
        while (x2 < text1_length && y2 < text2_length &&
          text1.charAt(text1_length - x2 - 1) ===
          text2.charAt(text2_length - y2 - 1)) {
          x2++;
          y2++;
        }
        v2[k2_offset] = x2;
        if (x2 > text1_length) {
          // Ran off the left of the graph.
          k2end += 2;
        } else if (y2 > text2_length) {
          // Ran off the top of the graph.
          k2start += 2;
        } else if (!front) {
          let k1_offset = v_offset + delta - k2;
          if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] !== -1) {
            let x1 = v1[k1_offset];
            let y1 = v_offset + x1 - k1_offset;
            // Mirror x2 onto top-left coordinate system.
            x2 = text1_length - x2;
            if (x1 >= x2) {
              // Overlap detected.
              return this.diff_bisectSplit_(text1, text2, x1, y1);
            }
          }
        }
      }
    }
    // Diff took too long and hit the deadline or
    // number of diffs equals number of characters, no commonality at all.
    return [[DiffString.DIFF_DELETE, text1], [DiffString.DIFF_INSERT, text2]];
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
  private diff_bisectSplit_(text1:any, text2: any, x: any, y: any) {
    var text1a = text1.substring(0, x);
    var text2a = text2.substring(0, y);
    var text1b = text1.substring(x);
    var text2b = text2.substring(y);

    // Compute both diffs serially.
    var diffs = this.diff_main(text1a, text2a);
    var diffsb = this.diff_main(text1b, text2b);

    return diffs.concat(diffsb);
  }


  /**
   * Determine the common prefix of two strings.
   * @param {string} text1 First string.
   * @param {string} text2 Second string.
   * @return {number} The number of characters common to the start of each
   *     string.
   */
  private diff_commonPrefix(text1: any, text2: any) {
    // Quick check for common null cases.
    if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
      return 0;
    }
    // Binary search.
    // Performance analysis: http://neil.fraser.name/news/2007/10/09/
    var pointermin = 0;
    var pointermax = Math.min(text1.length, text2.length);
    var pointermid = pointermax;
    var pointerstart = 0;
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
  private diff_commonSuffix(text1: any, text2: any) {
    // Quick check for common null cases.
    if (!text1 || !text2 ||
      text1.charAt(text1.length - 1) !== text2.charAt(text2.length - 1)) {
      return 0;
    }
    // Binary search.
    // Performance analysis: http://neil.fraser.name/news/2007/10/09/
    var pointermin = 0;
    var pointermax = Math.min(text1.length, text2.length);
    var pointermid = pointermax;
    var pointerend = 0;
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
       * Does a substring of shorttext exist within longtext such that the substring
       * is at least half the length of longtext?
       * Closure, but does not reference any external variables.
       * @param {string} longtext Longer string.
       * @param {string} shorttext Shorter string.
       * @param {number} i Start index of quarter length substring within longtext.
       * @return {Array.<string>} Five element Array, containing the prefix of
       *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
       *     of shorttext and the common middle.  Or null if there was no match.
       * @private
       */
  private diff_halfMatchI_(longtext: any, shorttext: any, i: any) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a: any, best_longtext_b: any, best_shorttext_a: any, best_shorttext_b: any;
    while ((j = shorttext.indexOf(seed, j + 1)) !== -1) {
      var prefixLength = this.diff_commonPrefix(longtext.substring(i),
        shorttext.substring(j));
      var suffixLength = this.diff_commonSuffix(longtext.substring(0, i),
        shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) +
          shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [best_longtext_a, best_longtext_b,
        best_shorttext_a, best_shorttext_b, best_common];
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
  private diff_halfMatch_(text1: any, text2: any) {
    var longtext = text1.length > text2.length ? text1 : text2;
    var shorttext = text1.length > text2.length ? text2 : text1;
    if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
      return null;  // Pointless.
    }

    // First check if the second quarter is the seed for a half-match.
    var hm1 = this.diff_halfMatchI_(longtext, shorttext,
      Math.ceil(longtext.length / 4));
    // Check again based on the third quarter.
    var hm2 = this.diff_halfMatchI_(longtext, shorttext,
      Math.ceil(longtext.length / 2));
    var hm: any;
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
    var text1_a: any, text1_b: any, text2_a: any, text2_b: any;
    if (text1.length > text2.length) {
      text1_a = hm[0];
      text1_b = hm[1];
      text2_a = hm[2];
      text2_b = hm[3];
    } else {
      text2_a = hm[0];
      text2_b = hm[1];
      text1_a = hm[2];
      text1_b = hm[3];
    }
    var mid_common = hm[4];
    return [text1_a, text1_b, text2_a, text2_b, mid_common];
  }

  /**
   * Reorder and merge like edit sections.  Merge equalities.
   * Any edit section can move as long as it doesn't cross an equality.
   * @param {Array} diffs Array of diff tuples.
   */
  private diff_cleanupMerge(diffs: any) {
    diffs.push([DiffString.DIFF_EQUAL, '']);  // Add a dummy entry at the end.
    var pointer = 0;
    var count_delete = 0;
    var count_insert = 0;
    var text_delete = '';
    var text_insert = '';
    var commonlength: any;
    while (pointer < diffs.length) {
      switch (diffs[pointer][0]) {
        case DiffString.DIFF_INSERT:
          count_insert++;
          text_insert += diffs[pointer][1];
          pointer++;
          break;
        case DiffString.DIFF_DELETE:
          count_delete++;
          text_delete += diffs[pointer][1];
          pointer++;
          break;
        case DiffString.DIFF_EQUAL:
          // Upon reaching an equality, check for prior redundancies.
          if (count_delete + count_insert > 1) {
            if (count_delete !== 0 && count_insert !== 0) {
              // Factor out any common prefixies.
              commonlength = this.diff_commonPrefix(text_insert, text_delete);
              if (commonlength !== 0) {
                if ((pointer - count_delete - count_insert) > 0 &&
                  diffs[pointer - count_delete - count_insert - 1][0] ===
                  DiffString.DIFF_EQUAL) {
                  diffs[pointer - count_delete - count_insert - 1][1] +=
                    text_insert.substring(0, commonlength);
                } else {
                  diffs.splice(0, 0, [DiffString.DIFF_EQUAL,
                    text_insert.substring(0, commonlength)]);
                  pointer++;
                }
                text_insert = text_insert.substring(commonlength);
                text_delete = text_delete.substring(commonlength);
              }
              // Factor out any common suffixies.
              commonlength = this.diff_commonSuffix(text_insert, text_delete);
              if (commonlength !== 0) {
                diffs[pointer][1] = text_insert.substring(text_insert.length -
                  commonlength) + diffs[pointer][1];
                text_insert = text_insert.substring(0, text_insert.length -
                  commonlength);
                text_delete = text_delete.substring(0, text_delete.length -
                  commonlength);
              }
            }
            // Delete the offending records and add the merged ones.
            if (count_delete === 0) {
              diffs.splice(pointer - count_insert,
                count_delete + count_insert, [DiffString.DIFF_INSERT, text_insert]);
            } else if (count_insert === 0) {
              diffs.splice(pointer - count_delete,
                count_delete + count_insert, [DiffString.DIFF_DELETE, text_delete]);
            } else {
              diffs.splice(pointer - count_delete - count_insert,
                count_delete + count_insert, [DiffString.DIFF_DELETE, text_delete],
                [DiffString.DIFF_INSERT, text_insert]);
            }
            pointer = pointer - count_delete - count_insert +
              (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
          } else if (pointer !== 0 && diffs[pointer - 1][0] === DiffString.DIFF_EQUAL) {
            // Merge this equality with the previous one.
            diffs[pointer - 1][1] += diffs[pointer][1];
            diffs.splice(pointer, 1);
          } else {
            pointer++;
          }
          count_insert = 0;
          count_delete = 0;
          text_delete = '';
          text_insert = '';
          break;
      }
    }
    if (diffs[diffs.length - 1][1] === '') {
      diffs.pop();  // Remove the dummy entry at the end.
    }

    // Second pass: look for single edits surrounded on both sides by equalities
    // which can be shifted sideways to eliminate an equality.
    // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
    var changes = false;
    pointer = 1;
    // Intentionally ignore the first and last element (don't need checking).
    while (pointer < diffs.length - 1) {
      if (diffs[pointer - 1][0] === DiffString.DIFF_EQUAL &&
        diffs[pointer + 1][0] === DiffString.DIFF_EQUAL) {
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
      this.diff_cleanupMerge(diffs);
    }
  }

}
