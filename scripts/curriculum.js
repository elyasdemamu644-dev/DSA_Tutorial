/**
 * C++ DSA Academy - Curriculum Data Model
 * 
 * Structure:
 * - 18 Topics across 3 Levels
 * - Each topic has multiple Modules
 * - Each module has multiple Lessons
 * - Each lesson has: objectives, content, code examples, exercises, quiz questions
 */
const CURRICULUM = {
    // ============================================================
    // LEVEL 1: FOUNDATIONS (6 topics)
    // ============================================================
    
    'cpp-foundations': {
        id: 'cpp-foundations',
        title: 'C++ Foundations for DSA',
        level: 1,
        order: 1,
        description: 'Essential C++ features for implementing data structures and algorithms',
        estimatedHours: 8,
        prerequisites: [],
        modules: [
            {
                id: 'cpp-basics',
                title: 'C++ Basics for DSA',
                order: 1,
                lessons: [
                    {
                        id: 'cpp-01',
                        title: 'Memory Model: Stack vs Heap',
                        objectives: [
                            'Understand stack and heap memory allocation',
                            'Distinguish between automatic and dynamic storage duration',
                            'Identify when to use each allocation type'
                        ],
                        content: `
                            <h3>Memory Model: Stack vs Heap</h3>
                            <p>C++ divides memory into several regions. For DSA, the two most important are the <strong>stack</strong> and the <strong>heap</strong>.</p>
                            
                            <h4>Stack Memory</h4>
                            <ul>
                                <li>Automatic allocation/deallocation (LIFO)</li>
                                <li>Fast allocation (just move stack pointer)</li>
                                <li>Limited size (typically 1-8 MB)</li>
                                <li>Variables: local variables, function parameters, return addresses</li>
                                <li>Deterministic lifetime: destroyed when scope ends</li>
                            </ul>
                            
                            <h4>Heap Memory</h4>
                            <ul>
                                <li>Manual allocation/deallocation (new/delete)</li>
                                <li>Slower allocation (search for free block)</li>
                                <li>Large size (limited by RAM)</li>
                                <li>Variables: dynamically allocated objects, data structures</li>
                                <li>Flexible lifetime: controlled by programmer</li>
                            </ul>
                            
                            <h4>Code Example</h4>
                            <pre><code>void stackVsHeap() {
    // Stack allocation - automatic
    int arr[100];           // 400 bytes on stack
    std::vector<int> v;     // v object on stack (24 bytes)
    
    // Heap allocation - manual
    int* heapArr = new int[100];     // 400 bytes on heap
    std::vector<int>* heapVec = new std::vector<int>(); // object on heap
    
    // Must manually free heap memory!
    delete[] heapArr;
    delete heapVec;
}</code></pre>
                            
                            <h4>Best Practice for DSA</h4>
                            <p><strong>Prefer stack when possible</strong> - use <code>std::vector</code>, <code>std::array</code>, <code>std::string</code> which manage heap internally but live on stack.</p>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Stack vs Heap Allocation',
                                code: `// Stack - preferred for DSA
std::vector<int> data(1000);  // Vector object on stack, elements on heap (managed)
std::array<int, 100> fixed;   // Entirely on stack
// Heap - when size unknown at compile time or polymorphic
auto* dynamic = new std::vector<int>(1000);
delete dynamic;`
                            }
                        ],
                        exercises: [
                            {
                                type: 'mcq',
                                question: 'What happens to a local array declared in a function when the function returns?',
                                options: [
                                    'It persists on the heap',
                                    'It is automatically deallocated (stack unwinding)',
                                    'It causes a memory leak',
                                    'It becomes a dangling pointer'
                                ],
                                correct: 1,
                                explanation: 'Stack-allocated variables are automatically destroyed when their scope ends (function returns).'
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'cpp-f-01-q1',
                                type: 'mcq',
                                question: 'Which memory region has a typical size limit of 1-8 MB?',
                                options: ['Stack', 'Heap', 'Static', 'Code segment'],
                                correct: 0
                            },
                            {
                                id: 'cpp-f-01-q2',
                                type: 'true-false',
                                question: 'Variables allocated with `new` are automatically deallocated when they go out of scope.',
                                correct: false,
                                explanation: 'Heap memory must be explicitly freed with `delete` or managed by smart pointers.'
                            }
                        ]
                    },
                    {
                        id: 'cpp-02',
                        title: 'Smart Pointers and RAII',
                        objectives: [
                            'Understand RAII (Resource Acquisition Is Initialization)',
                            'Use unique_ptr, shared_ptr, weak_ptr correctly',
                            'Avoid memory leaks with automatic resource management'
                        ],
                        content: `
                            <h3>Smart Pointers and RAII</h3>
                            <p><strong>RAII</strong> (Resource Acquisition Is Initialization) is a C++ idiom where resource lifetime is tied to object lifetime. When an object is created, it acquires resources; when destroyed, it releases them.</p>
                            
                            <h4>unique_ptr</h4>
                            <ul>
                                <li>Exclusive ownership - only one unique_ptr owns the resource</li>
                                <li>Lightweight (zero overhead vs raw pointer)</li>
                                <li>Automatically deletes on destruction</li>
                                <li>Move-only (cannot copy, only move)</li>
                            </ul>
                            
                            <h4>shared_ptr</h4>
                            <ul>
                                <li>Shared ownership - multiple shared_ptrs can own same resource</li>
                                <li>Reference counting - deletes when count reaches zero</li>
                                <li>Thread-safe reference counting (atomic)</li>
                                <li>Higher overhead (control block + atomic ops)</li>
                            </ul>
                            
                            <h4>weak_ptr</h4>
                            <ul>
                                <li>Non-owning reference to shared_ptr resource</li>
                                <li>Breaks circular references</li>
                                <li>Must lock() to access (returns shared_ptr)</li>
                                <li>Does not affect reference count</li>
                            </ul>
                            
                            <h4>Code Example</h4>
                            <pre><code>#include <memory>
class Node {
    int value;
    std::unique_ptr<Node> next;  // Exclusive ownership
    std::weak_ptr<Node> prev;    // Non-owning back-reference (if doubly linked)
    
public:
    Node(int v) : value(v) {}
    
    void setNext(std::unique_ptr<Node> n) { next = std::move(n); }
    Node* getNext() const { return next.get(); }
};
void example() {
    auto head = std::make_unique<Node>(1);
    head->setNext(std::make_unique<Node>(2));
    // Automatic cleanup when head goes out of scope
}</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Smart Pointers in Linked List',
                                code: `struct Node {
    int data;
    std::unique_ptr<Node> next;
    std::weak_ptr<Node> prev;  // For doubly linked
    
    Node(int d) : data(d) {}
};
void buildList() {
    auto head = std::make_unique<Node>(1);
    head->next = std::make_unique<Node>(2);
    head->next->prev = head;  // weak_ptr from shared/unique
    
    // No manual delete needed!
}`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-trace',
                                question: 'How many Node objects exist after this code runs?',
                                code: `auto a = std::make_shared<Node>(1);
auto b = a;
auto c = a;
a.reset();
b.reset();`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'cpp-f-02-q1',
                                type: 'mcq',
                                question: 'Which smart pointer has zero overhead compared to a raw pointer?',
                                options: ['unique_ptr', 'shared_ptr', 'weak_ptr', 'auto_ptr'],
                                correct: 0
                            }
                        ]
                    },
                    {
                        id: 'cpp-03',
                        title: 'Templates and Generic Programming',
                        objectives: [
                            'Write generic data structures using templates',
                            'Understand template type deduction',
                            'Use template specialization for optimization'
                        ],
                        content: `
                            <h3>Templates and Generic Programming</h3>
                            <p>Templates allow writing type-independent code. The compiler generates type-specific versions at compile time.</p>
                            
                            <h4>Function Templates</h4>
                            <pre><code>template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}
// Usage
int i = max(3, 7);        // T = int
double d = max(3.14, 2.71); // T = double</code></pre>
                            
                            <h4>Class Templates</h4>
                            <pre><code>template <typename T>
class Stack {
    std::vector<T> data;
public:
    void push(const T& val) { data.push_back(val); }
    T pop() { 
        T val = data.back();
        data.pop_back();
        return val;
    }
    bool empty() const { return data.empty(); }
};</code></pre>
                            
                            <h4>Template Best Practices for DSA</h4>
                            <ul>
                                <li>Use <code>typename</code> (or <code>class</code>) for type parameters</li>
                                <li>Prefer <code>const T&</code> for parameters to avoid copies</li>
                                <li>Use <code>std::move</code> for efficient returns</li>
                                <li>Consider concepts (C++20) for constrained templates</li>
                            </ul>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Generic Binary Search Tree',
                                code: `template <typename Key, typename Value,
          typename Compare = std::less<Key>>
class BST {
    struct Node {
        Key key;
        Value value;
        std::unique_ptr<Node> left, right;
        
        Node(Key k, Value v) : key(k), value(v) {}
    };
    
    std::unique_ptr<Node> root;
    Compare comp;
    
public:
    void insert(Key k, Value v) {
        insert(root, k, v);
    }
    
private:
    void insert(std::unique_ptr<Node>& node, Key k, Value v) {
        if (!node) {
            node = std::make_unique<Node>(k, v);
        } else if (comp(k, node->key)) {
            insert(node->left, k, v);
        } else {
            insert(node->right, k, v);
        }
    }
};`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'cpp-f-03-q1',
                                type: 'mcq',
                                question: 'When are templates instantiated?',
                                options: ['At runtime', 'At compile time', 'At link time', 'At preprocessor time'],
                                correct: 1
                            }
                        ]
                    }
                ]
            },
            {
                id: 'stl-containers',
                title: 'STL Containers for DSA',
                order: 2,
                lessons: [
                    {
                        id: 'cpp-04',
                        title: 'Sequence Containers: vector, list, deque',
                        objectives: [
                            'Choose the right container for the use case',
                            'Understand complexity guarantees',
                            'Use container adapters (stack, queue, priority_queue)'
                        ],
                        content: `
                            <h3>STL Sequence Containers</h3>
                            
                            <h4>std::vector - Dynamic Array</h4>
                            <ul>
                                <li>Contiguous memory, cache-friendly</li>
                                <li>O(1) random access, O(1) amortized push_back</li>
                                <li>O(n) insertion/deletion in middle</li>
                                <li><strong>Default choice for most DSA problems</strong></li>
                            </ul>
                            
                            <h4>std::list - Doubly Linked List</h4>
                            <ul>
                                <li>Non-contiguous, node-based</li>
                                <li>O(1) insertion/deletion anywhere (with iterator)</li>
                                <li>O(n) access - no random access</li>
                                <li>Higher memory overhead (pointers per node)</li>
                            </ul>
                            
                            <h4>std::deque - Double-Ended Queue</h4>
                            <ul>
                                <li>Block-based contiguous chunks</li>
                                <li>O(1) push/pop at both ends</li>
                                <li>O(1) random access</li>
                                <li>Good for sliding window, BFS queue</li>
                            </ul>
                            
                            <h4>Container Adapters</h4>
                            <pre><code>// Stack (LIFO) - uses deque by default
std::stack<int> st;
st.push(1); st.push(2);
int top = st.top(); st.pop();
// Queue (FIFO) - uses deque by default
std::queue<int> q;
q.push(1); q.push(2);
int front = q.front(); q.pop();
// Priority Queue (max-heap by default)
std::priority_queue<int> pq;
pq.push(5); pq.push(1); pq.push(3);
int max = pq.top(); // 5
// Min-heap
std::priority_queue<int, std::vector<int>, std::greater<int>> minPq;</code></pre>
                            
                            <h4>Choosing Guide</h4>
                            <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                                <tr style="background:#f8f9fa;">
                                    <th style="padding:8px;border:1px solid #ddd;">Need</th>
                                    <th style="padding:8px;border:1px solid #ddd;">Container</th>
                                </tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">General purpose, random access</td><td style="padding:8px;border:1px solid #ddd;">vector</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Frequent insert/delete in middle</td><td style="padding:8px;border:1px solid #ddd;">list</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Push/pop both ends</td><td style="padding:8px;border:1px solid #ddd;">deque</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">LIFO (stack)</td><td style="padding:8px;border:1px solid #ddd;">stack adapter</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">FIFO (queue)</td><td style="padding:8px;border:1px solid #ddd;">queue adapter</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Priority-based removal</td><td style="padding:8px;border:1px solid #ddd;">priority_queue</td></tr>
                            </table>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'BFS with deque vs queue',
                                code: `// Standard BFS - queue
std::queue<int> q;
q.push(start);
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u]) if (!vis[v]) {
        vis[v] = true;
        q.push(v);
    }
}
// 0-1 BFS - deque (push_front for 0-weight edges)
std::deque<int> dq;
dq.push_back(start);
while (!dq.empty()) {
    int u = dq.front(); dq.pop_front();
    for (auto [v, w] : adj[u]) {
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            if (w == 0) dq.push_front(v);
            else dq.push_back(v);
        }
    }
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'cpp-f-04-q1',
                                type: 'mcq',
                                question: 'Which container provides O(1) insertion at both ends?',
                                options: ['vector', 'list', 'deque', 'forward_list'],
                                correct: 2
                            }
                        ]
                    },
                    {
                        id: 'cpp-05',
                        title: 'Associative Containers: map, set, unordered_*',
                        objectives: [
                            'Distinguish ordered vs unordered associative containers',
                            'Choose based on complexity requirements',
                            'Use custom comparators and hash functions'
                        ],
                        content: `
                            <h3>Associative Containers</h3>
                            
                            <h4>Ordered (Tree-based, Red-Black Tree)</h4>
                            <ul>
                                <li><strong>std::map</strong> - key-value pairs, sorted by key</li>
                                <li><strong>std::set</strong> - unique keys only, sorted</li>
                                <li><strong>std::multimap / std::multiset</strong> - allow duplicates</li>
                                <li>O(log n) for search, insert, delete</li>
                                <li>Iterators traverse in sorted order</li>
                            </ul>
                            
                            <h4>Unordered (Hash Table)</h4>
                            <ul>
                                <li><strong>std::unordered_map</strong> - key-value, hashed</li>
                                <li><strong>std::unordered_set</strong> - unique keys, hashed</li>
                                <li>O(1) average, O(n) worst case</li>
                                <li>No guaranteed iteration order</li>
                                <li>Requires hash function and equality</li>
                            </ul>
                            
                            <h4>Custom Types</h4>
                            <pre><code>// Custom hash for pair<int,int>
struct PairHash {
    size_t operator()(const std::pair<int,int>& p) const noexcept {
        return std::hash<long long>()(((long long)p.first << 32) ^ p.second);
    }
};
std::unordered_set<std::pair<int,int>, PairHash> visited;
// Custom comparator for map
struct Descending {
    bool operator()(int a, int b) const { return a > b; }
};
std::map<int, int, Descending> mp; // Keys sorted descending</code></pre>
                            
                            <h4>Choosing Guide</h4>
                            <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                                <tr style="background:#f8f9fa;">
                                    <th style="padding:8px;border:1px solid #ddd;">Requirement</th>
                                    <th style="padding:8px;border:1px solid #ddd;">Container</th>
                                </tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Sorted keys, range queries</td><td style="padding:8px;border:1px solid #ddd;">map/set</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Fast lookup, no ordering needed</td><td style="padding:8px;border:1px solid #ddd;">unordered_map/set</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Duplicate keys needed</td><td style="padding:8px;border:1px solid #ddd;">multimap/multiset</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Custom ordering</td><td style="padding:8px;border:1px solid #ddd;">map/set with comparator</td></tr>
                            </table>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Frequency Counter with unordered_map',
                                code: `std::unordered_map<int, int> freq;
for (int x : arr) freq[x]++;
// Find most frequent
int maxFreq = 0, val = 0;
for (auto& [k, v] : freq) {
    if (v > maxFreq) { maxFreq = v; val = k; }
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'cpp-f-05-q1',
                                type: 'mcq',
                                question: 'What is the average time complexity for unordered_map lookup?',
                                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
                                correct: 0
                            }
                        ]
                    }
                ]
            }
        ]
    },
    
    // ============================================================
    // TOPIC 2: ALGORITHM ANALYSIS AND COMPLEXITY
    // ============================================================
    'complexity': {
        id: 'complexity',
        title: 'Algorithm Analysis and Complexity',
        level: 1,
        order: 2,
        description: 'Understanding how to analyze and compare algorithm efficiency',
        estimatedHours: 6,
        prerequisites: ['cpp-foundations'],
        modules: [
            {
                id: 'complexity-basics',
                title: 'Asymptotic Notation and Analysis',
                order: 1,
                lessons: [
                    {
                        id: 'comp-01',
                        title: 'Big-O, Omega, Theta Notation',
                        objectives: [
                            'Define and distinguish O, Ω, Θ notations',
                            'Analyze time complexity of iterative algorithms',
                            'Analyze space complexity'
                        ],
                        content: `
                            <h3>Asymptotic Notation</h3>
                            <p>Asymptotic notation describes the growth rate of functions as input size approaches infinity.</p>
                            
                            <h4>Big-O (Upper Bound)</h4>
                            <p>f(n) = O(g(n)) if ∃ c > 0, n₀ > 0 such that 0 ≤ f(n) ≤ c·g(n) for all n ≥ n₀</p>
                            <p>Meaning: f grows <strong>no faster than</strong> g (worst case)</p>
                            
                            <h4>Big-Omega (Lower Bound)</h4>
                            <p>f(n) = Ω(g(n)) if ∃ c > 0, n₀ > 0 such that 0 ≤ c·g(n) ≤ f(n) for all n ≥ n₀</p>
                            <p>Meaning: f grows <strong>at least as fast as</strong> g (best case)</p>
                            
                            <h4>Big-Theta (Tight Bound)</h4>
                            <p>f(n) = Θ(g(n)) if f(n) = O(g(n)) AND f(n) = Ω(g(n))</p>
                            <p>Meaning: f grows at the <strong>same rate as</strong> g (average case)</p>
                            
                            <h4>Common Complexity Classes</h4>
                            <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                                <tr style="background:#f8f9fa;">
                                    <th style="padding:8px;border:1px solid #ddd;">Notation</th>
                                    <th style="padding:8px;border:1px solid #ddd;">Name</th>
                                    <th style="padding:8px;border:1px solid #ddd;">Example</th>
                                </tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(1)</td><td style="padding:8px;border:1px solid #ddd;">Constant</td><td style="padding:8px;border:1px solid #ddd;">Array access</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(log n)</td><td style="padding:8px;border:1px solid #ddd;">Logarithmic</td><td style="padding:8px;border:1px solid #ddd;">Binary search</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(√n)</td><td style="padding:8px;border:1px solid #ddd;">Square root</td><td style="padding:8px;border:1px solid #ddd;">Trial division</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(n)</td><td style="padding:8px;border:1px solid #ddd;">Linear</td><td style="padding:8px;border:1px solid #ddd;">Linear search</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(n log n)</td><td style="padding:8px;border:1px solid #ddd;">Linearithmic</td><td style="padding:8px;border:1px solid #ddd;">Merge sort</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(n²)</td><td style="padding:8px;border:1px solid #ddd;">Quadratic</td><td style="padding:8px;border:1px solid #ddd;">Bubble sort</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(2ⁿ)</td><td style="padding:8px;border:1px solid #ddd;">Exponential</td><td style="padding:8px;border:1px solid #ddd;">Subset generation</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(n!)</td><td style="padding:8px;border:1px solid #ddd;">Factorial</td><td style="padding:8px;border:1px solid #ddd;">Permutations</td></tr>
                            </table>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Complexity Analysis Examples',
                                code: `// O(n) - Single loop
int sum = 0;
for (int i = 0; i < n; ++i) sum += arr[i];
// O(n²) - Nested loops
for (int i = 0; i < n; ++i)
    for (int j = 0; j < n; ++j)
        process(i, j);
// O(log n) - Dividing problem size
while (n > 1) n /= 2;
// O(n log n) - Divide and conquer
void mergeSort(vector<int>& a, int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m+1, r);
    merge(a, l, m, r);  // O(n)
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'comp-01-q1',
                                type: 'mcq',
                                question: 'What is the time complexity of binary search?',
                                options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
                                correct: 1
                            },
                            {
                                id: 'comp-01-q2',
                                type: 'true-false',
                                question: 'If f(n) = O(n²), then f(n) = O(n³) is also true.',
                                correct: true,
                                explanation: 'Big-O is an upper bound. If f grows no faster than n², it also grows no faster than n³.'
                            }
                        ]
                    },
                    {
                        id: 'comp-02',
                        title: 'Recurrence Relations and Master Theorem',
                        objectives: [
                            'Set up recurrence relations for divide-and-conquer algorithms',
                            'Apply Master Theorem to solve recurrences',
                            'Analyze recursive algorithms'
                        ],
                        content: `
                            <h3>Recurrence Relations</h3>
                            <p>A recurrence relation defines a function in terms of its value on smaller inputs.</p>
                            
                            <h4>Common Recurrences</h4>
                            <ul>
                                <li>T(n) = T(n/2) + O(1) → O(log n) — Binary search</li>
                                <li>T(n) = 2T(n/2) + O(n) → O(n log n) — Merge sort</li>
                                <li>T(n) = T(n-1) + O(1) → O(n) — Linear recursion</li>
                                <li>T(n) = 2T(n-1) + O(1) → O(2ⁿ) — Fibonacci (naive)</li>
                            </ul>
                            
                            <h4>Master Theorem</h4>
                            <p>For T(n) = a·T(n/b) + f(n) where a ≥ 1, b > 1:</p>
                            <ol>
                                <li>If f(n) = O(n^(log_b(a) - ε)) for some ε > 0: T(n) = Θ(n^(log_b(a)))</li>
                                <li>If f(n) = Θ(n^(log_b(a)) · log^k(n)): T(n) = Θ(n^(log_b(a)) · log^(k+1)(n))</li>
                                <li>If f(n) = Ω(n^(log_b(a) + ε)) and a·f(n/b) ≤ c·f(n) for c < 1: T(n) = Θ(f(n))</li>
                            </ol>
                            
                            <h4>Examples</h4>
                            <ul>
                                <li>Merge sort: a=2, b=2, f(n)=n → log₂2=1, f(n)=n=Θ(n¹) → Case 2, k=0 → Θ(n log n)</li>
                                <li>Binary search: a=1, b=2, f(n)=1 → log₂1=0, f(n)=1=Θ(n⁰) → Case 2, k=0 → Θ(log n)</li>
                                <li>Strassen: a=7, b=2, f(n)=n² → log₂7≈2.81, f(n)=n²=O(n²·⁸¹⁻ε) → Case 1 → Θ(n²·⁸¹)</li>
                            </ul>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Recursive Fibonacci - Exponential',
                                code: `// T(n) = T(n-1) + T(n-2) + O(1) ≈ O(2ⁿ)
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}
// Optimized with DP - O(n)
int fibDP(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; ++i) {
        int c = a + b;
        a = b; b = c;
    }
    return b;
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'comp-02-q1',
                                type: 'mcq',
                                question: 'For T(n) = 2T(n/2) + n, what is the time complexity?',
                                options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
                                correct: 1
                            }
                        ]
                    },
                    {
                        id: 'comp-03',
                        title: 'Amortized Analysis',
                        objectives: [
                            'Understand amortized vs worst-case analysis',
                            'Apply aggregate, accounting, and potential methods',
                            'Analyze dynamic array resizing'
                        ],
                        content: `
                            <h3>Amortized Analysis</h3>
                            <p>Amortized analysis gives the average cost per operation over a sequence, even if some individual operations are expensive.</p>
                            
                            <h4>Methods</h4>
                            <ul>
                                <li><strong>Aggregate:</strong> Total cost / number of operations</li>
                                <li><strong>Accounting:</strong> Assign credits to operations</li>
                                <li><strong>Potential:</strong> Define potential function Φ</li>
                            </ul>
                            
                            <h4>Dynamic Array (vector) Example</h4>
                            <p>When vector capacity is exceeded, it allocates 2× capacity and copies elements.</p>
                            <pre><code>// Push_back sequence: 1, 2, 4, 8, 16, 32...
// Costs: 1, 2 (copy 1), 3 (copy 2), 5 (copy 4), 9 (copy 8)...
// Total for n pushes: n + (1+2+4+...+n/2) < n + n = 2n
// Amortized cost = 2n/n = O(1)</code></pre>
                            
                            <h4>Accounting Method</h4>
                            <p>Charge 3 credits per push: 1 for insertion, 2 stored for future copy. When resizing, use stored credits to pay for copying.</p>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Vector Growth Strategy',
                                code: `std::vector<int> v;
v.reserve(1000);  // Avoid reallocations if size known
// Amortized O(1) push_back
for (int i = 0; i < 100000; ++i) v.push_back(i);`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'comp-03-q1',
                                type: 'mcq',
                                question: 'What is the amortized cost of vector push_back?',
                                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                                correct: 0
                            }
                        ]
                    }
                ]
            }
        ]
    },
    
    // ============================================================
    // TOPIC 3: ARRAYS AND STRINGS
    // ============================================================
    'arrays': {
        id: 'arrays',
        title: 'Arrays and Strings',
        level: 1,
        order: 3,
        description: 'Fundamental array and string algorithms and techniques',
        estimatedHours: 10,
        prerequisites: ['cpp-foundations', 'complexity'],
        modules: [
            {
                id: 'array-basics',
                title: 'Array Fundamentals',
                order: 1,
                lessons: [
                    {
                        id: 'arr-01',
                        title: 'Array Representation and Memory Layout',
                        objectives: [
                            'Understand contiguous memory layout',
                            'Calculate addresses with pointer arithmetic',
                            'Distinguish static vs dynamic arrays'
                        ],
                        content: `
                            <h3>Array Memory Layout</h3>
                            <p>Arrays store elements in <strong>contiguous memory</strong>. For an array <code>T arr[n]</code>:</p>
                            <ul>
                                <li>Element i is at address <code>base + i * sizeof(T)</code></li>
                                <li>Cache-friendly: spatial locality</li>
                                <li>No per-element overhead</li>
                            </ul>
                            
                            <h4>C++ Array Types</h4>
                            <pre><code>// Fixed-size (stack)
int arr1[10];              // C-style
std::array<int, 10> arr2;  // C++11 wrapper
// Dynamic (heap-managed)
std::vector<int> arr3(10); // Preferred for variable size
int* arr4 = new int[10];   // Manual (avoid)</code></pre>
                            
                            <h4>Pointer Arithmetic</h4>
                            <pre><code>int arr[5] = {10, 20, 30, 40, 50};
int* ptr = arr;           // Points to arr[0]
*(ptr + 2) = 30;          // arr[2] = 30
ptr[3] = 40;              // arr[3] = 40
int diff = (ptr + 4) - ptr; // 4 (elements, not bytes)</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Array Iteration Patterns',
                                code: `// Index-based
for (size_t i = 0; i < v.size(); ++i) { }
// Iterator-based
for (auto it = v.begin(); it != v.end(); ++it) { }
// Range-based for (C++11)
for (int& x : v) { x *= 2; }
// Reverse iteration
for (auto it = v.rbegin(); it != v.rend(); ++it) { }`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'arr-01-q1',
                                type: 'mcq',
                                question: 'What is the memory layout of std::vector elements?',
                                options: ['Contiguous', 'Linked list', 'Tree', 'Hash table'],
                                correct: 0
                            }
                        ]
                    },
                    {
                        id: 'arr-02',
                        title: 'Two Pointer Technique',
                        objectives: [
                            'Apply two pointers for sorted array problems',
                            'Solve pair sum, triplet sum, container with most water',
                            'Understand when to move left vs right pointer'
                        ],
                        content: `
                            <h3>Two Pointer Technique</h3>
                            <p>Use two indices moving through an array, typically from opposite ends or at different speeds.</p>
                            
                            <h4>Pattern 1: Opposite Ends (Sorted Array)</h4>
                            <pre><code>// Two Sum in Sorted Array - O(n)
bool twoSumSorted(vector<int>& a, int target) {
    int l = 0, r = a.size() - 1;
    while (l < r) {
        int sum = a[l] + a[r];
        if (sum == target) return true;
        else if (sum < target) ++l;  // Need larger sum
        else --r;                     // Need smaller sum
    }
    return false;
}</code></pre>
                            
                            <h4>Pattern 2: Fast/Slow Pointers</h4>
                            <pre><code>// Detect cycle in array (Floyd's Tortoise and Hare)
int findDuplicate(vector<int>& nums) {
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    
    slow = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}</code></pre>
                            
                            <h4>Pattern 3: Sliding Window</h4>
                            <pre><code>// Maximum sum subarray of size k - O(n)
int maxSumK(vector<int>& a, int k) {
    int sum = 0;
    for (int i = 0; i < k; ++i) sum += a[i];
    int maxSum = sum;
    for (int i = k; i < a.size(); ++i) {
        sum += a[i] - a[i - k];
        maxSum = max(maxSum, sum);
    }
    return maxSum;
}</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Container With Most Water',
                                code: `int maxArea(vector<int>& height) {
    int l = 0, r = height.size() - 1;
    int maxArea = 0;
    while (l < r) {
        int area = min(height[l], height[r]) * (r - l);
        maxArea = max(maxArea, area);
        if (height[l] < height[r]) ++l;
        else --r;
    }
    return maxArea;
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'arr-02-q1',
                                type: 'mcq',
                                question: 'In the two-pointer approach for sorted array two-sum, if sum < target, which pointer moves?',
                                options: ['Left pointer (++)', 'Right pointer (--)', 'Both', 'Neither'],
                                correct: 0
                            }
                        ]
                    }
                ]
            },
            {
                id: 'string-algorithms',
                title: 'String Algorithms',
                order: 2,
                lessons: [
                    {
                        id: 'str-01',
                        title: 'String Basics and Operations',
                        objectives: [
                            'Master std::string operations',
                            'Understand string_view for zero-copy substrings',
                            'Apply common string algorithms'
                        ],
                        content: `
                            <h3>C++ String Operations</h3>
                            <p><code>std::string</code> is a dynamic array of characters with SSO (Small String Optimization).</p>
                            
                            <h4>Key Operations</h4>
                            <pre><code>std::string s = "hello";
s.size(), s.length();        // 5
s.empty();                   // false
s[0], s.at(0);              // 'h' (at() bounds-checks)
s.front(), s.back();        // 'h', 'o'
s.substr(1, 3);             // "ell" (copy)
s.find("ll");               // 1 (position)
s.rfind("l");               // 3 (last occurrence)
s.replace(1, 2, "xx");      // "hexxo"</code></pre>
                            
                            <h4>string_view (C++17) - Zero Copy</h4>
                            <pre><code>std::string s = "hello world";
std::string_view sv(s);        // No copy
std::string_view sub = sv.substr(6); // "world" - no copy!
// Use for function parameters to avoid copies
void process(std::string_view sv);</code></pre>
                            
                            <h4>String Algorithms</h4>
                            <ul>
                                <li><strong>KMP:</strong> Pattern matching in O(n+m)</li>
                                <li><strong>Z-algorithm:</strong> Pattern matching, O(n+m)</li>
                                <li><strong>Rabin-Karp:</strong> Rolling hash, O(n+m) average</li>
                                <li><strong>Suffix Array/Tree:</strong> Advanced string processing</li>
                            </ul>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'KMP Prefix Function',
                                code: `vector<int> prefixFunction(const string& s) {
    int n = s.size();
    vector<int> pi(n);
    for (int i = 1; i < n; ++i) {
        int j = pi[i-1];
        while (j > 0 && s[i] != s[j]) j = pi[j-1];
        if (s[i] == s[j]) ++j;
        pi[i] = j;
    }
    return pi;
}
vector<int> kmpSearch(const string& text, const string& pattern) {
    string combined = pattern + '#' + text;
    auto pi = prefixFunction(combined);
    vector<int> matches;
    for (int i = pattern.size() + 1; i < combined.size(); ++i) {
        if (pi[i] == pattern.size()) 
            matches.push_back(i - 2*pattern.size());
    }
    return matches;
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'str-01-q1',
                                type: 'mcq',
                                question: 'What is the advantage of string_view over string for substrings?',
                                options: ['Faster compilation', 'Zero-copy (no allocation)', 'Mutable', 'Owns memory'],
                                correct: 1
                            }
                        ]
                    }
                ]
            }
        ]
    },
    
    // ============================================================
    // Additional topics would follow the same structure...
    // For brevity, showing structure for remaining topics
    // ============================================================
    
    'linked-lists': {
        id: 'linked-lists',
        title: 'Linked Lists',
        level: 1,
        order: 4,
        description: 'Linked list implementations, operations, and algorithms',
        estimatedHours: 8,
        prerequisites: ['cpp-foundations'],
        modules: [
            {
                id: 'll-basics',
                title: 'Linked List Fundamentals',
                order: 1,
                lessons: [
                    {
                        id: 'll-01',
                        title: 'Singly Linked List Implementation',
                        objectives: ['Implement singly linked list with smart pointers', 'Understand node structure and traversal', 'Handle edge cases (empty list, single node)', 'Implement insert, delete, and search operations'],
                        content: `
                            <h3>Singly Linked List</h3>
                            <p>A <strong>singly linked list</strong> is a linear data structure where each element (node) contains data and a pointer to the next node. Unlike arrays, linked lists don't require contiguous memory.</p>
                            
                            <h4>Node Structure</h4>
                            <pre><code>struct Node {
    int data;
    std::unique_ptr<Node> next;
    
    Node(int val) : data(val), next(nullptr) {}
};</code></pre>
                            
                            <h4>Basic Operations</h4>
                            <ul>
                                <li><strong>Traversal:</strong> O(n) - follow next pointers from head</li>
                                <li><strong>Search:</strong> O(n) - linear scan</li>
                                <li><strong>Insert at head:</strong> O(1) - create new node, point to old head</li>
                                <li><strong>Insert at tail:</strong> O(n) without tail pointer, O(1) with tail pointer</li>
                                <li><strong>Delete:</strong> O(n) - need to find previous node</li>
                            </ul>
                            
                            <h4>Smart Pointer Implementation</h4>
                            <p>Using <code>std::unique_ptr</code> for automatic memory management:</p>
                            <pre><code>class LinkedList {
    std::unique_ptr<Node> head;
    Node* tail = nullptr;
    size_t size = 0;
    
public:
    void push_front(int val) {
        auto newNode = std::make_unique<Node>(val);
        newNode->next = std::move(head);
        head = std::move(newNode);
        if (!tail) tail = head.get();
        ++size;
    }
    
    void push_back(int val) {
        auto newNode = std::make_unique<Node>(val);
        if (!head) {
            head = std::move(newNode);
            tail = head.get();
        } else {
            tail->next = std::move(newNode);
            tail = tail->next.get();
        }
        ++size;
    }
    
    bool remove(int val) {
        if (!head) return false;
        if (head->data == val) {
            head = std::move(head->next);
            if (!head) tail = nullptr;
            --size;
            return true;
        }
        Node* curr = head.get();
        while (curr->next && curr->next->data != val) {
            curr = curr->next.get();
        }
        if (curr->next) {
            curr->next = std::move(curr->next->next);
            if (!curr->next) tail = curr;
            --size;
            return true;
        }
        return false;
    }
};</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Complete Singly Linked List with Iterator',
                                code: `#include <memory>
#include <iostream>
struct Node {
    int data;
    std::unique_ptr<Node> next;
    Node(int val) : data(val), next(nullptr) {}
};
class LinkedList {
    std::unique_ptr<Node> head;
    Node* tail = nullptr;
    size_t sz = 0;
    
public:
    // Iterator support
    struct Iterator {
        Node* curr;
        int& operator*() { return curr->data; }
        Iterator& operator++() { curr = curr->next.get(); return *this; }
        bool operator!=(const Iterator& other) { return curr != other.curr; }
    };
    
    Iterator begin() { return {head.get()}; }
    Iterator end() { return {nullptr}; }
    
    void push_front(int val) {
        auto node = std::make_unique<Node>(val);
        node->next = std::move(head);
        head = std::move(node);
        if (!tail) tail = head.get();
        ++sz;
    }
    
    void push_back(int val) {
        auto node = std::make_unique<Node>(val);
        if (!head) {
            head = std::move(node);
            tail = head.get();
        } else {
            tail->next = std::move(node);
            tail = tail->next.get();
        }
        ++sz;
    }
    
    void insert_after(Iterator it, int val) {
        if (!it.curr) return;
        auto node = std::make_unique<Node>(val);
        node->next = std::move(it.curr->next);
        it.curr->next = std::move(node);
        if (!node->next) tail = node.get();
        ++sz;
    }
    
    bool remove(int val) {
        if (!head) return false;
        if (head->data == val) {
            head = std::move(head->next);
            if (!head) tail = nullptr;
            --sz;
            return true;
        }
        for (Node* curr = head.get(); curr->next; curr = curr->next.get()) {
            if (curr->next->data == val) {
                curr->next = std::move(curr->next->next);
                if (!curr->next) tail = curr;
                --sz;
                return true;
            }
        }
        return false;
    }
    
    size_t size() const { return sz; }
    bool empty() const { return sz == 0; }
};
int main() {
    LinkedList ll;
    ll.push_back(1);
    ll.push_back(2);
    ll.push_front(0);
    ll.insert_after(ll.begin(), -1); // Insert after first element
    
    for (int x : ll) std::cout << x << " "; // 0 -1 1 2
    std::cout << "\\n";
    
    ll.remove(1);
    for (int x : ll) std::cout << x << " "; // 0 -1 2
}
`
                            },
                            {
                                language: 'cpp',
                                title: 'Doubly Linked List Implementation',
                                code: `struct DNode {
    int data;
    std::unique_ptr<DNode> next;
    DNode* prev = nullptr;  // Raw pointer for back-reference (no ownership)
    
    DNode(int val) : data(val) {}
};
class DoublyLinkedList {
    std::unique_ptr<DNode> head;
    DNode* tail = nullptr;
    size_t sz = 0;
    
public:
    void push_front(int val) {
        auto node = std::make_unique<DNode>(val);
        node->next = std::move(head);
        if (head) head->prev = node.get();
        head = std::move(node);
        if (!tail) tail = head.get();
        ++sz;
    }
    
    void push_back(int val) {
        auto node = std::make_unique<DNode>(val);
        if (!head) {
            head = std::move(node);
            tail = head.get();
        } else {
            tail->next = std::move(node);
            tail->next->prev = tail;
            tail = tail->next.get();
        }
        ++sz;
    }
    
    // O(1) removal given pointer to node
    void remove(DNode* node) {
        if (!node) return;
        if (node->prev) node->prev->next = std::move(node->next);
        else head = std::move(node->next);
        
        if (node->next) node->next->prev = node->prev;
        else tail = node->prev;
        --sz;
    }
};
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement the find function to return a pointer to the node with given value, or nullptr if not found.',
                                code: `Node* find(Node* head, int val) {
    // TODO: implement
}`
                            },
                            {
                                type: 'code-trace',
                                question: 'What is the output of this code?',
                                code: `LinkedList ll;
ll.push_back(1);
ll.push_back(2);
ll.push_front(0);
ll.remove(1);
for (int x : ll) std::cout << x << " ";`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'll-01-q1',
                                type: 'mcq',
                                question: 'What is the time complexity of inserting at the head of a singly linked list?',
                                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                                correct: 0
                            },
                            {
                                id: 'll-01-q2',
                                type: 'mcq',
                                question: 'Why use unique_ptr for the next pointer in a singly linked list?',
                                options: ['To enable sharing', 'For automatic memory management', 'To allow cycles', 'For faster access'],
                                correct: 1
                            },
                            {
                                id: 'll-01-q3',
                                type: 'true-false',
                                question: 'Deleting a node from a singly linked list given only a pointer to that node is possible in O(1) time.',
                                correct: false,
                                explanation: 'You need access to the previous node to update its next pointer. With only the node to delete, you can copy data from next node and delete next instead (if not tail).'
                            }
                        ]
                    },
                    {
                        id: 'll-02',
                        title: 'Doubly Linked List and Circular Lists',
                        objectives: ['Implement doubly linked list with prev/next pointers', 'Understand circular linked lists', 'Compare singly vs doubly vs circular lists'],
                        content: `
                            <h3>Doubly Linked List</h3>
                            <p>A <strong>doubly linked list</strong> has nodes with both <code>next</code> and <code>prev</code> pointers, enabling bidirectional traversal.</p>
                            
                            <h4>Advantages over Singly Linked List</h4>
                            <ul>
                                <li>O(1) deletion given pointer to node (no need to find predecessor)</li>
                                <li>Bidirectional traversal</li>
                                <li>Easier to implement certain algorithms</li>
                            </ul>
                            
                            <h4>Circular Linked List</h4>
                            <p>In a <strong>circular linked list</strong>, the last node points back to the first (head), forming a circle. Can be singly or doubly circular.</p>
                            <pre><code>// Circular singly linked list
struct Node {
    int data;
    Node* next;
};
void insertCircular(Node*& head, int val) {
    auto* node = new Node{val, nullptr};
    if (!head) {
        node->next = node; // Points to itself
        head = node;
    } else {
        node->next = head->next;
        head->next = node;
        head = node; // New node becomes tail (points to head)
    }
}</code></pre>
                            
                            <h4>Applications</h4>
                            <ul>
                                <li>Round-robin scheduling</li>
                                <li>Music playlist with repeat</li>
                                <li>Buffer management (circular buffer)</li>
                            </ul>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Circular Linked List with Josephus Problem',
                                code: `struct Node {
    int data;
    Node* next;
    Node(int v) : data(v), next(nullptr) {}
};
// Josephus Problem: n people in circle, eliminate every k-th
int josephus(int n, int k) {
    // Create circular list 1..n
    Node* head = new Node(1);
    Node* curr = head;
    for (int i = 2; i <= n; ++i) {
        curr->next = new Node(i);
        curr = curr->next;
    }
    curr->next = head; // Make circular
    
    // Eliminate every k-th
    Node* prev = curr; // Points to last node
    curr = head;
    while (curr->next != curr) {
        for (int i = 1; i < k; ++i) {
            prev = curr;
            curr = curr->next;
        }
        // Remove curr
        prev->next = curr->next;
        delete curr;
        curr = prev->next;
    }
    int ans = curr->data;
    delete curr;
    return ans;
}
// Mathematical solution: O(n) time, O(1) space
int josephusMath(int n, int k) {
    int res = 0; // 0-indexed
    for (int i = 2; i <= n; ++i) {
        res = (res + k) % i;
    }
    return res + 1; // 1-indexed
}
`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'll-02-q1',
                                type: 'mcq',
                                question: 'What is the main advantage of a doubly linked list over singly linked list?',
                                options: ['Less memory', 'O(1) deletion given node pointer', 'Faster traversal', 'Simpler implementation'],
                                correct: 1
                            },
                            {
                                id: 'll-02-q2',
                                type: 'true-false',
                                question: 'In a circular linked list, there is no NULL pointer.',
                                correct: true,
                                explanation: 'The last node points back to the first node, creating a cycle with no null termination.'
                            }
                        ]
                    },
                    {
                        id: 'll-03',
                        title: 'Linked List Algorithms',
                        objectives: ['Reverse a linked list (iterative and recursive)', 'Detect cycles with Floyd\'s algorithm', 'Find middle node, merge sorted lists', 'Solve intersection and palindrome problems'],
                        content: `
                            <h3>Essential Linked List Algorithms</h3>
                            
                            <h4>1. Reverse Linked List (Iterative)</h4>
                            <pre><code>Node* reverse(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;
    while (curr) {
        Node* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev; // New head
}</code></pre>
                            
                            <h4>2. Detect Cycle (Floyd's Tortoise and Hare)</h4>
                            <pre><code>bool hasCycle(Node* head) {
    Node* slow = head;
    Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}
// Find cycle start
Node* detectCycleStart(Node* head) {
    Node* slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) break;
    }
    if (!fast || !fast->next) return nullptr;
    slow = head;
    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
    }
    return slow;
}</code></pre>
                            
                            <h4>3. Find Middle Node</h4>
                            <pre><code>Node* middleNode(Node* head) {
    Node* slow = head;
    Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow; // For even length, returns second middle
}</code></pre>
                            
                            <h4>4. Merge Two Sorted Lists</h4>
                            <pre><code>Node* mergeTwoLists(Node* l1, Node* l2) {
    Node dummy(0);
    Node* tail = &dummy;
    while (l1 && l2) {
        if (l1->data < l2->data) {
            tail->next = l1;
            l1 = l1->next;
        } else {
            tail->next = l2;
            l2 = l2->next;
        }
        tail = tail->next;
    }
    tail->next = l1 ? l1 : l2;
    return dummy.next;
}</code></pre>
                            
                            <h4>5. Palindrome Check</h4>
                            <pre><code>bool isPalindrome(Node* head) {
    // Find middle
    Node* slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    // Reverse second half
    Node* prev = nullptr;
    while (slow) {
        Node* next = slow->next;
        slow->next = prev;
        prev = slow;
        slow = next;
    }
    // Compare
    Node* p1 = head, *p2 = prev;
    while (p2) {
        if (p1->data != p2->data) return false;
        p1 = p1->next;
        p2 = p2->next;
    }
    return true;
}</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Add Two Numbers (Linked List Representation)',
                                code: `// LeetCode 2: Add Two Numbers
// Digits stored in reverse order: 342 = 2->4->3
Node* addTwoNumbers(Node* l1, Node* l2) {
    Node dummy(0);
    Node* curr = &dummy;
    int carry = 0;
    
    while (l1 || l2 || carry) {
        int sum = carry;
        if (l1) { sum += l1->data; l1 = l1->next; }
        if (l2) { sum += l2->data; l2 = l2->next; }
        
        carry = sum / 10;
        curr->next = new Node(sum % 10);
        curr = curr->next;
    }
    return dummy.next;
}
// Follow-up: Digits in forward order
Node* addTwoNumbersForward(Node* l1, Node* l2) {
    // Reverse both, add, reverse result
    l1 = reverse(l1);
    l2 = reverse(l2);
    Node* result = addTwoNumbers(l1, l2);
    return reverse(result);
}
`
                            },
                            {
                                language: 'cpp',
                                title: 'Copy List with Random Pointer',
                                code: `// LeetCode 138: Copy List with Random Pointer
struct Node {
    int val;
    Node* next;
    Node* random;
    Node(int v) : val(v), next(nullptr), random(nullptr) {}
};
// O(n) time, O(1) space - interweave nodes
Node* copyRandomList(Node* head) {
    if (!head) return nullptr;
    
    // Step 1: Create copy nodes interleaved
    for (Node* curr = head; curr; curr = curr->next->next) {
        Node* copy = new Node(curr->val);
        copy->next = curr->next;
        curr->next = copy;
    }
    
    // Step 2: Assign random pointers
    for (Node* curr = head; curr; curr = curr->next->next) {
        if (curr->random)
            curr->next->random = curr->random->next;
    }
    
    // Step 3: Separate lists
    Node* copyHead = head->next;
    for (Node* curr = head; curr; curr = curr->next) {
        Node* copy = curr->next;
        curr->next = copy->next;
        if (copy->next)
            copy->next = copy->next->next;
    }
    return copyHead;
}
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement function to remove nth node from end of list in one pass.',
                                code: `Node* removeNthFromEnd(Node* head, int n) {
    // TODO: use two pointers with gap of n
}`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace through Floyd\'s cycle detection for list: 1->2->3->4->5->3 (cycle at 3)',
                                code: `// Step through: slow=1,fast=1 -> slow=2,fast=3 -> slow=3,fast=5 -> slow=4,fast=4 (meet)`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'll-03-q1',
                                type: 'mcq',
                                question: 'In Floyd\'s cycle detection, when slow and fast meet, how to find cycle start?',
                                options: ['Reset slow to head, move both one step at a time', 'Reset fast to head', 'Move slow twice as fast', 'Count cycle length first'],
                                correct: 0
                            },
                            {
                                id: 'll-03-q2',
                                type: 'mcq',
                                question: 'Time complexity to merge two sorted linked lists of lengths m and n?',
                                options: ['O(m+n)', 'O(m log n)', 'O(mn)', 'O(log(m+n))'],
                                correct: 0
                            }
                        ]
                    }
                ]
            },
            {
                id: 'll-advanced',
                title: 'Advanced Linked List Techniques',
                order: 2,
                lessons: [
                    {
                        id: 'll-04',
                        title: 'Linked List in STL and Custom Allocators',
                        objectives: ['Use std::list and std::forward_list', 'Understand when to use each', 'Implement custom allocator for pool allocation'],
                        content: `
                            <h3>STL Linked Lists</h3>
                            
                            <h4>std::forward_list (Singly Linked)</h4>
                            <ul>
                                <li>Zero overhead vs hand-rolled singly linked list</li>
                                <li>No size() method (O(1) would require extra storage)</li>
                                <li>insert_after, erase_after operations</li>
                                <li>Ideal for memory-constrained scenarios</li>
                            </ul>
                            <pre><code>std::forward_list<int> fl = {1, 2, 3};
fl.push_front(0);        // {0, 1, 2, 3}
auto it = fl.before_begin();
fl.insert_after(it, -1); // {-1, 0, 1, 2, 3}
fl.remove(2);            // Remove all 2s
fl.unique();             // Remove consecutive duplicates
fl.sort();               // Merge sort O(n log n)
fl.reverse();</code></pre>
                            
                            <h4>std::list (Doubly Linked)</h4>
                            <ul>
                                <li>Bidirectional iterators</li>
                                <li>splice() - O(1) transfer elements between lists</li>
                                <li>Stable iterators (not invalidated by insert/erase elsewhere)</li>
                            </ul>
                            <pre><code>std::list<int> lst = {3, 1, 4, 1, 5};
lst.sort();              // {1, 1, 3, 4, 5}
lst.unique();            // {1, 3, 4, 5}
// Splice - move elements from another list in O(1)
std::list<int> lst2 = {9, 8};
lst.splice(lst.begin(), lst2); // lst: {9, 8, 1, 3, 4, 5}, lst2: empty
</code></pre>
                            
                            <h4>Custom Pool Allocator</h4>
                            <p>For high-frequency allocations, a pool allocator reduces overhead:</p>
                            <pre><code>template <typename T, size_t PoolSize = 10000>
class PoolAllocator {
    alignas(T) char pool[PoolSize * sizeof(T)];
    bool used[PoolSize] = {false};
    size_t freeCount = PoolSize;
    
public:
    using value_type = T;
    
    T* allocate(size_t n) {
        if (n != 1 || freeCount == 0) throw std::bad_alloc();
        for (size_t i = 0; i < PoolSize; ++i) {
            if (!used[i]) {
                used[i] = true;
                --freeCount;
                return reinterpret_cast<T*>(pool + i * sizeof(T));
            }
        }
        throw std::bad_alloc();
    }
    
    void deallocate(T* p, size_t) {
        size_t idx = (reinterpret_cast<char*>(p) - pool) / sizeof(T);
        if (idx < PoolSize) {
            used[idx] = false;
            ++freeCount;
        }
    }
};
// Usage with std::list
std::list<int, PoolAllocator<int>> pooledList;
</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'LRU Cache with std::list and unordered_map',
                                code: `class LRUCache {
    struct Node { int key, value; };
    size_t capacity;
    std::list<Node> dll; // Most recent at front
    std::unordered_map<int, std::list<Node>::iterator> map;
    
public:
    LRUCache(size_t cap) : capacity(cap) {}
    
    int get(int key) {
        auto it = map.find(key);
        if (it == map.end()) return -1;
        // Move to front (most recently used)
        dll.splice(dll.begin(), dll, it->second);
        return it->second->value;
    }
    
    void put(int key, int value) {
        auto it = map.find(key);
        if (it != map.end()) {
            it->second->value = value;
            dll.splice(dll.begin(), dll, it->second);
            return;
        }
        if (dll.size() == capacity) {
            // Remove least recently used (back)
            map.erase(dll.back().key);
            dll.pop_back();
        }
        dll.emplace_front(Node{key, value});
        map[key] = dll.begin();
    }
};
`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'll-04-q1',
                                type: 'mcq',
                                question: 'What is the key difference between std::list and std::forward_list?',
                                options: ['std::list is singly linked', 'std::forward_list is doubly linked', 'std::list is doubly linked', 'std::forward_list has size()'],
                                correct: 2
                            },
                            {
                                id: 'll-04-q2',
                                type: 'true-false',
                                question: 'std::list::splice invalidates iterators to the spliced elements.',
                                correct: false,
                                explanation: 'std::list iterators remain valid after splice - elements are moved, not copied.'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    
    'stacks-queues': {
        id: 'stacks-queues',
        title: 'Stacks and Queues',
        level: 1,
        order: 5,
        description: 'Stack, queue, deque, and priority queue implementations and applications',
        estimatedHours: 6,
        prerequisites: ['cpp-foundations'],
        modules: [
            {
                id: 'stack-queue-basics',
                title: 'Stack and Queue Implementations',
                order: 1,
                lessons: [
                    {
                        id: 'sq-01',
                        title: 'Stack Implementation and Applications',
                        objectives: ['Implement stack with vector and linked list', 'Apply to expression evaluation, parentheses matching', 'Understand call stack', 'Solve monotonic stack problems'],
                        content: `
                            <h3>Stack Data Structure</h3>
                            <p>A <strong>stack</strong> is a LIFO (Last In, First Out) data structure. Elements are added and removed from the same end (top).</p>
                            
                            <h4>Operations</h4>
                            <ul>
                                <li><strong>push(x):</strong> Add element to top - O(1)</li>
                                <li><strong>pop():</strong> Remove top element - O(1)</li>
                                <li><strong>top():</strong> Access top element - O(1)</li>
                                <li><strong>empty():</strong> Check if empty - O(1)</li>
                                <li><strong>size():</strong> Number of elements - O(1)</li>
                            </ul>
                            
                            <h4>Implementations</h4>
                            <pre><code>// Array-based (vector)
class Stack {
    std::vector<int> data;
public:
    void push(int x) { data.push_back(x); }
    void pop() { if (!data.empty()) data.pop_back(); }
    int top() const { return data.back(); }
    bool empty() const { return data.empty(); }
    size_t size() const { return data.size(); }
};
// Linked list-based
class StackLL {
    struct Node { int val; std::unique_ptr<Node> next; };
    std::unique_ptr<Node> head;
public:
    void push(int x) {
        auto node = std::make_unique<Node>();
        node->val = x;
        node->next = std::move(head);
        head = std::move(node);
    }
    // ... similar pop, top
};</code></pre>
                            
                            <h4>Application 1: Parentheses Matching</h4>
                            <pre><code>bool isValid(const std::string& s) {
    std::stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) return false;
        }
    }
    return st.empty();
}</code></pre>
                            
                            <h4>Application 2: Expression Evaluation (Postfix)</h4>
                            <pre><code>int evalPostfix(const std::string& expr) {
    std::stack<int> st;
    for (char c : expr) {
        if (isdigit(c)) {
            st.push(c - '0');
        } else {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            switch (c) {
                case '+': st.push(a + b); break;
                case '-': st.push(a - b); break;
                case '*': st.push(a * b); break;
                case '/': st.push(a / b); break;
            }
        }
    }
    return st.top();
}</code></pre>
                            
                            <h4>Application 3: Call Stack and Recursion</h4>
                            <p>Every function call creates a <strong>stack frame</strong> containing local variables, parameters, and return address. Deep recursion can cause <strong>stack overflow</strong>.</p>
                            <pre><code>// Each call adds a frame
int factorial(int n) {
    if (n <= 1) return 1;  // Base case - stops recursion
    return n * factorial(n - 1); // New frame for each call
}
// Tail recursion optimization (compiler may convert to loop)
int factorialTail(int n, int acc = 1) {
    if (n <= 1) return acc;
    return factorialTail(n - 1, n * acc); // Tail call
}</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Infix to Postfix Conversion (Shunting Yard)',
                                code: `int precedence(char op) {
    if (op == '+' || op == '-') return 1;
    if (op == '*' || op == '/') return 2;
    return 0;
}
std::string infixToPostfix(const std::string& infix) {
    std::stack<char> ops;
    std::string output;
    
    for (char c : infix) {
        if (isdigit(c)) {
            output += c;
        } else if (c == '(') {
            ops.push(c);
        } else if (c == ')') {
            while (!ops.empty() && ops.top() != '(') {
                output += ops.top(); ops.pop();
            }
            ops.pop(); // Remove '('
        } else { // Operator
            while (!ops.empty() && precedence(ops.top()) >= precedence(c)) {
                output += ops.top(); ops.pop();
            }
            ops.push(c);
        }
    }
    while (!ops.empty()) {
        output += ops.top(); ops.pop();
    }
    return output;
}
// Example: "3+4*2/(1-5)" -> "342*15-/+"
`
                            },
                            {
                                language: 'cpp',
                                title: 'Monotonic Stack - Next Greater Element',
                                code: `// Next Greater Element to the right
vector<int> nextGreater(const vector<int>& arr) {
    int n = arr.size();
    vector<int> result(n, -1);
    stack<int> st; // Stores indices
    
    for (int i = 0; i < n; ++i) {
        while (!st.empty() && arr[i] > arr[st.top()]) {
            result[st.top()] = arr[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}
// Largest Rectangle in Histogram (LeetCode 84)
int largestRectangleArea(vector<int>& heights) {
    stack<int> st;
    int maxArea = 0;
    heights.push_back(0); // Sentinel
    
    for (int i = 0; i < heights.size(); ++i) {
        while (!st.empty() && heights[i] < heights[st.top()]) {
            int h = heights[st.top()]; st.pop();
            int w = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, h * w);
        }
        st.push(i);
    }
    return maxArea;
}
// Trapping Rain Water
int trap(vector<int>& height) {
    stack<int> st;
    int water = 0;
    for (int i = 0; i < height.size(); ++i) {
        while (!st.empty() && height[i] > height[st.top()]) {
            int bottom = st.top(); st.pop();
            if (st.empty()) break;
            int w = i - st.top() - 1;
            int h = min(height[i], height[st.top()]) - height[bottom];
            water += w * h;
        }
        st.push(i);
    }
    return water;
}
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement a stack that supports getMin() in O(1) time.',
                                code: `class MinStack {
    std::stack<int> mainStack;
    std::stack<int> minStack;
public:
    void push(int x) {
        // TODO
    }
    void pop() {
        // TODO
    }
    int top() { return mainStack.top(); }
    int getMin() { return minStack.top(); }
};`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace monotonic stack for arr = [2, 1, 5, 6, 2, 3] - Largest Rectangle in Histogram',
                                code: `// Heights with indices: (0,2) (1,1) (2,5) (3,6) (4,2) (5,3)
// Step through stack operations`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'sq-01-q1',
                                type: 'mcq',
                                question: 'What is the time complexity of stack push/pop operations?',
                                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                                correct: 0
                            },
                            {
                                id: 'sq-01-q2',
                                type: 'mcq',
                                question: 'In the monotonic stack pattern for Next Greater Element, what does the stack store?',
                                options: ['Values', 'Indices', 'Both values and indices', 'Differences'],
                                correct: 1
                            },
                            {
                                id: 'sq-01-q3',
                                type: 'true-false',
                                question: 'A stack can be used to convert recursive algorithms to iterative ones.',
                                correct: true,
                                explanation: 'Explicit stack simulates the call stack, enabling iterative versions of recursive algorithms.'
                            }
                        ]
                    },
                    {
                        id: 'sq-02',
                        title: 'Queue and Deque Implementations',
                        objectives: ['Implement queue with circular array and linked list', 'Understand std::queue and std::deque', 'Apply to BFS, sliding window, and cache algorithms'],
                        content: `
                            <h3>Queue Data Structure</h3>
                            <p>A <strong>queue</strong> is a FIFO (First In, First Out) data structure. Elements are added at the rear and removed from the front.</p>
                            
                            <h4>Operations</h4>
                            <ul>
                                <li><strong>push(x)/enqueue:</strong> Add to rear - O(1)</li>
                                <li><strong>pop()/dequeue:</strong> Remove from front - O(1)</li>
                                <li><strong>front():</strong> Access front element - O(1)</li>
                                <li><strong>back():</strong> Access rear element - O(1)</li>
                                <li><strong>empty()/size():</strong> O(1)</li>
                            </ul>
                            
                            <h4>Circular Array Implementation</h4>
                            <pre><code>class Queue {
    std::vector<int> data;
    int front = 0, rear = 0, count = 0;
    int capacity;
    
public:
    Queue(int cap) : data(cap), capacity(cap) {}
    
    void push(int x) {
        if (count == capacity) resize();
        data[rear] = x;
        rear = (rear + 1) % capacity;
        ++count;
    }
    
    void pop() {
        if (empty()) return;
        front = (front + 1) % capacity;
        --count;
    }
    
    int front() const { return data[front]; }
    bool empty() const { return count == 0; }
    size_t size() const { return count; }
    
private:
    void resize() {
        std::vector<int> newData(capacity * 2);
        for (int i = 0; i < count; ++i) {
            newData[i] = data[(front + i) % capacity];
        }
        data = std::move(newData);
        front = 0;
        rear = count;
        capacity *= 2;
    }
};</code></pre>
                            
                            <h4>Deque (Double-Ended Queue)</h4>
                            <p>Supports O(1) insertion/deletion at both ends. <code>std::deque</code> uses block-based allocation.</p>
                            <pre><code>std::deque<int> dq;
dq.push_front(1); dq.push_back(2);
dq.pop_front(); dq.pop_back();
int front = dq.front(); int back = dq.back();
// Random access O(1) (unlike list)
dq[0] = 10; dq.at(1) = 20;</code></pre>
                            
                            <h4>Applications</h4>
                            <ul>
                                <li><strong>BFS:</strong> Queue for level-order traversal</li>
                                <li><strong>Sliding Window:</strong> Deque for min/max in window</li>
                                <li><strong>0-1 BFS:</strong> Deque for weighted graphs with 0/1 edges</li>
                                <li><strong>Cache:</strong> LRU with deque or list</li>
                            </ul>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Sliding Window Maximum with Deque',
                                code: `// LeetCode 239: Sliding Window Maximum
// O(n) time using deque storing indices
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq; // Indices, decreasing values
    vector<int> result;
    
    for (int i = 0; i < nums.size(); ++i) {
        // Remove indices outside window
        while (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        
        // Maintain decreasing order
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        
        dq.push_back(i);
        
        if (i >= k - 1) result.push_back(nums[dq.front()]);
    }
    return result;
}
// 0-1 BFS - Shortest path with edge weights 0 or 1
vector<int> zeroOneBFS(int n, vector<vector<pair<int,int>>>& adj, int src) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    deque<int> dq;
    
    dist[src] = 0;
    dq.push_back(src);
    
    while (!dq.empty()) {
        int u = dq.front(); dq.pop_front();
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (w == 0) dq.push_front(v);
                else dq.push_back(v);
            }
        }
    }
    return dist;
}
`
                            },
                            {
                                language: 'cpp',
                                title: 'Circular Buffer / Ring Buffer',
                                code: `template <typename T>
class CircularBuffer {
    std::vector<T> buffer;
    size_t head = 0, tail = 0, count = 0;
    size_t capacity;
    
public:
    CircularBuffer(size_t cap) : buffer(cap), capacity(cap) {}
    
    // Producer: add element (overwrites oldest if full)
    void push(const T& item) {
        buffer[tail] = item;
        tail = (tail + 1) % capacity;
        if (count < capacity) ++count;
        else head = (head + 1) % capacity; // Overwrite oldest
    }
    
    // Consumer: get element
    bool pop(T& item) {
        if (count == 0) return false;
        item = buffer[head];
        head = (head + 1) % capacity;
        --count;
        return true;
    }
    
    bool empty() const { return count == 0; }
    bool full() const { return count == capacity; }
    size_t size() const { return count; }
};
// Usage: audio streaming, logging, producer-consumer
`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'sq-02-q1',
                                type: 'mcq',
                                question: 'What is the key advantage of a circular array queue over a simple array queue?',
                                options: ['Less memory', 'O(1) enqueue/dequeue without shifting', 'Simpler implementation', 'Dynamic resizing'],
                                correct: 1
                            },
                            {
                                id: 'sq-02-q2',
                                type: 'mcq',
                                question: 'In sliding window maximum with deque, why do we store indices instead of values?',
                                options: ['To check window boundaries', 'For faster comparison', 'To save memory', 'Required by STL'],
                                correct: 0
                            }
                        ]
                    }
                ]
            },
            {
                id: 'priority-queue',
                title: 'Priority Queue and Heap',
                order: 2,
                lessons: [
                    {
                        id: 'pq-01',
                        title: 'Heap Implementation and Priority Queue',
                        objectives: ['Implement binary heap (max-heap and min-heap)', 'Understand heapify, push, pop operations', 'Use std::priority_queue with custom comparators', 'Apply to Dijkstra, Huffman, K-th largest'],
                        content: `
                            <h3>Priority Queue and Binary Heap</h3>
                            <p>A <strong>priority queue</strong> retrieves the highest (or lowest) priority element. Typically implemented as a <strong>binary heap</strong>.</p>
                            
                            <h4>Binary Heap Properties</h4>
                            <ul>
                                <li>Complete binary tree (array representation)</li>
                                <li>Heap property: parent >= children (max-heap) or parent <= children (min-heap)</li>
                                <li>Array indices: parent(i) = (i-1)/2, left(i) = 2i+1, right(i) = 2i+2</li>
                            </ul>
                            
                            <h4>Operations</h4>
                            <ul>
                                <li><strong>push:</strong> Add at end, bubble up (sift up) - O(log n)</li>
                                <li><strong>pop:</strong> Swap root with last, remove last, bubble down (sift down) - O(log n)</li>
                                <li><strong>top:</strong> Access root - O(1)</li>
                                <li><strong>heapify:</strong> Build heap from array in O(n) - bottom-up sift down</li>
                            </ul>
                            
                            <h4>Manual Heap Implementation</h4>
                            <pre><code>class MaxHeap {
    std::vector<int> heap;
    
    void siftUp(int i) {
        while (i > 0) {
            int p = (i - 1) / 2;
            if (heap[p] >= heap[i]) break;
            std::swap(heap[p], heap[i]);
            i = p;
        }
    }
    
    void siftDown(int i) {
        int n = heap.size();
        while (true) {
            int l = 2*i + 1, r = 2*i + 2, largest = i;
            if (l < n && heap[l] > heap[largest]) largest = l;
            if (r < n && heap[r] > heap[largest]) largest = r;
            if (largest == i) break;
            std::swap(heap[i], heap[largest]);
            i = largest;
        }
    }
    
public:
    void push(int x) { heap.push_back(x); siftUp(heap.size() - 1); }
    void pop() { heap[0] = heap.back(); heap.pop_back(); if (!heap.empty()) siftDown(0); }
    int top() const { return heap[0]; }
    bool empty() const { return heap.empty(); }
    size_t size() const { return heap.size(); }
    
    // Build heap in O(n)
    static MaxHeap heapify(std::vector<int> arr) {
        MaxHeap h;
        h.heap = std::move(arr);
        for (int i = (h.heap.size() - 2) / 2; i >= 0; --i) h.siftDown(i);
        return h;
    }
};</code></pre>
                            
                            <h4>std::priority_queue</h4>
                            <pre><code>// Max-heap (default)
std::priority_queue<int> maxPq;
maxPq.push(5); maxPq.push(1); maxPq.push(3);
maxPq.top(); // 5
// Min-heap
std::priority_queue<int, std::vector<int>, std::greater<int>> minPq;
minPq.push(5); minPq.push(1); minPq.push(3);
minPq.top(); // 1
// Custom comparator for pairs (min-heap by first, then second)
using pii = std::pair<int, int>;
auto cmp = [](const pii& a, const pii& b) { 
    return a.first > b.first; // Min-heap by first
};
std::priority_queue<pii, std::vector<pii>, decltype(cmp)> pq(cmp);
</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Dijkstra\'s Algorithm with Priority Queue',
                                code: `// O((V+E) log V) with binary heap
vector<int> dijkstra(int n, vector<vector<pair<int,int>>>& adj, int src) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    dist[src] = 0;
    
    // Min-heap: (distance, node)
    using pii = pair<int, int>;
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.emplace(0, src);
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue; // Stale entry
        
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.emplace(dist[v], v);
            }
        }
    }
    return dist;
}
`
                            },
                            {
                                language: 'cpp',
                                title: 'K-th Largest Element and Merge K Sorted Lists',
                                code: `// K-th largest element - O(n log k) using min-heap of size k
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int x : nums) {
        minHeap.push(x);
        if (minHeap.size() > k) minHeap.pop();
    }
    return minHeap.top();
}
// Merge K Sorted Lists - O(N log k) where N = total elements
ListNode* mergeKLists(vector<ListNode*>& lists) {
    using pni = pair<int, ListNode*>;
    priority_queue<pni, vector<pni>, greater<pni>> pq;
    
    for (auto* node : lists) if (node) pq.emplace(node->val, node);
    
    ListNode dummy(0), *tail = &dummy;
    while (!pq.empty()) {
        auto [val, node] = pq.top(); pq.pop();
        tail->next = node;
        tail = tail->next;
        if (node->next) pq.emplace(node->next->val, node->next);
    }
    return dummy.next;
}
// Huffman Coding - Build optimal prefix codes
struct HuffmanNode {
    char ch;
    int freq;
    HuffmanNode *left, *right;
    HuffmanNode(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
};
struct Compare {
    bool operator()(HuffmanNode* a, HuffmanNode* b) { return a->freq > b->freq; }
};
HuffmanNode* buildHuffmanTree(const vector<pair<char,int>>& freq) {
    priority_queue<HuffmanNode*, vector<HuffmanNode*>, Compare> pq;
    for (auto [c, f] : freq) pq.push(new HuffmanNode(c, f));
    
    while (pq.size() > 1) {
        auto* left = pq.top(); pq.pop();
        auto* right = pq.top(); pq.pop();
        auto* merged = new HuffmanNode('\0', left->freq + right->freq);
        merged->left = left;
        merged->right = right;
        pq.push(merged);
    }
    return pq.top();
}
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement heapify (build heap from array) in O(n) time.',
                                code: `void heapify(vector<int>& arr) {
    // TODO: bottom-up sift down from last parent
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'pq-01-q1',
                                type: 'mcq',
                                question: 'What is the time complexity of building a heap from an unsorted array using heapify?',
                                options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n²)'],
                                correct: 1
                            },
                            {
                                id: 'pq-01-q2',
                                type: 'mcq',
                                question: 'In Dijkstra\'s algorithm with binary heap, why do we check `if (d > dist[u]) continue`?',
                                options: ['To skip visited nodes', 'To handle stale priority queue entries', 'To prevent infinite loop', 'To optimize memory'],
                                correct: 1
                            },
                            {
                                id: 'pq-01-q3',
                                type: 'true-false',
                                question: 'std::priority_queue supports decrease-key operation efficiently.',
                                correct: false,
                                explanation: 'std::priority_queue does not support decrease-key. Common workaround: insert new entry and ignore stale ones when popping.'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    
    'recursion': {
        id: 'recursion',
        title: 'Recursion and Backtracking',
        level: 1,
        order: 6,
        description: 'Recursive problem solving and backtracking algorithms',
        estimatedHours: 10,
        prerequisites: ['cpp-foundations', 'complexity'],
        modules: [
            {
                id: 'recursion-basics',
                title: 'Recursion Fundamentals',
                order: 1,
                lessons: [
                    {
                        id: 'rec-01',
                        title: 'Recursion Patterns and Memoization',
                        objectives: ['Identify base cases and recursive structure', 'Apply memoization for overlapping subproblems', 'Convert to tabulation (bottom-up DP)', 'Understand recursion tree and stack frames'],
                        content: `
                            <h3>Recursion Fundamentals</h3>
                            <p>Recursion solves problems by breaking them into smaller instances of the same problem. Every recursive function needs:</p>
                            <ol>
                                <li><strong>Base case(s):</strong> Termination condition(s) without recursion</li>
                                <li><strong>Recursive case:</strong> Call to self with smaller input</li>
                                <li><strong>Progress:</strong> Each call moves toward base case</li>
                            </ol>
                            
                            <h4>Common Recursion Patterns</h4>
                            
                            <h5>1. Linear Recursion</h5>
                            <pre><code>// Factorial: T(n) = T(n-1) + O(1)
int fact(int n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);
}
// Sum of array
int sum(int arr[], int n) {
    if (n == 0) return 0;
    return arr[n-1] + sum(arr, n-1);
}</code></pre>
                            
                            <h5>2. Tree Recursion (Multiple Recursive Calls)</h5>
                            <pre><code>// Fibonacci: T(n) = T(n-1) + T(n-2) + O(1) ≈ O(2ⁿ)
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}
// Subset generation
void subsets(vector<int>& nums, int i, vector<int>& curr, vector<vector<int>>& result) {
    if (i == nums.size()) { result.push_back(curr); return; }
    // Exclude
    subsets(nums, i+1, curr, result);
    // Include
    curr.push_back(nums[i]);
    subsets(nums, i+1, curr, result);
    curr.pop_back();
}</code></pre>
                            
                            <h5>3. Divide and Conquer</h5>
                            <pre><code>// Merge sort: T(n) = 2T(n/2) + O(n)
void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m+1, r);
    merge(arr, l, m, r);
}</code></pre>
                            
                            <h4>Recursion Tree Analysis</h4>
                            <p>Visualize recursive calls as a tree to understand time complexity:</p>
                            <pre><code>// fib(5) recursion tree:
                    fib(5)
                   /      \\
              fib(4)      fib(3)
             /     \\      /    \\
         fib(3)  fib(2) fib(2) fib(1)
        /    \\
    fib(2)  fib(1)
// Many repeated subproblems!
</code></pre>
                            
                            <h4>Memoization (Top-Down DP)</h4>
                            <p>Store results of subproblems to avoid recomputation:</p>
                            <pre><code>// Memoized Fibonacci: O(n) time, O(n) space
int fibMemo(int n, vector<int>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
}
// Generic memoization helper
template <typename T, typename... Args>
auto memoize(function<T(Args...)> f) {
    unordered_map<string, T> cache;
    return [=](Args... args) mutable {
        string key = to_string(args...); // Simplified
        if (cache.count(key)) return cache[key];
        return cache[key] = f(args...);
    };
}</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Recursion Examples - Tower of Hanoi, Permutations',
                                code: `// Tower of Hanoi - O(2ⁿ) moves
void hanoi(int n, char from, char to, char aux, vector<string>& moves) {
    if (n == 1) {
        moves.push_back("Move disk 1 from " + string(1, from) + " to " + string(1, to));
        return;
    }
    hanoi(n-1, from, aux, to, moves);
    moves.push_back("Move disk " + to_string(n) + " from " + string(1, from) + " to " + string(1, to));
    hanoi(n-1, aux, to, from, moves);
}
// Generate all permutations
void permute(vector<int>& nums, int start, vector<vector<int>>& result) {
    if (start == nums.size()) { result.push_back(nums); return; }
    for (int i = start; i < nums.size(); ++i) {
        swap(nums[start], nums[i]);
        permute(nums, start + 1, result);
        swap(nums[start], nums[i]); // backtrack
    }
}
// Generate parentheses combinations
void generateParen(int open, int close, string& curr, vector<string>& result) {
    if (open == 0 && close == 0) { result.push_back(curr); return; }
    if (open > 0) {
        curr.push_back('(');
        generateParen(open-1, close, curr, result);
        curr.pop_back();
    }
    if (close > open) {
        curr.push_back(')');
        generateParen(open, close-1, curr, result);
        curr.pop_back();
    }
}
`
                            },
                            {
                                language: 'cpp',
                                title: 'Memoization with unordered_map for Complex Keys',
                                code: `// Grid unique paths with obstacles - memoization
int uniquePathsWithObstacles(vector<vector<int>>& grid, int i, int j, 
                              unordered_map<long long, int>& memo) {
    int m = grid.size(), n = grid[0].size();
    if (i >= m || j >= n || grid[i][j] == 1) return 0;
    if (i == m-1 && j == n-1) return 1;
    
    long long key = ((long long)i << 32) | j;
    if (memo.count(key)) return memo[key];
    
    return memo[key] = uniquePathsWithObstacles(grid, i+1, j, memo) +
                        uniquePathsWithObstacles(grid, i, j+1, memo);
}
// Decode ways (LeetCode 91) - "226" -> "BBF", "BZ", "VF"
int numDecodings(string& s, int i, vector<int>& memo) {
    if (i == s.size()) return 1;
    if (s[i] == '0') return 0;
    if (memo[i] != -1) return memo[i];
    
    int ways = numDecodings(s, i+1, memo);
    if (i+1 < s.size() && (s[i] == '1' || (s[i] == '2' && s[i+1] <= '6'))) {
        ways += numDecodings(s, i+2, memo);
    }
    return memo[i] = ways;
}
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement recursive function to compute x^n in O(log n) time.',
                                code: `double fastPow(double x, long long n) {
    // TODO: use divide and conquer
}`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace the recursion tree for fib(4) with memoization.',
                                code: `// Show which calls are memoized vs computed`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'rec-01-q1',
                                type: 'mcq',
                                question: 'What is the time complexity of naive recursive Fibonacci?',
                                options: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(n log n)'],
                                correct: 2
                            },
                            {
                                id: 'rec-01-q2',
                                type: 'mcq',
                                question: 'What are the three requirements for a correct recursive function?',
                                options: ['Base case, recursive case, progress', 'Base case, loop, return', 'Parameters, return, base', 'Stack, heap, base'],
                                correct: 0
                            },
                            {
                                id: 'rec-01-q3',
                                type: 'true-false',
                                question: 'Memoization changes the time complexity of recursive Fibonacci from O(2ⁿ) to O(n).',
                                correct: true,
                                explanation: 'Each subproblem fib(i) is computed only once, stored, and reused.'
                            }
                        ]
                    },
                    {
                        id: 'rec-02',
                        title: 'Tail Recursion and Optimization',
                        objectives: ['Identify tail-recursive functions', 'Understand tail call optimization (TCO)', 'Convert recursive to iterative'],
                        content: `
                            <h3>Tail Recursion</h3>
                            <p>A function is <strong>tail-recursive</strong> if the recursive call is the last operation. The current stack frame can be reused.</p>
                            
                            <h4>Non-Tail vs Tail Recursive</h4>
                            <pre><code>// Non-tail: multiplication happens AFTER recursive call returns
int fact(int n) {
    if (n <= 1) return 1;
    return n * fact(n - 1); // Not tail - must multiply after return
}
// Tail-recursive: accumulator carries result
int factTail(int n, int acc = 1) {
    if (n <= 1) return acc;
    return factTail(n - 1, n * acc); // Tail call - nothing after
}</code></pre>
                            
                            <h4>Tail Call Optimization (TCO)</h4>
                            <p>Compiler reuses the same stack frame for tail calls, preventing stack overflow:</p>
                            <pre><code>// With TCO (GCC -O2, Clang -O2), this runs in O(1) space
int factTail(int n, int acc = 1) {
    if (n <= 1) return acc;
    return factTail(n - 1, n * acc);
}
// Without TCO: O(n) stack space, may overflow for large n
// C++ standard does not guarantee TCO, but most compilers optimize it
</code></pre>
                            
                            <h4>Converting to Iterative</h4>
                            <pre><code>// Iterative version (always O(1) space)
int factIter(int n) {
    int result = 1;
    for (int i = 2; i <= n; ++i) result *= i;
    return result;
}
// Converting general tail recursion to loop:
/*
TailRecursive(params, acc):
    if baseCase: return acc
    newAcc = combine(acc, params)
    newParams = reduce(params)
    return TailRecursive(newParams, newAcc)
=>
Iterative(params):
    acc = initialAcc
    while !baseCase(params):
        acc = combine(acc, params)
        params = reduce(params)
    return acc
*/
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Tail Recursion Examples',
                                code: `// Sum array - tail recursive
int sumTail(const vector<int>& arr, int i, int acc) {
    if (i == arr.size()) return acc;
    return sumTail(arr, i + 1, acc + arr[i]);
}
// Reverse string - tail recursive
void reverseTail(string& s, int l, int r) {
    if (l >= r) return;
    swap(s[l], s[r]);
    reverseTail(s, l+1, r-1); // Tail call
}
// Fibonacci - tail recursive (needs two accumulators)
int fibTail(int n, int a = 0, int b = 1) {
    if (n == 0) return a;
    if (n == 1) return b;
    return fibTail(n - 1, b, a + b);
}
// Binary search - tail recursive
int binarySearch(const vector<int>& arr, int target, int l, int r) {
    if (l > r) return -1;
    int m = l + (r - l) / 2;
    if (arr[m] == target) return m;
    if (arr[m] < target) return binarySearch(arr, target, m + 1, r);
    return binarySearch(arr, target, l, m - 1);
}
`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'rec-02-q1',
                                type: 'mcq',
                                question: 'Which of these is tail-recursive?',
                                options: [
                                    'return n * fact(n-1);',
                                    'return fact(n-1, n*acc);',
                                    'return fact(n-1) + fact(n-2);',
                                    'return n + sum(n-1);'
                                ],
                                correct: 1
                            },
                            {
                                id: 'rec-02-q2',
                                type: 'true-false',
                                question: 'C++ standard guarantees tail call optimization.',
                                correct: false,
                                explanation: 'TCO is not guaranteed by the C++ standard, but GCC/Clang/MSVC optimize it at -O2/-O3.'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'backtracking',
                title: 'Backtracking Algorithms',
                order: 2,
                lessons: [
                    {
                        id: 'bt-01',
                        title: 'Backtracking Fundamentals',
                        objectives: ['Understand backtracking template', 'Apply to N-Queens, Sudoku, subset/permutation generation', 'Use pruning to optimize search space'],
                        content: `
                            <h3>Backtracking</h3>
                            <p>Backtracking is a systematic way to explore all possible configurations by building candidates incrementally and abandoning ("backtracking") when a candidate cannot lead to a valid solution.</p>
                            
                            <h4>General Template</h4>
                            <pre><code>void backtrack(State& state, Params params) {
    if (isSolution(state, params)) {
        addSolution(state);
        return;
    }
    
    for (Choice choice : getChoices(state, params)) {
        if (isValid(choice, state, params)) {
            makeChoice(state, choice);      // Do
            backtrack(state, params);       // Recurse
            undoChoice(state, choice);      // Undo (backtrack)
        }
    }
}</code></pre>
                            
                            <h4>Key Components</h4>
                            <ul>
                                <li><strong>State:</strong> Current partial solution</li>
                                <li><strong>Choices:</strong> Possible next steps</li>
                                <li><strong>Constraints:</strong> Validity check (pruning)</li>
                                <li><strong>Goal:</strong> Complete solution criteria</li>
                            </ul>
                            
                            <h4>Pruning Strategies</h4>
                            <ul>
                                <li><strong>Constraint propagation:</strong> Eliminate impossible choices early</li>
                                <li><strong>Symmetry breaking:</strong> Avoid exploring equivalent states</li>
                                <li><strong>Heuristic ordering:</strong> Try most promising choices first</li>
                                <li><strong>Forward checking:</strong> Check future implications</li>
                            </ul>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'N-Queens Problem',
                                code: `// LeetCode 51: N-Queens
// Place n queens on n×n board so no two attack each other
class NQueens {
    int n;
    vector<string> board;
    vector<vector<string>> solutions;
    vector<bool> cols, diag1, diag2; // diag1: row+col, diag2: row-col+n-1
    
public:
    vector<vector<string>> solveNQueens(int n) {
        this->n = n;
        board = vector<string>(n, string(n, '.'));
        cols.assign(n, false);
        diag1.assign(2*n-1, false);
        diag2.assign(2*n-1, false);
        backtrack(0);
        return solutions;
    }
    
    void backtrack(int row) {
        if (row == n) {
            solutions.push_back(board);
            return;
        }
        for (int col = 0; col < n; ++col) {
            int d1 = row + col;
            int d2 = row - col + n - 1;
            if (!cols[col] && !diag1[d1] && !diag2[d2]) {
                board[row][col] = 'Q';
                cols[col] = diag1[d1] = diag2[d2] = true;
                backtrack(row + 1);
                board[row][col] = '.';
                cols[col] = diag1[d1] = diag2[d2] = false;
            }
        }
    }
};
`
                            },
                            {
                                language: 'cpp',
                                title: 'Sudoku Solver',
                                code: `// LeetCode 37: Sudoku Solver
// Fill 9×9 grid following Sudoku rules
class SudokuSolver {
    bool rows[9][10] = {}, cols[9][10] = {}, boxes[9][10] = {};
    // rows[r][d] = digit d used in row r
    // boxes[(r/3)*3 + c/3][d] = digit d used in 3x3 box
    
public:
    void solveSudoku(vector<vector<char>>& board) {
        // Initialize constraints
        for (int r = 0; r < 9; ++r)
            for (int c = 0; c < 9; ++c)
                if (board[r][c] != '.') {
                    int d = board[r][c] - '0';
                    rows[r][d] = cols[c][d] = boxes[(r/3)*3 + c/3][d] = true;
                }
        backtrack(board, 0, 0);
    }
    
    bool backtrack(vector<vector<char>>& board, int r, int c) {
        if (r == 9) return true; // Solved
        if (c == 9) return backtrack(board, r+1, 0);
        if (board[r][c] != '.') return backtrack(board, r, c+1);
        
        int b = (r/3)*3 + c/3;
        for (int d = 1; d <= 9; ++d) {
            if (!rows[r][d] && !cols[c][d] && !boxes[b][d]) {
                board[r][c] = '0' + d;
                rows[r][d] = cols[c][d] = boxes[b][d] = true;
                if (backtrack(board, r, c+1)) return true;
                board[r][c] = '.';
                rows[r][d] = cols[c][d] = boxes[b][d] = false;
            }
        }
        return false; // Trigger backtrack
    }
};
`
                            },
                            {
                                language: 'cpp',
                                title: 'Combination Sum and Subsets with Duplicates',
                                code: `// LeetCode 39: Combination Sum (unlimited uses)
void combinationSum(vector<int>& candidates, int target, int start,
                    vector<int>& curr, vector<vector<int>>& result) {
    if (target == 0) { result.push_back(curr); return; }
    if (target < 0) return;
    
    for (int i = start; i < candidates.size(); ++i) {
        curr.push_back(candidates[i]);
        combinationSum(candidates, target - candidates[i], i, curr, result); // i not i+1 (reuse)
        curr.pop_back();
    }
}
// LeetCode 40: Combination Sum II (each candidate used once)
void combinationSum2(vector<int>& candidates, int target, int start,
                     vector<int>& curr, vector<vector<int>>& result) {
    if (target == 0) { result.push_back(curr); return; }
    if (target < 0) return;
    
    for (int i = start; i < candidates.size(); ++i) {
        if (i > start && candidates[i] == candidates[i-1]) continue; // Skip duplicates
        curr.push_back(candidates[i]);
        combinationSum2(candidates, target - candidates[i], i+1, curr, result);
        curr.pop_back();
    }
}
// LeetCode 90: Subsets II (with duplicates)
void subsetsWithDup(vector<int>& nums, int start, vector<int>& curr,
                    vector<vector<int>>& result) {
    result.push_back(curr);
    for (int i = start; i < nums.size(); ++i) {
        if (i > start && nums[i] == nums[i-1]) continue;
        curr.push_back(nums[i]);
        subsetsWithDup(nums, i+1, curr, result);
        curr.pop_back();
    }
}
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement backtracking for generating all valid parentheses combinations of n pairs.',
                                code: `void generateParen(int n, int open, int close, string& curr, vector<string>& result) {
    // TODO
}`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace N-Queens for n=4: show first solution found.',
                                code: `// Board states during backtracking`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'bt-01-q1',
                                type: 'mcq',
                                question: 'What is the key difference between backtracking and brute force?',
                                options: ['Backtracking uses recursion', 'Backtracking prunes invalid paths early', 'Backtracking is faster', 'Backtracking uses less memory'],
                                correct: 1
                            },
                            {
                                id: 'bt-01-q2',
                                type: 'mcq',
                                question: 'In N-Queens, what do diag1 and diag2 arrays track?',
                                options: ['Row and column', 'Main diagonal and anti-diagonal', 'Queens placed', 'Available positions'],
                                correct: 1
                            }
                        ]
                    }
                ]
            }
        ]
    },
    
    'trees': {
        id: 'trees',
        title: 'Trees',
        level: 2,
        order: 7,
        description: 'Binary trees, BSTs, heaps, and tree traversal algorithms',
        estimatedHours: 12,
        prerequisites: ['linked-lists', 'recursion'],
        modules: [
            {
                id: 'tree-basics',
                title: 'Binary Tree Fundamentals',
                order: 1,
                lessons: [
                    {
                        id: 'tree-01',
                        title: 'Tree Terminology and Representation',
                        objectives: ['Define tree terminology', 'Represent trees in C++', 'Implement traversals (pre/in/post-order)', 'Understand tree properties and types'],
                        content: `
                            <h3>Binary Tree Basics</h3>
                            <p>A <strong>tree</strong> is a hierarchical data structure with nodes connected by edges. A <strong>binary tree</strong> restricts each node to at most two children (left and right).</p>
                            
                            <h4>Terminology</h4>
                            <ul>
                                <li><strong>Root:</strong> Topmost node</li>
                                <li><strong>Parent/Child:</strong> Direct connection</li>
                                <li><strong>Leaf:</strong> Node with no children</li>
                                <li><strong>Subtree:</strong> Node + all descendants</li>
                                <li><strong>Depth:</strong> Distance from root (root depth = 0)</li>
                                <li><strong>Height:</strong> Longest path to leaf (leaf height = 0)</li>
                                <li><strong>Level:</strong> Nodes at same depth</li>
                                <li><strong>Complete tree:</strong> All levels full except last, filled left to right</li>
                                <li><strong>Perfect tree:</strong> All levels completely full</li>
                                <li><strong>Balanced tree:</strong> Height difference ≤ 1 for all nodes</li>
                            </ul>
                            
                            <h4>Node Representation</h4>
                            <pre><code>struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
// With smart pointers (recommended)
struct TreeNode {
    int val;
    std::unique_ptr<TreeNode> left, right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};</code></pre>
                            
                            <h4>Tree Traversals</h4>
                            <p>Three depth-first traversals (recursive):</p>
                            <pre><code>// Preorder: Root → Left → Right
void preorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    result.push_back(root->val);
    preorder(root->left.get(), result);
    preorder(root->right.get(), result);
}
// Inorder: Left → Root → Right (BST gives sorted order)
void inorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    inorder(root->left.get(), result);
    result.push_back(root->val);
    inorder(root->right.get(), result);
}
// Postorder: Left → Right → Root
void postorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    postorder(root->left.get(), result);
    postorder(root->right.get(), result);
    result.push_back(root->val);
}
// Level-order (BFS): Level by level
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;
        for (int i = 0; i < sz; ++i) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left.get());
            if (node->right) q.push(node->right.get());
        }
        result.push_back(level);
    }
    return result;
}</code></pre>
                            
                            <h4>Iterative Traversals</h4>
                            <pre><code>// Iterative preorder (explicit stack)
vector<int> preorderIter(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    stack<TreeNode*> st;
    st.push(root);
    while (!st.empty()) {
        TreeNode* node = st.top(); st.pop();
        result.push_back(node->val);
        if (node->right) st.push(node->right.get()); // Right first (stack is LIFO)
        if (node->left) st.push(node->left.get());
    }
    return result;
}
// Iterative inorder
vector<int> inorderIter(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> st;
    TreeNode* curr = root;
    while (curr || !st.empty()) {
        while (curr) { st.push(curr); curr = curr->left.get(); }
        curr = st.top(); st.pop();
        result.push_back(curr->val);
        curr = curr->right.get();
    }
    return result;
}
// Morris Traversal - O(1) space!
vector<int> morrisInorder(TreeNode* root) {
    vector<int> result;
    TreeNode* curr = root;
    while (curr) {
        if (!curr->left) {
            result.push_back(curr->val);
            curr = curr->right.get();
        } else {
            TreeNode* pred = curr->left.get();
            while (pred->right && pred->right.get() != curr) pred = pred->right.get();
            if (!pred->right) {
                pred->right.reset(curr); // Thread
                curr = curr->left.get();
            } else {
                pred->right.reset(nullptr); // Remove thread
                result.push_back(curr->val);
                curr = curr->right.get();
            }
        }
    }
    return result;
}
</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Tree Construction from Traversals',
                                code: `// Build tree from preorder + inorder
// Preorder: [root, left..., right...]
// Inorder: [left..., root, right...]
TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    unordered_map<int, int> inMap;
    for (int i = 0; i < inorder.size(); ++i) inMap[inorder[i]] = i;
    return build(preorder, 0, preorder.size()-1, inorder, 0, inorder.size()-1, inMap);
}
TreeNode* build(vector<int>& pre, int preL, int preR,
                vector<int>& in, int inL, int inR,
                unordered_map<int,int>& inMap) {
    if (preL > preR) return nullptr;
    int rootVal = pre[preL];
    TreeNode* root = new TreeNode(rootVal);
    int inRoot = inMap[rootVal];
    int leftSize = inRoot - inL;
    
    root->left = build(pre, preL+1, preL+leftSize, in, inL, inRoot-1, inMap);
    root->right = build(pre, preL+leftSize+1, preR, in, inRoot+1, inR, inMap);
    return root;
}
// Build from postorder + inorder
// Postorder: [left..., right..., root]
TreeNode* buildFromPostIn(vector<int>& post, vector<int>& in) {
    unordered_map<int, int> inMap;
    for (int i = 0; i < in.size(); ++i) inMap[in[i]] = i;
    return buildPost(post, 0, post.size()-1, in, 0, in.size()-1, inMap);
}
`
                            },
                            {
                                language: 'cpp',
                                title: 'Tree Properties and Path Problems',
                                code: `// Diameter of binary tree (longest path between any two nodes)
int diameter(TreeNode* root) {
    int maxDia = 0;
    function<int(TreeNode*)> depth = [&](TreeNode* node) {
        if (!node) return 0;
        int L = depth(node->left.get());
        int R = depth(node->right.get());
        maxDia = max(maxDia, L + R);
        return 1 + max(L, R);
    };
    depth(root);
    return maxDia;
}
// Maximum path sum (path can start/end anywhere)
int maxPathSum(TreeNode* root) {
    int maxSum = INT_MIN;
    function<int(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return 0;
        int left = max(0, dfs(node->left.get()));
        int right = max(0, dfs(node->right.get()));
        maxSum = max(maxSum, left + right + node->val);
        return node->val + max(left, right);
    };
    dfs(root);
    return maxSum;
}
// Path sum equals target (root-to-leaf)
bool hasPathSum(TreeNode* root, int target) {
    if (!root) return false;
    if (!root->left && !root->right) return root->val == target;
    return hasPathSum(root->left.get(), target - root->val) ||
           hasPathSum(root->right.get(), target - root->val);
}
// All root-to-leaf paths
vector<string> binaryTreePaths(TreeNode* root) {
    vector<string> result;
    string path;
    function<void(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return;
        string curr = to_string(node->val);
        if (!path.empty()) path += "->";
        path += curr;
        if (!node->left && !node->right) result.push_back(path);
        else { dfs(node->left.get()); dfs(node->right.get()); }
        // Backtrack path string
        if (!path.empty() && path.size() >= curr.size()) {
            if (path.size() > curr.size()) path.resize(path.size() - curr.size() - 2);
            else path.clear();
        }
    };
    dfs(root);
    return result;
}
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement iterative postorder traversal using one stack.',
                                code: `vector<int> postorderIter(TreeNode* root) {
    // TODO: use stack with visited flag or two stacks
}`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace Morris inorder traversal for tree: 1->2->3 (1 root, 2 left, 3 right)',
                                code: `// Show thread creation and removal`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'tree-01-q1',
                                type: 'mcq',
                                question: 'Which traversal gives sorted order for a BST?',
                                options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
                                correct: 1
                            },
                            {
                                id: 'tree-01-q2',
                                type: 'mcq',
                                question: 'What is the space complexity of Morris inorder traversal?',
                                options: ['O(n)', 'O(log n)', 'O(1)', 'O(h)'],
                                correct: 2
                            },
                            {
                                id: 'tree-01-q3',
                                type: 'true-false',
                                question: 'A complete binary tree of height h has exactly 2^(h+1) - 1 nodes.',
                                correct: false,
                                explanation: 'That is a perfect binary tree. Complete tree has between 2^h and 2^(h+1)-1 nodes.'
                            }
                        ]
                    },
                    {
                        id: 'tree-02',
                        title: 'Binary Search Tree (BST) Operations',
                        objectives: ['Implement BST insert, delete, search', 'Understand BST properties and invariants', 'Find predecessor, successor, LCA', 'Validate BST'],
                        content: `
                            <h3>Binary Search Tree</h3>
                            <p>A <strong>BST</strong> is a binary tree where for each node: all left descendants < node < all right descendants.</p>
                            
                            <h4>Operations</h4>
                            <pre><code>// Search - O(h)
TreeNode* search(TreeNode* root, int val) {
    while (root && root->val != val) {
        root = (val < root->val) ? root->left.get() : root->right.get();
    }
    return root;
}
// Insert - O(h)
TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left.reset(insert(root->left.get(), val));
    else if (val > root->val) root->right.reset(insert(root->right.get(), val));
    return root;
}
// Delete - O(h) - Three cases
TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    if (key < root->val) root->left.reset(deleteNode(root->left.get(), key));
    else if (key > root->val) root->right.reset(deleteNode(root->right.get(), key));
    else { // Found node to delete
        if (!root->left) return root->right.release();
        if (!root->right) return root->left.release();
        // Two children: replace with inorder successor (min in right subtree)
        TreeNode* succ = root->right.get();
        while (succ->left) succ = succ->left.get();
        root->val = succ->val;
        root->right.reset(deleteNode(root->right.get(), succ->val));
    }
    return root;
}</code></pre>
                            
                            <h4>BST Queries</h4>
                            <pre><code>// Find minimum/maximum
TreeNode* findMin(TreeNode* root) {
    while (root && root->left) root = root->left.get();
    return root;
}
// Predecessor (largest value < key)
TreeNode* predecessor(TreeNode* root, int key) {
    TreeNode* pred = nullptr;
    while (root) {
        if (root->val < key) { pred = root; root = root->right.get(); }
        else root = root->left.get();
    }
    return pred;
}
// Successor (smallest value > key)
TreeNode* successor(TreeNode* root, int key) {
    TreeNode* succ = nullptr;
    while (root) {
        if (root->val > key) { succ = root; root = root->left.get(); }
        else root = root->right.get();
    }
    return succ;
}
// Lowest Common Ancestor in BST
TreeNode* lcaBST(TreeNode* root, TreeNode* p, TreeNode* q) {
    while (root) {
        if (p->val < root->val && q->val < root->val) root = root->left.get();
        else if (p->val > root->val && q->val > root->val) root = root->right.get();
        else return root; // Split point
    }
    return nullptr;
}
// Validate BST (check bounds)
bool isValidBST(TreeNode* root, long minVal = LONG_MIN, long maxVal = LONG_MAX) {
    if (!root) return true;
    if (root->val <= minVal || root->val >= maxVal) return false;
    return isValidBST(root->left.get(), minVal, root->val) &&
           isValidBST(root->right.get(), root->val, maxVal);
}
</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'BST Iterator and Range Operations',
                                code: `// BST Iterator (LeetCode 173) - O(1) amortized next()
class BSTIterator {
    stack<TreeNode*> st;
    void pushLeft(TreeNode* node) {
        while (node) { st.push(node); node = node->left.get(); }
    }
public:
    BSTIterator(TreeNode* root) { pushLeft(root); }
    int next() {
        TreeNode* node = st.top(); st.pop();
        pushLeft(node->right.get());
        return node->val;
    }
    bool hasNext() { return !st.empty(); }
};
// Range sum query in BST
int rangeSumBST(TreeNode* root, int low, int high) {
    if (!root) return 0;
    if (root->val < low) return rangeSumBST(root->right.get(), low, high);
    if (root->val > high) return rangeSumBST(root->left.get(), low, high);
    return root->val + rangeSumBST(root->left.get(), low, high) + 
                   rangeSumBST(root->right.get(), low, high);
}
// Convert BST to sorted DLL (in-place)
TreeNode* prev = nullptr, *head = nullptr;
void bstToDll(TreeNode* root) {
    if (!root) return;
    bstToDll(root->left.get());
    if (!prev) head = root;
    else { prev->right.reset(root); root->left.reset(prev); }
    prev = root;
    bstToDll(root->right.get());
}
// Floor and Ceil in BST
int floor(TreeNode* root, int key) {
    int res = -1;
    while (root) {
        if (root->val == key) return key;
        if (root->val < key) { res = root->val; root = root->right.get(); }
        else root = root->left.get();
    }
    return res;
}
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement function to find k-th smallest element in BST.',
                                code: `int kthSmallest(TreeNode* root, int k) {
    // TODO: inorder traversal with counter
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'tree-02-q1',
                                type: 'mcq',
                                question: 'When deleting a node with two children in BST, what replaces it?',
                                options: ['Inorder predecessor', 'Inorder successor', 'Either works', 'Parent node'],
                                correct: 1
                            },
                            {
                                id: 'tree-02-q2',
                                type: 'true-false',
                                question: 'BST insert/search/delete are always O(log n).',
                                correct: false,
                                explanation: 'Only if tree is balanced. Worst case (skewed tree) is O(n).'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'tree-advanced',
                title: 'Advanced Tree Structures',
                order: 2,
                lessons: [
                    {
                        id: 'tree-03',
                        title: 'AVL Trees and Self-Balancing',
                        objectives: ['Understand balance factor and rotations', 'Implement AVL insert/delete with rebalancing', 'Compare AVL, Red-Black, and other balanced trees'],
                        content: `
                            <h3>AVL Trees</h3>
                            <p>An <strong>AVL tree</strong> is a self-balancing BST where heights of left and right subtrees of every node differ by at most 1.</p>
                            
                            <h4>Balance Factor</h4>
                            <pre><code>balanceFactor(node) = height(node->left) - height(node->right)
// Must be -1, 0, or 1</code></pre>
                            
                            <h4>Four Rotation Cases</h4>
                            <ol>
                                <li><strong>LL (Left-Left):</strong> Right rotation</li>
                                <li><strong>RR (Right-Right):</strong> Left rotation</li>
                                <li><strong>LR (Left-Right):</strong> Left rotation on left child, then right rotation</li>
                                <li><strong>RL (Right-Left):</strong> Right rotation on right child, then left rotation</li>
                            </ol>
                            
                            <pre><code>struct AVLNode {
    int val, height;
    AVLNode *left, *right;
    AVLNode(int v) : val(v), height(1), left(nullptr), right(nullptr) {}
};
int height(AVLNode* n) { return n ? n->height : 0; }
int getBalance(AVLNode* n) { return n ? height(n->left) - height(n->right) : 0; }
void updateHeight(AVLNode* n) { 
    n->height = 1 + max(height(n->left), height(n->right)); 
}
AVLNode* rightRotate(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;
    x->right = y;
    y->left = T2;
    updateHeight(y); updateHeight(x);
    return x;
}
AVLNode* leftRotate(AVLNode* x) {
    AVLNode* y = x->right;
    AVLNode* T2 = y->left;
    y->left = x;
    x->right = T2;
    updateHeight(x); updateHeight(y);
    return y;
}
AVLNode* insert(AVLNode* node, int key) {
    if (!node) return new AVLNode(key);
    if (key < node->val) node->left = insert(node->left, key);
    else if (key > node->val) node->right = insert(node->right, key);
    else return node; // No duplicates
    
    updateHeight(node);
    int balance = getBalance(node);
    
    // LL
    if (balance > 1 && key < node->left->val) return rightRotate(node);
    // RR
    if (balance < -1 && key > node->right->val) return leftRotate(node);
    // LR
    if (balance > 1 && key > node->left->val) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    // RL
    if (balance < -1 && key < node->right->val) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    return node;
}
</code></pre>
                            
                            <h4>Comparison of Balanced Trees</h4>
                            <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                                <tr style="background:#f8f9fa;">
                                    <th style="padding:8px;border:1px solid #ddd;">Tree</th>
                                    <th style="padding:8px;border:1px solid #ddd;">Insert/Delete</th>
                                    <th style="padding:8px;border:1px solid #ddd;">Search</th>
                                    <th style="padding:8px;border:1px solid #ddd;">Notes</th>
                                </tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">AVL</td><td style="padding:8px;border:1px solid #ddd;">O(log n)</td><td style="padding:8px;border:1px solid #ddd;">O(log n)</td><td style="padding:8px;border:1px solid #ddd;">Strictly balanced, more rotations</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Red-Black</td><td style="padding:8px;border:1px solid #ddd;">O(log n)</td><td style="padding:8px:border:1px solid #ddd;">O(log n)</td><td style="padding:8px;border:1px solid #ddd;">std::map/set, fewer rotations</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Splay</td><td style="padding:8px;border:1px solid #ddd;">Amortized O(log n)</td><td style="padding:8px;border:1px solid #ddd;">Amortized O(log n)</td><td style="padding:8px;border:1px solid #ddd;">Recent accesses fast</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Treap</td><td style="padding:8px;border:1px solid #ddd;">Expected O(log n)</td><td style="padding:8px;border:1px solid #ddd;">Expected O(log n)</td><td style="padding:8px;border:1px solid #ddd;">BST + heap (random priorities)</td></tr>
                            </table>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Treap (Randomized BST)',
                                code: `// Treap: BST by key, Heap by priority (random)
struct TreapNode {
    int key, priority;
    TreapNode *left, *right;
    TreapNode(int k) : key(k), priority(rand()), left(nullptr), right(nullptr) {}
};
void split(TreapNode* root, int key, TreapNode*& left, TreapNode*& right) {
    if (!root) { left = right = nullptr; return; }
    if (root->key <= key) {
        split(root->right, key, root->right, right);
        left = root;
    } else {
        split(root->left, key, left, root->left);
        right = root;
    }
}
TreapNode* merge(TreapNode* left, TreapNode* right) {
    if (!left || !right) return left ? left : right;
    if (left->priority > right->priority) {
        left->right = merge(left->right, right);
        return left;
    } else {
        right->left = merge(left, right->left);
        return right;
    }
}
TreapNode* insert(TreapNode* root, TreapNode* item) {
    if (!root) return item;
    if (item->priority > root->priority) {
        split(root, item->key, item->left, item->right);
        return item;
    } else if (item->key < root->key) {
        root->left = insert(root->left, item);
    } else {
        root->right = insert(root->right, item);
    }
    return root;
}
`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'tree-03-q1',
                                type: 'mcq',
                                question: 'What is the maximum height of an AVL tree with n nodes?',
                                options: ['O(n)', 'O(log n)', 'O(√n)', '1.44*log₂(n+2)'],
                                correct: 3
                            },
                            {
                                id: 'tree-03-q2',
                                type: 'mcq',
                                question: 'Which balanced tree is used in std::map/std::set?',
                                options: ['AVL', 'Red-Black', 'Splay', 'Treap'],
                                correct: 1
                            }
                        ]
                    },
                    {
                        id: 'tree-04',
                        title: 'Segment Tree and Fenwick Tree',
                        objectives: ['Build segment tree for range queries', 'Implement point/range updates', 'Use Fenwick tree for prefix sums', 'Apply to range min/max/sum queries'],
                        content: `
                            <h3>Segment Tree</h3>
                            <p>A <strong>segment tree</strong> is a binary tree for efficient range queries and updates on arrays. Each node represents a segment [l, r].</p>
                            
                            <h4>Operations</h4>
                            <ul>
                                <li><strong>Build:</strong> O(n)</li>
                                <li><strong>Point update:</strong> O(log n)</li>
                                <li><strong>Range query:</strong> O(log n)</li>
                                <li><strong>Range update (lazy):</strong> O(log n)</li>
                            </ul>
                            
                            <h4>Structure</h4>
                            <pre><code>// For array of size n, segment tree needs 4n space
class SegmentTree {
    int n;
    vector<int> tree, lazy;
    bool hasLazy;
    
    SegmentTree(const vector<int>& arr) {
        n = arr.size();
        tree.assign(4*n, 0);
        if (hasLazy) lazy.assign(4*n, 0);
        build(arr, 1, 0, n-1);
    }
    
    void build(const vector<int>& arr, int node, int l, int r) {
        if (l == r) { tree[node] = arr[l]; return; }
        int mid = (l + r) / 2;
        build(arr, 2*node, l, mid);
        build(arr, 2*node+1, mid+1, r);
        tree[node] = tree[2*node] + tree[2*node+1]; // Or min/max
    }
    
    // Point update
    void update(int idx, int val) { update(1, 0, n-1, idx, val); }
    void update(int node, int l, int r, int idx, int val) {
        if (l == r) { tree[node] = val; return; }
        int mid = (l + r) / 2;
        if (idx <= mid) update(2*node, l, mid, idx, val);
        else update(2*node+1, mid+1, r, idx, val);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
    
    // Range query
    int query(int ql, int qr) { return query(1, 0, n-1, ql, qr); }
    int query(int node, int l, int r, int ql, int qr) {
        if (ql > r || qr < l) return 0; // Identity for sum
        if (ql <= l && r <= qr) return tree[node];
        int mid = (l + r) / 2;
        return query(2*node, l, mid, ql, qr) + query(2*node+1, mid+1, r, ql, qr);
    }
    
    // Lazy propagation for range updates
    void push(int node, int l, int r) {
        if (lazy[node] != 0) {
            tree[node] += (r - l + 1) * lazy[node];
            if (l != r) {
                lazy[2*node] += lazy[node];
                lazy[2*node+1] += lazy[node];
            }
            lazy[node] = 0;
        }
    }
    
    void rangeUpdate(int ql, int qr, int val) { rangeUpdate(1, 0, n-1, ql, qr, val); }
    void rangeUpdate(int node, int l, int r, int ql, int qr, int val) {
        push(node, l, r);
        if (ql > r || qr < l) return;
        if (ql <= l && r <= qr) {
            lazy[node] += val;
            push(node, l, r);
            return;
        }
        int mid = (l + r) / 2;
        rangeUpdate(2*node, l, mid, ql, qr, val);
        rangeUpdate(2*node+1, mid+1, r, ql, qr, val);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
};</code></pre>
                            
                            <h4>Fenwick Tree (Binary Indexed Tree)</h4>
                            <p>Simpler alternative for prefix sums. O(log n) for both update and query. Uses less memory.</p>
                            <pre><code>class FenwickTree {
    int n;
    vector<int> bit; // 1-indexed
    
public:
    FenwickTree(int n) : n(n), bit(n+1, 0) {}
    FenwickTree(const vector<int>& arr) : n(arr.size()), bit(n+1, 0) {
        for (int i = 0; i < n; ++i) add(i, arr[i]);
    }
    
    // Add val at index idx (0-indexed)
    void add(int idx, int val) {
        for (++idx; idx <= n; idx += idx & -idx) bit[idx] += val;
    }
    
    // Prefix sum [0, idx]
    int sum(int idx) {
        int res = 0;
        for (++idx; idx > 0; idx -= idx & -idx) res += bit[idx];
        return res;
    }
    
    // Range sum [l, r]
    int rangeSum(int l, int r) { return sum(r) - (l ? sum(l-1) : 0); }
    
    // Find smallest idx such that prefix sum >= target (lower bound)
    int lowerBound(int target) {
        int idx = 0, mask = 1;
        while (mask <= n) mask <<= 1;
        for (mask >>= 1; mask; mask >>= 1) {
            int next = idx + mask;
            if (next <= n && bit[next] < target) {
                idx = next;
                target -= bit[idx];
            }
        }
        return idx; // 0-indexed
    }
};</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Segment Tree with Lazy Propagation - Range Add, Range Min',
                                code: `struct SegTree {
    int n;
    vector<int> mn, lazy;
    
    SegTree(int n) : n(n), mn(4*n, 0), lazy(4*n, 0) {}
    SegTree(const vector<int>& a) : n(a.size()), mn(4*n), lazy(4*n) {
        build(a, 1, 0, n-1);
    }
    
    void build(const vector<int>& a, int p, int l, int r) {
        if (l == r) { mn[p] = a[l]; return; }
        int m = (l + r) >> 1;
        build(a, p<<1, l, m);
        build(a, p<<1|1, m+1, r);
        mn[p] = min(mn[p<<1], mn[p<<1|1]);
    }
    
    void push(int p) {
        if (lazy[p]) {
            mn[p<<1] += lazy[p]; lazy[p<<1] += lazy[p];
            mn[p<<1|1] += lazy[p]; lazy[p<<1|1] += lazy[p];
            lazy[p] = 0;
        }
    }
    
    void rangeAdd(int L, int R, int val) { rangeAdd(1, 0, n-1, L, R, val); }
    void rangeAdd(int p, int l, int r, int L, int R, int val) {
        if (L <= l && r <= R) { mn[p] += val; lazy[p] += val; return; }
        push(p);
        int m = (l + r) >> 1;
        if (L <= m) rangeAdd(p<<1, l, m, L, R, val);
        if (R > m) rangeAdd(p<<1|1, m+1, r, L, R, val);
        mn[p] = min(mn[p<<1], mn[p<<1|1]);
    }
    
    int rangeMin(int L, int R) { return rangeMin(1, 0, n-1, L, R); }
    int rangeMin(int p, int l, int r, int L, int R) {
        if (L <= l && r <= R) return mn[p];
        push(p);
        int m = (l + r) >> 1;
        int res = INT_MAX;
        if (L <= m) res = min(res, rangeMin(p<<1, l, m, L, R));
        if (R > m) res = min(res, rangeMin(p<<1|1, m+1, r, L, R));
        return res;
    }
};
`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'tree-04-q1',
                                type: 'mcq',
                                question: 'What is the space complexity of a segment tree for array of size n?',
                                options: ['O(n)', 'O(n log n)', 'O(4n)', 'O(n²)'],
                                correct: 2
                            },
                            {
                                id: 'tree-04-q2',
                                type: 'mcq',
                                question: 'Fenwick tree supports which operations efficiently?',
                                options: ['Range sum, point update', 'Range min, range update', 'Range add, range min', 'All of the above'],
                                correct: 0
                            }
                        ]
                    }
                ]
            }
        ]
    },
    
    'hashing': {
        id: 'hashing',
        title: 'Hashing',
        level: 2,
        order: 8,
        description: 'Hash tables, collision resolution, and applications',
        estimatedHours: 8,
        prerequisites: ['arrays', 'complexity'],
        modules: [
            {
                id: 'hashing-basics',
                title: 'Hash Table Implementation',
                order: 1,
                lessons: [
                    {
                        id: 'hash-01',
                        title: 'Hash Functions and Collision Resolution',
                        objectives: ['Design hash functions', 'Implement chaining and open addressing', 'Analyze load factor and rehashing', 'Understand std::unordered_map internals'],
                        content: `
                            <h3>Hash Table Fundamentals</h3>
                            <p>A <strong>hash table</strong> maps keys to values using a hash function to compute an index into an array of buckets.</p>
                            
                            <h4>Hash Functions</h4>
                            <pre><code>// Simple hash for integers
size_t hashInt(int key, size_t tableSize) {
    return key % tableSize; // Poor for non-uniform keys
}
// Better: multiplicative hashing (Knuth)
size_t hashInt(int key, size_t tableSize) {
    return (key * 2654435761u) >> (32 - log2(tableSize));
}
// Hash for strings (djb2)
size_t hashString(const string& s, size_t tableSize) {
    size_t hash = 5381;
    for (char c : s) hash = ((hash << 5) + hash) + c;
    return hash % tableSize;
}
// C++ std::hash specializations
struct PairHash {
    size_t operator()(const pair<int,int>& p) const noexcept {
        return hash<long long>()(((long long)p.first << 32) ^ p.second);
    }
};</code></pre>
                            
                            <h4>Collision Resolution: Chaining</h4>
                            <p>Each bucket stores a linked list (or vector) of key-value pairs.</p>
                            <pre><code>template <typename K, typename V>
class HashMapChaining {
    struct Node { K key; V value; Node* next; };
    vector<Node*> buckets;
    size_t size = 0;
    float maxLoadFactor = 0.75;
    
    size_t hash(const K& key) const {
        return std::hash<K>{}(key) % buckets.size();
    }
    
public:
    HashMapChaining(size_t capacity = 16) : buckets(capacity, nullptr) {}
    
    void put(const K& key, const V& value) {
        if (loadFactor() > maxLoadFactor) rehash();
        size_t idx = hash(key);
        for (Node* curr = buckets[idx]; curr; curr = curr->next) {
            if (curr->key == key) { curr->value = value; return; }
        }
        Node* node = new Node{key, value, buckets[idx]};
        buckets[idx] = node;
        ++size;
    }
    
    bool get(const K& key, V& value) const {
        for (Node* curr = buckets[hash(key)]; curr; curr = curr->next) {
            if (curr->key == key) { value = curr->value; return true; }
        }
        return false;
    }
    
    bool remove(const K& key) {
        size_t idx = hash(key);
        Node *curr = buckets[idx], *prev = nullptr;
        while (curr) {
            if (curr->key == key) {
                if (prev) prev->next = curr->next;
                else buckets[idx] = curr->next;
                delete curr;
                --size;
                return true;
            }
            prev = curr; curr = curr->next;
        }
        return false;
    }
    
    float loadFactor() const { return (float)size / buckets.size(); }
    void rehash() { /* resize and reinsert */ }
};
</code></pre>
                            
                            <h4>Collision Resolution: Open Addressing</h4>
                            <p>All entries stored in the array itself. Probe sequence finds next slot on collision.</p>
                            <pre><code>template <typename K, typename V>
class HashMapOpenAddressing {
    struct Entry { K key; V value; bool occupied = false, deleted = false; };
    vector<Entry> table;
    size_t size = 0;
    
    size_t probe(size_t hash, int attempt) const {
        // Linear probing
        return (hash + attempt) % table.size();
        // Quadratic: (hash + attempt*attempt) % size
        // Double hashing: (hash + attempt * hash2(key)) % size
    }
    
public:
    void put(const K& key, const V& value) {
        if (loadFactor() > 0.5) rehash(); // Lower threshold for open addressing
        size_t h = std::hash<K>{}(key) % table.size();
        for (int i = 0; i < table.size(); ++i) {
            size_t idx = probe(h, i);
            if (!table[idx].occupied || table[idx].deleted) {
                table[idx] = {key, value, true, false};
                ++size; return;
            }
            if (table[idx].key == key) { table[idx].value = value; return; }
        }
    }
    
    bool get(const K& key, V& value) const {
        size_t h = std::hash<K>{}(key) % table.size();
        for (int i = 0; i < table.size(); ++i) {
            size_t idx = probe(h, i);
            if (!table[idx].occupied) return false;
            if (!table[idx].deleted && table[idx].key == key) {
                value = table[idx].value; return true;
            }
        }
        return false;
    }
    
    bool remove(const K& key) {
        size_t h = std::hash<K>{}(key) % table.size();
        for (int i = 0; i < table.size(); ++i) {
            size_t idx = probe(h, i);
            if (!table[idx].occupied) return false;
            if (!table[idx].deleted && table[idx].key == key) {
                table[idx].deleted = true; --size; return true;
            }
        }
        return false;
    }
};
</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Custom Hash for unordered_map with Anti-Hack',
                                code: `// Prevent collision attacks (HashDoS) with randomized hash
// C++17: std::hash is not randomized by default, use custom
struct SafeHash {
    // Splitmix64 - good avalanche, fast
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }
    
    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + FIXED_RANDOM);
    }
    
    template<typename T>
    size_t operator()(const T& x) const {
        return operator()(std::hash<T>{}(x));
    }
};
// Usage
unordered_map<int, int, SafeHash> safeMap;
unordered_map<long long, int, SafeHash> safeMapLL;
unordered_map<pair<int,int>, int, SafeHash> safePairMap;
`
                            },
                            {
                                language: 'cpp',
                                title: 'Rabin-Karp String Matching with Rolling Hash',
                                code: `// O(n+m) average, O(nm) worst case
// Rolling hash: H = (c₁·p^(m-1) + c₂·p^(m-2) + ... + cₘ) mod MOD
vector<int> rabinKarp(const string& text, const string& pattern) {
    const int MOD = 1e9 + 7;
    const int BASE = 256;
    int n = text.size(), m = pattern.size();
    if (m > n) return {};
    
    long long patternHash = 0, windowHash = 0;
    long long basePow = 1;
    for (int i = 0; i < m - 1; ++i) basePow = (basePow * BASE) % MOD;
    
    for (int i = 0; i < m; ++i) {
        patternHash = (patternHash * BASE + pattern[i]) % MOD;
        windowHash = (windowHash * BASE + text[i]) % MOD;
    }
    
    vector<int> matches;
    for (int i = 0; i <= n - m; ++i) {
        if (patternHash == windowHash) {
            // Verify to handle hash collision
            if (text.substr(i, m) == pattern) matches.push_back(i);
        }
        if (i + m < n) {
            windowHash = (windowHash - text[i] * basePow) % MOD;
            if (windowHash < 0) windowHash += MOD;
            windowHash = (windowHash * BASE + text[i + m]) % MOD;
        }
    }
    return matches;
}
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement double hashing probe function for open addressing.',
                                code: `size_t doubleHashProbe(size_t h1, size_t h2, int attempt, size_t tableSize) {
    // TODO: (h1 + attempt * h2) % tableSize
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'hash-01-q1',
                                type: 'mcq',
                                question: 'What is the load factor threshold for rehashing in chaining?',
                                options: ['0.5', '0.75', '1.0', '0.25'],
                                correct: 1
                            },
                            {
                                id: 'hash-01-q2',
                                type: 'mcq',
                                question: 'Which probing method has the best cache performance?',
                                options: ['Linear', 'Quadratic', 'Double hashing', 'All same'],
                                correct: 0
                            },
                            {
                                id: 'hash-01-q3',
                                type: 'true-false',
                                question: 'In open addressing, deleted slots must be marked as "deleted" not "empty".',
                                correct: true,
                                explanation: 'Marking as empty breaks probe chains. "Deleted" allows search to continue past it.'
                            }
                        ]
                    },
                    {
                        id: 'hash-02',
                        title: 'Hash Table Applications',
                        objectives: ['Solve Two Sum, frequency counting, grouping anagrams', 'Implement LRU cache, LFU cache', 'Use hashing for deduplication and set operations'],
                        content: `
                            <h3>Hash Table Applications</h3>
                            
                            <h4>Two Sum Variants</h4>
                            <pre><code>
// Two Sum - O(n) time, O(n) space
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map; // value -> index
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (map.count(complement)) return {map[complement], i};
        map[nums[i]] = i;
    }
    return {};
}
// 4Sum II - Count tuples (a,b,c,d) with sum = 0
int fourSumCount(vector<int>& A, vector<int>& B, vector<int>& C, vector<int>& D) {
    unordered_map<int, int> ab;
    for (int a : A) for (int b : B) ab[a + b]++;
    int count = 0;
    for (int c : C) for (int d : D) count += ab[-(c + d)];
    return count;
}
// Subarray sum equals k
int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> prefixCount{{0, 1}};
    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        count += prefixCount[sum - k];
        prefixCount[sum]++;
    }
    return count;
}
</code></pre>
                            
                            <h4>Frequency and Grouping</h4>
                            <pre><code>
// Group anagrams
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    for (string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        groups[key].push_back(s);
    }
    vector<vector<string>> result;
    for (auto& [_, v] : groups) result.push_back(v);
    return result;
}
// Top K frequent elements
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int x : nums) freq[x]++;
    
    // Min-heap of size k
    using pii = pair<int, int>;
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    for (auto& [num, f] : freq) {
        pq.emplace(f, num);
        if (pq.size() > k) pq.pop();
    }
    vector<int> result;
    while (!pq.empty()) { result.push_back(pq.top().second); pq.pop(); }
    return result;
}
</code></pre>
                            
                            <h4>LRU Cache</h4>
                            <pre><code>class LRUCache {
    struct Node { int key, val; Node *prev, *next; };
    int cap;
    unordered_map<int, Node*> map;
    Node *head = new Node(), *tail = new Node();
    
    LRUCache(int capacity) : cap(capacity) {
        head->next = tail; tail->prev = head;
    }
    
    int get(int key) {
        if (!map.count(key)) return -1;
        Node* node = map[key];
        moveToHead(node);
        return node->val;
    }
    
    void put(int key, int value) {
        if (map.count(key)) {
            Node* node = map[key];
            node->val = value;
            moveToHead(node);
        } else {
            Node* node = new Node{key, value, nullptr, nullptr};
            map[key] = node;
            addToHead(node);
            if (map.size() > cap) {
                Node* lru = tail->prev;
                removeNode(lru);
                map.erase(lru->key);
                delete lru;
            }
        }
    }
    
    void moveToHead(Node* n) { removeNode(n); addToHead(n); }
    void addToHead(Node* n) {
        n->next = head->next; n->prev = head;
        head->next->prev = n; head->next = n;
    }
    void removeNode(Node* n) {
        n->prev->next = n->next; n->next->prev = n->prev;
    }
};
</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'LFU Cache and Consistent Hashing',
                                code: `// LFU Cache - O(1) get/put using freq lists
class LFUCache {
    struct Node { int key, val, freq; Node *prev, *next; };
    int cap, minFreq = 0;
    unordered_map<int, Node*> keyMap;
    unordered_map<int, pair<Node*, Node*>> freqMap; // freq -> (head, tail)
    
    LFUCache(int capacity) : cap(capacity) {}
    
    int get(int key) {
        if (!keyMap.count(key)) return -1;
        Node* node = keyMap[key];
        updateFreq(node);
        return node->val;
    }
    
    void put(int key, int value) {
        if (cap == 0) return;
        if (keyMap.count(key)) {
            Node* node = keyMap[key];
            node->val = value;
            updateFreq(node);
        } else {
            if (keyMap.size() == cap) {
                // Evict LRU from minFreq list
                auto& [head, tail] = freqMap[minFreq];
                Node* lru = tail->prev;
                removeNode(lru, minFreq);
                keyMap.erase(lru->key);
                delete lru;
            }
            Node* node = new Node{key, value, 1, nullptr, nullptr};
            keyMap[key] = node;
            addToFreq(node, 1);
            minFreq = 1;
        }
    }
    
    void updateFreq(Node* node) {
        int f = node->freq;
        removeNode(node, f);
        if (freqMap[f].first->next == freqMap[f].second && minFreq == f) minFreq++;
        node->freq++;
        addToFreq(node, f + 1);
    }
    // ... helper functions
};
`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'hash-02-q1',
                                type: 'mcq',
                                question: 'In subarray sum equals k, why initialize map with {0: 1}?',
                                options: ['For empty subarray', 'To handle subarray starting at index 0', 'To avoid overflow', 'For negative numbers'],
                                correct: 1
                            },
                            {
                                id: 'hash-02-q2',
                                type: 'mcq',
                                question: 'What is the time complexity of LRU cache get/put with hash map + doubly linked list?',
                                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
                                correct: 0
                            }
                        ]
                    }
                ]
            }
        ]
    },
    
    'graphs': {
        id: 'graphs',
        title: 'Graph Algorithms',
        level: 2,
        order: 9,
        description: 'Graph representations, traversals, and shortest path algorithms',
        estimatedHours: 15,
        prerequisites: ['trees', 'hashing'],
        modules: [
            {
                id: 'graph-basics',
                title: 'Graph Representation and Traversal',
                order: 1,
                lessons: [
                    {
                        id: 'graph-01',
                        title: 'Graph Representations and BFS/DFS',
                        objectives: ['Implement adjacency list and matrix', 'Perform BFS and DFS traversals', 'Detect cycles, connected components', 'Topological sort'],
                        content: `
                            <h3>Graph Fundamentals</h3>
                            <p>A <strong>graph</strong> G = (V, E) consists of vertices V and edges E. Edges can be directed or undirected, weighted or unweighted.</p>
                            
                            <h4>Representations</h4>
                            <pre><code>// Adjacency List - O(V+E) space, best for sparse graphs
vector<vector<int>> adjList(n); // Unweighted
vector<vector<pair<int,int>>> adjWeighted(n); // (neighbor, weight)
// Adjacency Matrix - O(V²) space, O(1) edge lookup
vector<vector<int>> adjMatrix(n, vector<int>(n, 0));
vector<vector<int>> weightMatrix(n, vector<int>(n, INF));
// Edge List - O(E) space
struct Edge { int u, v, w; };
vector<Edge> edges;
// Building from input
for (auto& e : edges) {
    adjList[e.u].push_back(e.v);
    adjList[e.v].push_back(e.u); // For undirected
    // Weighted
    adjWeighted[e.u].push_back({e.v, e.w});
    adjWeighted[e.v].push_back({e.u, e.w});
}
</code></pre>
                            
                            <h4>BFS (Breadth-First Search)</h4>
                            <p>Explores level by level. Finds shortest path in unweighted graphs.</p>
                            <pre><code>// BFS for single source shortest path (unweighted)
vector<int> bfs(int n, vector<vector<int>>& adj, int src) {
    vector<int> dist(n, -1);
    queue<int> q;
    dist[src] = 0;
    q.push(src);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    return dist;
}
// BFS for connected components
vector<int> components(int n, vector<vector<int>>& adj) {
    vector<int> comp(n, -1);
    int cid = 0;
    for (int i = 0; i < n; ++i) if (comp[i] == -1) {
        queue<int> q; q.push(i); comp[i] = cid;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : adj[u]) if (comp[v] == -1) {
                comp[v] = cid; q.push(v);
            }
        }
        ++cid;
    }
    return comp;
}
</code></pre>
                            
                            <h4>DFS (Depth-First Search)</h4>
                            <p>Explores as far as possible before backtracking. Uses stack (explicit or call stack).</p>
                            <pre><code>// Recursive DFS
void dfs(int u, vector<vector<int>>& adj, vector<bool>& vis, vector<int>& order) {
    vis[u] = true;
    for (int v : adj[u]) if (!vis[v]) dfs(v, adj, vis, order);
    order.push_back(u); // Post-order
}
// Iterative DFS
void dfsIter(int src, vector<vector<int>>& adj, vector<bool>& vis) {
    stack<int> st; st.push(src);
    while (!st.empty()) {
        int u = st.top(); st.pop();
        if (vis[u]) continue;
        vis[u] = true;
        // Push in reverse for same order as recursive
        for (auto it = adj[u].rbegin(); it != adj[u].rend(); ++it)
            if (!vis[*it]) st.push(*it);
    }
}
// Cycle detection in undirected graph
bool hasCycleUndirected(int u, int parent, vector<vector<int>>& adj, vector<bool>& vis) {
    vis[u] = true;
    for (int v : adj[u]) {
        if (!vis[v]) {
            if (hasCycleUndirected(v, u, adj, vis)) return true;
        } else if (v != parent) return true;
    }
    return false;
}
// Cycle detection in directed graph (3 colors: 0=unvisited, 1=visiting, 2=done)
bool hasCycleDirected(int u, vector<vector<int>>& adj, vector<int>& state) {
    state[u] = 1; // Visiting
    for (int v : adj[u]) {
        if (state[v] == 1) return true; // Back edge
        if (state[v] == 0 && hasCycleDirected(v, adj, state)) return true;
    }
    state[u] = 2; // Done
    return false;
}
</code></pre>
                            
                            <h4>Topological Sort</h4>
                            <p>Linear ordering of vertices such that for every directed edge u→v, u comes before v. Only for DAGs.</p>
                            <pre><code>// Kahn's Algorithm (BFS-based) - O(V+E)
vector<int> topoSortKahn(int n, vector<vector<int>>& adj) {
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; ++u)
        for (int v : adj[u]) indeg[v]++;
    
    queue<int> q;
    for (int i = 0; i < n; ++i) if (indeg[i] == 0) q.push(i);
    
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
    }
    return order.size() == n ? order : vector<int>(); // Empty if cycle
}
// DFS-based - O(V+E)
vector<int> topoSortDFS(int n, vector<vector<int>>& adj) {
    vector<int> state(n, 0), order;
    function<bool(int)> dfs = [&](int u) {
        state[u] = 1;
        for (int v : adj[u]) {
            if (state[v] == 1) return false; // Cycle
            if (state[v] == 0 && !dfs(v)) return false;
        }
        state[u] = 2;
        order.push_back(u);
        return true;
    };
    for (int i = 0; i < n; ++i)
        if (state[i] == 0 && !dfs(i)) return {};
    reverse(order.begin(), order.end());
    return order;
}
</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Bipartite Check and Shortest Path in Unweighted Graph',
                                code: `// Bipartite check - 2-coloring with BFS
bool isBipartite(vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> color(n, -1); // 0 or 1
    for (int i = 0; i < n; ++i) if (color[i] == -1) {
        queue<int> q; q.push(i); color[i] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : adj[u]) {
                if (color[v] == -1) { color[v] = color[u] ^ 1; q.push(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}
// Shortest path in unweighted graph with path reconstruction
pair<vector<int>, vector<int>> shortestPath(int n, vector<vector<int>>& adj, int src, int dest) {
    vector<int> dist(n, -1), parent(n, -1);
    queue<int> q; q.push(src); dist[src] = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        if (u == dest) break;
        for (int v : adj[u]) if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            parent[v] = u;
            q.push(v);
        }
    }
    // Reconstruct path
    vector<int> path;
    for (int v = dest; v != -1; v = parent[v]) path.push_back(v);
    reverse(path.begin(), path.end());
    return {dist, path};
}
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement BFS to find shortest path in a grid with obstacles.',
                                code: `int shortestPathGrid(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> end) {
    // TODO: grid[i][j] = 0 (empty) or 1 (obstacle)
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'graph-01-q1',
                                type: 'mcq',
                                question: 'What is the time complexity of BFS with adjacency list?',
                                options: ['O(V)', 'O(E)', 'O(V+E)', 'O(V²)'],
                                correct: 2
                            },
                            {
                                id: 'graph-01-q2',
                                type: 'mcq',
                                question: 'Which algorithm finds shortest path in unweighted graph?',
                                options: ['DFS', 'BFS', 'Dijkstra', 'Topological sort'],
                                correct: 1
                            },
                            {
                                id: 'graph-01-q3',
                                type: 'true-false',
                                question: 'Topological sort is possible for any directed graph.',
                                correct: false,
                                explanation: 'Only for DAGs (Directed Acyclic Graphs).'
                            }
                        ]
                    },
                    {
                        id: 'graph-02',
                        title: 'Shortest Path Algorithms',
                        objectives: ['Implement Dijkstra for non-negative weights', 'Implement Bellman-Ford for negative weights', 'Understand when to use each algorithm'],
                        content: `
                            <h3>Shortest Path Algorithms</h3>
                            
                            <h4>Dijkstra's Algorithm</h4>
                            <p>Single-source shortest path for graphs with <strong>non-negative</strong> edge weights. O((V+E) log V) with binary heap.</p>
                            <pre><code>vector<int> dijkstra(int n, vector<vector<pair<int,int>>>& adj, int src) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    dist[src] = 0;
    
    using pii = pair<int, int>; // (dist, node)
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.emplace(0, src);
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue; // Stale entry
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.emplace(dist[v], v);
            }
        }
    }
    return dist;
}
// With path reconstruction
pair<vector<int>, vector<int>> dijkstraPath(int n, vector<vector<pair<int,int>>>& adj, int src) {
    const int INF = 1e9;
    vector<int> dist(n, INF), parent(n, -1);
    dist[src] = 0;
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.emplace(0, src);
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
                pq.emplace(dist[v], v);
            }
        }
    }
    return {dist, parent};
}
</code></pre>
                            
                            <h4>Bellman-Ford Algorithm</h4>
                            <p>Handles <strong>negative weights</strong>. Detects negative cycles. O(VE).</p>
                            <pre><code>// Returns empty vector if negative cycle reachable from src
vector<int> bellmanFord(int n, vector<Edge>& edges, int src) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    dist[src] = 0;
    
    // Relax edges V-1 times
    for (int i = 0; i < n - 1; ++i) {
        bool updated = false;
        for (auto& e : edges) {
            if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                updated = true;
            }
        }
        if (!updated) break; // Early termination
    }
    
    // Check negative cycles
    for (auto& e : edges) {
        if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {
            return {}; // Negative cycle
        }
    }
    return dist;
}
// SPFA (Shortest Path Faster Algorithm) - optimized Bellman-Ford
vector<int> spfa(int n, vector<vector<pair<int,int>>>& adj, int src) {
    const int INF = 1e9;
    vector<int> dist(n, INF), inQueue(n, 0), count(n, 0);
    queue<int> q;
    dist[src] = 0; q.push(src); inQueue[src] = 1;
    
    while (!q.empty()) {
        int u = q.front(); q.pop(); inQueue[u] = 0;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (!inQueue[v]) {
                    q.push(v);
                    inQueue[v] = 1;
                    if (++count[v] > n) return {}; // Negative cycle
                }
            }
        }
    }
    return dist;
}
</code></pre>
                            
                            <h4>Floyd-Warshall (All-Pairs Shortest Path)</h4>
                            <p>O(V³) for dense graphs. Also detects negative cycles.</p>
                            <pre><code>vector<vector<int>> floydWarshall(int n, vector<vector<int>>& adjMatrix) {
    const int INF = 1e9;
    vector<vector<int>> dist = adjMatrix;
    for (int i = 0; i < n; ++i) dist[i][i] = 0;
    
    for (int k = 0; k < n; ++k)
        for (int i = 0; i < n; ++i)
            for (int j = 0; j < n; ++j)
                if (dist[i][k] != INF && dist[k][j] != INF)
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
    
    // Check negative cycles
    for (int i = 0; i < n; ++i) if (dist[i][i] < 0) return {};
    return dist;
}
// With path reconstruction
vector<vector<int>> floydWarshallPath(int n, vector<vector<int>>& adjMatrix, vector<vector<int>>& next) {
    // next[i][j] = next node on path i->j
    const int INF = 1e9;
    vector<vector<int>> dist = adjMatrix;
    next.assign(n, vector<int>(n, -1));
    for (int i = 0; i < n; ++i) {
        dist[i][i] = 0;
        for (int j = 0; j < n; ++j)
            if (adjMatrix[i][j] != INF) next[i][j] = j;
    }
    
    for (int k = 0; k < n; ++k)
        for (int i = 0; i < n; ++i)
            for (int j = 0; j < n; ++j)
                if (dist[i][k] != INF && dist[k][j] != INF &&
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
    return dist;
}
vector<int> reconstructPath(int u, int v, vector<vector<int>>& next) {
    if (next[u][v] == -1) return {};
    vector<int> path = {u};
    while (u != v) { u = next[u][v]; path.push_back(u); }
    return path;
}
</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Dijkstra with State (Modulo, Fuel, etc.)',
                                code: `// Shortest path with state: e.g., minimum cost with at most k discounts
int dijkstraWithDiscounts(int n, vector<vector<pair<int,int>>>& adj, int src, int dest, int k) {
    // dist[node][discounts_used]
    const int INF = 1e9;
    vector<vector<int>> dist(n, vector<int>(k+1, INF));
    dist[src][0] = 0;
    
    using State = tuple<int, int, int>; // (dist, node, discounts_used)
    priority_queue<State, vector<State>, greater<State>> pq;
    pq.emplace(0, src, 0);
    
    while (!pq.empty()) {
        auto [d, u, used] = pq.top(); pq.pop();
        if (d > dist[u][used]) continue;
        if (u == dest) return d; // Early exit (first time we pop dest is optimal)
        
        for (auto [v, w] : adj[u]) {
            // Without discount
            if (dist[u][used] + w < dist[v][used]) {
                dist[v][used] = dist[u][used] + w;
                pq.emplace(dist[v][used], v, used);
            }
            // With discount (if available)
            if (used < k && dist[u][used] + w/2 < dist[v][used+1]) {
                dist[v][used+1] = dist[u][used] + w/2;
                pq.emplace(dist[v][used+1], v, used+1);
            }
        }
    }
    return *min_element(dist[dest].begin(), dist[dest].end());
}
// 0-1 BFS for weights 0 or 1
vector<int> zeroOneBFS(int n, vector<vector<pair<int,int>>>& adj, int src) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    deque<int> dq;
    dist[src] = 0; dq.push_back(src);
    while (!dq.empty()) {
        int u = dq.front(); dq.pop_front();
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (w == 0) dq.push_front(v); else dq.push_back(v);
            }
        }
    }
    return dist;
}
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement A* search for grid with Manhattan distance heuristic.',
                                code: `int astar(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> goal) {
    // TODO: f = g + h, h = Manhattan distance
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'graph-02-q1',
                                type: 'mcq',
                                question: 'What is the time complexity of Dijkstra with binary heap?',
                                options: ['O(V log V)', 'O(E log V)', 'O((V+E) log V)', 'O(V²)'],
                                correct: 2
                            },
                            {
                                id: 'graph-02-q2',
                                type: 'mcq',
                                question: 'Which algorithm can handle negative weight edges?',
                                options: ['Dijkstra', 'Bellman-Ford', 'Both', 'Neither'],
                                correct: 1
                            },
                            {
                                id: 'graph-02-q3',
                                type: 'true-false',
                                question: 'Floyd-Warshall is preferred over running Dijkstra from each vertex for sparse graphs.',
                                correct: false,
                                explanation: 'Floyd-Warshall is O(V³). For sparse graphs, V×Dijkstra is O(VE log V) which is better.'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'graph-advanced',
                title: 'Advanced Graph Algorithms',
                order: 2,
                lessons: [
                    {
                        id: 'graph-03',
                        title: 'Minimum Spanning Tree (Prim\'s and Kruskal\'s)',
                        objectives: ['Implement Prim\'s algorithm with priority queue', 'Implement Kruskal\'s with Union-Find', 'Understand when to use each', 'Apply to clustering and approximation'],
                        content: `
                            <h3>Minimum Spanning Tree</h3>
                            <p>An <strong>MST</strong> connects all vertices with minimum total edge weight. No cycles, V-1 edges.</p>
                            
                            <h4>Prim's Algorithm</h4>
                            <p>Grows MST from arbitrary start vertex. O(E log V) with heap.</p>
                            <pre><code>// Prim's - returns MST weight and edges
pair<int, vector<Edge>> prim(int n, vector<vector<pair<int,int>>>& adj) {
    const int INF = 1e9;
    vector<int> minEdge(n, INF), parent(n, -1);
    vector<bool> inMST(n, false);
    minEdge[0] = 0;
    
    using pii = pair<int, int>;
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.emplace(0, 0);
    
    int mstWeight = 0;
    vector<Edge> mstEdges;
    
    while (!pq.empty()) {
        auto [w, u] = pq.top(); pq.pop();
        if (inMST[u]) continue;
        inMST[u] = true;
        mstWeight += w;
        if (parent[u] != -1) mstEdges.push_back({parent[u], u, w});
        
        for (auto [v, weight] : adj[u]) {
            if (!inMST[v] && weight < minEdge[v]) {
                minEdge[v] = weight;
                parent[v] = u;
                pq.emplace(weight, v);
            }
        }
    }
    return {mstWeight, mstEdges};
}
</code></pre>
                            
                            <h4>Kruskal's Algorithm</h4>
                            <p>Sorts all edges, adds if no cycle. Uses Union-Find (DSU). O(E log E) = O(E log V).</p>
                            <pre><code>// Union-Find (Disjoint Set Union)
struct DSU {
    vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) { iota(parent.begin(), parent.end(), 0); }
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rank[a] < rank[b]) swap(a, b);
        parent[b] = a;
        if (rank[a] == rank[b]) rank[a]++;
        return true;
    }
};
pair<int, vector<Edge>> kruskal(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end(), [](Edge a, Edge b) { return a.w < b.w; });
    DSU dsu(n);
    int mstWeight = 0;
    vector<Edge> mstEdges;
    for (auto& e : edges) {
        if (dsu.unite(e.u, e.v)) {
            mstWeight += e.w;
            mstEdges.push_back(e);
            if (mstEdges.size() == n - 1) break;
        }
    }
    return {mstWeight, mstEdges};
}
</code></pre>
                            
                            <h4>Comparison</h4>
                            <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                                <tr style="background:#f8f9fa;">
                                    <th style="padding:8px;border:1px solid #ddd;">Algorithm</th>
                                    <th style="padding:8px;border:1px solid #ddd;">Time</th>
                                    <th style="padding:8px;border:1px solid #ddd;">Best For</th>
                                </tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Prim (heap)</td><td style="padding:8px;border:1px solid #ddd;">O(E log V)</td><td style="padding:8px;border:1px solid #ddd;">Dense graphs</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">Kruskal</td><td style="padding:8px;border:1px solid #ddd;">O(E log E)</td><td style="padding:8px;border:1px solid #ddd;">Sparse graphs, edge list input</td></tr>
                            </table>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'MST Applications - Clustering and Second Best MST',
                                code: `// Clustering: remove k-1 largest edges from MST to get k clusters
vector<vector<int>> clusteringMST(int n, vector<vector<pair<int,int>>>& adj, int k) {
    auto [weight, mstEdges] = prim(n, adj);
    sort(mstEdges.begin(), mstEdges.end(), [](Edge a, Edge b) { return a.w > b.w; });
    // Remove k-1 largest edges
    DSU dsu(n);
    for (int i = k-1; i < mstEdges.size(); ++i) dsu.unite(mstEdges[i].u, mstEdges[i].v);
    
    unordered_map<int, vector<int>> clusters;
    for (int i = 0; i < n; ++i) clusters[dsu.find(i)].push_back(i);
    vector<vector<int>> result;
    for (auto& [_, v] : clusters) result.push_back(v);
    return result;
}
// Second Best MST - try replacing each MST edge with non-MST edge
int secondBestMST(int n, vector<Edge>& edges) {
    auto [bestWeight, mstEdges] = kruskal(n, edges);
    // Build MST adjacency for LCA queries (max edge on path)
    // For each non-MST edge, find max edge on path between u,v in MST
    // Second best = min over non-MST edges of (bestWeight + w - maxOnPath)
    // O(E log V) with binary lifting for LCA
    return secondBest; // Implementation omitted for brevity
}
`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'graph-03-q1',
                                type: 'mcq',
                                question: 'What is the key difference between Prim and Kruskal?',
                                options: ['Prim uses heap, Kruskal uses DSU', 'Prim grows from vertex, Kruskal from edges', 'Prim for dense, Kruskal for sparse', 'All of the above'],
                                correct: 3
                            },
                            {
                                id: 'graph-03-q2',
                                type: 'true-false',
                                question: 'MST is unique if all edge weights are distinct.',
                                correct: true,
                                explanation: 'With distinct weights, the cut property gives unique light edge for each cut.'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    
    'searching': {
        id: 'searching',
        title: 'Searching Algorithms',
        level: 2,
        order: 10,
        description: 'Binary search variants and searching in data structures',
        estimatedHours: 6,
        prerequisites: ['arrays', 'complexity'],
        modules: [
            {
                id: 'searching-basics',
                title: 'Binary Search and Variants',
                order: 1,
                lessons: [
                    {
                        id: 'search-01',
                        title: 'Binary Search on Answer',
                        objectives: ['Apply binary search to monotonic functions', 'Find first/last occurrence', 'Search on answer space', 'Use STL lower_bound/upper_bound'],
                        content: `
                            <h3>Binary Search Fundamentals</h3>
                            <p>Binary search finds a target in a <strong>sorted</strong> array in O(log n) by repeatedly dividing the search space.</p>
                            
                            <h4>Classic Binary Search</h4>
                            <pre><code>// Returns index of target, or -1 if not found
int binarySearch(const vector<int>& arr, int target) {
    int l = 0, r = arr.size() - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == target) return m;
        else if (arr[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}
// Template for finding FIRST true in [false...false, true...true]
int firstTrue(int l, int r, function<bool(int)> check) {
    while (l < r) {
        int m = l + (r - l) / 2;
        if (check(m)) r = m;
        else l = m + 1;
    }
    return check(l) ? l : -1;
}
// Template for finding LAST true in [true...true, false...false]
int lastTrue(int l, int r, function<bool(int)> check) {
    while (l < r) {
        int m = l + (r - l + 1) / 2; // Upper mid
        if (check(m)) l = m;
        else r = m - 1;
    }
    return check(l) ? l : -1;
}
</code></pre>
                            
                            <h4>STL Binary Search</h4>
                            <pre><code>vector<int> v = {1, 2, 2, 3, 4, 4, 4, 5};
auto it = lower_bound(v.begin(), v.end(), 3); // First >= 3 (index 3)
auto it = upper_bound(v.begin(), v.end(), 3); // First > 3 (index 4)
auto range = equal_range(v.begin(), v.end(), 4); // [first, last) of 4
int count = range.second - range.first; // 3 occurrences
bool exists = binary_search(v.begin(), v.end(), 3); // true
</code></pre>
                            
                            <h4>Binary Search on Answer</h4>
                            <p>Search the answer space instead of array. Check if a candidate answer is valid (monotonic predicate).</p>
                            <pre><code>// Example: Minimize maximum subarray sum (Split Array Largest Sum)
// Given array, split into k subarrays, minimize the maximum sum
int splitArray(vector<int>& nums, int k) {
    auto canSplit = [&](int maxSum) {
        int subarrays = 1, currSum = 0;
        for (int x : nums) {
            if (currSum + x > maxSum) {
                subarrays++;
                currSum = x;
                if (subarrays > k) return false;
            } else currSum += x;
        }
        return true;
    };
    
    int left = *max_element(nums.begin(), nums.end());
    int right = accumulate(nums.begin(), nums.end(), 0);
    return firstTrue(left, right, canSplit);
}
// Example: Koko Eating Bananas
int minEatingSpeed(vector<int>& piles, int h) {
    auto canEat = [&](int speed) {
        long long hours = 0;
        for (int p : piles) hours += (p + speed - 1) / speed;
        return hours <= h;
    };
    int left = 1, right = *max_element(piles.begin(), piles.end());
    return firstTrue(left, right, canEat);
}
// Example: Capacity To Ship Packages Within D Days
int shipWithinDays(vector<int>& weights, int days) {
    auto canShip = [&](int cap) {
        int d = 1, load = 0;
        for (int w : weights) {
            if (load + w > cap) { d++; load = w; }
            else load += w;
        }
        return d <= days;
    };
    int left = *max_element(weights.begin(), weights.end());
    int right = accumulate(weights.begin(), weights.end(), 0);
    return firstTrue(left, right, canShip);
}
</code></pre>
                            
                            <h4>Finding First/Last Occurrence</h4>
                            <pre><code>// First occurrence of target
int firstOccurrence(const vector<int>& arr, int target) {
    int l = 0, r = arr.size() - 1, ans = -1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == target) { ans = m; r = m - 1; }
        else if (arr[m] < target) l = m + 1;
        else r = m - 1;
    }
    return ans;
}
// Last occurrence
int lastOccurrence(const vector<int>& arr, int target) {
    int l = 0, r = arr.size() - 1, ans = -1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == target) { ans = m; l = m + 1; }
        else if (arr[m] < target) l = m + 1;
        else r = m - 1;
    }
    return ans;
}
// Count occurrences
int countOccurrences(const vector<int>& arr, int target) {
    int first = firstOccurrence(arr, target);
    if (first == -1) return 0;
    return lastOccurrence(arr, target) - first + 1;
}
// Using STL
int countSTL(const vector<int>& arr, int target) {
    return upper_bound(arr.begin(), arr.end(), target) - 
           lower_bound(arr.begin(), arr.end(), target);
}
</code></pre>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Advanced Binary Search Patterns',
                                code: `// Search in a rotated sorted array (distinct values)
// Example: nums = [4,5,6,7,0,1,2], target = 0 -> returns 4
int searchRotated(const vector<int>& nums, int target) {
    int l = 0, r = static_cast<int>(nums.size()) - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] == target) return m;

        if (nums[l] <= nums[m]) { // Left half [l..m] is sorted
            if (nums[l] <= target && target < nums[m]) r = m - 1;
            else l = m + 1;
        } else { // Right half [m..r] is sorted
            if (nums[m] < target && target <= nums[r]) l = m + 1;
            else r = m - 1;
        }
    }
    return -1;
}

// Find minimum in a rotated sorted array (distinct values)
// Example: [4,5,6,7,0,1,2] -> returns 0
int findMin(const vector<int>& nums) {
    if (nums.empty()) return -1; // empty input: guard so nums[l] is never read
    int l = 0, r = static_cast<int>(nums.size()) - 1;
    while (l < r) {
        int m = l + (r - l) / 2;
        if (nums[m] > nums[r]) l = m + 1;
        else r = m;
    }
    return nums[l];
}

// Find a peak element: return an index i such that nums[i] > nums[i + 1]
// (the last index counts as a peak because nums[n] is treated as -infinity)
int findPeakElement(const vector<int>& nums) {
    if (nums.empty()) return -1;
    int l = 0, r = static_cast<int>(nums.size()) - 1;
    while (l < r) {
        int m = l + (r - l) / 2;
        if (nums[m] > nums[m + 1]) r = m;
        else l = m + 1;
    }
    return l;
}
`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement lower_bound manually: return the first index whose value is >= target.',
                                code: `int lowerBound(const vector<int>& arr, int target) {
    // TODO: binary search for first index >= target
}`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace searchRotated on nums = [4,5,6,7,0,1,2] with target = 0.',
                                code: `// Show l, m, r and which half is discarded at each step`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'search-01-q1',
                                type: 'mcq',
                                question: 'What is the time complexity of binary search?',
                                options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
                                correct: 1
                            },
                            {
                                id: 'search-01-q2',
                                type: 'mcq',
                                question: 'In binary search on the answer, what property must the predicate have?',
                                options: ['Monotonic (false...false, true...true)', 'Random', 'Linear', 'Symmetric'],
                                correct: 0
                            },
                            {
                                id: 'search-01-q3',
                                type: 'true-false',
                                question: 'std::lower_bound returns the first element greater than the given value.',
                                correct: false,
                                explanation: 'lower_bound returns the first element >= value; upper_bound returns the first element > value.'
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 11: SORTING ALGORITHMS
    // ============================================================
    'sorting': {
        id: 'sorting',
        title: 'Sorting Algorithms',
        level: 2,
        order: 11,
        description: 'Comparison and non-comparison sorting algorithms',
        estimatedHours: 10,
        prerequisites: ['arrays', 'complexity', 'recursion'],
        modules: [
            {
                id: 'sorting-basics',
                title: 'Comparison Sorts',
                order: 1,
                lessons: [
                    {
                        id: 'sort-01',
                        title: 'Merge Sort, Quick Sort, Heap Sort',
                        objectives: ['Implement O(n log n) sorts', 'Understand partitioning and heapify', 'Analyze stability and space'],
                        content: `<h3>Efficient Comparison Sorts</h3><p>Merge sort, quick sort, heap sort implementations.</p>`,
                        codeExamples: [],
                        quizQuestions: [
                            {
                                id: 'sort-01-q1',
                                type: 'mcq',
                                question: 'Which of the following is an O(n log n) sort?',
                                options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
                                correct: 2
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 12: GREEDY ALGORITHMS
    // ============================================================
    'greedy': {
        id: 'greedy',
        title: 'Greedy Algorithms',
        level: 2,
        order: 12,
        description: 'Greedy choice property and applications',
        estimatedHours: 8,
        prerequisites: ['sorting', 'complexity'],
        modules: [
            {
                id: 'greedy-basics',
                title: 'Greedy Techniques',
                order: 1,
                lessons: [
                    {
                        id: 'greedy-01',
                        title: 'Interval Scheduling and Huffman Coding',
                        objectives: ['Prove the greedy choice property', 'Solve interval scheduling', 'Implement Huffman coding'],
                        content: `<h3>Greedy Algorithms</h3><p>Interval scheduling, Huffman coding, and exchange arguments.</p>`,
                        codeExamples: [],
                        quizQuestions: [
                            {
                                id: 'greedy-01-q1',
                                type: 'mcq',
                                question: 'Which strategy solves the maximum non-overlapping interval scheduling problem?',
                                options: ['Earliest start time', 'Earliest finish time', 'Longest interval first', 'Shortest interval first'],
                                correct: 1
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 13: DYNAMIC PROGRAMMING
    // ============================================================
    'dynamic-programming': {
        id: 'dynamic-programming',
        title: 'Dynamic Programming',
        level: 3,
        order: 13,
        description: 'Optimal substructure and overlapping subproblems',
        estimatedHours: 14,
        prerequisites: ['recursion', 'complexity'],
        modules: [
            {
                id: 'dp-basics',
                title: 'DP Fundamentals',
                order: 1,
                lessons: [
                    {
                        id: 'dp-01',
                        title: 'Memoization and Tabulation',
                        objectives: ['Identify overlapping subproblems', 'Implement top-down memoization', 'Convert to bottom-up tabulation'],
                        content: `<h3>Dynamic Programming</h3><p>Memoization (top-down) and tabulation (bottom-up) for overlapping subproblems.</p>`,
                        codeExamples: [],
                        quizQuestions: [
                            {
                                id: 'dp-01-q1',
                                type: 'mcq',
                                question: 'Which property is required for dynamic programming?',
                                options: ['Overlapping subproblems', 'Random access', 'Sorted input', 'Constant memory'],
                                correct: 0
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 14: DIVIDE AND CONQUER
    // ============================================================
    'divide-conquer': {
        id: 'divide-conquer',
        title: 'Divide and Conquer',
        level: 3,
        order: 14,
        description: 'Divide, solve, and combine algorithmic paradigm',
        estimatedHours: 10,
        prerequisites: ['recursion', 'sorting'],
        modules: [
            {
                id: 'dc-basics',
                title: 'Divide and Conquer Techniques',
                order: 1,
                lessons: [
                    {
                        id: 'dc-01',
                        title: 'Merge Sort, Quick Select, Closest Pair',
                        objectives: ['Apply the divide-and-conquer template', 'Implement quick select', 'Solve the closest pair problem'],
                        content: `<h3>Divide and Conquer</h3><p>Merge sort, quick select, and closest pair of points.</p>`,
                        codeExamples: [],
                        quizQuestions: [
                            {
                                id: 'dc-01-q1',
                                type: 'mcq',
                                question: 'What is the average time complexity of quick select?',
                                options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
                                correct: 0
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 15: BIT MANIPULATION
    // ============================================================
    'bit-manipulation': {
        id: 'bit-manipulation',
        title: 'Bit Manipulation',
        level: 3,
        order: 15,
        description: 'Bitwise operations and bit-level tricks',
        estimatedHours: 6,
        prerequisites: ['cpp-foundations'],
        modules: [
            {
                id: 'bit-basics',
                title: 'Bitwise Fundamentals',
                order: 1,
                lessons: [
                    {
                        id: 'bit-01',
                        title: 'Bit Tricks and Techniques',
                        objectives: ['Use bitwise operators', 'Clear, set, and toggle bits', 'Apply bitmasks and subset enumeration'],
                        content: `<h3>Bit Manipulation</h3><p>Bitwise operators, masks, subsets, and common bit tricks.</p>`,
                        codeExamples: [],
                        quizQuestions: [
                            {
                                id: 'bit-01-q1',
                                type: 'mcq',
                                question: 'What does x & (x - 1) do?',
                                options: ['Sets the lowest set bit', 'Clears the lowest set bit', 'Flips all bits', 'Doubles x'],
                                correct: 1
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 16: ADVANCED GRAPH ALGORITHMS
    // ============================================================
    'advanced-graphs': {
        id: 'advanced-graphs',
        title: 'Advanced Graph Algorithms',
        level: 3,
        order: 16,
        description: 'MST, advanced shortest paths, network flow',
        estimatedHours: 15,
        prerequisites: ['graphs', 'dynamic-programming'],
        modules: [
            {
                id: 'adv-graph-basics',
                title: 'Minimum Spanning Tree and Flow',
                order: 1,
                lessons: [
                    {
                        id: 'adv-graph-01',
                        title: 'Prim\'s, Kruskal\'s, and Max Flow',
                        objectives: ['Implement Prim\'s and Kruskal\'s MST', 'Apply Bellman-Ford, Floyd-Warshall', 'Solve max flow with Edmonds-Karp'],
                        content: `<h3>Advanced Graph Algorithms</h3><p>MST algorithms, all-pairs shortest path, max flow.</p>`,
                        codeExamples: [],
                        quizQuestions: [
                            {
                                id: 'adv-graph-01-q1',
                                type: 'mcq',
                                question: 'Prim\'s algorithm grows a tree from which starting point?',
                                options: ['An arbitrary vertex', 'The root', 'The minimum degree vertex', 'The vertex with maximum edges'],
                                correct: 0
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 17: COMPETITIVE PROGRAMMING
    // ============================================================
    'competitive-programming': {
        id: 'competitive-programming',
        title: 'Competitive Programming',
        level: 3,
        order: 17,
        description: 'Contest strategies, templates, and problem patterns',
        estimatedHours: 12,
        prerequisites: ['dynamic-programming', 'advanced-graphs'],
        modules: [
            {
                id: 'cp-basics',
                title: 'Contest Fundamentals',
                order: 1,
                lessons: [
                    {
                        id: 'cp-01',
                        title: 'Fast I/O, Templates, and Common Patterns',
                        objectives: ['Speed up I/O', 'Build a reusable contest template', 'Recognize common problem patterns'],
                        content: `<h3>Competitive Programming</h3><p>Fast I/O, contest templates, and pattern recognition.</p>`,
                        codeExamples: [],
                        quizQuestions: [
                            {
                                id: 'cp-01-q1',
                                type: 'mcq',
                                question: 'Which line speeds up C++ stream I/O for contests?',
                                options: ['ios::sync_with_stdio(false);', 'std::cout.tie(nullptr);', 'setvbuf(stdout, NULL, _IONBF, 0);', 'All of the above'],
                                correct: 3
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ============================================================
    // TOPIC 18: PRACTICAL PROJECTS
    // ============================================================
    'practical-projects': {
        id: 'practical-projects',
        title: 'Practical DSA Projects',
        level: 3,
        order: 18,
        description: 'Real-world projects applying DSA concepts',
        estimatedHours: 15,
        prerequisites: ['competitive-programming'],
        modules: [
            {
                id: 'projects-basics',
                title: 'Capstone Projects',
                order: 1,
                lessons: [
                    {
                        id: 'proj-01',
                        title: 'Text Editor with Undo/Redo',
                        objectives: ['Design data structures for text editor', 'Implement undo/redo with stacks', 'Handle cursor movement efficiently'],
                        content: `<h3>Project: Text Editor</h3><p>Gap buffer, rope data structure, or dual-stack approach for undo/redo.</p>`,
                        codeExamples: [],
                        quizQuestions: [
                            {
                                id: 'proj-01-q1',
                                type: 'mcq',
                                question: 'Which data structure pair is commonly used to implement undo and redo?',
                                options: ['Two stacks', 'Two queues', 'A hash map and a set', 'A linked list and a heap'],
                                correct: 0
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
