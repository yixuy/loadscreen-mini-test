// "description": "Implement the function `twoSum(nums, target)` that takes an array of integers and a target integer, and returns an array of the two indices whose values add up to the target. You may assume exactly one solution exists and you may not use the same element twice. Return the indices in ascending order.",

  // "test_cases": [
  //     {
  //       "id": 1,
  //       "input": {
  //         "nums": [2, 7, 11, 15],
  //         "target": 9
  //       }
  //     },
  //     {
  //       "id": 2,
  //       "input": {
  //         "nums": [3, 2, 4],
  //         "target": 6
  //       }
  //     },
  //     {
  //       "id": 3,
  //       "input": {
  //         "nums": [3, 3],
  //         "target": 6
  //       }
  //     },
  //     {
  //       "id": 4,
  //       "input": {
  //         "nums": [1, 2, 3, 4, 5],
  //         "target": 9
  //       }
  //     },
  //     {
  //       "id": 5,
  //       "input": {
  //         "nums": [0, 4, 3, 0],
  //         "target": 0
  //       }
  //     },
  //     {
  //       "id": 6,
  //       "input": {
  //         "nums": [-1, -2, -3, -4, -5],
  //         "target": -8
  //       }
  //     },
  //     {
  //       "id": 7,
  //       "input": {
  //         "nums": [1, 5, 2, 11],
  //         "target": 7
  //       }
  //     },
  //     {
  //       "id": 8,
  //       "input": {
  //         "nums": [10, 20, 30, 40],
  //         "target": 70
  //       }
  //     },
  //     {
  //       "id": 9,
  //       "input": {
  //         "nums": [100, 200, 300],
  //         "target": 400
  //       }
  //     },
  //     {
  //       "id": 10,
  //       "input": {
  //         "nums": [1, 1, 1, 1, 2],
  //         "target": 3
  //       }
  //     }
  //   ]

interface TestCase {
  id: number;
  input: {
    nums: number[];
    target: number;
  };
}

async function readTestCases(): Promise<TestCase[]> {
  const URL = "https://mini-test.loadscreen.lunary.cloud/test";

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data?.question?.programming?.test_cases ?? [];
  } catch (e) {
    console.error(`An error occurred while fetching test cases: ${e}`);
    return [];
  }
}

// Assume if there is no test cases, we will return an empty list and the program will not run any tests.

// time complexity: O(n)
// space complexity: O(n)

function twoSum(nums: number[], target: number): number[] {
  const mapping = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (mapping.has(complement)) {
      return [mapping.get(complement)!, i];
    }

    if (!mapping.has(nums[i])) {
      mapping.set(nums[i], i);
    }
  }

  return [];
}

// Test cases
(async () => {
  // read test case from the API
  const testCases = await readTestCases();
  for (const test of testCases) {
    const { nums, target } = test.input;
    const result = twoSum(nums, target);
    console.log(`Test Case ${test.id}: `);
    console.log(`Input: nums=${JSON.stringify(nums)}, target=${target} => Output: ${JSON.stringify(result)}`);
  }

  // corner cases test
  // no result
  let nums = [1, 2, 3, 4, 5];
  let target = 10;
  let result = twoSum(nums, target);
  console.log(`Corner Case: Input: `);
  console.log(`nums=${JSON.stringify(nums)}, target=${target} => Output: ${JSON.stringify(result)}`);

  // duplicate results
  nums = [3, 3, 3];
  target = 6;
  result = twoSum(nums, target);
  console.log(`Corner Case: Input: `);
  console.log(`nums=${JSON.stringify(nums)}, target=${target} => Output: ${JSON.stringify(result)}`);
})();


// Running command: npx tsx two_sum.ts