// AP CSP Mastery Lab — question bank.
//
// Add questions by appending to the array. Keep ids unique. Required fields:
//   id, topic, difficulty ('easy' | 'medium' | 'hard'),
//   question, choices, correctAnswer (index), explanation
// Optional:
//   codeSnippet  — use AP CSP pseudocode ONLY (← for assignment, IF, REPEAT, FOR EACH,
//                   PROCEDURE/RETURN, MOD, lists are 1-indexed)
//
// `section` is auto-derived from topic for the Exam Simulation Mode.

const TOPIC_TO_SECTION = {
  Variables: 'Programming',
  'Data types': 'Data',
  Lists: 'Programming',
  Algorithms: 'Algorithms',
  Sequencing: 'Programming',
  Selection: 'Programming',
  Iteration: 'Programming',
  Procedures: 'Programming',
  Parameters: 'Programming',
  'Boolean logic': 'Algorithms',
  Binary: 'Data',
  'Data compression': 'Data',
  Internet: 'Internet',
  Cybersecurity: 'Internet',
  Encryption: 'Internet',
  Abstraction: 'Programming',
  Simulations: 'Algorithms',
  APIs: 'Programming',
  Libraries: 'Programming',
  'AP Create Task': 'Programming',
};

export function sectionFor(topic) {
  return TOPIC_TO_SECTION[topic] || 'Programming';
}

const RAW = [
  // ===================== Variables =====================
  {
    id: 'var-001', topic: 'Variables', difficulty: 'easy',
    question: 'What is the value of total after the code runs?',
    codeSnippet: 'a \u2190 4\nb \u2190 6\ntotal \u2190 a + b',
    choices: ['10', '46', '24', 'undefined'],
    correctAnswer: 0,
    explanation: 'total is assigned 4 + 6 = 10. "46" treats values as strings; "24" multiplies; "undefined" would only happen if a or b had no value.',
  },
  {
    id: 'var-002', topic: 'Variables', difficulty: 'easy',
    question: 'Which best describes a variable in AP CSP?',
    choices: [
      'A named storage location whose value can change',
      'A constant that cannot change',
      'A list of items',
      'A type of loop',
    ],
    correctAnswer: 0,
    explanation: 'Variables are named references to values that can be reassigned. Constants do not change; lists store sequences of values; loops are control structures.',
  },
  {
    id: 'var-003', topic: 'Variables', difficulty: 'medium',
    question: 'After the code runs, what is the value of x?',
    codeSnippet: 'x \u2190 5\nx \u2190 x * 2\nx \u2190 x + 1',
    choices: ['11', '10', '6', '12'],
    correctAnswer: 0,
    explanation: 'x: 5 → 10 → 11. 10 forgets the +1; 6 forgets the *2; 12 doubles after the +1.',
  },
  {
    id: 'var-004', topic: 'Variables', difficulty: 'easy',
    question: 'Which statement assigns the value 7 to the variable score?',
    choices: ['score \u2190 7', 'score = 7 forever', '7 \u2190 score', 'score :: 7'],
    correctAnswer: 0,
    explanation: 'In AP CSP pseudocode the assignment arrow points from value to variable. "7 ← score" assigns score INTO 7 which is invalid.',
  },
  {
    id: 'var-005', topic: 'Variables', difficulty: 'medium',
    question: 'After this code runs, what is displayed?',
    codeSnippet: 'a \u2190 3\nb \u2190 a\na \u2190 a + 5\nDISPLAY(b)',
    choices: ['3', '8', '5', '0'],
    correctAnswer: 0,
    explanation: 'b stores the value of a at the moment of assignment (3). Reassigning a later does NOT change b. 8 would be true if b held a reference; 5 ignores the original value.',
  },

  // ===================== Data types =====================
  {
    id: 'dtype-001', topic: 'Data types', difficulty: 'easy',
    question: 'Which data type is best for storing whether a user is logged in?',
    choices: ['Boolean', 'String', 'List', 'Number'],
    correctAnswer: 0,
    explanation: 'Booleans hold true/false — perfect for binary state. A string would work but loses type safety; a list would be over-engineered; a number is ambiguous.',
  },
  {
    id: 'dtype-002', topic: 'Data types', difficulty: 'easy',
    question: 'Which is a string literal?',
    choices: ['"42"', '42', 'true', '[1,2,3]'],
    correctAnswer: 0,
    explanation: 'Quotes mark a string. 42 is a number, true is a Boolean, and [1,2,3] is a list.',
  },
  {
    id: 'dtype-003', topic: 'Data types', difficulty: 'medium',
    question: 'Why does choosing the right data type matter?',
    choices: [
      'It affects what operations are valid and how data is stored',
      'It changes the color of code in the editor',
      'It determines internet speed',
      'It controls the operating system',
    ],
    correctAnswer: 0,
    explanation: 'Data types determine valid operations and storage. Editor colors are cosmetic; the other choices are unrelated.',
  },

  // ===================== Lists =====================
  {
    id: 'list-001', topic: 'Lists', difficulty: 'easy',
    question: 'AP CSP lists are 1-indexed. What does the code display?',
    codeSnippet: 'nums \u2190 [10, 20, 30, 40]\nDISPLAY(nums[2])',
    choices: ['20', '10', '30', '40'],
    correctAnswer: 0,
    explanation: 'nums[2] is the SECOND element, 20. 10 is index 1; 30 is index 3; 40 is index 4.',
  },
  {
    id: 'list-002', topic: 'Lists', difficulty: 'easy',
    question: 'What does APPEND(list, value) do?',
    choices: [
      'Adds value to the end of the list',
      'Removes the last element',
      'Reverses the list',
      'Replaces the first element',
    ],
    correctAnswer: 0,
    explanation: 'APPEND grows the list by one at the end. Reversing or removing requires different procedures.',
  },
  {
    id: 'list-003', topic: 'Lists', difficulty: 'medium',
    question: 'What is the length of the list at the end?',
    codeSnippet: 'data \u2190 [1, 2, 3]\nAPPEND(data, 4)\nAPPEND(data, 5)\nREMOVE(data, 1)',
    choices: ['4', '5', '3', '6'],
    correctAnswer: 0,
    explanation: 'Two appends → length 5. REMOVE deletes index 1 → length 4. Choosing 5 forgets the REMOVE; 3 forgets the appends.',
  },
  {
    id: 'list-004', topic: 'Lists', difficulty: 'hard',
    question: 'What is displayed?',
    codeSnippet: 'list \u2190 [3, 1, 4, 1, 5, 9, 2, 6]\ntotal \u2190 0\nFOR EACH n IN list\n{\n  IF (n MOD 2 = 0)\n  {\n    total \u2190 total + n\n  }\n}\nDISPLAY(total)',
    choices: ['12', '14', '8', '10'],
    correctAnswer: 0,
    explanation: 'Even values are 4, 2, 6 → 12. 14 mistakenly includes a 5; 8 misses the 6; 10 misses the 4.',
  },
  {
    id: 'list-005', topic: 'Lists', difficulty: 'medium',
    question: 'Which call swaps the first and last items of a 4-element list named L?',
    choices: [
      'tmp \u2190 L[1]; L[1] \u2190 L[4]; L[4] \u2190 tmp',
      'L[1] \u2190 L[4]; L[4] \u2190 L[1]',
      'SWAP(L)',
      'REMOVE(L, 1); INSERT(L, L[4], 1)',
    ],
    correctAnswer: 0,
    explanation: 'A correct swap uses a temporary variable. Choice B overwrites L[1] before saving it. SWAP is not standard; the INSERT/REMOVE chain shifts and changes length.',
  },
  {
    id: 'list-006', topic: 'Lists', difficulty: 'easy',
    question: 'What does INSERT(list, value, i) do?',
    choices: [
      'Inserts value at position i, shifting later elements right',
      'Replaces the item at position i',
      'Removes the item at position i',
      'Sorts the list',
    ],
    correctAnswer: 0,
    explanation: 'INSERT places value at index i and grows the list by one. Replacement does not change length; REMOVE shrinks; sorting reorders.',
  },

  // ===================== Algorithms =====================
  {
    id: 'algo-001', topic: 'Algorithms', difficulty: 'easy',
    question: 'What is an algorithm?',
    choices: [
      'A finite sequence of well-defined steps to solve a problem',
      'A type of computer hardware',
      'A list of variables',
      'A programming language',
    ],
    correctAnswer: 0,
    explanation: 'Algorithms are step-by-step procedures. The other items are not procedures themselves.',
  },
  {
    id: 'algo-002', topic: 'Algorithms', difficulty: 'medium',
    question: 'A linear search runs in time proportional to list size. This is best described as:',
    choices: ['Reasonable time', 'Unreasonable time', 'Constant time', 'Exponential time'],
    correctAnswer: 0,
    explanation: 'Linear (O(n)) is reasonable. "Unreasonable" usually refers to exponential or worse; constant time does not depend on n; exponential grows much faster.',
  },
  {
    id: 'algo-003', topic: 'Algorithms', difficulty: 'hard',
    question: 'A problem is undecidable. Which best describes it?',
    choices: [
      'No algorithm always gives a correct yes/no answer for all inputs',
      'It always takes exponential time',
      'It can only be solved by humans',
      'It cannot be approximated',
    ],
    correctAnswer: 0,
    explanation: 'Undecidable means no algorithm can correctly answer in all cases. It is unrelated to runtime, humans, or approximation.',
  },
  {
    id: 'algo-004', topic: 'Algorithms', difficulty: 'medium',
    question: 'Binary search requires what about the input?',
    choices: ['It must be sorted', 'It must be a string', 'It must contain only integers', 'It must be small'],
    correctAnswer: 0,
    explanation: 'Binary search relies on order to halve the search space. The other constraints are not needed.',
  },
  {
    id: 'algo-005', topic: 'Algorithms', difficulty: 'medium',
    question: 'Two algorithms produce the same output for all inputs. Which is true?',
    choices: [
      'They are equivalent in correctness, but may differ in efficiency',
      'They must run in the same time',
      'One must be wrong',
      'They must use the same data structures',
    ],
    correctAnswer: 0,
    explanation: 'Same outputs = correctness equivalence. Time/data structures may differ.',
  },
  {
    id: 'algo-006', topic: 'Algorithms', difficulty: 'hard',
    question: 'An algorithm runs in roughly 2^n steps for input size n. This is:',
    choices: [
      'Exponential and considered unreasonable for large n',
      'Polynomial and reasonable',
      'Constant time',
      'Logarithmic',
    ],
    correctAnswer: 0,
    explanation: '2^n grows extremely fast and is unreasonable for large inputs. Polynomial (n^k) is reasonable; constant and log grow slowly.',
  },

  // ===================== Sequencing =====================
  {
    id: 'seq-001', topic: 'Sequencing', difficulty: 'easy',
    question: 'What does sequencing mean?',
    choices: [
      'Statements run in the order written',
      'Statements run randomly',
      'Statements run in reverse',
      'Statements run in parallel',
    ],
    correctAnswer: 0,
    explanation: 'Sequencing is top-down execution. The others describe different control flows.',
  },
  {
    id: 'seq-002', topic: 'Sequencing', difficulty: 'easy',
    question: 'What does this code display?',
    codeSnippet: 'x \u2190 2\ny \u2190 3\nx \u2190 y\ny \u2190 x\nDISPLAY(x)\nDISPLAY(y)',
    choices: ['3 then 3', '2 then 3', '3 then 2', '2 then 2'],
    correctAnswer: 0,
    explanation: 'After x ← y, x is 3. Then y ← x sets y to 3. Both display 3. The values were not swapped because no temporary variable was used.',
  },
  {
    id: 'seq-003', topic: 'Sequencing', difficulty: 'medium',
    question: 'Which is a true statement about sequencing?',
    choices: [
      'The order of statements can change the result',
      'Order never matters in sequencing',
      'Sequencing only applies to loops',
      'Sequencing is the same as recursion',
    ],
    correctAnswer: 0,
    explanation: 'Order matters — a += b before b += a vs after produces different results. Sequencing applies generally and is not recursion.',
  },

  // ===================== Selection =====================
  {
    id: 'sel-001', topic: 'Selection', difficulty: 'easy',
    question: 'What is displayed?',
    codeSnippet: 'score \u2190 75\nIF (score \u2265 70)\n{\n  DISPLAY("Pass")\n}\nELSE\n{\n  DISPLAY("Fail")\n}',
    choices: ['Pass', 'Fail', '75', 'nothing'],
    correctAnswer: 0,
    explanation: '75 ≥ 70 is true → "Pass". The ELSE branch only runs when the condition is false.',
  },
  {
    id: 'sel-002', topic: 'Selection', difficulty: 'medium',
    question: 'What does the code display when n is 12?',
    codeSnippet: 'IF (n MOD 3 = 0 AND n MOD 4 = 0)\n{\n  DISPLAY("A")\n}\nELSE IF (n MOD 3 = 0)\n{\n  DISPLAY("B")\n}\nELSE\n{\n  DISPLAY("C")\n}',
    choices: ['A', 'B', 'C', 'A and B'],
    correctAnswer: 0,
    explanation: '12 is divisible by both 3 and 4 → branch A. ELSE IF only runs if the previous IF is false; "A and B" cannot happen because IF/ELSE is exclusive.',
  },
  {
    id: 'sel-003', topic: 'Selection', difficulty: 'easy',
    question: 'A statement runs only when both conditions are true. Which Boolean operator joins them?',
    choices: ['AND', 'OR', 'NOT', 'XOR'],
    correctAnswer: 0,
    explanation: 'AND requires both to be true. OR is at-least-one; NOT inverts; XOR is exactly one.',
  },
  {
    id: 'sel-004', topic: 'Selection', difficulty: 'hard',
    question: 'Which input causes "yes" to be displayed?',
    codeSnippet:
      'IF ((x > 0 AND x < 10) OR x = 100)\n{\n  DISPLAY("yes")\n}',
    choices: [
      'x = 5',
      'x = 0',
      'x = 50',
      'x = 200',
    ],
    correctAnswer: 0,
    explanation: '5 satisfies x>0 AND x<10. 0 fails x>0; 50 is outside (1..9) and not 100; 200 fails both branches.',
  },

  // ===================== Iteration =====================
  {
    id: 'iter-001', topic: 'Iteration', difficulty: 'easy',
    question: 'How many times does this loop run?',
    codeSnippet: 'REPEAT 5 TIMES\n{\n  DISPLAY("hi")\n}',
    choices: ['5', '4', '6', '0'],
    correctAnswer: 0,
    explanation: 'REPEAT n TIMES runs the body exactly n times. Off-by-one answers (4 or 6) are common mistakes.',
  },
  {
    id: 'iter-002', topic: 'Iteration', difficulty: 'medium',
    question: 'What is the final value of total?',
    codeSnippet: 'total \u2190 0\ni \u2190 1\nREPEAT UNTIL (i > 4)\n{\n  total \u2190 total + i\n  i \u2190 i + 1\n}\nDISPLAY(total)',
    choices: ['10', '6', '15', '4'],
    correctAnswer: 0,
    explanation: 'i takes 1, 2, 3, 4 → sum 10. 6 stops at i=3; 15 includes 5; 4 only adds the last value.',
  },
  {
    id: 'iter-003', topic: 'Iteration', difficulty: 'hard',
    question: 'How many times does DISPLAY run?',
    codeSnippet:
      'count \u2190 0\nFOR EACH x IN [1, 2, 3]\n{\n  FOR EACH y IN [4, 5]\n  {\n    count \u2190 count + 1\n    DISPLAY(count)\n  }\n}',
    choices: ['6', '5', '3', '2'],
    correctAnswer: 0,
    explanation: 'Nested loops: 3 × 2 = 6 iterations. Other choices ignore one of the loops.',
  },
  {
    id: 'iter-004', topic: 'Iteration', difficulty: 'medium',
    question: 'Which loop will never terminate?',
    codeSnippet: 'i \u2190 0\nREPEAT UNTIL (i = 10)\n{\n  i \u2190 i + 2\n}',
    choices: [
      'It will terminate when i = 10',
      'It never terminates because i goes 0, 2, 4, 6, 8, 10',
      'It never terminates because i = 10 is impossible only if i starts odd',
      'It depends on the user input',
    ],
    correctAnswer: 0,
    explanation: 'Starting from 0 and adding 2 reaches 10. The loop terminates. (Starting from 1 it would skip 10 and never stop.)',
  },
  {
    id: 'iter-005', topic: 'Iteration', difficulty: 'easy',
    question: 'Which best describes FOR EACH?',
    choices: [
      'Iterates over every element of a collection',
      'Repeats while a condition is true',
      'Picks one random element',
      'Defines a procedure',
    ],
    correctAnswer: 0,
    explanation: 'FOR EACH visits every element exactly once. The other descriptions match REPEAT UNTIL, random, and PROCEDURE respectively.',
  },

  // ===================== Procedures =====================
  {
    id: 'proc-001', topic: 'Procedures', difficulty: 'easy',
    question: 'What is a procedure?',
    choices: [
      'A named, reusable group of instructions',
      'A list of values',
      'A type of loop',
      'A variable that stores text',
    ],
    correctAnswer: 0,
    explanation: 'Procedures (functions/methods) are reusable named code blocks. The others are different abstractions.',
  },
  {
    id: 'proc-002', topic: 'Procedures', difficulty: 'medium',
    question: 'What is returned by Mystery(3, 4)?',
    codeSnippet: 'PROCEDURE Mystery(a, b)\n{\n  RETURN (a * a) + (b * b)\n}',
    choices: ['25', '12', '14', '49'],
    correctAnswer: 0,
    explanation: '3*3 + 4*4 = 9 + 16 = 25. 12 multiplies a*b*1; 14 sums squares incorrectly; 49 squares (a+b).',
  },
  {
    id: 'proc-003', topic: 'Procedures', difficulty: 'medium',
    question: 'Why use procedural abstraction?',
    choices: [
      'To hide complexity and make code reusable and maintainable',
      'To slow programs down for debugging',
      'To avoid using variables',
      'To replace iteration with selection',
    ],
    correctAnswer: 0,
    explanation: 'Abstraction lets us reason at a higher level. The other options are misconceptions.',
  },
  {
    id: 'proc-004', topic: 'Procedures', difficulty: 'hard',
    question: 'What does Mystery(6) return?',
    codeSnippet: 'PROCEDURE Mystery(n)\n{\n  IF (n \u2264 1)\n  {\n    RETURN 1\n  }\n  RETURN n * Mystery(n - 1)\n}',
    choices: ['720', '36', '120', '6'],
    correctAnswer: 0,
    explanation: 'This computes 6! = 720. 120 = 5!; 36 = 6*6; 6 forgets recursion.',
  },

  // ===================== Parameters =====================
  {
    id: 'param-001', topic: 'Parameters', difficulty: 'easy',
    question: 'Parameters are best described as:',
    choices: [
      'Inputs to a procedure that change behavior with each call',
      'Output values returned by a procedure',
      'Variables created automatically by lists',
      'A type of error message',
    ],
    correctAnswer: 0,
    explanation: 'Parameters generalize procedures. Returns are outputs; lists do not auto-create variables; errors are runtime issues.',
  },
  {
    id: 'param-002', topic: 'Parameters', difficulty: 'hard',
    question: 'What is displayed?',
    codeSnippet:
      'PROCEDURE Apply(x, y)\n{\n  x \u2190 x + 1\n  RETURN x + y\n}\n\nresult \u2190 Apply(5, 10)\nDISPLAY(result)',
    choices: ['16', '15', '11', '5'],
    correctAnswer: 0,
    explanation: 'Inside, x becomes 6; return is 6+10=16. The original 5 outside is unchanged because parameters are local.',
  },
  {
    id: 'param-003', topic: 'Parameters', difficulty: 'medium',
    question: 'What is the difference between a parameter and an argument?',
    choices: [
      'Parameter is in the definition; argument is the actual value passed',
      'They are the same thing',
      'A parameter is always a list; an argument is always a number',
      'A parameter is the return value',
    ],
    correctAnswer: 0,
    explanation: 'Parameter = name in PROCEDURE; argument = value supplied at the call site.',
  },

  // ===================== Boolean logic =====================
  {
    id: 'bool-001', topic: 'Boolean logic', difficulty: 'easy',
    question: 'Which expression evaluates to true?',
    choices: [
      '(5 > 3) AND (2 < 4)',
      '(5 > 3) AND (2 > 4)',
      'NOT (3 = 3)',
      '(5 < 3) OR (2 > 4)',
    ],
    correctAnswer: 0,
    explanation: 'Both halves are true → AND is true. The other combinations evaluate to false.',
  },
  {
    id: 'bool-002', topic: 'Boolean logic', difficulty: 'medium',
    question: 'NOT (A OR B) is logically equivalent to:',
    choices: [
      '(NOT A) AND (NOT B)',
      '(NOT A) OR (NOT B)',
      'A AND B',
      'A OR B',
    ],
    correctAnswer: 0,
    explanation: 'De Morgan\u2019s law: NOT(A OR B) = (NOT A) AND (NOT B). The other equivalences would require different operators.',
  },
  {
    id: 'bool-003', topic: 'Boolean logic', difficulty: 'hard',
    question: 'Which input makes the procedure return true?',
    codeSnippet: 'PROCEDURE Check(a, b)\n{\n  RETURN (a > 0) AND (NOT (b = 0)) AND ((a + b) MOD 2 = 0)\n}',
    choices: ['a=3, b=5', 'a=0, b=4', 'a=2, b=0', 'a=3, b=4'],
    correctAnswer: 0,
    explanation: 'a=3>0; b=5≠0; 3+5=8 even → true. (0,4) fails a>0; (2,0) fails b≠0; (3,4) sum is 7 odd.',
  },
  {
    id: 'bool-004', topic: 'Boolean logic', difficulty: 'easy',
    question: 'What is the value of NOT (5 < 3)?',
    choices: ['true', 'false', '5', '3'],
    correctAnswer: 0,
    explanation: '5 < 3 is false, NOT false = true. Numbers are not Boolean values.',
  },

  // ===================== Binary =====================
  {
    id: 'bin-001', topic: 'Binary', difficulty: 'easy',
    question: 'What is the decimal value of binary 1011?',
    choices: ['11', '9', '13', '7'],
    correctAnswer: 0,
    explanation: '8+0+2+1 = 11. 9 ignores the trailing 1; 13 includes a phantom 4; 7 ignores the 8.',
  },
  {
    id: 'bin-002', topic: 'Binary', difficulty: 'medium',
    question: 'How many distinct values can be represented with 8 bits?',
    choices: ['256', '128', '64', '512'],
    correctAnswer: 0,
    explanation: '2^8 = 256. 128 = 2^7; 64 = 2^6; 512 = 2^9.',
  },
  {
    id: 'bin-003', topic: 'Binary', difficulty: 'medium',
    question: 'What is the binary representation of decimal 19?',
    choices: ['10011', '11001', '10101', '11100'],
    correctAnswer: 0,
    explanation: '16 + 2 + 1 = 19 → 10011. The other patterns evaluate to 25, 21, and 28.',
  },
  {
    id: 'bin-004', topic: 'Binary', difficulty: 'hard',
    question: 'Which best explains overflow error?',
    choices: [
      'A value exceeds the maximum representable in the bits available',
      'The hard drive ran out of space',
      'Two variables share the same name',
      'A program runs forever',
    ],
    correctAnswer: 0,
    explanation: 'Overflow is a numeric range issue. The other options describe different problems (storage, scoping, infinite loops).',
  },
  {
    id: 'bin-005', topic: 'Binary', difficulty: 'easy',
    question: 'What is the decimal value of binary 100?',
    choices: ['4', '8', '2', '100'],
    correctAnswer: 0,
    explanation: '1·4 + 0·2 + 0·1 = 4. The "100" answer reads it as decimal.',
  },
  {
    id: 'bin-006', topic: 'Binary', difficulty: 'medium',
    question: 'Which decimal value equals binary 11111111?',
    choices: ['255', '256', '128', '512'],
    correctAnswer: 0,
    explanation: '2^8 − 1 = 255 (all 8 bits on). 256 = 2^8 needs 9 bits.',
  },
  {
    id: 'bin-007', topic: 'Binary', difficulty: 'hard',
    question: 'How many bits are required to represent decimal 1000?',
    choices: ['10', '8', '12', '4'],
    correctAnswer: 0,
    explanation: '2^9 = 512 < 1000 ≤ 1024 = 2^10, so 10 bits. 8 bits max 255; 4 bits max 15.',
  },
  {
    id: 'bin-008', topic: 'Binary', difficulty: 'easy',
    question: 'A "bit" is best described as:',
    choices: ['The smallest unit of data: a 0 or 1', 'A group of 8 numbers', 'A type of CPU', 'A web protocol'],
    correctAnswer: 0,
    explanation: 'Bit = binary digit (0 or 1). 8 bits = 1 byte; CPU and protocol are unrelated terms.',
  },

  // ===================== Data compression =====================
  {
    id: 'comp-001', topic: 'Data compression', difficulty: 'easy',
    question: 'Which compression always restores the original perfectly?',
    choices: ['Lossless', 'Lossy', 'Encryption', 'Streaming'],
    correctAnswer: 0,
    explanation: 'Lossless preserves all bits. Lossy discards some; encryption is for secrecy; streaming is delivery.',
  },
  {
    id: 'comp-002', topic: 'Data compression', difficulty: 'medium',
    question: 'Which file format is typically lossy?',
    choices: ['JPEG image', 'PNG image', 'TXT file', 'ZIP file'],
    correctAnswer: 0,
    explanation: 'JPEG sacrifices some image fidelity to shrink files. PNG/TXT/ZIP are lossless.',
  },
  {
    id: 'comp-003', topic: 'Data compression', difficulty: 'hard',
    question: 'When is lossy compression most appropriate?',
    choices: [
      'When small file size matters more than perfect fidelity',
      'When restoring exact original data is required',
      'When transmitting medical records',
      'When compressing source code',
    ],
    correctAnswer: 0,
    explanation: 'Lossy is fine for media where small fidelity loss is acceptable. Medical/legal/source files require lossless.',
  },
  {
    id: 'comp-004', topic: 'Data compression', difficulty: 'medium',
    question: 'Why does compression generally improve transmission speed?',
    choices: [
      'Smaller files require fewer bits to send',
      'It encrypts data so it goes faster',
      'It changes the speed of light on cables',
      'It eliminates protocols',
    ],
    correctAnswer: 0,
    explanation: 'Less data = less bandwidth time. The other answers are physically or technically wrong.',
  },

  // ===================== Internet =====================
  {
    id: 'net-001', topic: 'Internet', difficulty: 'easy',
    question: 'What is a protocol?',
    choices: [
      'A set of rules for data transmission between devices',
      'A type of cable',
      'A specific computer brand',
      'A web browser',
    ],
    correctAnswer: 0,
    explanation: 'Protocols (HTTP, TCP, IP) standardize communication so different systems interoperate.',
  },
  {
    id: 'net-002', topic: 'Internet', difficulty: 'medium',
    question: 'What does HTTP stand for?',
    choices: [
      'Hypertext Transfer Protocol',
      'Hyperlink Text Transfer Page',
      'Home Tool Transfer Protocol',
      'High-Throughput Transfer Process',
    ],
    correctAnswer: 0,
    explanation: 'HTTP = HyperText Transfer Protocol — the application-layer protocol for the Web.',
  },
  {
    id: 'net-003', topic: 'Internet', difficulty: 'medium',
    question: 'What is the role of DNS?',
    choices: [
      'Translates domain names into IP addresses',
      'Encrypts emails',
      'Stores backups of websites',
      'Compresses images',
    ],
    correctAnswer: 0,
    explanation: 'DNS is the Internet phonebook. The other roles belong to other systems entirely.',
  },
  {
    id: 'net-004', topic: 'Internet', difficulty: 'hard',
    question: 'Why is packet switching useful?',
    choices: [
      'Data takes different paths and tolerates failures',
      'It guarantees packets arrive in order',
      'It removes the need for protocols',
      'It encrypts all messages automatically',
    ],
    correctAnswer: 0,
    explanation: 'Independent routing makes the network fault-tolerant. Order is not guaranteed by IP; encryption is separate.',
  },
  {
    id: 'net-005', topic: 'Internet', difficulty: 'easy',
    question: 'Difference between bandwidth and latency?',
    choices: [
      'Bandwidth is data per unit time; latency is delay between request and response',
      'They are synonyms',
      'Bandwidth is delay; latency is data per unit time',
      'Both refer to encryption strength',
    ],
    correctAnswer: 0,
    explanation: 'Bandwidth = throughput; latency = delay. They are independent metrics.',
  },
  {
    id: 'net-006', topic: 'Internet', difficulty: 'medium',
    question: 'What is an IP address?',
    choices: [
      'A numeric label assigned to a device on a network',
      'A type of email service',
      'A web browser plugin',
      'A copyright symbol',
    ],
    correctAnswer: 0,
    explanation: 'IP addresses identify devices for routing. The other items are unrelated.',
  },
  {
    id: 'net-007', topic: 'Internet', difficulty: 'medium',
    question: 'What does TCP add on top of IP?',
    choices: [
      'Reliable, ordered delivery via acknowledgments and retransmission',
      'Encryption of all packets',
      'Domain-name translation',
      'Compression',
    ],
    correctAnswer: 0,
    explanation: 'TCP guarantees order/reliability; IP just routes packets. Encryption (TLS) and DNS are separate layers.',
  },
  {
    id: 'net-008', topic: 'Internet', difficulty: 'hard',
    question: 'Why does the Internet use open standards?',
    choices: [
      'So devices from different vendors can interoperate',
      'To restrict who can build hardware',
      'To slow down innovation',
      'To require a single vendor',
    ],
    correctAnswer: 0,
    explanation: 'Open standards enable interoperability and innovation; the other options are the opposite.',
  },
  {
    id: 'net-009', topic: 'Internet', difficulty: 'easy',
    question: 'A packet on the Internet typically contains:',
    choices: [
      'A header with addressing info plus a payload of data',
      'Only the user\'s password',
      'The entire file in one chunk',
      'Only metadata, never data',
    ],
    correctAnswer: 0,
    explanation: 'Header + payload is the basic structure. Files are split into many packets, not sent whole.',
  },

  // ===================== Cybersecurity =====================
  {
    id: 'cyber-001', topic: 'Cybersecurity', difficulty: 'easy',
    question: 'A phishing attack tries to:',
    choices: [
      'Trick the user into revealing sensitive info such as passwords',
      'Speed up the network',
      'Compress files',
      'Encrypt messages between friends',
    ],
    correctAnswer: 0,
    explanation: 'Phishing uses deceptive messages to extract credentials. The other items describe unrelated activities.',
  },
  {
    id: 'cyber-002', topic: 'Cybersecurity', difficulty: 'medium',
    question: 'Which is the strongest password?',
    choices: ['9$kRa!2#qZv7', 'password123', 'qwerty', 'admin'],
    correctAnswer: 0,
    explanation: 'Long with mixed case, digits, and symbols resists brute force. Common dictionary words fall instantly.',
  },
  {
    id: 'cyber-003', topic: 'Cybersecurity', difficulty: 'medium',
    question: 'Multi-factor authentication (MFA) means:',
    choices: [
      'Two or more independent credentials verify identity',
      'Two users share an account',
      'Encrypting data with two keys',
      'Using the same password on multiple sites',
    ],
    correctAnswer: 0,
    explanation: 'MFA combines something you know/have/are. Sharing accounts and password reuse are insecurities.',
  },
  {
    id: 'cyber-004', topic: 'Cybersecurity', difficulty: 'easy',
    question: 'A "virus" is best described as:',
    choices: [
      'Malicious software that can spread to other programs/files',
      'A weak password',
      'A network protocol',
      'A type of compression',
    ],
    correctAnswer: 0,
    explanation: 'Viruses replicate and infect. The other items are unrelated security or networking concepts.',
  },
  {
    id: 'cyber-005', topic: 'Cybersecurity', difficulty: 'medium',
    question: 'Why might you avoid public Wi-Fi without VPN?',
    choices: [
      'Other users on the network may eavesdrop on unencrypted traffic',
      'Public Wi-Fi is always faster than mobile data',
      'It uses too much electricity',
      'It speeds up phishing',
    ],
    correctAnswer: 0,
    explanation: 'Open networks expose plaintext traffic. The other claims are inaccurate.',
  },

  // ===================== Encryption =====================
  {
    id: 'enc-001', topic: 'Encryption', difficulty: 'easy',
    question: 'Encryption transforms data so that:',
    choices: [
      'Only authorized parties can read it',
      'Files become smaller',
      'Domains map to IPs',
      'Backups happen automatically',
    ],
    correctAnswer: 0,
    explanation: 'Encryption is about confidentiality. Compression, DNS, and backup are different concerns.',
  },
  {
    id: 'enc-002', topic: 'Encryption', difficulty: 'medium',
    question: 'Symmetric vs asymmetric encryption — which is correct?',
    choices: [
      'Symmetric uses one shared key; asymmetric uses a public/private key pair',
      'Symmetric requires the Internet; asymmetric does not',
      'Symmetric is always more secure',
      'There is no difference',
    ],
    correctAnswer: 0,
    explanation: 'Key model is the defining difference. Security depends on implementation, not on which family.',
  },
  {
    id: 'enc-003', topic: 'Public/private keys', difficulty: 'hard',
    question: 'In public-key encryption, what is shared and what is kept secret?',
    choices: [
      'Public key is shared; private key is secret',
      'Both keys are shared',
      'Both keys are secret',
      'The public key is secret; the private key is shared',
    ],
    correctAnswer: 0,
    explanation: 'You publish the public key; only you can decrypt with the private key.',
  },
  {
    id: 'enc-004', topic: 'Public/private keys', difficulty: 'medium',
    question: 'Bob wants to send Alice an encrypted message. Whose key does he use?',
    choices: [
      "Alice's public key",
      "Bob's private key",
      "Alice's private key",
      "Bob's public key",
    ],
    correctAnswer: 0,
    explanation: 'Encrypt with the recipient\'s public key so only they can decrypt with their private key.',
  },
  {
    id: 'enc-005', topic: 'Encryption', difficulty: 'medium',
    question: 'A digital certificate primarily provides:',
    choices: [
      'A way to verify a server\'s identity',
      'Free disk space',
      'A faster CPU',
      'Compression of HTML',
    ],
    correctAnswer: 0,
    explanation: 'Certificates bind identities to public keys via a trusted authority. Other choices are unrelated.',
  },

  // ===================== Abstraction =====================
  {
    id: 'abs-001', topic: 'Abstraction', difficulty: 'easy',
    question: 'What does abstraction help programmers do?',
    choices: [
      'Manage complexity by hiding details',
      'Run programs on more hardware',
      'Avoid using variables',
      'Skip writing comments',
    ],
    correctAnswer: 0,
    explanation: 'Abstraction lets us focus on what something does, not how. The other options are misconceptions.',
  },
  {
    id: 'abs-002', topic: 'Abstraction', difficulty: 'medium',
    question: 'Calling DrawCircle without knowing how it works is an example of:',
    choices: ['Procedural abstraction', 'Iteration', 'Selection', 'Sequencing'],
    correctAnswer: 0,
    explanation: 'Using a procedure by name is procedural abstraction. The other answers describe different control structures.',
  },
  {
    id: 'abs-003', topic: 'Abstraction', difficulty: 'medium',
    question: 'Which is an example of data abstraction?',
    choices: [
      'Treating a list of student grades as one object instead of separate variables',
      'Writing a longer program',
      'Using only integers',
      'Avoiding loops',
    ],
    correctAnswer: 0,
    explanation: 'Data abstraction wraps related values in one structure. The other choices are unrelated to abstraction.',
  },

  // ===================== Simulations =====================
  {
    id: 'sim-001', topic: 'Simulations', difficulty: 'easy',
    question: 'Why use a simulation instead of a real experiment?',
    choices: [
      'Safer, cheaper, or faster',
      'It always gives perfect real-world results',
      'It removes the need for any model',
      'It eliminates the need for data',
    ],
    correctAnswer: 0,
    explanation: 'Simulations explore scenarios that are dangerous, expensive, or slow in reality. They are not perfect.',
  },
  {
    id: 'sim-002', topic: 'Simulations', difficulty: 'medium',
    question: 'A common limitation of simulations is:',
    choices: [
      'They are simplifications and may omit important factors',
      'They cannot use random numbers',
      'They cannot be re-run',
      'They always require physical materials',
    ],
    correctAnswer: 0,
    explanation: 'Models leave out detail; results may diverge from reality. The other claims are false.',
  },
  {
    id: 'sim-003', topic: 'Simulations', difficulty: 'medium',
    question: 'Modeling a fair coin flip in code is best done by:',
    choices: [
      'A random number generator returning 0 or 1 with equal probability',
      'Always returning heads',
      'Alternating heads and tails',
      'Asking the user',
    ],
    correctAnswer: 0,
    explanation: 'Equal-probability randomness fits a fair coin. Determinism or user input does not.',
  },

  // ===================== APIs =====================
  {
    id: 'api-001', topic: 'APIs', difficulty: 'easy',
    question: 'What is an API?',
    choices: [
      'An interface that lets programs interact with another service or library',
      'A type of password',
      'A data compression algorithm',
      'A web browser',
    ],
    correctAnswer: 0,
    explanation: 'APIs define how to call functionality. The other options are unrelated terms.',
  },
  {
    id: 'api-002', topic: 'APIs', difficulty: 'medium',
    question: 'Why use a public API?',
    choices: [
      'Reuse complex functionality without rebuilding it',
      'Avoid using procedures',
      'Bypass legal terms of service',
      'Make programs run on more CPUs',
    ],
    correctAnswer: 0,
    explanation: 'APIs are about reuse and abstraction. They do not let you bypass terms or change CPU support.',
  },
  {
    id: 'api-003', topic: 'APIs', difficulty: 'medium',
    question: 'Why is reading API documentation important?',
    choices: [
      'It explains expected inputs, outputs, and side effects',
      'It is required for the program to compile',
      'It changes the operating system',
      'It is the same as installing the API',
    ],
    correctAnswer: 0,
    explanation: 'Docs are for humans; compilation does not require them. They are not the OS or installer.',
  },

  // ===================== Libraries =====================
  {
    id: 'lib-001', topic: 'Libraries', difficulty: 'easy',
    question: 'What is a library in programming?',
    choices: [
      'A collection of pre-written code that can be reused',
      'A physical place to store data',
      'A list of variables',
      'A subnet mask',
    ],
    correctAnswer: 0,
    explanation: 'Libraries package reusable functionality. The other options describe other concepts.',
  },
  {
    id: 'lib-002', topic: 'Libraries', difficulty: 'medium',
    question: 'A benefit of using a well-tested library is:',
    choices: [
      'Less time spent reimplementing common features',
      'Programs run without bugs forever',
      'No need to learn programming',
      'Removes the need for variables',
    ],
    correctAnswer: 0,
    explanation: 'Reuse saves time and reduces bugs in common code paths. It does not eliminate bugs entirely.',
  },

  // ===================== AP Create Task =====================
  {
    id: 'create-001', topic: 'AP Create Task', difficulty: 'easy',
    question: 'For the Create Task program, you must include:',
    choices: [
      'A list (or other collection) used in a meaningful way',
      'A graphical user interface',
      'A database connection',
      'Multiplayer networking',
    ],
    correctAnswer: 0,
    explanation: 'A list managing complexity is required. UI/db/networking are not required.',
  },
  {
    id: 'create-002', topic: 'AP Create Task', difficulty: 'medium',
    question: 'Which of these is REQUIRED in the student-developed program?',
    choices: [
      'A student-developed procedure with at least one parameter that affects functionality',
      'A backend database',
      'A login system',
      'Multiple programming languages',
    ],
    correctAnswer: 0,
    explanation: 'A meaningful, parameterized procedure you wrote is required. Other items are not.',
  },
  {
    id: 'create-003', topic: 'AP Create Task', difficulty: 'medium',
    question: 'Why must your written response explain how the list manages complexity?',
    choices: [
      'To show that without the list the program would be more complicated or less general',
      'To prove your code uses recursion',
      'To list all variables',
      'Because hand-drawn diagrams are required',
    ],
    correctAnswer: 0,
    explanation: 'You must justify the list\'s usefulness. Recursion is not required, and diagrams aren\'t mandated.',
  },
  {
    id: 'create-004', topic: 'AP Create Task', difficulty: 'hard',
    question: 'The procedure response must describe:',
    choices: [
      'How it contributes to functionality, including how parameters change behavior',
      'Only the syntax used',
      'A complete edit history',
      'Every variable in the program',
    ],
    correctAnswer: 0,
    explanation: 'Functionality + parameters is the rubric requirement. Editing history and full variable lists are not asked for.',
  },

  // ===================== Mixed scenario / extra coverage =====================
  {
    id: 'sce-001', topic: 'Algorithms', difficulty: 'medium',
    question: 'A program checks every value in a list for a match. Doubling the list size roughly doubles runtime. This is:',
    choices: ['Linear search (reasonable time)', 'Binary search', 'Unreasonable time', 'Constant time'],
    correctAnswer: 0,
    explanation: 'Doubling input → doubling time = linear (O(n)). Binary search is O(log n); constant doesn\'t depend on n.',
  },
  {
    id: 'sce-002', topic: 'Cybersecurity', difficulty: 'medium',
    question: 'A school sends emails warning about suspicious links asking for passwords. They are mainly defending against:',
    choices: ['Phishing', 'Lossy compression', 'Bandwidth limits', 'DNS lookups'],
    correctAnswer: 0,
    explanation: 'Phishing awareness training reduces credential theft. The others are unrelated phenomena.',
  },
  {
    id: 'sce-003', topic: 'Internet', difficulty: 'easy',
    question: 'Two devices with very different hardware still communicate because:',
    choices: ['Open standards and shared protocols', 'Identical CPUs', 'Same operating system', 'Shared encryption keys'],
    correctAnswer: 0,
    explanation: 'Standards/protocols enable interoperability across hardware/OS differences.',
  },
  {
    id: 'voc-001', topic: 'Abstraction', difficulty: 'easy',
    question: 'Which best defines "data abstraction"?',
    choices: [
      'Representing complex data with simpler structures or names',
      'Encrypting data',
      'Compressing data',
      'Sending data over a network',
    ],
    correctAnswer: 0,
    explanation: 'Abstraction is naming/structuring. The other items describe security, compression, and networking.',
  },
  {
    id: 'voc-002', topic: 'Iteration', difficulty: 'easy',
    question: '"Iteration" most nearly means:',
    choices: ['Repetition of steps', 'Choosing between options', 'Storing a value', 'Calling a procedure'],
    correctAnswer: 0,
    explanation: 'Iteration is repetition. Selection chooses; assignment stores; call executes a procedure.',
  },
  {
    id: 'voc-003', topic: 'Selection', difficulty: 'easy',
    question: '"Selection" most nearly means:',
    choices: [
      'Choosing which statements to run based on a condition',
      'Storing values in a list',
      'Repeating instructions',
      'Defining a new procedure',
    ],
    correctAnswer: 0,
    explanation: 'IF/ELSE chooses paths. Lists store; loops repeat; PROCEDURE defines.',
  },
  {
    id: 'code-001', topic: 'Iteration', difficulty: 'medium',
    question: 'What does the procedure return when called with [4, 9, 2, 7, 5]?',
    codeSnippet:
      'PROCEDURE FindMax(list)\n{\n  best \u2190 list[1]\n  FOR EACH item IN list\n  {\n    IF (item > best)\n    {\n      best \u2190 item\n    }\n  }\n  RETURN best\n}',
    choices: ['9', '7', '4', '5'],
    correctAnswer: 0,
    explanation: 'It tracks the largest element. Maximum is 9.',
  },
  {
    id: 'code-002', topic: 'Lists', difficulty: 'medium',
    question: 'What does Count([3,1,4,1,5], 1) return?',
    codeSnippet:
      'PROCEDURE Count(list, target)\n{\n  c \u2190 0\n  FOR EACH x IN list\n  {\n    IF (x = target)\n    {\n      c \u2190 c + 1\n    }\n  }\n  RETURN c\n}',
    choices: ['2', '1', '3', '0'],
    correctAnswer: 0,
    explanation: '1 appears at indices 2 and 4 → count 2.',
  },

  // ===== more variables =====
  {
    id: 'var-006', topic: 'Variables', difficulty: 'easy',
    question: 'What is the value of count after the loop runs?',
    codeSnippet: 'count \u2190 0\nREPEAT 3 TIMES\n{\n  count \u2190 count + 2\n}',
    choices: ['6', '3', '5', '0'],
    correctAnswer: 0,
    explanation: '0 → 2 → 4 → 6. The other choices forget the +2 behavior.',
  },
  {
    id: 'var-007', topic: 'Variables', difficulty: 'medium',
    question: 'What does this code display?',
    codeSnippet: 'a \u2190 5\nb \u2190 10\ntmp \u2190 a\na \u2190 b\nb \u2190 tmp\nDISPLAY(a)\nDISPLAY(b)',
    choices: ['10 then 5', '5 then 10', '10 then 10', '5 then 5'],
    correctAnswer: 0,
    explanation: 'A classic swap with a temp variable: a=10, b=5.',
  },

  // ===== more lists =====
  {
    id: 'list-007', topic: 'Lists', difficulty: 'medium',
    question: 'What is displayed?',
    codeSnippet: 'L \u2190 [10, 20, 30]\nL[2] \u2190 L[2] + L[3]\nDISPLAY(L[2])',
    choices: ['50', '30', '20', '60'],
    correctAnswer: 0,
    explanation: 'L[2]=20, L[3]=30; sum is 50. 30 forgets the addition; 60 doubles incorrectly.',
  },
  {
    id: 'list-008', topic: 'Lists', difficulty: 'hard',
    question: 'What does the procedure return for [3,5,2,9,1]?',
    codeSnippet:
      'PROCEDURE Mystery(list)\n{\n  s \u2190 0\n  FOR EACH x IN list\n  {\n    IF (x MOD 2 = 1)\n    {\n      s \u2190 s + x\n    }\n  }\n  RETURN s\n}',
    choices: ['18', '20', '10', '15'],
    correctAnswer: 0,
    explanation: 'Sum of odd numbers: 3+5+9+1 = 18.',
  },
  {
    id: 'list-009', topic: 'Lists', difficulty: 'easy',
    question: 'What does LENGTH(["a","b","c","d"]) return?',
    choices: ['4', '3', '5', '0'],
    correctAnswer: 0,
    explanation: 'LENGTH returns element count, which is 4.',
  },

  // ===== more iteration =====
  {
    id: 'iter-006', topic: 'Iteration', difficulty: 'medium',
    question: 'How many DISPLAY calls happen?',
    codeSnippet: 'i \u2190 0\nREPEAT UNTIL (i \u2265 3)\n{\n  DISPLAY(i)\n  i \u2190 i + 1\n}',
    choices: ['3', '4', '2', '1'],
    correctAnswer: 0,
    explanation: 'i prints 0, 1, 2 then loop ends → 3 calls. 4 would include i=3.',
  },
  {
    id: 'iter-007', topic: 'Iteration', difficulty: 'hard',
    question: 'What is total at the end?',
    codeSnippet: 'total \u2190 0\nFOR EACH x IN [1,2,3]\n{\n  FOR EACH y IN [1,2]\n  {\n    total \u2190 total + (x * y)\n  }\n}',
    choices: ['18', '12', '24', '9'],
    correctAnswer: 0,
    explanation: 'Sum over (x*y): (1+2)+(2+4)+(3+6) = 3+6+9 = 18.',
  },

  // ===== more selection =====
  {
    id: 'sel-005', topic: 'Selection', difficulty: 'medium',
    question: 'What is displayed when n is 7?',
    codeSnippet: 'IF (n MOD 2 = 0)\n{\n  DISPLAY("even")\n}\nELSE\n{\n  IF (n > 5)\n  {\n    DISPLAY("big odd")\n  }\n  ELSE\n  {\n    DISPLAY("small odd")\n  }\n}',
    choices: ['big odd', 'even', 'small odd', 'nothing'],
    correctAnswer: 0,
    explanation: '7 is odd and > 5 → "big odd". The first IF\'s body only runs for evens.',
  },

  // ===== more procedures =====
  {
    id: 'proc-005', topic: 'Procedures', difficulty: 'medium',
    question: 'What does Twice(Add, 3, 4) display, given Twice runs the procedure twice on its arguments?',
    codeSnippet:
      'PROCEDURE Add(a, b)\n{\n  RETURN a + b\n}\n\nPROCEDURE Twice(F, a, b)\n{\n  DISPLAY(F(a, b))\n  DISPLAY(F(a, b))\n}\n\nTwice(Add, 3, 4)',
    choices: ['7 then 7', '7 then 14', '3 then 4', '14'],
    correctAnswer: 0,
    explanation: 'F(3,4) = 7 each call → "7" twice. Higher-order procedures pass other procedures as arguments.',
  },

  // ===== more parameters =====
  {
    id: 'param-004', topic: 'Parameters', difficulty: 'easy',
    question: 'In PROCEDURE Square(n), n is what?',
    choices: ['A parameter', 'A return value', 'A list', 'A boolean operator'],
    correctAnswer: 0,
    explanation: 'Names in the parentheses of a definition are parameters.',
  },

  // ===== more boolean =====
  {
    id: 'bool-005', topic: 'Boolean logic', difficulty: 'medium',
    question: 'Which simplification is correct?',
    choices: [
      'NOT (A AND B) = (NOT A) OR (NOT B)',
      'NOT (A AND B) = (NOT A) AND (NOT B)',
      'NOT (A OR B) = A AND B',
      'NOT (A OR B) = NOT A',
    ],
    correctAnswer: 0,
    explanation: 'De Morgan: NOT(A AND B) = (NOT A) OR (NOT B). The other options misuse the law.',
  },

  // ===== more binary =====
  {
    id: 'bin-009', topic: 'Binary', difficulty: 'medium',
    question: 'A file is 2,048 bytes. How many bits does it contain?',
    choices: ['16,384', '2,048', '256', '8,192'],
    correctAnswer: 0,
    explanation: '2,048 × 8 = 16,384 bits. 256 reverses (bytes/8); 8,192 multiplies by 4; 2,048 forgets the conversion.',
  },
  {
    id: 'bin-010', topic: 'Binary', difficulty: 'easy',
    question: 'Decimal 7 in binary is:',
    choices: ['111', '101', '110', '011'],
    correctAnswer: 0,
    explanation: '4+2+1 = 7 → 111. Other options give 5, 6, or 3.',
  },

  // ===== more compression =====
  {
    id: 'comp-005', topic: 'Data compression', difficulty: 'easy',
    question: 'Which scenario is best for lossless compression?',
    choices: ['Compressing source code', 'Streaming low-quality video', 'Sharing a large photo for social media', 'Recording a long voicemail'],
    correctAnswer: 0,
    explanation: 'Source code must round-trip exactly. Streaming/photo/voicemail tolerate minor quality loss.',
  },

  // ===== more internet =====
  {
    id: 'net-010', topic: 'Internet', difficulty: 'easy',
    question: 'A "router" primarily:',
    choices: [
      'Forwards packets between networks',
      'Encrypts files on disk',
      'Hosts websites',
      'Compresses images',
    ],
    correctAnswer: 0,
    explanation: 'Routers route. Hosting and encryption are separate roles.',
  },
  {
    id: 'net-011', topic: 'Internet', difficulty: 'medium',
    question: 'IPv6 addresses were introduced because:',
    choices: [
      'IPv4 ran out of unique addresses',
      'IPv6 is faster',
      'IPv6 supports HTML5',
      'IPv6 replaces DNS',
    ],
    correctAnswer: 0,
    explanation: 'IPv4 address exhaustion drove IPv6 adoption. The other claims are inaccurate.',
  },

  // ===== more cybersec =====
  {
    id: 'cyber-006', topic: 'Cybersecurity', difficulty: 'easy',
    question: 'Which is an example of social engineering?',
    choices: [
      'A scammer pretends to be IT support to get a password',
      'A faulty cable',
      'A weak password',
      'A virus exploiting an unpatched bug',
    ],
    correctAnswer: 0,
    explanation: 'Social engineering manipulates people. Hardware/software flaws are not social attacks.',
  },
  {
    id: 'cyber-007', topic: 'Cybersecurity', difficulty: 'medium',
    question: 'A "DDoS" attack does what?',
    choices: [
      'Overwhelms a service with traffic so it cannot respond',
      'Steals a password by guessing',
      'Encrypts files for ransom',
      'Forges a digital certificate',
    ],
    correctAnswer: 0,
    explanation: 'Distributed Denial of Service floods. Brute force, ransomware, and forgery are different attacks.',
  },

  // ===== more abstraction =====
  {
    id: 'abs-004', topic: 'Abstraction', difficulty: 'easy',
    question: 'Which is the highest-level abstraction?',
    choices: ['"Find the cheapest flight to Tokyo"', 'Add two integers', 'Set bit 3 to 1', 'Move the read head to sector 12'],
    correctAnswer: 0,
    explanation: '"Find cheapest flight" hides many subroutines. The others are progressively closer to hardware.',
  },

  // ===== more simulations =====
  {
    id: 'sim-004', topic: 'Simulations', difficulty: 'medium',
    question: 'Which is a benefit of running many simulation trials?',
    choices: [
      'Estimating probabilities and average outcomes more accurately',
      'Avoiding the need for any model assumptions',
      'Eliminating randomness',
      'Removing the need for testing',
    ],
    correctAnswer: 0,
    explanation: 'More trials → tighter estimates. Assumptions and testing are still required.',
  },

  // ===== more APIs =====
  {
    id: 'api-004', topic: 'APIs', difficulty: 'easy',
    question: 'Which is an example of API usage?',
    choices: [
      'Calling DrawCircle(50) provided by a graphics library',
      'Buying a new monitor',
      'Plugging in a USB cable',
      'Soldering a chip',
    ],
    correctAnswer: 0,
    explanation: 'Calling a provided procedure is API usage. The others are physical/hardware actions.',
  },

  // ===== more libraries =====
  {
    id: 'lib-003', topic: 'Libraries', difficulty: 'easy',
    question: 'A risk of relying on third-party libraries is:',
    choices: [
      'A vulnerability in the library can affect your program',
      'Your program will run faster automatically',
      'You will lose access to your own code',
      'You no longer need to test your program',
    ],
    correctAnswer: 0,
    explanation: 'Library bugs/vulnerabilities propagate to your program. The other claims are wrong.',
  },

  // ===== more create task =====
  {
    id: 'create-005', topic: 'AP Create Task', difficulty: 'medium',
    question: 'Your written response must include video evidence demonstrating:',
    choices: [
      'A program input, the program in operation, and a program output',
      'Your local development environment setup',
      'Each variable in the source code',
      'The runtime of every loop',
    ],
    correctAnswer: 0,
    explanation: 'The video must show input, run, and output. Setup or runtime details are not required in the video.',
  },

  // ===== Additional questions for breadth (push past 150) =====
  {
    id: 'var-008', topic: 'Variables', difficulty: 'easy',
    question: 'What does this code display?',
    codeSnippet: 'x \u2190 10\nx \u2190 x - 4\nDISPLAY(x)',
    choices: ['6', '10', '-4', '14'],
    correctAnswer: 0,
    explanation: '10 - 4 = 6. -4 forgets x; 14 adds; 10 forgets reassignment.',
  },
  {
    id: 'list-010', topic: 'Lists', difficulty: 'medium',
    question: 'What does the code display?',
    codeSnippet: 'L \u2190 [1,2,3,4,5]\ncount \u2190 0\nFOR EACH x IN L\n{\n  IF (x MOD 2 = 0)\n  {\n    count \u2190 count + x\n  }\n}\nDISPLAY(count)',
    choices: ['6', '15', '4', '9'],
    correctAnswer: 0,
    explanation: 'Sum of even values 2 and 4 → 6. 15 sums everything; 4 forgets the 2; 9 incorrectly includes odds.',
  },
  {
    id: 'algo-007', topic: 'Algorithms', difficulty: 'hard',
    question: 'A heuristic algorithm:',
    choices: [
      'Finds an approximate solution that may not be optimal but is good enough',
      'Always finds the best solution',
      'Always runs in constant time',
      'Cannot be implemented on computers',
    ],
    correctAnswer: 0,
    explanation: 'Heuristics trade optimality for practicality. They are widely used and not constant-time.',
  },
  {
    id: 'iter-008', topic: 'Iteration', difficulty: 'medium',
    question: 'What does this print?',
    codeSnippet: 'i \u2190 1\nREPEAT 4 TIMES\n{\n  DISPLAY(i)\n  i \u2190 i * 2\n}',
    choices: ['1, 2, 4, 8', '2, 4, 8, 16', '1, 1, 1, 1', '1, 2, 3, 4'],
    correctAnswer: 0,
    explanation: 'Doubles each iteration starting from 1 → 1, 2, 4, 8.',
  },
  {
    id: 'proc-006', topic: 'Procedures', difficulty: 'easy',
    question: 'A procedure that returns no value is sometimes called:',
    choices: ['A void / pure-effect procedure', 'A literal', 'A constant', 'A class'],
    correctAnswer: 0,
    explanation: 'No-return procedures perform side effects only. The other terms are unrelated.',
  },
  {
    id: 'param-005', topic: 'Parameters', difficulty: 'medium',
    question: 'A procedure with TWO parameters that affect functionality is required for the Create Task. Why?',
    choices: [
      'It demonstrates how parameter values change behavior',
      'It is a security requirement',
      'It speeds up code',
      'It saves memory',
    ],
    correctAnswer: 0,
    explanation: 'The point is to demonstrate generality and abstraction via parameters. Note: the rubric requires AT LEAST one such parameter.',
  },
  {
    id: 'bool-006', topic: 'Boolean logic', difficulty: 'easy',
    question: 'true OR false equals:',
    choices: ['true', 'false', 'undefined', '1 or 0'],
    correctAnswer: 0,
    explanation: 'OR is true if either is true. "1 or 0" is a representation, not a Boolean value.',
  },
  {
    id: 'bin-011', topic: 'Binary', difficulty: 'easy',
    question: 'How is the letter "A" typically encoded in ASCII?',
    choices: ['65', '1', 'A', '101'],
    correctAnswer: 0,
    explanation: 'ASCII "A" is 65 (decimal). 101 is "e".',
  },
  {
    id: 'comp-006', topic: 'Data compression', difficulty: 'medium',
    question: 'A simple compression scheme replaces repeated runs with (count, value). This is:',
    choices: ['Run-length encoding (lossless)', 'Lossy compression', 'Public-key encryption', 'Hashing'],
    correctAnswer: 0,
    explanation: 'RLE losslessly compresses repeated runs. The other options are unrelated.',
  },
  {
    id: 'net-012', topic: 'Internet', difficulty: 'medium',
    question: 'What does HTTPS add over HTTP?',
    choices: [
      'Encryption via TLS for confidentiality and integrity',
      'Faster latency in all cases',
      'Compression of bytes',
      'Mandatory IPv6',
    ],
    correctAnswer: 0,
    explanation: 'HTTPS = HTTP + TLS. Latency may be slightly higher; compression and IPv6 are unrelated.',
  },
  {
    id: 'cyber-008', topic: 'Cybersecurity', difficulty: 'medium',
    question: 'Defense-in-depth means:',
    choices: [
      'Layering multiple controls so that one failure does not breach the system',
      'Using only one strong password',
      'Storing passwords in plain text inside a deep folder',
      'Encrypting files twice with the same key',
    ],
    correctAnswer: 0,
    explanation: 'Multiple, independent layers raise the cost of a successful attack.',
  },
  {
    id: 'enc-006', topic: 'Encryption', difficulty: 'medium',
    question: 'Hashing is best described as:',
    choices: [
      'A one-way function that maps data to a fixed-size value, useful for integrity checks',
      'A reversible encryption method',
      'A type of compression',
      'A protocol for routing packets',
    ],
    correctAnswer: 0,
    explanation: 'Hashes are one-way; encryption is reversible with a key. Compression and routing are different.',
  },
  {
    id: 'abs-005', topic: 'Abstraction', difficulty: 'medium',
    question: 'Which is NOT a benefit of abstraction?',
    choices: [
      'It guarantees the program has no bugs',
      'It hides complexity',
      'It promotes reuse',
      'It improves readability',
    ],
    correctAnswer: 0,
    explanation: 'Abstraction does not eliminate bugs. The others are real benefits.',
  },
  {
    id: 'sim-005', topic: 'Simulations', difficulty: 'easy',
    question: 'Which is the best example of using a simulation?',
    choices: [
      'Modeling traffic flow before changing road designs',
      'Watching a movie',
      'Compressing a file',
      'Sorting a list of names',
    ],
    correctAnswer: 0,
    explanation: 'Real-world systems modeled in code → simulation. The others are unrelated tasks.',
  },
  {
    id: 'api-005', topic: 'APIs', difficulty: 'medium',
    question: 'A common reason an API call fails is:',
    choices: [
      'Wrong arguments or missing authentication',
      'Your monitor brightness is too low',
      'You typed in dark mode',
      'You did not restart the OS',
    ],
    correctAnswer: 0,
    explanation: 'Bad inputs/credentials are the typical cause. The other options are not technical reasons.',
  },
  {
    id: 'lib-004', topic: 'Libraries', difficulty: 'medium',
    question: 'Why is library version pinning useful?',
    choices: [
      'Reproducible builds — the same version behaves the same across machines',
      'It makes code prettier',
      'It uses less RAM',
      'It removes all bugs',
    ],
    correctAnswer: 0,
    explanation: 'Pinning prevents surprise changes from upstream. Aesthetics, RAM, and bug-freeness are not direct effects.',
  },
  {
    id: 'create-006', topic: 'AP Create Task', difficulty: 'easy',
    question: 'During the Create Task, you may collaborate with:',
    choices: [
      'No one — it must be your individual work',
      'Anyone in your school freely',
      'A professional developer',
      'Only your teacher',
    ],
    correctAnswer: 0,
    explanation: 'The Create Task program submission must be the student\'s individual work.',
  },

  // -- additional code-heavy items --
  {
    id: 'code-003', topic: 'Procedures', difficulty: 'medium',
    question: 'What does Mystery(0) return?',
    codeSnippet: 'PROCEDURE Mystery(n)\n{\n  IF (n = 0)\n  {\n    RETURN 1\n  }\n  RETURN n * Mystery(n - 1)\n}',
    choices: ['1', '0', 'undefined', 'infinite'],
    correctAnswer: 0,
    explanation: 'Base case returns 1. 0! = 1 by convention.',
  },
  {
    id: 'code-004', topic: 'Iteration', difficulty: 'hard',
    question: 'How many DISPLAY calls run?',
    codeSnippet: 'i \u2190 0\nREPEAT UNTIL (i > 5)\n{\n  IF (i MOD 2 = 0)\n  {\n    DISPLAY(i)\n  }\n  i \u2190 i + 1\n}',
    choices: ['3', '6', '4', '2'],
    correctAnswer: 0,
    explanation: 'i goes 0..5; even values 0,2,4 → 3 displays.',
  },
  {
    id: 'code-005', topic: 'Lists', difficulty: 'medium',
    question: 'What is L after the code runs?',
    codeSnippet: 'L \u2190 [4,5,6]\nFOR i \u2190 1 TO LENGTH(L)\n{\n  L[i] \u2190 L[i] * 2\n}',
    choices: ['[8,10,12]', '[4,5,6]', '[2,2.5,3]', '[16,20,24]'],
    correctAnswer: 0,
    explanation: 'Each element doubled. The original or quartered/halved options are wrong.',
  },
  {
    id: 'code-006', topic: 'Selection', difficulty: 'easy',
    question: 'Which condition is true when score is between 70 and 89 inclusive?',
    choices: [
      '(score \u2265 70) AND (score \u2264 89)',
      '(score \u2265 70) OR (score \u2264 89)',
      'score = 70 AND score = 89',
      '(score < 70) AND (score > 89)',
    ],
    correctAnswer: 0,
    explanation: 'Inclusive range needs AND with both bounds. OR matches all numbers; the others are impossible.',
  },
  {
    id: 'sce-004', topic: 'Algorithms', difficulty: 'easy',
    question: 'Why decompose a problem into smaller procedures?',
    choices: [
      'Easier to design, test, and reuse',
      'It always reduces runtime',
      'It eliminates all bugs',
      'It is required by every programming language',
    ],
    correctAnswer: 0,
    explanation: 'Decomposition aids design and testing. It does not guarantee speed or bug-freeness.',
  },
  {
    id: 'sce-005', topic: 'Cybersecurity', difficulty: 'medium',
    question: 'Why store passwords as salted hashes?',
    choices: [
      'Even if the database leaks, original passwords cannot be recovered',
      'It compresses passwords',
      'It logs in users faster',
      'It prevents typos',
    ],
    correctAnswer: 0,
    explanation: 'Salted hashes resist offline cracking and rainbow tables. Compression/login speed/typos are unrelated.',
  },
  {
    id: 'sce-006', topic: 'Internet', difficulty: 'easy',
    question: 'A web request typically goes:',
    choices: [
      'Browser → DNS resolves → server → response → render',
      'Browser → CPU → CD-ROM',
      'Server → BIOS → Browser',
      'Email → DNS → File system',
    ],
    correctAnswer: 0,
    explanation: 'High-level web flow involves DNS resolution and HTTP exchange.',
  },

  // ----- Even more to cleanly exceed 150 -----
  {
    id: 'var-009', topic: 'Variables', difficulty: 'medium',
    question: 'What is the value of result?',
    codeSnippet: 'a \u2190 7\nb \u2190 3\nresult \u2190 (a * 2) + b\nresult \u2190 result - a',
    choices: ['10', '17', '14', '7'],
    correctAnswer: 0,
    explanation: 'result = 14+3=17, then 17-7=10. Step-by-step substitution catches off-by-one errors.',
  },
  {
    id: 'list-011', topic: 'Lists', difficulty: 'medium',
    question: 'After the code, what is L[3]?',
    codeSnippet: 'L \u2190 [10,20,30,40]\nIF (L[1] < L[2])\n{\n  L[3] \u2190 L[3] + 5\n}',
    choices: ['35', '30', '25', '40'],
    correctAnswer: 0,
    explanation: 'L[1]=10 < L[2]=20 is true, so L[3] becomes 35.',
  },
  {
    id: 'algo-008', topic: 'Algorithms', difficulty: 'medium',
    question: 'Decomposition is best described as:',
    choices: [
      'Breaking a problem into smaller subproblems',
      'Decoding ciphertext',
      'Compressing data',
      'Removing comments',
    ],
    correctAnswer: 0,
    explanation: 'Decomposition tackles complexity by splitting problems. The others are different operations.',
  },
  {
    id: 'iter-009', topic: 'Iteration', difficulty: 'easy',
    question: 'Which loop type is guaranteed to run at least once?',
    choices: [
      'A REPEAT n TIMES with n > 0',
      'A REPEAT UNTIL with condition true at start',
      'A FOR EACH on an empty list',
      'A WHILE on a false condition',
    ],
    correctAnswer: 0,
    explanation: 'REPEAT n>0 runs n times. The others may run zero times.',
  },
  {
    id: 'proc-007', topic: 'Procedures', difficulty: 'medium',
    question: 'A procedure is "pure" if:',
    choices: [
      'It returns the same output for the same inputs and has no side effects',
      'It is named in capital letters',
      'It is written in pseudocode',
      'It does not use parameters',
    ],
    correctAnswer: 0,
    explanation: 'Purity = deterministic + no side effects. Naming and language are unrelated.',
  },
  {
    id: 'bool-007', topic: 'Boolean logic', difficulty: 'medium',
    question: 'Which expression equals (NOT A) for any Boolean A?',
    choices: ['A XOR true', 'A AND true', 'A OR true', 'A AND A'],
    correctAnswer: 0,
    explanation: 'A XOR true flips A. A AND true = A; A OR true = true; A AND A = A.',
  },
  {
    id: 'bin-012', topic: 'Binary', difficulty: 'medium',
    question: 'How many bits are needed to represent 0..31 inclusive?',
    choices: ['5', '4', '6', '32'],
    correctAnswer: 0,
    explanation: '2^5 = 32 distinct values. 4 bits only reach 15.',
  },
  {
    id: 'comp-007', topic: 'Data compression', difficulty: 'medium',
    question: 'A photo file shrinks 80% with JPEG and quality looks fine. The compression here is:',
    choices: ['Lossy', 'Lossless', 'Hashing', 'Encryption'],
    correctAnswer: 0,
    explanation: 'JPEG is lossy. The other options are not compression schemes.',
  },
  {
    id: 'net-013', topic: 'Internet', difficulty: 'easy',
    question: 'Why do messages get split into packets?',
    choices: [
      'To utilize multiple paths and recover from failures',
      'To make them slower',
      'Because routers cannot read whole files',
      'To convert them into HTML',
    ],
    correctAnswer: 0,
    explanation: 'Packetization improves resilience and utilization. Routers handle binary regardless of file type.',
  },
  {
    id: 'cyber-009', topic: 'Cybersecurity', difficulty: 'easy',
    question: 'Which is a sign of a phishing email?',
    choices: [
      'Urgent threats and a suspicious link asking for credentials',
      'Plain greeting from a friend',
      'A confirmation receipt for an order you actually placed',
      'A monthly newsletter you signed up for',
    ],
    correctAnswer: 0,
    explanation: 'Urgency + credential-asking is the classic pattern. Receipts and newsletters can be legitimate.',
  },
  {
    id: 'enc-007', topic: 'Encryption', difficulty: 'medium',
    question: 'Which is true about modern strong encryption keys?',
    choices: [
      'Longer keys are generally harder to brute force',
      'Short keys are equally secure',
      'Keys do not affect security',
      'Algorithms reveal keys automatically',
    ],
    correctAnswer: 0,
    explanation: 'Key length matters for brute-force resistance. The others are misconceptions.',
  },
  {
    id: 'abs-006', topic: 'Abstraction', difficulty: 'easy',
    question: 'Which is an example of layered abstraction?',
    choices: [
      'High-level language → assembly → machine code',
      'A loop with three iterations',
      'A list of three integers',
      'An IF/ELSE block',
    ],
    correctAnswer: 0,
    explanation: 'Languages are stacked layers. The other choices are constructs at one level.',
  },
  {
    id: 'sim-006', topic: 'Simulations', difficulty: 'medium',
    question: 'Which is most appropriate to model with a simulation?',
    choices: [
      'How a virus might spread in a population',
      'Computing 2 + 2',
      'Storing a single integer',
      'Reading a file path',
    ],
    correctAnswer: 0,
    explanation: 'Spread of a phenomenon is a classic simulation use case. The others are direct operations.',
  },
  {
    id: 'api-006', topic: 'APIs', difficulty: 'easy',
    question: 'An API "endpoint" usually refers to:',
    choices: [
      'A specific URL or function entry point you can call',
      'The end of the wire',
      'The end-of-life of a project',
      'The first line of code',
    ],
    correctAnswer: 0,
    explanation: 'Endpoints are call targets, often URLs (web APIs) or function names.',
  },
  {
    id: 'lib-005', topic: 'Libraries', difficulty: 'easy',
    question: 'Which is true about importing libraries?',
    choices: [
      'You can use their procedures without rewriting them',
      'It deletes your code',
      'It installs the OS',
      'It always slows the program',
    ],
    correctAnswer: 0,
    explanation: 'Importing exposes existing functionality. The other claims are wrong.',
  },
  {
    id: 'create-007', topic: 'AP Create Task', difficulty: 'medium',
    question: 'Which is a strong list-justification for the Create Task?',
    choices: [
      '"Without the list, I would need a separate variable for every score, which would not scale to a class of 30."',
      '"I used a list because it looked cool."',
      '"I used a list to encrypt grades."',
      '"My list was unused but listed in comments."',
    ],
    correctAnswer: 0,
    explanation: 'You must show how the list manages complexity vs alternatives.',
  },

  // Round out to 150+
  {
    id: 'var-010', topic: 'Variables', difficulty: 'medium',
    question: 'What is the final value of n?',
    codeSnippet: 'n \u2190 1\nREPEAT 5 TIMES\n{\n  n \u2190 n + n\n}',
    choices: ['32', '10', '16', '5'],
    correctAnswer: 0,
    explanation: 'Doubling 5 times: 1→2→4→8→16→32.',
  },
  {
    id: 'list-012', topic: 'Lists', difficulty: 'medium',
    question: 'What does the procedure return for [2, -3, 4, -1]?',
    codeSnippet:
      'PROCEDURE CountPositive(list)\n{\n  c \u2190 0\n  FOR EACH x IN list\n  {\n    IF (x > 0)\n    {\n      c \u2190 c + 1\n    }\n  }\n  RETURN c\n}',
    choices: ['2', '4', '0', '3'],
    correctAnswer: 0,
    explanation: 'Positives are 2 and 4 → 2.',
  },
  {
    id: 'algo-009', topic: 'Algorithms', difficulty: 'easy',
    question: 'Pseudocode is:',
    choices: [
      'An informal way of writing algorithms in human-readable form',
      'A specific compiled language',
      'A type of CPU instruction',
      'A web protocol',
    ],
    correctAnswer: 0,
    explanation: 'Pseudocode communicates algorithms without strict syntax.',
  },
  {
    id: 'iter-010', topic: 'Iteration', difficulty: 'medium',
    question: 'Which loop body could lead to an off-by-one error?',
    codeSnippet: 'i \u2190 1\nREPEAT UNTIL (i > LENGTH(list))\n{\n  DISPLAY(list[i - 1])\n  i \u2190 i + 1\n}',
    choices: [
      'Yes — list[0] is invalid for AP CSP 1-indexed lists',
      'No — list[i-1] is correct',
      'No — i is fine',
      'Yes — REPEAT UNTIL never terminates',
    ],
    correctAnswer: 0,
    explanation: 'AP CSP lists are 1-indexed; list[0] is not defined. The intent was DISPLAY(list[i]).',
  },
  {
    id: 'proc-008', topic: 'Procedures', difficulty: 'medium',
    question: 'A procedure that calls itself is called:',
    choices: ['Recursive', 'Iterative', 'Reflexive', 'Generic'],
    correctAnswer: 0,
    explanation: 'Recursion = self-calling. Iterative uses loops; the others are unrelated.',
  },
  {
    id: 'bool-008', topic: 'Boolean logic', difficulty: 'easy',
    question: 'Which is the truth value of (true AND (NOT false))?',
    choices: ['true', 'false', 'undefined', '1'],
    correctAnswer: 0,
    explanation: 'NOT false = true; true AND true = true.',
  },
  {
    id: 'bin-013', topic: 'Binary', difficulty: 'easy',
    question: 'What is decimal 0 in binary?',
    choices: ['0', '1', '10', '00000001'],
    correctAnswer: 0,
    explanation: 'Zero is zero in any base.',
  },
  {
    id: 'net-014', topic: 'Internet', difficulty: 'medium',
    question: 'A "URL" includes:',
    choices: [
      'Scheme, host, optional path and query',
      'Only the IP address',
      'Only the file name',
      'Only the encryption key',
    ],
    correctAnswer: 0,
    explanation: 'A URL has scheme://host[/path][?query]. The other options omit critical parts.',
  },
  {
    id: 'cyber-010', topic: 'Cybersecurity', difficulty: 'medium',
    question: 'A "zero-day" vulnerability is:',
    choices: [
      'A flaw not yet known to defenders or patched',
      'A flaw fixed for many years',
      'An old encryption algorithm',
      'A type of cable',
    ],
    correctAnswer: 0,
    explanation: 'Zero-day = no time has passed for a fix. The other options are unrelated.',
  },
  {
    id: 'enc-008', topic: 'Encryption', difficulty: 'medium',
    question: 'Which is most likely PUBLIC information?',
    choices: [
      "Alice's public key",
      "Alice's private key",
      'Alice\'s password',
      "Alice's session token",
    ],
    correctAnswer: 0,
    explanation: 'Public keys are designed to be shared; the others are secrets.',
  },
  {
    id: 'abs-007', topic: 'Abstraction', difficulty: 'easy',
    question: '"Black-box" use of a library means:',
    choices: [
      'Using it via its interface without inspecting internals',
      'Reading every line of source code',
      'Avoiding it entirely',
      'Writing it from scratch',
    ],
    correctAnswer: 0,
    explanation: 'Black-box use is interface-only — a hallmark of abstraction.',
  },
  {
    id: 'sim-007', topic: 'Simulations', difficulty: 'medium',
    question: 'Which best validates a simulation\'s realism?',
    choices: [
      'Comparing its outputs against real-world measurements',
      'Counting lines of code',
      'Adding more comments',
      'Running it longer with no checks',
    ],
    correctAnswer: 0,
    explanation: 'Validation requires comparison to reality. The other actions don\'t establish realism.',
  },
  {
    id: 'api-007', topic: 'APIs', difficulty: 'medium',
    question: 'A library\'s API contract usually specifies:',
    choices: [
      'Inputs, outputs, exceptions, and side effects of each function',
      'The user\'s favorite color',
      'The CPU model required',
      'The font used in source files',
    ],
    correctAnswer: 0,
    explanation: 'A contract documents what callers can rely on.',
  },
  {
    id: 'lib-006', topic: 'Libraries', difficulty: 'medium',
    question: 'Why might you prefer the standard library over a third-party one?',
    choices: [
      'Stability, broad availability, and minimal extra dependencies',
      'It is always the fastest',
      'It uses less battery',
      'It removes the need to test',
    ],
    correctAnswer: 0,
    explanation: 'Standard libraries trade some speed for stability and availability.',
  },
  {
    id: 'create-008', topic: 'AP Create Task', difficulty: 'medium',
    question: 'Acceptable program types for the Create Task include:',
    choices: [
      'A wide variety: games, tools, simulations, data-analysis programs',
      'Only mobile games',
      'Only command-line calculators',
      'Only programs in JavaScript',
    ],
    correctAnswer: 0,
    explanation: 'The College Board allows any program that meets the rubric in any language.',
  },

  // ===== A few more to ensure 150+ across all topics =====
  {
    id: 'sce-007', topic: 'Selection', difficulty: 'medium',
    question: 'A program shows "Adult" if age ≥ 18 else "Minor". Which is correct?',
    choices: [
      'IF (age \u2265 18) DISPLAY("Adult") ELSE DISPLAY("Minor")',
      'IF (age = 18) DISPLAY("Adult")',
      'IF (age < 18) DISPLAY("Adult") ELSE DISPLAY("Minor")',
      'WHILE (age \u2265 18) DISPLAY("Adult")',
    ],
    correctAnswer: 0,
    explanation: 'The first matches the spec exactly. The others test the wrong condition or use a loop.',
  },
  {
    id: 'sce-008', topic: 'Iteration', difficulty: 'medium',
    question: 'You need to print every other element of L. Which is correct (1-indexed)?',
    codeSnippet: 'i \u2190 1\nREPEAT UNTIL (i > LENGTH(L))\n{\n  DISPLAY(L[i])\n  i \u2190 i + 2\n}',
    choices: [
      'Yes — prints L[1], L[3], L[5], …',
      'No — prints every element',
      'No — prints L[2], L[4], L[6]',
      'No — infinite loop',
    ],
    correctAnswer: 0,
    explanation: 'Starting at 1 and stepping by 2 hits odd indices. To hit even indices, start at 2.',
  },
  {
    id: 'sce-009', topic: 'Boolean logic', difficulty: 'medium',
    question: 'A program approves a loan if (income ≥ 50000 AND debt < 10000) OR creditScore ≥ 750. Which input is approved?',
    choices: [
      'income=60000, debt=5000, creditScore=600',
      'income=40000, debt=20000, creditScore=600',
      'income=40000, debt=20000, creditScore=700',
      'income=80000, debt=15000, creditScore=600',
    ],
    correctAnswer: 0,
    explanation: 'First option satisfies the AND clause. Others fail both branches.',
  },
  {
    id: 'sce-010', topic: 'Algorithms', difficulty: 'hard',
    question: 'Why might binary search fail on this list: [3,1,4,1,5,9,2,6]?',
    choices: [
      'It is not sorted; binary search requires order',
      'It is too long',
      'It contains duplicates',
      'Binary search only works on numbers above 10',
    ],
    correctAnswer: 0,
    explanation: 'Sorted input is mandatory. Length and duplicates are not the blocker.',
  },
  {
    id: 'voc-004', topic: 'Lists', difficulty: 'easy',
    question: 'Which best defines "list"?',
    choices: [
      'An ordered collection of elements that can grow and shrink',
      'A boolean value',
      'A type of loop',
      'A return value of a procedure',
    ],
    correctAnswer: 0,
    explanation: 'Lists are ordered, mutable collections.',
  },
  {
    id: 'voc-005', topic: 'Procedures', difficulty: 'easy',
    question: '"RETURN" in pseudocode does what?',
    choices: [
      'Ends the procedure and produces a value to the caller',
      'Starts a loop',
      'Defines a new variable',
      'Prints to the screen',
    ],
    correctAnswer: 0,
    explanation: 'RETURN ends the procedure with a value. DISPLAY prints; loops use REPEAT/FOR EACH.',
  },
  {
    id: 'voc-006', topic: 'Cybersecurity', difficulty: 'easy',
    question: 'PII stands for:',
    choices: [
      'Personally Identifiable Information',
      'Protected Internet Interface',
      'Public IP Information',
      'Plain Internal Identification',
    ],
    correctAnswer: 0,
    explanation: 'PII is sensitive data that identifies a person.',
  },
];

export const questions = RAW.map((q) => ({ ...q, section: sectionFor(q.topic) }));

export function allTopics() {
  return Array.from(new Set(questions.map((q) => q.topic))).sort();
}

export function allSections() {
  return Array.from(new Set(questions.map((q) => q.section))).sort();
}
