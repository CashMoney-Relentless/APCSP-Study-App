// AP CSP question bank.
// Each question:
//   id: string (unique)
//   topic: string
//   difficulty: 'easy' | 'medium' | 'hard'
//   question: string
//   codeSnippet: string (optional, AP CSP pseudocode — NOT JavaScript)
//   choices: string[]
//   correctAnswer: number (index into choices)
//   explanation: string
//
// Add new questions by appending to this array. IDs should stay unique.

export const questions = [
  // ---------- Variables ----------
  {
    id: 'var-001',
    topic: 'Variables',
    difficulty: 'easy',
    question: 'What is the value of total after the code runs?',
    codeSnippet: 'a \u2190 4\nb \u2190 6\ntotal \u2190 a + b',
    choices: ['10', '46', '24', 'undefined'],
    correctAnswer: 0,
    explanation: 'The variable total is assigned the sum 4 + 6, which is 10.',
  },
  {
    id: 'var-002',
    topic: 'Variables',
    difficulty: 'easy',
    question: 'Which best describes a variable in AP CSP?',
    choices: [
      'A named storage location that holds a value that can change',
      'A constant value that cannot change',
      'A type of loop',
      'A list of items',
    ],
    correctAnswer: 0,
    explanation: 'A variable is a named reference to a value in memory and may be reassigned.',
  },
  {
    id: 'var-003',
    topic: 'Variables',
    difficulty: 'medium',
    question: 'After this code runs, what is the value of x?',
    codeSnippet: 'x \u2190 5\nx \u2190 x * 2\nx \u2190 x + 1',
    choices: ['11', '10', '6', '12'],
    correctAnswer: 0,
    explanation: 'x becomes 5, then 10, then 11.',
  },

  // ---------- Lists ----------
  {
    id: 'list-001',
    topic: 'Lists',
    difficulty: 'easy',
    question: 'In AP CSP pseudocode, lists are 1-indexed. What does the code display?',
    codeSnippet: 'nums \u2190 [10, 20, 30, 40]\nDISPLAY(nums[2])',
    choices: ['20', '10', '30', '40'],
    correctAnswer: 0,
    explanation: 'AP CSP lists are 1-indexed, so nums[2] is the second element, 20.',
  },
  {
    id: 'list-002',
    topic: 'Lists',
    difficulty: 'medium',
    question: 'What does the procedure APPEND do?',
    choices: [
      'Adds a value to the end of the list',
      'Removes the last element of the list',
      'Reverses the order of the list',
      'Replaces the first element',
    ],
    correctAnswer: 0,
    explanation: 'APPEND(list, value) adds value to the end, increasing list length by 1.',
  },
  {
    id: 'list-003',
    topic: 'Lists',
    difficulty: 'medium',
    question: 'What is the length of the list after the code runs?',
    codeSnippet: 'data \u2190 [1, 2, 3]\nAPPEND(data, 4)\nAPPEND(data, 5)\nREMOVE(data, 1)',
    choices: ['4', '5', '3', '6'],
    correctAnswer: 0,
    explanation: 'Two appends bring length to 5, then REMOVE deletes index 1, leaving 4.',
  },
  {
    id: 'list-004',
    topic: 'Lists',
    difficulty: 'hard',
    question: 'What is the value displayed?',
    codeSnippet: 'list \u2190 [3, 1, 4, 1, 5, 9, 2, 6]\ntotal \u2190 0\nFOR EACH n IN list\n{\n  IF (n MOD 2 = 0)\n  {\n    total \u2190 total + n\n  }\n}\nDISPLAY(total)',
    choices: ['12', '14', '8', '10'],
    correctAnswer: 0,
    explanation: 'Even numbers are 4, 2, and 6. Their sum is 12.',
  },

  // ---------- Algorithms ----------
  {
    id: 'algo-001',
    topic: 'Algorithms',
    difficulty: 'easy',
    question: 'What is an algorithm?',
    choices: [
      'A finite sequence of well-defined instructions for solving a problem',
      'A type of computer hardware',
      'A list of variables',
      'A programming language',
    ],
    correctAnswer: 0,
    explanation: 'An algorithm is a step-by-step process to accomplish a task or solve a problem.',
  },
  {
    id: 'algo-002',
    topic: 'Algorithms',
    difficulty: 'medium',
    question: 'Which two algorithms produce the same result for any list of numbers?',
    choices: [
      'One that sums all elements vs. one that adds each element to a running total',
      'One that finds the max vs. one that finds the min',
      'Linear search vs. binary search on an unsorted list',
      'Sorting ascending vs. sorting descending',
    ],
    correctAnswer: 0,
    explanation: 'Both descriptions describe summing the same elements and produce identical output.',
  },
  {
    id: 'algo-003',
    topic: 'Algorithms',
    difficulty: 'hard',
    question:
      'A problem is described as undecidable. Which best describes it?',
    choices: [
      'No algorithm can be constructed to always lead to a correct yes/no answer',
      'It always takes a long time to solve',
      'It can only be solved by humans',
      'It requires parallel computing',
    ],
    correctAnswer: 0,
    explanation:
      'An undecidable problem has no algorithm that can give a correct answer for all inputs.',
  },

  // ---------- Sequencing ----------
  {
    id: 'seq-001',
    topic: 'Sequencing',
    difficulty: 'easy',
    question: 'What does sequencing mean in programming?',
    choices: [
      'Statements run in the order they appear',
      'Statements run randomly',
      'Statements run in reverse order',
      'Statements run in parallel',
    ],
    correctAnswer: 0,
    explanation:
      'Sequencing means each statement is executed one after another in order.',
  },
  {
    id: 'seq-002',
    topic: 'Sequencing',
    difficulty: 'easy',
    question: 'What does this code display?',
    codeSnippet: 'x \u2190 2\ny \u2190 3\nx \u2190 y\ny \u2190 x\nDISPLAY(x)\nDISPLAY(y)',
    choices: ['3 then 3', '2 then 3', '3 then 2', '2 then 2'],
    correctAnswer: 0,
    explanation:
      'After x \u2190 y, x is 3. Then y \u2190 x sets y to 3. Both display 3.',
  },

  // ---------- Selection ----------
  {
    id: 'sel-001',
    topic: 'Selection',
    difficulty: 'easy',
    question: 'What is displayed?',
    codeSnippet: 'score \u2190 75\nIF (score \u2265 70)\n{\n  DISPLAY("Pass")\n}\nELSE\n{\n  DISPLAY("Fail")\n}',
    choices: ['Pass', 'Fail', '75', 'nothing'],
    correctAnswer: 0,
    explanation: '75 is greater than or equal to 70, so the IF branch runs.',
  },
  {
    id: 'sel-002',
    topic: 'Selection',
    difficulty: 'medium',
    question: 'What is displayed when n is 12?',
    codeSnippet:
      'IF (n MOD 3 = 0 AND n MOD 4 = 0)\n{\n  DISPLAY("A")\n}\nELSE IF (n MOD 3 = 0)\n{\n  DISPLAY("B")\n}\nELSE\n{\n  DISPLAY("C")\n}',
    choices: ['A', 'B', 'C', 'A and B'],
    correctAnswer: 0,
    explanation:
      '12 is divisible by both 3 and 4, so the first branch runs and "A" is displayed.',
  },
  {
    id: 'sel-003',
    topic: 'Selection',
    difficulty: 'medium',
    question:
      'A statement runs only when both conditions are true. Which Boolean operator joins them?',
    choices: ['AND', 'OR', 'NOT', 'XOR'],
    correctAnswer: 0,
    explanation:
      'AND requires both operands to be true for the result to be true.',
  },

  // ---------- Iteration ----------
  {
    id: 'iter-001',
    topic: 'Iteration',
    difficulty: 'easy',
    question: 'How many times does this loop run?',
    codeSnippet: 'REPEAT 5 TIMES\n{\n  DISPLAY("hi")\n}',
    choices: ['5', '4', '6', '0'],
    correctAnswer: 0,
    explanation: 'REPEAT n TIMES runs the block exactly n times.',
  },
  {
    id: 'iter-002',
    topic: 'Iteration',
    difficulty: 'medium',
    question: 'What is the final value of total?',
    codeSnippet: 'total \u2190 0\ni \u2190 1\nREPEAT UNTIL (i > 4)\n{\n  total \u2190 total + i\n  i \u2190 i + 1\n}\nDISPLAY(total)',
    choices: ['10', '6', '15', '4'],
    correctAnswer: 0,
    explanation: 'i takes values 1, 2, 3, 4. Their sum is 10.',
  },
  {
    id: 'iter-003',
    topic: 'Iteration',
    difficulty: 'hard',
    question: 'How many times does DISPLAY run?',
    codeSnippet:
      'count \u2190 0\nFOR EACH x IN [1, 2, 3]\n{\n  FOR EACH y IN [4, 5]\n  {\n    count \u2190 count + 1\n    DISPLAY(count)\n  }\n}',
    choices: ['6', '5', '3', '2'],
    correctAnswer: 0,
    explanation: 'Nested loops produce 3 \u00d7 2 = 6 iterations.',
  },

  // ---------- Procedures ----------
  {
    id: 'proc-001',
    topic: 'Procedures',
    difficulty: 'easy',
    question: 'What is a procedure?',
    choices: [
      'A named group of programming instructions that can be reused',
      'A list of values',
      'A type of loop',
      'A variable that stores text',
    ],
    correctAnswer: 0,
    explanation:
      'Procedures (also called functions or methods) are reusable named blocks of code.',
  },
  {
    id: 'proc-002',
    topic: 'Procedures',
    difficulty: 'medium',
    question: 'What is returned by Mystery(3, 4)?',
    codeSnippet:
      'PROCEDURE Mystery(a, b)\n{\n  RETURN (a * a) + (b * b)\n}',
    choices: ['25', '12', '14', '49'],
    correctAnswer: 0,
    explanation: '3*3 + 4*4 = 9 + 16 = 25.',
  },
  {
    id: 'proc-003',
    topic: 'Procedures',
    difficulty: 'medium',
    question:
      'Why do programmers use procedural abstraction?',
    choices: [
      'To hide complexity and make code easier to reuse and maintain',
      'To slow programs down for debugging',
      'To avoid writing any variables',
      'To replace iteration with selection',
    ],
    correctAnswer: 0,
    explanation:
      'Procedural abstraction lets you reuse code and reason at a higher level.',
  },

  // ---------- Parameters ----------
  {
    id: 'param-001',
    topic: 'Parameters',
    difficulty: 'easy',
    question: 'What are parameters?',
    choices: [
      'Inputs to a procedure that allow different data each call',
      'Output values printed by a procedure',
      'The internal variables of a list',
      'A type of error message',
    ],
    correctAnswer: 0,
    explanation: 'Parameters allow a procedure to operate on different inputs without rewriting code.',
  },
  {
    id: 'param-002',
    topic: 'Parameters',
    difficulty: 'hard',
    question: 'What is displayed?',
    codeSnippet:
      'PROCEDURE Apply(x, y)\n{\n  x \u2190 x + 1\n  RETURN x + y\n}\n\nresult \u2190 Apply(5, 10)\nDISPLAY(result)',
    choices: ['16', '15', '11', '5'],
    correctAnswer: 0,
    explanation: 'Inside the procedure x becomes 6, then returns 6 + 10 = 16.',
  },

  // ---------- Boolean logic ----------
  {
    id: 'bool-001',
    topic: 'Boolean logic',
    difficulty: 'easy',
    question: 'Which expression evaluates to true?',
    choices: ['(5 > 3) AND (2 < 4)', '(5 > 3) AND (2 > 4)', 'NOT (3 = 3)', '(5 < 3) OR (2 > 4)'],
    correctAnswer: 0,
    explanation: 'Both 5 > 3 and 2 < 4 are true, so the AND result is true.',
  },
  {
    id: 'bool-002',
    topic: 'Boolean logic',
    difficulty: 'medium',
    question: 'NOT (A OR B) is logically equivalent to which expression?',
    choices: ['(NOT A) AND (NOT B)', '(NOT A) OR (NOT B)', 'A AND B', 'A OR B'],
    correctAnswer: 0,
    explanation: 'By De Morgan\u2019s law, NOT (A OR B) = (NOT A) AND (NOT B).',
  },
  {
    id: 'bool-003',
    topic: 'Boolean logic',
    difficulty: 'hard',
    question: 'When does the IF block run?',
    codeSnippet:
      'IF ((x > 0 AND x < 10) OR x = 100)\n{\n  DISPLAY("yes")\n}',
    choices: [
      'When x is between 1 and 9, or exactly 100',
      'Only when x equals 100',
      'When x is greater than 0',
      'Always',
    ],
    correctAnswer: 0,
    explanation: 'The first part requires x > 0 and x < 10. The OR also accepts exactly 100.',
  },

  // ---------- Binary ----------
  {
    id: 'bin-001',
    topic: 'Binary',
    difficulty: 'easy',
    question: 'What is the decimal value of binary 1011?',
    choices: ['11', '9', '13', '7'],
    correctAnswer: 0,
    explanation: '1\u00d78 + 0\u00d74 + 1\u00d72 + 1\u00d71 = 11.',
  },
  {
    id: 'bin-002',
    topic: 'Binary',
    difficulty: 'medium',
    question: 'How many distinct values can be represented with 8 bits?',
    choices: ['256', '128', '64', '512'],
    correctAnswer: 0,
    explanation: '2^8 = 256 unique values.',
  },
  {
    id: 'bin-003',
    topic: 'Binary',
    difficulty: 'medium',
    question: 'What is the binary representation of decimal 19?',
    choices: ['10011', '11001', '10101', '11100'],
    correctAnswer: 0,
    explanation: '16 + 2 + 1 = 19, so the bits are 10011.',
  },
  {
    id: 'bin-004',
    topic: 'Binary',
    difficulty: 'hard',
    question: 'Which best explains overflow error?',
    choices: [
      'A value is too large to be stored in the bits available',
      'A computer runs out of disk space',
      'Two variables share the same name',
      'A program runs forever',
    ],
    correctAnswer: 0,
    explanation: 'Overflow occurs when a value exceeds the maximum representable in the allotted bits.',
  },

  // ---------- Data compression ----------
  {
    id: 'comp-001',
    topic: 'Data compression',
    difficulty: 'easy',
    question: 'Which type of compression always allows the original data to be perfectly restored?',
    choices: ['Lossless compression', 'Lossy compression', 'Encryption', 'Streaming'],
    correctAnswer: 0,
    explanation: 'Lossless compression preserves all original information exactly.',
  },
  {
    id: 'comp-002',
    topic: 'Data compression',
    difficulty: 'medium',
    question: 'Which file format is typically lossy?',
    choices: ['JPEG image', 'PNG image', 'TXT file', 'ZIP file'],
    correctAnswer: 0,
    explanation: 'JPEG uses lossy compression; PNG, TXT, and ZIP are lossless.',
  },
  {
    id: 'comp-003',
    topic: 'Data compression',
    difficulty: 'hard',
    question: 'When is lossy compression most appropriate?',
    choices: [
      'When smaller file size matters more than perfect fidelity',
      'When restoring exact original data is required',
      'When transmitting medical records',
      'When compressing source code',
    ],
    correctAnswer: 0,
    explanation: 'Lossy is acceptable when minor quality loss is fine in exchange for smaller files.',
  },

  // ---------- Internet ----------
  {
    id: 'net-001',
    topic: 'Internet',
    difficulty: 'easy',
    question: 'What is a protocol?',
    choices: [
      'A set of rules that govern how data is transmitted between devices',
      'A type of cable',
      'A specific computer brand',
      'A web browser',
    ],
    correctAnswer: 0,
    explanation: 'Protocols are agreed-upon rules so different systems can communicate.',
  },
  {
    id: 'net-002',
    topic: 'Internet',
    difficulty: 'medium',
    question: 'What does HTTP stand for?',
    choices: [
      'Hypertext Transfer Protocol',
      'Hyperlink Text Transfer Page',
      'Home Tool Transfer Protocol',
      'High-Throughput Transfer Process',
    ],
    correctAnswer: 0,
    explanation: 'HTTP \u2014 HyperText Transfer Protocol \u2014 is used to exchange web data.',
  },
  {
    id: 'net-003',
    topic: 'Internet',
    difficulty: 'medium',
    question: 'What is the role of DNS?',
    choices: [
      'Translates domain names into IP addresses',
      'Encrypts emails',
      'Stores backups of websites',
      'Compresses images',
    ],
    correctAnswer: 0,
    explanation: 'The Domain Name System maps human-readable names to numerical IPs.',
  },
  {
    id: 'net-004',
    topic: 'Internet',
    difficulty: 'hard',
    question: 'Why is packet switching useful on the Internet?',
    choices: [
      'It allows data to take different paths and tolerates network failures',
      'It guarantees packets always arrive in order',
      'It removes the need for protocols',
      'It encrypts all messages automatically',
    ],
    correctAnswer: 0,
    explanation:
      'Packet switching breaks data into pieces routed independently, improving fault tolerance.',
  },
  {
    id: 'net-005',
    topic: 'Internet',
    difficulty: 'easy',
    question: 'What is the difference between bandwidth and latency?',
    choices: [
      'Bandwidth is data per unit time; latency is delay between request and response',
      'They mean the same thing',
      'Bandwidth is delay; latency is data per unit time',
      'Both refer to encryption strength',
    ],
    correctAnswer: 0,
    explanation:
      'Bandwidth measures throughput while latency measures the delay of a single transmission.',
  },

  // ---------- Cybersecurity ----------
  {
    id: 'cyber-001',
    topic: 'Cybersecurity',
    difficulty: 'easy',
    question: 'A phishing attack tries to do what?',
    choices: [
      'Trick the user into revealing sensitive info such as passwords',
      'Speed up the network',
      'Compress files',
      'Encrypt messages between friends',
    ],
    correctAnswer: 0,
    explanation: 'Phishing uses fake messages to get users to disclose credentials.',
  },
  {
    id: 'cyber-002',
    topic: 'Cybersecurity',
    difficulty: 'medium',
    question: 'Which is the strongest password?',
    choices: ['9$kRa!2#qZv7', 'password123', 'qwerty', 'admin'],
    correctAnswer: 0,
    explanation: 'Long, mixed-case, numeric and symbol passwords are far harder to crack.',
  },
  {
    id: 'cyber-003',
    topic: 'Cybersecurity',
    difficulty: 'medium',
    question: 'What is multi-factor authentication?',
    choices: [
      'Using two or more independent credentials to verify identity',
      'Using the same password on multiple sites',
      'Encrypting data with two keys',
      'Two users sharing one account',
    ],
    correctAnswer: 0,
    explanation: 'MFA combines something you know, have, or are to strengthen security.',
  },

  // ---------- Encryption ----------
  {
    id: 'enc-001',
    topic: 'Encryption',
    difficulty: 'easy',
    question: 'What is encryption?',
    choices: [
      'Transforming data so only authorized parties can read it',
      'Compressing files to be smaller',
      'Translating domain names to IPs',
      'Backing up files automatically',
    ],
    correctAnswer: 0,
    explanation: 'Encryption transforms plaintext to ciphertext requiring a key to decode.',
  },
  {
    id: 'enc-002',
    topic: 'Encryption',
    difficulty: 'medium',
    question: 'How does symmetric encryption differ from asymmetric encryption?',
    choices: [
      'Symmetric uses one shared key; asymmetric uses a public/private key pair',
      'Symmetric requires the Internet; asymmetric does not',
      'Symmetric is always more secure',
      'There is no difference',
    ],
    correctAnswer: 0,
    explanation:
      'Symmetric encryption uses the same key to encrypt and decrypt; asymmetric uses paired keys.',
  },
  {
    id: 'enc-003',
    topic: 'Encryption',
    difficulty: 'hard',
    question: 'In public-key encryption, what is shared and what is kept secret?',
    choices: [
      'The public key is shared; the private key is kept secret',
      'Both keys are shared',
      'Both keys are secret',
      'The public key is secret; the private key is shared',
    ],
    correctAnswer: 0,
    explanation: 'You publish the public key so others can encrypt; only you can decrypt with the private key.',
  },

  // ---------- Abstraction ----------
  {
    id: 'abs-001',
    topic: 'Abstraction',
    difficulty: 'easy',
    question: 'What does abstraction help programmers do?',
    choices: [
      'Manage complexity by hiding details that are not needed at the moment',
      'Make programs run on more hardware',
      'Eliminate the need for variables',
      'Avoid writing comments',
    ],
    correctAnswer: 0,
    explanation: 'Abstraction lets us focus on what something does, not how it does it.',
  },
  {
    id: 'abs-002',
    topic: 'Abstraction',
    difficulty: 'medium',
    question: 'Calling a procedure named DrawCircle without knowing its internal code is an example of \u2026',
    choices: ['Procedural abstraction', 'Iteration', 'Selection', 'Sequencing'],
    correctAnswer: 0,
    explanation:
      'Using a procedure by its name without seeing its implementation is procedural abstraction.',
  },

  // ---------- Simulations ----------
  {
    id: 'sim-001',
    topic: 'Simulations',
    difficulty: 'easy',
    question: 'Why might researchers use a simulation instead of a real-world experiment?',
    choices: [
      'It is safer, cheaper, and faster to test scenarios',
      'It always gives perfect real-world results',
      'It eliminates the need for data',
      'It removes the need for any model',
    ],
    correctAnswer: 0,
    explanation:
      'Simulations let us test scenarios that are dangerous, expensive, or slow to perform in reality.',
  },
  {
    id: 'sim-002',
    topic: 'Simulations',
    difficulty: 'medium',
    question: 'A limitation of simulations is that they \u2026',
    choices: [
      'Are simplifications of reality and may omit important factors',
      'Always need physical materials',
      'Cannot be re-run',
      'Cannot use random numbers',
    ],
    correctAnswer: 0,
    explanation:
      'Models leave out detail. The omitted detail can affect accuracy of results.',
  },
  {
    id: 'sim-003',
    topic: 'Simulations',
    difficulty: 'medium',
    question: 'A simulation models flipping a fair coin. Which is most appropriate?',
    choices: [
      'Use a random number generator that returns 0 or 1 with equal probability',
      'Always return heads',
      'Alternate heads and tails',
      'Return whichever the user types',
    ],
    correctAnswer: 0,
    explanation:
      'A fair coin needs equally likely outcomes \u2014 a uniform random number generator fits.',
  },

  // ---------- AP Create Task requirements ----------
  {
    id: 'create-001',
    topic: 'AP Create Task',
    difficulty: 'easy',
    question: 'For the AP CSP Create Task, the program submitted must include which of the following?',
    choices: [
      'A list (or other collection) used in a meaningful way',
      'A graphical user interface',
      'A database connection',
      'Multiplayer networking',
    ],
    correctAnswer: 0,
    explanation:
      'A required component is a list (collection) used to manage complexity in the program.',
  },
  {
    id: 'create-002',
    topic: 'AP Create Task',
    difficulty: 'medium',
    question:
      'Which of these is REQUIRED in the student-developed Create Task program?',
    choices: [
      'A student-developed procedure with at least one parameter that affects functionality',
      'A backend database',
      'A login system',
      'Multiple programming languages',
    ],
    correctAnswer: 0,
    explanation:
      'Students must develop a procedure with parameter(s) that affect program behavior.',
  },
  {
    id: 'create-003',
    topic: 'AP Create Task',
    difficulty: 'medium',
    question: 'In the Create Task written response, you must explain how your list manages complexity. Why?',
    choices: [
      'To show that without the list the program would be more complicated or less general',
      'Because the College Board requires hand-drawn diagrams',
      'To prove your code uses recursion',
      'To list all variables in your program',
    ],
    correctAnswer: 0,
    explanation:
      'Students must explain how the list reduces complexity vs. an alternative implementation.',
  },
  {
    id: 'create-004',
    topic: 'AP Create Task',
    difficulty: 'hard',
    question: 'Your Create Task procedure has parameters. What must your written response describe?',
    choices: [
      'How the procedure contributes to overall functionality, including how parameters change behavior',
      'Only the syntax of the procedure',
      'A complete history of edits',
      'A list of every variable used in the program',
    ],
    correctAnswer: 0,
    explanation:
      'You must explain functionality and the role of parameters in producing different results.',
  },

  // ---------- Mixed scenario / vocab questions ----------
  {
    id: 'scenario-001',
    topic: 'Algorithms',
    difficulty: 'medium',
    question:
      'A program checks every value in a list for a match. As the list size doubles, the time roughly doubles too. This is an example of which kind of algorithm?',
    choices: [
      'A reasonable-time linear search algorithm',
      'A binary search algorithm',
      'An algorithm that runs in unreasonable time',
      'A constant-time algorithm',
    ],
    correctAnswer: 0,
    explanation: 'Linear search runs in time proportional to list size and is considered reasonable.',
  },
  {
    id: 'scenario-002',
    topic: 'Cybersecurity',
    difficulty: 'medium',
    question:
      'A school sends emails warning about suspicious links that ask for passwords. This is mainly defending against \u2026',
    choices: ['Phishing', 'Lossy compression', 'Bandwidth limits', 'DNS lookups'],
    correctAnswer: 0,
    explanation: 'Such warnings train people to recognize and avoid phishing attempts.',
  },
  {
    id: 'scenario-003',
    topic: 'Internet',
    difficulty: 'easy',
    question:
      'When two devices have very different hardware but still communicate, this is largely possible because of \u2026',
    choices: ['Open standards and shared protocols', 'Shared encryption keys', 'Identical CPUs', 'Same operating system'],
    correctAnswer: 0,
    explanation: 'Open standards and protocols allow interoperability across diverse devices.',
  },
  {
    id: 'vocab-001',
    topic: 'Abstraction',
    difficulty: 'easy',
    question: 'Which best defines "data abstraction"?',
    choices: [
      'Representing complex data with simpler structures or names',
      'Encrypting data',
      'Compressing data',
      'Sending data over a network',
    ],
    correctAnswer: 0,
    explanation:
      'Data abstraction lets us treat collections of data (lists, records) as a single unit.',
  },
  {
    id: 'vocab-002',
    topic: 'Iteration',
    difficulty: 'easy',
    question: '"Iteration" most nearly means \u2026',
    choices: ['Repetition of steps', 'Choosing between options', 'Storing a value', 'Calling a procedure'],
    correctAnswer: 0,
    explanation: 'Iteration is the repeated execution of a sequence of instructions.',
  },
  {
    id: 'vocab-003',
    topic: 'Selection',
    difficulty: 'easy',
    question: '"Selection" most nearly means \u2026',
    choices: [
      'Choosing which statements to run based on a condition',
      'Storing values in a list',
      'Repeating instructions',
      'Defining a new procedure',
    ],
    correctAnswer: 0,
    explanation: 'Selection uses conditions (IF/ELSE) to determine which code runs.',
  },

  // ---------- A few more code-heavy ones ----------
  {
    id: 'code-001',
    topic: 'Iteration',
    difficulty: 'medium',
    question: 'What does the procedure return when called with [4, 9, 2, 7, 5]?',
    codeSnippet:
      'PROCEDURE FindMax(list)\n{\n  best \u2190 list[1]\n  FOR EACH item IN list\n  {\n    IF (item > best)\n    {\n      best \u2190 item\n    }\n  }\n  RETURN best\n}',
    choices: ['9', '7', '4', '5'],
    correctAnswer: 0,
    explanation: 'It tracks the largest element seen so far. The maximum is 9.',
  },
  {
    id: 'code-002',
    topic: 'Procedures',
    difficulty: 'hard',
    question: 'What does Mystery(6) return?',
    codeSnippet:
      'PROCEDURE Mystery(n)\n{\n  IF (n \u2264 1)\n  {\n    RETURN 1\n  }\n  RETURN n * Mystery(n - 1)\n}',
    choices: ['720', '36', '120', '6'],
    correctAnswer: 0,
    explanation: 'This computes 6! = 6\u00d75\u00d74\u00d73\u00d72\u00d71 = 720.',
  },
  {
    id: 'code-003',
    topic: 'Lists',
    difficulty: 'medium',
    question: 'What does the procedure return when called with [3, 1, 4, 1, 5]?',
    codeSnippet:
      'PROCEDURE Count(list, target)\n{\n  c \u2190 0\n  FOR EACH x IN list\n  {\n    IF (x = target)\n    {\n      c \u2190 c + 1\n    }\n  }\n  RETURN c\n}\n\nDISPLAY(Count([3, 1, 4, 1, 5], 1))',
    choices: ['2', '1', '3', '0'],
    correctAnswer: 0,
    explanation: 'The value 1 appears twice in the list.',
  },
  {
    id: 'code-004',
    topic: 'Boolean logic',
    difficulty: 'hard',
    question: 'For which input does the procedure return true?',
    codeSnippet:
      'PROCEDURE Check(a, b)\n{\n  RETURN (a > 0) AND (NOT (b = 0)) AND ((a + b) MOD 2 = 0)\n}',
    choices: ['a = 3, b = 5', 'a = 0, b = 4', 'a = 2, b = 0', 'a = 3, b = 4'],
    correctAnswer: 0,
    explanation:
      'a is positive, b is nonzero, and 3 + 5 = 8 which is even. Other choices fail one condition.',
  },
];

// Convenience getters
export function allTopics() {
  return Array.from(new Set(questions.map((q) => q.topic))).sort();
}
