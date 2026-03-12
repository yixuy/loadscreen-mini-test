import requests

# "description": "Implement the function `twoSum(nums, target)` that takes an array of integers and a target integer, and returns an array of the two indices whose values add up to the target. You may assume exactly one solution exists and you may not use the same element twice. Return the indices in ascending order.",

    # "test_cases": [
    #     {
    #       "id": 1,
    #       "input": {
    #         "nums": [2, 7, 11, 15],
    #         "target": 9
    #       }
    #     },
    #     {
    #       "id": 2,
    #       "input": {
    #         "nums": [3, 2, 4],
    #         "target": 6
    #       }
    #     },
    #     {
    #       "id": 3,
    #       "input": {
    #         "nums": [3, 3],
    #         "target": 6
    #       }
    #     },
    #     {
    #       "id": 4,
    #       "input": {
    #         "nums": [1, 2, 3, 4, 5],
    #         "target": 9
    #       }
    #     },
    #     {
    #       "id": 5,
    #       "input": {
    #         "nums": [0, 4, 3, 0],
    #         "target": 0
    #       }
    #     },
    #     {
    #       "id": 6,
    #       "input": {
    #         "nums": [-1, -2, -3, -4, -5],
    #         "target": -8
    #       }
    #     },
    #     {
    #       "id": 7,
    #       "input": {
    #         "nums": [1, 5, 2, 11],
    #         "target": 7
    #       }
    #     },
    #     {
    #       "id": 8,
    #       "input": {
    #         "nums": [10, 20, 30, 40],
    #         "target": 70
    #       }
    #     },
    #     {
    #       "id": 9,
    #       "input": {
    #         "nums": [100, 200, 300],
    #         "target": 400
    #       }
    #     },
    #     {
    #       "id": 10,
    #       "input": {
    #         "nums": [1, 1, 1, 1, 2],
    #         "target": 3
    #       }
    #     }
    #   ]


def read_test_cases():
    
    URL = "https://mini-test.loadscreen.lunary.cloud/test"
    
    try: 
        response = requests.get(URL)
        response.raise_for_status()  # Check if the request was successful
        data = response.json()
        # print(f"Fetched test cases: {data.get('question', [])}")
        return data.get("question", []).get("programming", []).get("test_cases", [])
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching test cases: {e}")
        return []
    
# Assume if there is no test cases, we will return an empty list and the program will not run any tests.

# time complexity: O(n)
# space complexity: O(n)

def twoSum(nums, target):
    
    mapping = {}
    
    for i, num in enumerate(nums):
        if target - num in mapping:
            return [mapping[target - num], i]
        
        mapping[num] = i
        
    return []
        
        
# Test cases
if __name__ == "__main__":
    # read test case from the API 
    test_cases = read_test_cases()
    for test in test_cases:
        nums = test["input"]["nums"]
        target = test["input"]["target"]
        result = twoSum(nums, target)
        print(f"Test Case {test['id']}: ")
        print(f"Input: nums={nums}, target={target} => Output: {result}")

    # corner cases test
    # no result
    nums = [1, 2, 3, 4, 5]
    target = 10
    result = twoSum(nums, target)
    print(f"Corner Case: Input: ")
    print(f"nums={nums}, target={target} => Output: {result}")
    # duplicate results
    nums = [3, 3, 3]
    target = 6
    result = twoSum(nums, target)
    print(f"Corner Case: Input: ")
    print(f"nums={nums}, target={target} => Output: {result}")
            
        