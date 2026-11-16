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
                            'Define and distinguish O, ╬⌐, ╬ÿ notations',
                            'Analyze time complexity of iterative algorithms',
                            'Analyze space complexity'
                        ],
                        content: `
                            <h3>Asymptotic Notation</h3>
                            <p>Asymptotic notation describes the growth rate of functions as input size approaches infinity.</p>
                            
                            <h4>Big-O (Upper Bound)</h4>
                            <p>f(n) = O(g(n)) if Γêâ c > 0, nΓéÇ > 0 such that 0 Γëñ f(n) Γëñ c┬╖g(n) for all n ΓëÑ nΓéÇ</p>
                            <p>Meaning: f grows <strong>no faster than</strong> g (worst case)</p>
                            
                            <h4>Big-Omega (Lower Bound)</h4>
                            <p>f(n) = ╬⌐(g(n)) if Γêâ c > 0, nΓéÇ > 0 such that 0 Γëñ c┬╖g(n) Γëñ f(n) for all n ΓëÑ nΓéÇ</p>
                            <p>Meaning: f grows <strong>at least as fast as</strong> g (best case)</p>
                            
                            <h4>Big-Theta (Tight Bound)</h4>
                            <p>f(n) = ╬ÿ(g(n)) if f(n) = O(g(n)) AND f(n) = ╬⌐(g(n))</p>
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
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(ΓêÜn)</td><td style="padding:8px;border:1px solid #ddd;">Square root</td><td style="padding:8px;border:1px solid #ddd;">Trial division</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(n)</td><td style="padding:8px;border:1px solid #ddd;">Linear</td><td style="padding:8px;border:1px solid #ddd;">Linear search</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(n log n)</td><td style="padding:8px;border:1px solid #ddd;">Linearithmic</td><td style="padding:8px;border:1px solid #ddd;">Merge sort</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(n┬▓)</td><td style="padding:8px;border:1px solid #ddd;">Quadratic</td><td style="padding:8px;border:1px solid #ddd;">Bubble sort</td></tr>
                                <tr><td style="padding:8px;border:1px solid #ddd;">O(2Γü┐)</td><td style="padding:8px;border:1px solid #ddd;">Exponential</td><td style="padding:8px;border:1px solid #ddd;">Subset generation</td></tr>
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
// O(n┬▓) - Nested loops
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
                                question: 'If f(n) = O(n┬▓), then f(n) = O(n┬│) is also true.',
                                correct: true,
                                explanation: 'Big-O is an upper bound. If f grows no faster than n┬▓, it also grows no faster than n┬│.'
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
                                <li>T(n) = T(n/2) + O(1) ΓåÆ O(log n) ΓÇö Binary search</li>
                                <li>T(n) = 2T(n/2) + O(n) ΓåÆ O(n log n) ΓÇö Merge sort</li>
                                <li>T(n) = T(n-1) + O(1) ΓåÆ O(n) ΓÇö Linear recursion</li>
                                <li>T(n) = 2T(n-1) + O(1) ΓåÆ O(2Γü┐) ΓÇö Fibonacci (naive)</li>
                            </ul>
                            
                            <h4>Master Theorem</h4>
                            <p>For T(n) = a┬╖T(n/b) + f(n) where a ΓëÑ 1, b > 1:</p>
                            <ol>
                                <li>If f(n) = O(n^(log_b(a) - ╬╡)) for some ╬╡ > 0: T(n) = ╬ÿ(n^(log_b(a)))</li>
                                <li>If f(n) = ╬ÿ(n^(log_b(a)) ┬╖ log^k(n)): T(n) = ╬ÿ(n^(log_b(a)) ┬╖ log^(k+1)(n))</li>
                                <li>If f(n) = ╬⌐(n^(log_b(a) + ╬╡)) and a┬╖f(n/b) Γëñ c┬╖f(n) for c < 1: T(n) = ╬ÿ(f(n))</li>
                            </ol>
                            
                            <h4>Examples</h4>
                            <ul>
                                <li>Merge sort: a=2, b=2, f(n)=n ΓåÆ logΓéé2=1, f(n)=n=╬ÿ(n┬╣) ΓåÆ Case 2, k=0 ΓåÆ ╬ÿ(n log n)</li>
                                <li>Binary search: a=1, b=2, f(n)=1 ΓåÆ logΓéé1=0, f(n)=1=╬ÿ(nΓü░) ΓåÆ Case 2, k=0 ΓåÆ ╬ÿ(log n)</li>
                                <li>Strassen: a=7, b=2, f(n)=n┬▓ ΓåÆ logΓéé7Γëê2.81, f(n)=n┬▓=O(n┬▓┬╖Γü╕┬╣Γü╗╬╡) ΓåÆ Case 1 ΓåÆ ╬ÿ(n┬▓┬╖Γü╕┬╣)</li>
                            </ul>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Recursive Fibonacci - Exponential',
                                code: `// T(n) = T(n-1) + T(n-2) + O(1) Γëê O(2Γü┐)
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
                                options: ['O(n)', 'O(n log n)', 'O(n┬▓)', 'O(log n)'],
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
                                <li><strong>Potential:</strong> Define potential function ╬ª</li>
                            </ul>
                            
                            <h4>Dynamic Array (vector) Example</h4>
                            <p>When vector capacity is exceeded, it allocates 2├ù capacity and copies elements.</p>
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
                                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n┬▓)'],
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
                                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n┬▓)'],
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
                                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n┬▓)'],
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
                                options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n┬▓)'],
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
                            <pre><code>// Fibonacci: T(n) = T(n-1) + T(n-2) + O(1) Γëê O(2Γü┐)
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
                                code: `// Tower of Hanoi - O(2Γü┐) moves
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
                                options: ['O(n)', 'O(n┬▓)', 'O(2Γü┐)', 'O(n log n)'],
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
                                question: 'Memoization changes the time complexity of recursive Fibonacci from O(2Γü┐) to O(n).',
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
// Place n queens on n├ùn board so no two attack each other
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
// Fill 9├ù9 grid following Sudoku rules
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
                                <li><strong>Balanced tree:</strong> Height difference Γëñ 1 for all nodes</li>
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
                            <pre><code>// Preorder: Root ΓåÆ Left ΓåÆ Right
void preorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    result.push_back(root->val);
    preorder(root->left.get(), result);
    preorder(root->right.get(), result);
}
// Inorder: Left ΓåÆ Root ΓåÆ Right (BST gives sorted order)
void inorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    inorder(root->left.get(), result);
    result.push_back(root->val);
    inorder(root->right.get(), result);
}
// Postorder: Left ΓåÆ Right ΓåÆ Root
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
                                options: ['O(n)', 'O(log n)', 'O(ΓêÜn)', '1.44*logΓéé(n+2)'],
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
                                options: ['O(n)', 'O(n log n)', 'O(4n)', 'O(n┬▓)'],
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
// Rolling hash: H = (cΓéü┬╖p^(m-1) + cΓéé┬╖p^(m-2) + ... + cΓéÿ) mod MOD
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
// Adjacency Matrix - O(V┬▓) space, O(1) edge lookup
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
                            <p>Linear ordering of vertices such that for every directed edge uΓåÆv, u comes before v. Only for DAGs.</p>
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
                                options: ['O(V)', 'O(E)', 'O(V+E)', 'O(V┬▓)'],
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
                            <p>O(V┬│) for dense graphs. Also detects negative cycles.</p>
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
                                options: ['O(V log V)', 'O(E log V)', 'O((V+E) log V)', 'O(V┬▓)'],
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
                                explanation: 'Floyd-Warshall is O(V┬│). For sparse graphs, V├ùDijkstra is O(VE log V) which is better.'
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
                        objectives: [
                            'Implement the O(n log n) comparison sorts used in production C++ code',
                            'Derive merge sort and formalize its O(n log n) bound',
                            'Apply partitioning (Lomuto/Hoare) to implement quick sort',
                            'Build a max-heap and extract elements to implement heap sort',
                            'Choose between merge/quick/heap sort given constraints (stability, memory, adversarial input)'
                        ],
                        content: `
                            <h3>Efficient Comparison Sorts</h3>
                            <p>Comparison-based sorting has a hard information-theoretic floor of Ω(n log n) comparisons — the ⌈log₂(n!)⌉ decision-tree argument. Bubble, selection and insertion sort (see Chapter 2 of your course notes) are O(n²); the three algorithms in this lesson hit the bound and are the workhorses behind <code>std::sort</code>, <code>std::stable_sort</code> and <code>std::partial_sort</code>.</p>

                            <h4>Merge Sort — divide, conquer, merge</h4>
                            <p>Merge sort splits the array at the midpoint, recursively sorts both halves, then merges them with two pointers. Every level of the recursion tree touches n elements and the tree has log₂n levels, so the total work is Θ(n log n) — always, regardless of input distribution.</p>
                            <ul>
                                <li><strong>Stable:</strong> yes (equal elements keep their relative order if the merge prefers the left run)</li>
                                <li><strong>Auxiliary space:</strong> O(n) for the merge buffer</li>
                                <li><strong>When to use:</strong> linked lists (no random access needed), external sorting (sort chunks too big for RAM), stable output required</li>
                                <li><strong>Practice in your materials:</strong> see <code>ch-2.pdf</code> (merge sort analysis), <code>sorting 74869.pdf</code> (merge/quick sort lectures), <code>ch-8.pdf</code> (advanced sorts and external sorting)</li>
                            </ul>

                            <h4>Quick Sort — partition in place</h4>
                            <p>Quick sort picks a pivot and partitions the array so everything left of the pivot is smaller and everything right is larger. The recursion then sorts both sides. With a good pivot (e.g. median-of-three or randomized) the expected depth is O(log n); with a bad pivot (already-sorted data and first-element pivot) it degrades to O(n²).</p>
                            <ul>
                                <li><strong>Hoare partition:</strong> two pointers converge from both ends — fewer swaps than Lomuto</li>
                                <li><strong>Lomuto partition:</strong> single scan, index j of last ≤ pivot — simpler to memorize</li>
                                <li><strong>Worst case:</strong> O(n²) on adversarial input; fix with randomized pivot or introsort (quick sort + heap sort fallback)</li>
                                <li><strong>Cache-friendly, in-place:</strong> no auxiliary buffer; the reason <code>std::sort</code> is typically introsort, not merge sort</li>
                            </ul>

                            <h4>Heap Sort — implicit heap, no recursion</h4>
                            <p>Heap sort builds a max-heap in O(n) with bottom-up sift-down, then repeatedly swaps the root (maximum) with the last element and sifts the reduced heap — n extractions of O(log n) each give O(n log n) worst case.</p>
                            <ul>
                                <li><strong>In-place and not stable</strong></li>
                                <li><strong>Worst case equals average case</strong> — safe choice against adversarial input</li>
                                <li><strong>O(1) extra space</strong> — pairs naturally with priority queues (see the priority-queue lesson)</li>
                            </ul>

                            <h4>Picking the right sort</h4>
                            <table>
                                <thead><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable</th></tr></thead>
                                <tbody>
                                    <tr><td>Merge sort</td><td>n log n</td><td>n log n</td><td>n log n</td><td>O(n)</td><td>Yes</td></tr>
                                    <tr><td>Quick sort</td><td>n log n</td><td>n log n</td><td>n²</td><td>O(log n) stack</td><td>No</td></tr>
                                    <tr><td>Heap sort</td><td>n log n</td><td>n log n</td><td>n log n</td><td>O(1)</td><td>No</td></tr>
                                    <tr><td>std::sort (introsort)</td><td>n log n</td><td>n log n</td><td>n log n</td><td>O(log n)</td><td>No</td></tr>
                                </tbody>
                            </table>
                            <p><strong>Rule of thumb:</strong> in-place and cache-friendly beats everything else for arrays, so quick/introsort wins; when you need stability or worst-case guarantees with big data, merge sort; when memory is tight and input may be adversarial, heap sort.</p>

                            <h4>Complexity verification</h4>
                            <p>Use the recurrences T(n) = 2T(n/2) + Θ(n) (merge sort) and T(n) = T(n-1) + Θ(n) (quick sort, worst) solved with the master theorem / recursion-tree method — your Algorithm Analysis workbook and <code>ALgo_Efficiency 74864.pdf</code> cover the technique.</p>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Merge Sort (top-down)',
                                code: `// Merge sort — O(n log n) time, O(n) auxiliary, stable
void merge(std::vector<int>& arr, int l, int m, int r) {
    std::vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    std::vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    size_t i = 0, j = 0;
    int k = l;
    while (i < left.size() && j < right.size())
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`
                            },
                            {
                                language: 'cpp',
                                title: 'Quick Sort (Lomuto partition)',
                                code: `// Quick sort — average O(n log n), in-place, not stable
int partition(std::vector<int>& arr, int l, int r) {
    int pivot = arr[r];
    int i = l;
    for (int j = l; j < r; ++j)
        if (arr[j] <= pivot) std::swap(arr[i++], arr[j]);
    std::swap(arr[i], arr[r]);
    return i;
}

void quickSort(std::vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int p = partition(arr, l, r);
    quickSort(arr, l, p - 1);
    quickSort(arr, p + 1, r);
}`
                            },
                            {
                                language: 'cpp',
                                title: 'Heap Sort',
                                code: `// Heap sort — O(n log n) worst case, O(1) extra, not stable
void siftDown(std::vector<int>& arr, int n, int root) {
    int i = root;
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, largest = i;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest == i) break;
        std::swap(arr[i], arr[largest]);
        i = largest;
    }
}

void heapSort(std::vector<int>& arr) {
    int n = static_cast<int>(arr.size());
    for (int i = n / 2 - 1; i >= 0; --i) siftDown(arr, n, i);  // build O(n)
    for (int end = n - 1; end > 0; --end) {
        std::swap(arr[0], arr[end]);
        siftDown(arr, end, 0);
    }
}`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement the merge routine: combine two already-sorted contiguents arr[l..m] and arr[m+1..r] into one sorted range.',
                                code: `void merge(std::vector<int>& arr, int l, int m, int r) {
    std::vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    std::vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    size_t i = 0, j = 0;
    int k = l;
    // TODO: fill arr[k..r] from left/right, then copy any remainder
}`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace quick sort (Lomuto partition) on arr = [7, 2, 1, 6, 8, 5, 3, 4]. Show the array after each partition call and the final pivot indices.',
                                code: `int partition(std::vector<int>& arr, int l, int r) {
    int pivot = arr[r];   // pivot = 4
    int i = l;
    for (int j = l; j < r; ++j)
        if (arr[j] <= pivot) std::swap(arr[i++], arr[j]);
    std::swap(arr[i], arr[r]);
    return i;
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'sort-01-q1',
                                type: 'mcq',
                                question: 'Which of the following is an O(n log n) sort?',
                                options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
                                correct: 2,
                                explanation: 'Merge sort always performs Θ(n log n) comparisons on every level of its recursion tree.'
                            },
                            {
                                id: 'sort-01-q2',
                                type: 'true-false',
                                question: 'Heap sort guarantees O(n log n) worst-case time with O(1) auxiliary space, but is not stable.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: 'Heap sort is in-place and has no per-level recursion allocation; relative order of equal keys is not preserved.'
                            },
                            {
                                id: 'sort-01-q3',
                                type: 'mcq',
                                question: 'Quick sort degrades to O(n²) primarily when:',
                                options: ['The array contains duplicates', 'Pivots are consistently extremes of the subarray', 'The array is smaller than 16 elements', 'Stability is required'],
                                correct: 1,
                                explanation: 'First/last-element pivot on already-sorted input yields maximally unbalanced partitions T(n) = T(n-1) + Θ(n) = Θ(n²). Randomized pivots or median-of-three fix this in expectation.'
                            },
                            {
                                id: 'sort-01-q4',
                                type: 'mcq',
                                question: 'For external sorting of a 10 GB file on a machine with 1 GB RAM, the classic choice is:',
                                options: ['Quick sort', 'Heap sort', 'Merge sort (multiway)', 'Insertion sort'],
                                correct: 2,
                                explanation: 'Multiway merge sort minimizes disk seeks by processing k sorted runs per pass; this is the canonical external-sort algorithm (see ch-8.pdf and Chapter 2 of your notes on internal/external sorting).'
                            },
                            {
                                id: 'sort-01-q5',
                                type: 'true-false',
                                question: 'std::sort is typically implemented as introsort: quick sort that falls back to heap sort when recursion depth exceeds a threshold.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: 'Introsort (Musser, 1997) bounds quick sort recursion depth to ⌊log₂ n⌋ and switches to heap sort, guaranteeing O(n log n) worst case with good practical constants.'
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
                        objectives: [
                            'Identify the greedy-choice property and the exchange-argument proof technique',
                            'Solve maximum non-overlapping interval scheduling with earliest-finish-first selection',
                            'Compare fractional vs 0/1 knapsack and see where greedy fails',
                            'Build Huffman codes from a frequency table and decode a bitstream',
                            'Know the classic greedy counterexamples before trusting the technique'
                        ],
                        content: `
                            <h3>Greedy Algorithms</h3>
                            <p>A greedy algorithm builds a solution piece by piece, committing to the locally best choice at each step without reconsidering it. It works when two properties hold:</p>
                            <ul>
                                <li><strong>Greedy-choice property:</strong> some globally optimal solution includes the locally best step</li>
                                <li><strong>Optimal substructure:</strong> after making the greedy choice, the remaining subproblem is of the same form</li>
                            </ul>
                            <p><strong>Exchange argument</strong> — the standard way to prove optimality: take an arbitrary optimal solution, and show it can be transformed, one swap at a time, into the greedy solution without getting worse. Your AASTU syllabus (SWEG 3103, Week 12) explicitly covers greedy techniques; the canonical theory follows this lesson.</p>

                            <h4>Maximum Interval Scheduling</h4>
                            <p>Given n intervals with start and end times, select the largest subset of mutually non-overlapping intervals.</p>
                            <ul>
                                <li><strong>Wrong greedy choices:</strong> earliest start (blocks everything), shortest interval (can be surrounded by two longer ones), fewest conflicts (fails on crafted instances)</li>
                                <li><strong>Correct greedy choice:</strong> pick the interval with the <strong>earliest finish time</strong> — it leaves maximum room for the rest. Proof: exchange any interval in an optimal solution that finishes later with the earliest-finishing one</li>
                                <li><strong>Algorithm:</strong> sort by finish time, sweep once, take every interval that starts at or after the last chosen finish — Θ(n log n) sort + Θ(n) sweep</li>
                            </ul>

                            <h4>Knapsack — where greedy fails</h4>
                            <p>Two variants matter:</p>
                            <ul>
                                <li><strong>Fractional knapsack:</strong> take items by value/weight ratio; the greedy solution is optimal (exchange argument: swap a unit of lower-density toward higher-density)</li>
                                <li><strong>0/1 knapsack:</strong> take each item whole or not at all — greedy ratio fails. Weights {10, 20, 30}, values {60, 100, 120}, capacity 50: greedy ratio picks item 1 (60) then item 2 (100) — total 160 — but optimal is {item 2, item 3} = 220. Your course notes cover knapsack-adjacent dynamic programming in the DP lesson; greedy is the wrong tool here</li>
                            </ul>

                            <h4>Huffman Coding</h4>
                            <p>Given character frequencies, build a prefix-free binary code minimizing total encoded length. The greedy step: <strong>repeatedly merge the two lowest-frequency nodes</strong> into a parent whose weight is their sum, until one tree remains.</p>
                            <ul>
                                <li>Depth of each leaf ∝ -log₂(freq/total) — the resulting code approaches entropy</li>
                                <li>Implement with a min-heap; tie-breaking doesn't affect optimality</li>
                                <li>Decoding is a root-to-leaf walk per bit — O(1) per bit with a small table</li>
                            </ul>

                            <h4>Greedy toolbox vs DP</h4>
                            <table>
                                <thead><tr><th>Problem</th><th>Technique</th><th>Property</th></tr></thead>
                                <tbody>
                                    <tr><td>Interval scheduling</td><td>Greedy (earliest finish)</td><td>Exchange argument</td></tr>
                                    <tr><td>Fractional knapsack</td><td>Greedy (ratio)</td><td>Density intuition, exchange proof</td></tr>
                                    <tr><td>0/1 knapsack</td><td>Dynamic programming</td><td>Greedy fails (counterexample above)</td></tr>
                                    <tr><td>Coin change (canonical coins)</td><td>Greedy</td><td>Works for 1,5,10,25 — fails for {1,3,4}</td></tr>
                                    <tr><td>Huffman coding</td><td>Greedy (merge two smallest)</td><td>Priority-queue exchange</td></tr>
                                    <tr><td>Dijkstra / Prim / Kruskal</td><td>Greedy</td><td>Covered in later lessons</td></tr>
                                </tbody>
                            </table>
                            <p><strong>Decision rule:</strong> if you cannot exhibit a clean exchange argument, you cannot trust greedy — use DP or search.</p>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Interval Scheduling (earliest finish first)',
                                code: `struct Interval { int start, finish, id; };

std::vector<int> maxIndependentIntervals(std::vector<Interval> v) {
    std::sort(v.begin(), v.end(),
              [](const Interval& a, const Interval& b) { return a.finish < b.finish; });
    std::vector<int> chosen;
    int lastFinish = INT_MIN;
    for (const auto& iv : v) {
        if (iv.start >= lastFinish) {
            chosen.push_back(iv.id);
            lastFinish = iv.finish;
        }
    }
    return chosen;   // Θ(n log n)
}`
                            },
                            {
                                language: 'cpp',
                                title: 'Fractional Knapsack',
                                code: `struct Item { double value, weight; };

double fractionalKnapsack(std::vector<Item> items, double capacity) {
    std::sort(items.begin(), items.end(),
              [](const Item& a, const Item& b) {
                  return a.value / a.weight > b.value / b.weight;
              });
    double total = 0.0, remaining = capacity;
    for (const auto& item : items) {
        double take = std::min(item.weight, remaining);
        total += take * (item.value / item.weight);
        remaining -= take;
        if (remaining == 0) break;
    }
    return total;
}`
                            },
                            {
                                language: 'cpp',
                                title: 'Huffman Coding (build the tree)',
                                code: `struct Node {
    int freq;
    char ch;
    Node *left, *right;
    bool operator>(const Node& o) const { return freq > o.freq; }
};

Node* buildHuffman(const std::unordered_map<char, int>& freq) {
    std::priority_queue<Node*, std::vector<Node*>, std::greater<Node*>> pq;
    for (auto& [c, f] : freq) pq.push(new Node{f, c, nullptr, nullptr});
    while (pq.size() > 1) {
        Node* a = pq.top(); pq.pop();
        Node* b = pq.top(); pq.pop();
        Node* merged = new Node{a->freq + b->freq, '\\0', a, b};
        pq.push(merged);
    }
    return pq.top();
}`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement the earliest-finish-first interval scheduler: given intervals, return the maximum count of non-overlapping ones.',
                                code: `int maxSchedule(std::vector<std::pair<int,int>> intervals) {
    // pair = (start, finish)
    // TODO: sort by finish, sweep, count non-overlapping intervals
}`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace Huffman construction for frequencies A=5, B=9, C=12, D=13, E=16, F=45. Show the merge order and the depth of A in the final tree.',
                                code: `Frequencies: A=5  B=9  C=12  D=13  E=16  F=45
Min-heap pop order (each step merges the two smallest):
  1. merge (5, 9)   -> node(14)
  2. merge (12, 13) -> node(25)
  3. merge (14, 16) -> node(30)
  4. merge (25, 30) -> node(55)
  5. merge (45, 55) -> node(100)`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'greedy-01-q1',
                                type: 'mcq',
                                question: 'Which strategy solves the maximum non-overlapping interval scheduling problem?',
                                options: ['Earliest start time', 'Earliest finish time', 'Longest interval first', 'Shortest interval first'],
                                correct: 1,
                                explanation: 'Earliest-finish-first maximizes remaining room; provable with an exchange argument.'
                            },
                            {
                                id: 'greedy-01-q2',
                                type: 'true-false',
                                question: 'The greedy ratio strategy (value/weight) is optimal for 0/1 knapsack.',
                                options: ['True', 'False'],
                                correct: false,
                                explanation: 'Counterexample: capacity 50, items (weight, value) = (10, 60), (20, 100), (30, 120). Greedy by ratio takes items 1 and 2 for 160; optimal is items 2 and 3 for 220.'
                            },
                            {
                                id: 'greedy-01-q3',
                                type: 'mcq',
                                question: 'Huffman coding repeatedly merges:',
                                options: ['The two most frequent nodes', 'The two least frequent nodes', 'Any two arbitrary nodes', 'The node with the most children'],
                                correct: 1,
                                explanation: 'Merging the two smallest frequencies each step yields the optimal prefix-free code (up to symbol symmetry).'
                            },
                            {
                                id: 'greedy-01-q4',
                                type: 'mcq',
                                question: 'For canonical coin systems {1, 5, 10, 25}, greedy always gives the fewest coins. For the system {1, 3, 4}, which amount breaks greedy?',
                                options: ['6', '7', '11', 'There is no counterexample'],
                                correct: 0,
                                explanation: 'Greedy gives 4+1+1 for 6 (3 coins) but optimal is 3+3 (2 coins). Always verify with small cases before trusting greedy.'
                            },
                            {
                                id: 'greedy-01-q5',
                                type: 'true-false',
                                question: 'Interval scheduling is solvable in Θ(n log n): sort by finish time, then sweep once taking any interval that starts at or after the last chosen finish.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: 'The sweep visits each interval once after the sort; exchange argument proves optimality.'
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
                        objectives: [
                            'Recognize overlapping subproblems and optimal substructure',
                            'Convert naive recursion into memoized top-down DP',
                            'Convert memoized recursion into iterative bottom-up tabulation',
                            'Solve the 0/1 knapsack, LIS and LCS problems',
                            'Apply space optimization (rolling arrays) when only the previous row is needed'
                        ],
                        content: `
                            <h3>Dynamic Programming — Memoization and Tabulation</h3>
                            <p>Dynamic programming solves problems by <strong>solving each distinct subproblem once</strong> and reusing the results. Two prerequisites must hold:</p>
                            <ul>
                                <li><strong>Optimal substructure:</strong> an optimal solution contains optimal solutions to its subproblems</li>
                                <li><strong>Overlapping subproblems:</strong> the recursion tree recomputes the same subproblems exponentially many times (plain Fibonacci recurses 2^n times but has only n distinct subproblems)</li>
                            </ul>

                            <h4>Top-down vs Bottom-up</h4>
                            <table>
                                <thead><tr><th>Style</th><th>Form</th><th>Complexity</th><th>Notes</th></tr></thead>
                                <tbody>
                                    <tr><td>Naive recursion</td><td>fib(n) = fib(n-1) + fib(n-2)</td><td>O(2^n)</td><td>No state reuse; explodes fast</td></tr>
                                    <tr><td>Memoization (top-down)</td><td>Recursive + cache</td><td>O(n)</td><td>Calls must match states; watch stack depth</td></tr>
                                    <tr><td>Tabulation (bottom-up)</td><td>Iterative dp[]</td><td>O(n)</td><td>No recursion overhead; explicit loop order</td></tr>
                                    <tr><td>Space-optimized</td><td>Rolling variables/array</td><td>O(1) or O(n)</td><td>Only keep what the recurrence reads</td></tr>
                                </tbody>
                            </table>
                            <p><strong>Pattern:</strong> write the recurrence → choose state → check transitions → add base cases → decide data structure → optimize space.</p>

                            <h4>Fibonacci, three ways</h4>
                            <pre><code>// 1) exponential recursion — 2^n time
long long fib(int n) { return n &lt; 2 ? n : fib(n - 1) + fib(n - 2); }

// 2) memoized top-down — O(n)
long long fibM(int n, vector&lt;long long&gt;&amp; memo) {
    if (n &lt; 2) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fibM(n - 1, memo) + fibM(n - 2, memo);
}

// 3) tabulation — O(n) time, O(1) space
long long fibT(int n) {
    long long a = 0, b = 1;
    for (int i = 2; i &lt;= n; ++i) { long long c = a + b; a = b; b = c; }
    return n &lt; 2 ? n : b;
}</code></pre>

                            <h4>0/1 Knapsack (the anchor in your materials)</h4>
                            <p>Capacity W, items with weight wᵢ and value vᵢ; choose a subset maximizing value with total weight ≤ W. Your course materials introduce the knapsack family (see the greedy lesson for the fractional variant and Preiss for the DP treatment):</p>
                            <pre><code>int dp[i][w] = best value using first i items with capacity w
dp[i][w] = max(dp[i-1][w],                    // skip item i
               dp[i-1][w-w_i] + v_i)          // take item i (if w_i &lt;= w)
dp[0][*] = dp[*][0] = 0</code></pre>
                            <p>O(nW) time. Space-optimized to O(W) with a single descending row (iterate w from W down so each item is used at most once).</p>

                            <h4>LCS and LIS</h4>
                            <p><strong>Longest Common Subsequence:</strong> dp[i][j] = LCS of s1[0..i) and s2[0..j); if s1[i-1]==s2[j-1] then dp[i][j] = dp[i-1][j-1]+1 else max(dp[i-1][j], dp[i][j-1]). O(nm).</p>
                            <p><strong>Longest Increasing Subsequence:</strong> two approaches — dp[n²] (dp[i] = best ending at i) or patience sorting with a tails array — O(n log n). Patience sorting: maintain <code>tails</code>, binary-search the first tail ≥ x.</p>

                            <h4>Common DP categories to master</h4>
                            <ul>
                                <li><strong>Knapsack family:</strong> 0/1, bounded, unbounded (coin change min coins)</li>
                                <li><strong>Sequence DP:</strong> LCS, LIS, edit distance, palindromic subsequence</li>
                                <li><strong>Grid DP:</strong> paths, min-sum path, maximal square</li>
                                <li><strong>Interval DP:</strong> matrix chain, burst balloons</li>
                                <li><strong>Partition DP:</strong> integer partition, subset-sum</li>
                            </ul>

                            <h4>Practice &amp; source notes</h4>
                            <p>The <code>worksheets</code> and complexity materials in your library drill the analysis; the knapsack connection is covered in Preiss. For recurrences, revisit the complexity lesson — DP recurrences follow the same growth-rate reasoning.</p>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: '0/1 Knapsack (space-optimized to O(W))',
                                code: `int knapSack01(int W, const std::vector<int>& wt, const std::vector<int>& val) {
    std::vector<int> dp(W + 1, 0);
    for (size_t i = 0; i < wt.size(); ++i)
        for (int w = W; w >= wt[i]; --w)        // descending keeps item i used once
            dp[w] = std::max(dp[w], dp[w - wt[i]] + val[i]);
    return dp[W];
}`
                            },
                            {
                                language: 'cpp',
                                title: 'LIS in O(n log n) — patience sorting',
                                code: `int lis(const std::vector<int>& a) {
    std::vector<int> tails;
    for (int x : a) {
        auto it = std::lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return static_cast<int>(tails.size());
}`
                            },
                            {
                                language: 'cpp',
                                title: 'Edit Distance (Levenshtein)',
                                code: `int editDistance(const std::string& a, const std::string& b) {
    std::vector<std::vector<int>> dp(a.size() + 1, std::vector<int>(b.size() + 1));
    for (size_t i = 0; i <= a.size(); ++i) dp[i][0] = static_cast<int>(i);
    for (size_t j = 0; j <= b.size(); ++j) dp[0][j] = static_cast<int>(j);
    for (size_t i = 1; i <= a.size(); ++i)
        for (size_t j = 1; j <= b.size(); ++j)
            dp[i][j] = (a[i - 1] == b[j - 1]) ? dp[i - 1][j - 1]
                     : 1 + std::min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
    return dp[a.size()][b.size()];
}`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement longest common subsequence length for two strings.',
                                code: `int lcs(const std::string& a, const std::string& b) {
    int n = (int)a.size(), m = (int)b.size();
    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(m + 1, 0));
    // TODO: fill dp and return dp[n][m]
}`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace the memoized fib cache for fib(5) — list the distinct calls computed and the final result. Compare against naive recursion call count.',
                                code: `long long fibM(int n, vector<long long>& memo) {
    if (n < 2) return n;
    if (memo[n] != -1) return memo[n];   // memo hit
    return memo[n] = fibM(n - 1, memo) + fibM(n - 2, memo);
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'dp-01-q1',
                                type: 'mcq',
                                question: 'Which property guarantees DP will work on a problem?',
                                options: ['Optimal substructure only', 'Overlapping subproblems only', 'Both optimal substructure and overlapping subproblems', 'Polynomial time budget'],
                                correct: 2,
                                explanation: 'Optimal substructure alone gives divide-and-conquer; overlapping subproblems alone give nothing. DP is the intersection.'
                            },
                            {
                                id: 'dp-01-q2',
                                type: 'true-false',
                                question: 'Plain recursive fib(n) recomputes fib(k) roughly fib(n-k) times — exponential behavior from polynomially many distinct states.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: 'fib(2) is recomputed ~n/2 times etc.; memoizing prunes to n distinct states → O(n).'
                            },
                            {
                                id: 'dp-01-q3',
                                type: 'mcq',
                                question: '0/1 knapsack with capacity W and n items via tabulation runs in:',
                                options: ['O(nW)', 'O(n + W)', 'O(2^n)', 'O(W log n)'],
                                correct: 0,
                                explanation: 'nW cells filled in O(1) each; pseudo-polynomial, not polynomial in the input size.'
                            },
                            {
                                id: 'dp-01-q4',
                                type: 'true-false',
                                question: 'LIS can be solved in O(n log n) with a maintained `tails` array and binary search, and the tails array is sorted ascending.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: 'Patience sorting: tails[i] is the smallest ending value of an increasing subsequence of length i+1; invariant tails sorted.'
                            },
                            {
                                id: 'dp-01-q5',
                                type: 'mcq',
                                question: 'In the descending-row 0/1 knapsack space optimization (w from W to wtᵢ), the purpose of the descending direction is:',
                                options: ['To preserve optimal substructure', 'To ensure each item is considered at most once', 'To improve cache locality', 'To reduce rounding error'],
                                correct: 1,
                                explanation: 'Ascending iteration would let the same item be taken multiple times (that is the unbounded knapsack loop order).'
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
                        objectives: [
                            'Apply the divide-and-conquer template: divide, conquer, combine',
                            'Use the master theorem to solve recurrences of the form T(n) = aT(n/b) + f(n)',
                            'Implement merge sort revisited and quick select for kth smallest',
                            'Sketch the O(n log n) closest-pair-of-points algorithm',
                            'Recognize when a problem yields to D&C vs DP vs greedy'
                        ],
                        content: `
                            <h3>Divide and Conquer</h3>
                            <p>The divide-and-conquer paradigm: <strong>(1) Divide</strong> the problem into smaller instances of the same problem, <strong>(2) Conquer</strong> them recursively, <strong>(3) Combine</strong> their answers into the final answer. The recursion stops at small base cases.</p>
                            <p>The sorting-line material in your library (e.g. <code>ch-2.pdf</code>, <code>sorting 74869.pdf</code> — merge sort, quick sort) is the canonical D&amp;C warmup. This lesson extends it to problems where the combine step is nontrivial.</p>

                            <h4>Master theorem (quick reference)</h4>
                            <p>For T(n) = aT(n/b) + f(n), compare f(n) with n^(log_b a):</p>
                            <ul>
                                <li><strong>f(n) = Θ(n^log_b a - ε)</strong> ⇒ T(n) = Θ(n^log_b a)</li>
                                <li><strong>f(n) = Θ(n^log_b a)</strong> ⇒ T(n) = Θ(n^log_b a · log n)  (e.g. merge sort)</li>
                                <li><strong>f(n) = Ω(n^log_b a + ε)</strong> and regularity af(n/b) ≤ cf(n) ⇒ T(n) = Θ(f(n))</li>
                            </ul>
                            <p><strong>Worked examples:</strong> T(n) = 2T(n/2) + n → Θ(n log n). T(n) = T(n/2) + c → Θ(log n). T(n) = 8T(n/2) + n² → Θ(n³) (case 1). T(n) = 2T(n/2) + n log n needs the extended version → Θ(n log² n).</p>

                            <h4>Quick Select — kth smallest in average O(n)</h4>
                            <p>Same partition routine as quick sort, but recurse only into the side containing index k:</p>
                            <pre><code>int kthSmallest(vector&lt;int&gt;&amp; a, int l, int r, int k) {
    if (l == r) return a[l];
    int p = partition(a, l, r);   // Lomuto or Hoare, as in the sorting lesson
    if (k == p) return a[p];
    return k &lt; p ? kthSmallest(a, l, p - 1, k) : kthSmallest(a, p + 1, r, k);
}</code></pre>
                            <p>Expected O(n); worst O(n²) with bad pivots — randomized pivoting or median-of-medians restores O(n) worst case. Quickselect is effectively "quicksort that keeps only one side".</p>

                            <h4>Closest Pair of Points</h4>
                            <p>Given n points in the plane, find the pair with minimum Euclidean distance. The naive O(n²) approach checks every pair; the D&amp;C solution is O(n log n):</p>
                            <ol>
                                <li><strong>Pre-sort</strong> points by x once.</li>
                                <li><strong>Divide</strong> by a vertical line x = medianX into L and R.</li>
                                <li><strong>Conquer</strong>: recurse on both halves; let d = min(dl, dr).</li>
                                <li><strong>Combine</strong>: any cross-pair closer than d must lie within a 2d-wide strip around the dividing line, and only a constant number (at most 6) of strip points must be checked per point (packing argument). Check points in the strip sorted by y.</li>
                            </ol>
                            <p>T(n) = 2T(n/2) + O(n log n) → O(n log² n); optimizing the strip merge to O(n) gives O(n log n) overall.</p>

                            <h4>When D&amp;C vs other paradigms</h4>
                            <table>
                                <thead><tr><th>Problem</th><th>Paradigm</th></tr></thead>
                                <tbody>
                                    <tr><td>Merge sort, inversions count, closest pair</td><td>Divide &amp; conquer</td></tr>
                                    <tr><td>Quick select, majority element</td><td>Divide &amp; conquer (quick-partition)</td></tr>
                                    <tr><td>Fibonacci with memo, subset sums</td><td>DP (shared subproblems)</td></tr>
                                    <tr><td>Huffman, interval scheduling</td><td>Greedy (exchange argument)</td></tr>
                                    <tr><td>Max subarray (Kadane)</td><td>DP / scan (not D&amp;C)</td></tr>
                                </tbody>
                            </table>

                            <h4>Inversions via merge sort (nested reuse)</h4>
                            <p>Counting inversions (pairs i &lt; j with a[i] &gt; a[j]) is a merge sort that adds a counter during merge: when taking from the right run, all remaining elements in the left run are inversions. Still O(n log n) — a beautiful example of piggybacking on an existing recurrence.</p>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Quick Select',
                                code: `int partition(std::vector<int>& a, int l, int r) {
    int pivot = a[r], i = l;
    for (int j = l; j < r; ++j)
        if (a[j] <= pivot) std::swap(a[i++], a[j]);
    std::swap(a[i], a[r]);
    return i;
}

int quickSelect(std::vector<int>& a, int l, int r, int k) {
    if (l == r) return a[l];
    int p = partition(a, l, r);
    return (k == p) ? a[p]
         : (k < p) ? quickSelect(a, l, p - 1, k)
                   : quickSelect(a, p + 1, r, k);
}`
                            },
                            {
                                language: 'cpp',
                                title: 'Closest Pair (combine step, sketch)',
                                code: `double stripClosest(std::vector<Point>& strip, double d) {
    std::sort(strip.begin(), strip.end(),
              [](const Point& a, const Point& b) { return a.y < b.y; });
    double best = d;
    for (size_t i = 0; i < strip.size(); ++i)
        for (size_t j = i + 1; j < strip.size() && (strip[j].y - strip[i].y) < best; ++j)
            best = std::min(best, dist(strip[i], strip[j]));
    return best;   // at most 6 neighbors per point are ever checked
}`
                            },
                            {
                                language: 'cpp',
                                title: 'Count Inversions (piggyback on merge sort)',
                                code: `long long mergeCount(std::vector<int>& a, int l, int m, int r) {
    std::vector<int> left(a.begin() + l, a.begin() + m + 1);
    std::vector<int> right(a.begin() + m + 1, a.begin() + r + 1);
    size_t i = 0, j = 0;
    long long inv = 0;
    int k = l;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) a[k++] = left[i++];
        else { a[k++] = right[j++]; inv += (long long)(left.size() - i); }
    }
    while (i < left.size()) a[k++] = left[i++];
    while (j < right.size()) a[k++] = right[j++];
    return inv;
}`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement quick select to return the kth smallest element (1-indexed) of a vector.',
                                code: `int quickSelect(std::vector<int>& a, int l, int r, int k) {
    if (l == r) return a[l];
    int p = l;  // TODO: partition in place around a[r], return pivot index
    // TODO: recurse into left or right of p
}`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace T(n) = 2T(n/2) + n for n = 8 by expanding the recurrence tree and verifying against the master theorem prediction Θ(n log n).',
                                code: `T(8) = 2*T(4) + 8
T(4) = 2*T(2) + 4
T(2) = 2*T(1) + 2
T(1) = 1`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'dc-01-q1',
                                type: 'mcq',
                                question: 'T(n) = 2T(n/2) + n corresponds to which of the following?',
                                options: ['Binary search', 'Merge sort', 'Quick select', 'Matrix multiplication'],
                                correct: 1,
                                explanation: 'Halving with n work at each node, binary recursion tree, Θ(n log n) — classic merge sort.'
                            },
                            {
                                id: 'dc-01-q2',
                                type: 'true-false',
                                question: 'Quick select keeps only one branch of the quicksort recursion, giving expected O(n) time.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: 'Expected size of the kept branch shrinks geometrically; sum is O(n).'
                            },
                            {
                                id: 'dc-01-q3',
                                type: 'mcq',
                                question: 'T(n) = 8T(n/2) + n² is solved by the master theorem as:',
                                options: ['Θ(n)', 'Θ(n³)', 'Θ(n² log n)', 'Θ(n log n)'],
                                correct: 1,
                                explanation: 'log₂8 = 3; f(n) = n² is polynomially smaller than n³ ⇒ case 1 ⇒ Θ(n^3).'
                            },
                            {
                                id: 'dc-01-q4',
                                type: 'mcq',
                                question: 'Closest pair compares at most how many strip points per point? (constant bound from packing argument)',
                                options: ['1', '3', '6', 'n'],
                                correct: 2,
                                explanation: 'Points within a 2d-wide strip with mutual distances ≥ d pack at most 6 per d² cell; only 6 forward neighbors needed.'
                            },
                            {
                                id: 'dc-01-q5',
                                type: 'true-false',
                                question: 'Counting inversions with a modified merge sort is O(n log n) — piggybacking on an existing recurrence.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: 'Merge detection adds O(1) work per merge step; overall O(n log n).'
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
                        objectives: [
                            'Master bitwise operators AND, OR, XOR, NOT, shifts',
                            'Use bitmasks to get/set/clear/toggle individual bits',
                            'Memorize the core tricks: isPow2, n&(n-1), n&-n, lowest set bit',
                            'Enumerate all subsets of a set with bitmasks',
                            'Understand two\'s complement, signed/unsigned behavior and shifts'
                        ],
                        content: `
                            <h3>Bitwise Fundamentals</h3>
                            <p>Integers are stored in binary; bitwise operators manipulate the bits directly. Understanding this model lets you do in micro-time what naive code does with loops or extra memory.</p>
                            <table>
                                <thead><tr><th>Operator</th><th>Name</th><th>Example (a=6 (0b110), b=3 (0b011))</th></tr></thead>
                                <tbody>
                                    <tr><td><code>&amp;</code></td><td>AND</td><td>6 &amp; 3 = 2 (0b010)</td></tr>
                                    <tr><td><code>|</code></td><td>OR</td><td>6 | 3 = 7 (0b111)</td></tr>
                                    <tr><td><code>^</code></td><td>XOR</td><td>6 ^ 3 = 5 (0b101)</td></tr>
                                    <tr><td><code>~</code></td><td>NOT</td><td>~6 = …11111001 (two's complement)</td></tr>
                                    <tr><td><code>&lt;&lt;</code></td><td>left shift</td><td>6 &lt;&lt; 1 = 12</td></tr>
                                    <tr><td><code>&gt;&gt;</code></td><td>arithmetic shift (signed)</td><td>6 &gt;&gt; 1 = 3</td></tr>
                                </tbody>
                            </table>

                            <h4>Single-bit toolkit</h4>
                            <pre><code>// Get bit k (0-indexed):  (n >> k) &amp; 1
// Set bit k:             n |= (1u << k)
// Clear bit k:           n &amp;= ~(1u << k)
// Toggle bit k:          n ^= (1u << k)
// Check if power of 2:   (n > 0) &amp;&amp; (n &amp; (n - 1)) == 0
// Lowest set bit:        n &amp; -n          (e.g. 12 -> 4)
// Remove lowest set bit: n &amp; (n - 1)     (e.g. 12 -> 8, count ones by looping)
// Count set bits (popcount):
int popcount(unsigned n) { int c = 0; while (n) { n &amp;= n - 1; ++c; } return c; }</code></pre>

                            <h4>Why <code>n &amp; (n - 1)</code> works</h4>
                            <p>Flipping the lowest set bit to 0: subtracting 1 flips all bits from the lowest set bit rightwards (…1000 → …0111); AND-ing with n clears exactly that bit. This is the core of Brian Kernighan's popcount loop and of the isolated-lowest-set-bit (<code>n &amp; -n</code>, with two's complement negation) used in Fenwick trees and DSU internals.</p>

                            <h4>Subset enumeration</h4>
                            <p>For a set of n elements (bitmask with n bits), all 2^n subsets iterate as integers 0..2^n - 1; the i-th bit of s tells whether element i is present. Classic applications: traveling salesman (DP over subsets), max-clique, partition problems, brute-force verification.</p>
                            <pre><code>int n = 4;
for (int s = 0; s &lt; (1 &lt;&lt; n); ++s) {
    std::vector&lt;int&gt; subset;
    for (int i = 0; i &lt; n; ++i)
        if (s &amp; (1 &lt;&lt; i)) subset.push_back(i);
    // process subset...
}</code></pre>

                            <h4>Two's complement and the gotchas</h4>
                            <ul>
                                <li>Signed right shift on negative values is implementation-defined in C++ — cast to <code>unsigned</code> first for portable behavior</li>
                                <li>Left shift of a negative signed value is UB; shifting by ≥ width of type is UB — prefer <code>1u &lt;&lt; k</code> with k &lt; 32</li>
                                <li><code>int</code> literals: write <code>1u</code> or <code>1LL</code> when bits above 31 are involved</li>
                                <li><code>std::bitset&lt;N&gt;</code> is the readable, modern alternative for compile-time sizes</li>
                            </ul>

                            <h4>Famous applications</h4>
                            <ul>
                                <li><strong>Hash of sets:</strong> bitmask keys for subset DP (e.g. DP over subsets with n ≤ 20)</li>
                                <li><strong>Permissions flags:</strong> UNIX mode bits rwxr-xr-x</li>
                                <li><strong>Toggle parity detection:</strong> XOR all elements to find the odd one out</li>
                                <li><strong>Swap without temp:</strong> a ^= b ^= a ^= b (cute, rarely a good idea in production)</li>
                                <li><strong>Counting trailing/leading zeros:</strong> <code>__builtin_ctz</code> / <code>__builtin_popcount</code> (GCC/Clang), <code>std::countl_zero</code> (C++20)</li>
                            </ul>

                            <h4>Practice &amp; sources</h4>
                            <p>Bit manipulation is not explicitly covered in your current document library — this lesson is authored from the standard C++ model (see also your C++ Foundations notes on the memory model and <code>&amp;</code> addressing, which is a different use of <code>&amp;</code>). Mastering these operators pays off in DSU, Fenwick trees, heap bitmasks and subset-DP.</p>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Bit toolkit',
                                code: `bool isPow2(unsigned n) { return n && !(n & (n - 1)); }
unsigned lowestBit(unsigned n) { return n & (0u - n); }
unsigned clearLowestBit(unsigned n) { return n & (n - 1); }
unsigned toggleBit(unsigned n, int k) { return n ^ (1u << k); }
int popcount(unsigned n) { int c = 0; while (n) { n &= n - 1; ++c; } return c; }`
                            },
                            {
                                language: 'cpp',
                                title: 'Subset enumeration',
                                code: `void enumerateSubsets(const std::vector<int>& items) {
    int n = (int)items.size();
    for (int s = 0; s < (1 << n); ++s) {
        std::vector<int> cur;
        for (int i = 0; i < n; ++i)
            if (s & (1 << i)) cur.push_back(items[i]);
        // use cur…
    }
}`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement popcount (count of set bits) with and without builtins.',
                                code: `int popcountNoBuiltin(unsigned n) {
    int c = 0;
    // TODO: use n & (n - 1) to count
    return c;
}
int popcountBuiltin(unsigned n) {
    // TODO: use __builtin_popcount
}`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace which subsets get generated for n = 3 items [A, B, C]. List the membership of s as 0b101, 0b011 and 0b111.',
                                code: `for (int s = 0; s < (1 << 3); ++s) {
    if (s & (1 << 0)) { /* A is in subset */ }
    if (s & (1 << 1)) { /* B is in subset */ }
    if (s & (1 << 2)) { /* C is in subset */ }
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'bit-01-q1',
                                type: 'mcq',
                                question: 'Which expression is true iff n is a power of two? (n ≥ 1)',
                                options: ['(n & (n - 1)) == 0', '(n | (n - 1)) == 0', 'n == 2', '(n >> 1) == 0'],
                                correct: 0,
                                explanation: 'Powers of two have exactly one set bit; n & (n-1) clears that bit, leaving 0.'
                            },
                            {
                                id: 'bit-01-q2',
                                type: 'true-false',
                                question: 'n & -n isolates the lowest set bit of n (two\'s complement).',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: '-n flips and adds 1; ANDing with n leaves only the lowest 1-bit.'
                            },
                            {
                                id: 'bit-01-q3',
                                type: 'mcq',
                                question: 'How many times does the Brian Kernighan popcount loop iterate for n = 0b1010101?',
                                options: ['3', '4', '7', '8'],
                                correct: 1,
                                explanation: 'n & (n-1) removes one set bit per iteration; 0b1010101 has 4 set bits.'
                            },
                            {
                                id: 'bit-01-q4',
                                type: 'mcq',
                                question: 'For a set of n elements, how many subsets exist?',
                                options: ['n', '2n', '2^n', 'n!'],
                                correct: 2,
                                explanation: 'Each element is independently in or out: 2 choices per element → 2^n.'
                            },
                            {
                                id: 'bit-01-q5',
                                type: 'true-false',
                                question: 'Left-shifting a negative signed integer is undefined behavior in C++.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: '(a)Signed left shift of a negative value, and shift counts ≥ bit-width, are both UB; prefer unsigned operands.'
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
                        title: "Prim's, Kruskal's, and Max Flow",
                        objectives: [
                            'Build minimum spanning trees with Prim\'s and Kruskal\'s algorithms',
                            'Implement a disjoint-set union (DSU) with path compression and union by rank',
                            'Compute shortest paths on dense graphs with Floyd-Warshall',
                            'Understand the max-flow min-cut theorem via residual networks',
                            'Implement Edmonds-Karp BFS augmenting paths and read off the min cut'
                        ],
                        content: `
                            <h3>Advanced Graph Algorithms</h3>
                            <p>Your library supports this topic end-to-end: <code>ch-7.pdf</code> (graphs, BFS/DFS, Prim, Kruskal, MST), Jimma COMP331 (edges, Prim/Kruskal, MST 29 hits, topological sort), and Preiss (MST Prim 63, Kruskal 24, MST 94 total, Dijkstra 38, Floyd 17, SCC 6, topological sort 55).</p>

                            <h4>Minimum Spanning Trees</h4>
                            <p>An MST of a connected undirected graph spans all vertices with minimum total edge weight — the backbone of network design. Cut property: the cheapest edge crossing any cut belongs to some MST.</p>

                            <p><strong>Prim\'s algorithm (vertex-centric):</strong></p>
                            <ul>
                                <li>Start from any vertex; grow the tree one vertex at a time</li>
                                <li>Use a min-heap of (edge weight, vertex); pop the cheapest connecting edge; skip already-visited vertices; push neighbors</li>
                                <li>O(E log V) with a binary heap — the right choice for <strong>dense</strong> graphs</li>
                            </ul>

                            <p><strong>Kruskal\'s algorithm (edge-centric):</strong></p>
                            <ul>
                                <li>Sort all edges by weight ascending</li>
                                <li>Add an edge if it connects two different components (DSU find/union)</li>
                                <li>Stop when the tree has V-1 edges</li>
                                <li>O(E log E) ≈ O(E log V) — the right choice for <strong>sparse</strong> graphs</li>
                            </ul>

                            <h4>Disjoint Set Union (DSU)</h4>
                            <p>Maintain a partition of elements into disjoint sets with near-O(1) find/union via <strong>path compression</strong> and <strong>union by rank (or size)</strong>. This one structure powers Kruskal, cycle detection in undirected graphs, offline LCA preprocessing and clustering.</p>
                            <pre><code>struct DSU {
    vector&lt;int&gt; parent, rank;
    DSU(int n) : parent(n), rank(n, 0) { iota(parent.begin(), parent.end(), 0); }
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rank[a] &lt; rank[b]) swap(a, b);
        parent[b] = a;
        if (rank[a] == rank[b]) ++rank[a];
        return true;
    }
};</code></pre>

                            <h4>Floyd-Warshall — all-pairs in O(V³)</h4>
                            <p>dp[k][i][j] = shortest i→j path using only intermediate vertices ≤ k. Rewrite as in-place triple loop over k:</p>
                            <pre><code>for (int k = 0; k &lt; n; ++k)
    for (int i = 0; i &lt; n; ++i)
        for (int j = 0; j &lt; n; ++j)
            if (dist[i][k] + dist[k][j] &lt; dist[i][j])
                dist[i][j] = dist[i][k] + dist[k][j];</code></pre>
                            <p>Works with negative edges (no negative cycles); preferred for dense graphs and for immediate all-pairs transitive closure.</p>

                            <h4>Max Flow — residual networks and Edmonds-Karp</h4>
                            <p>Given a directed capacity graph and source s, sink t, find the maximum flow. A <strong>residual edge</strong> carries remaining capacity forward and flow backward; an <strong>augmenting path</strong> from s to t in the residual graph increases the flow by its bottleneck.</p>
                            <p><strong>Edmonds-Karp</strong> = Ford-Fulkerson with BFS to pick the augmenting path with fewest edges — O(VE²) and avoids arbitrarily bad choices that plain Ford-Fulkerson makes on irrational capacities.</p>
                            <p><strong>Max-flow min-cut theorem:</strong> the value of the maximum s-t flow equals the capacity of the minimum s-t cut. Compute the flow, then the reachable set from s in the final residual graph gives the min cut — a set of edges whose total capacity equals the flow.</p>
                            <ul>
                                <li><strong>Blocking-flow view:</strong> each DFS/BFS finds a blocking flow on acyclic residuals; Dinic's improves to O(V²E) with level graphs</li>
                                <li><strong>Unit-capacity application:</strong> bipartite matching falls out directly (source→left, right→sink, 1-cap edges)</li>
                            </ul>

                            <h4>SCC and topological sort (quick review)</h4>
                            <p><strong>Topological sort</strong> orders a DAG so every edge points forward — Kahn's BFS-with-indegree does it in O(V+E). <strong>Strongly connected components</strong> are maximal vertex sets with mutual reachability; Kosaraju's two-pass DFS computes them in O(V+E). Preiss treats both; your AASTU materials cover BFS/DFS/topsort.</p>

                            <h4>Complexity cheat sheet</h4>
                            <table>
                                <thead><tr><th>Algorithm</th><th>Time</th><th>Use when</th></tr></thead>
                                <tbody>
                                    <tr><td>Prim (binary heap)</td><td>O(E log V)</td><td>Dense graphs / total order on weight</td></tr>
                                    <tr><td>Kruskal + DSU</td><td>O(E log E)</td><td>Sparse graphs</td></tr>
                                    <tr><td>Dijkstra</td><td>O((V+E) log V)</td><td>Single-source, non-negative weights</td></tr>
                                    <tr><td>Floyd-Warshall</td><td>O(V³)</td><td>All-pairs, dense, or negative edges</td></tr>
                                    <tr><td>Edmonds-Karp</td><td>O(VE²)</td><td>Max flow, simple to implement</td></tr>
                                    <tr><td>Kosaraju SCC</td><td>O(V+E)</td><td>Decomposition of cyclic graphs</td></tr>
                                </tbody>
                            </table>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: "Prim's MST",
                                code: `int primMST(int n, const std::vector<std::vector<std::pair<int,int>>>& adj) {
    std::vector<bool> used(n, false);
    std::priority_queue<std::pair<int,int>, std::vector<std::pair<int,int>>, std::greater<>> pq; // (w, v)
    pq.push({0, 0});
    int total = 0, trees = 0;
    while (!pq.empty() && trees < n) {
        auto [w, u] = pq.top(); pq.pop();
        if (used[u]) continue;
        used[u] = true;
        total += w;
        ++trees;
        for (auto [wt, v] : adj[u])
            if (!used[v]) pq.push({wt, v});
    }
    return total;
}`
                            },
                            {
                                language: 'cpp',
                                title: "Kruskal's MST with DSU",
                                code: `int kruskal(int n, std::vector<std::tuple<int,int,int>> edges) {
    DSU dsu(n);  // DSU as shown above
    std::sort(edges.begin(), edges.end(),
              [](const auto& a, const auto& b) { return std::get<0>(a) < std::get<0>(b); });
    int total = 0, taken = 0;
    for (auto [w, u, v] : edges) {
        if (dsu.unite(u, v)) { total += w; if (++taken == n - 1) break; }
    }
    return total;
}`
                            },
                            {
                                language: 'cpp',
                                title: 'Edmonds-Karp (max flow, BFS)',
                                code: `int maxFlow(const std::vector<std::vector<int>>& capInput, int s, int t) {
    int n = (int)capInput.size();
    std::vector<std::vector<int>> cap = capInput;  // local copy; residual graph
    int flow = 0;
    while (true) {
        std::vector<int> parent(n, -1);
        std::queue<int> q; q.push(s); parent[s] = s;
        while (!q.empty() && parent[t] == -1) {
            int u = q.front(); q.pop();
            for (int v = 0; v < n; ++v)
                if (parent[v] == -1 && cap[u][v] > 0) { parent[v] = u; q.push(v); }
        }
        if (parent[t] == -1) break;
        int pushed = INT_MAX;
        for (int v = t; v != s; v = parent[v]) pushed = std::min(pushed, cap[parent[v]][v]);
        for (int v = t; v != s; v = parent[v]) {
            cap[parent[v]][v] -= pushed;
            cap[v][parent[v]] += pushed;
        }
        flow += pushed;
    }
    return flow;
}`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement DSU with path compression and union by rank: find returns root of the component, unite merges two components and returns true if they were different.',
                                code: `struct DSU {
    std::vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) {}
    int find(int x) {
        // TODO: path compression
    }
    bool unite(int a, int b) {
        // TODO: union by rank; return true if merged
    }
};`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace Edmonds-Karp on S->A (cap 3), S->B (cap 2), A->B (cap 1), A->T (cap 2), B->T (cap 3). Show each augmenting path, its bottleneck, and the residual capacities afterward.',
                                code: `Graph: S -> A (3)   S -> B (2)   A -> B (1)   A -> T (2)   B -> T (3)
Edmonds-Karp picks shortest augmenting paths by BFS from S to T:
  1) S -> A -> T, bottleneck 2
  2) S -> B -> T, bottleneck 2
  3) S -> A -> B -> T, bottleneck 1
Max flow = 5`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'adv-graph-01-q1',
                                type: 'mcq',
                                question: 'Which cut property drives both Prim\'s and Kruskal\'s algorithms?',
                                options: ['Longest edge crossing', 'Lightest edge crossing any cut belongs to some MST', 'Most edges crossing', 'First edge added to graph'],
                                correct: 1,
                                explanation: 'The cut property: the minimum-weight edge crossing any cut is in some MST — this is why greedy MST algorithms are correct.'
                            },
                            {
                                id: 'adv-graph-01-q2',
                                type: 'true-false',
                                question: "Kruskal's algorithm requires a disjoint-set union to detect cycles among selected edges.",
                                options: ['True', 'False'],
                                correct: true,
                                explanation: 'find(u) == find(v) means u and v are already in the same component; skipping that edge prevents cycles.'
                            },
                            {
                                id: 'adv-graph-01-q3',
                                type: 'mcq',
                                question: 'DSU with path compression and union by rank answers operations in:',
                                options: ['O(log n)', 'O(α(n)) amortized (inverse Ackermann)', 'O(n)', 'O(1) worst case'],
                                correct: 1,
                                explanation: 'Amortized inverse-Ackermann time per op — effectively constant.'
                            },
                            {
                                id: 'adv-graph-01-q4',
                                type: 'mcq',
                                question: 'Max-flow min-cut theorem states that the maximum s-t flow value equals:',
                                options: ['The minimum number of edges between s and t', 'The capacity of the minimum s-t cut', 'The number of augmenting paths', 'The minimum vertex connectivity'],
                                correct: 1,
                                explanation: 'Link & Cutter min-cut equals max flow; reachable set in the final residual graph gives the cut.'
                            },
                            {
                                id: 'adv-graph-01-q5',
                                type: 'true-false',
                                question: 'Floyd-Warshall handles graphs with negative edges as long as they contain no negative cycles.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: 'Floyd-Warshall computes true shortest paths with negative weights; negative cycles can be detected when dist[i][i] < 0 appears.'
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
                        objectives: [
                            'Write C++ templates that compile fast and run fast under contest time limits',
                            'Apply the competitive-programming I/O and precision techniques',
                            'Recognize and implement the core patterns: two pointers, sliding window, prefix sums, binary search on answer',
                            'Avoid the classic overflow and precision traps',
                            'Adopt a contest workflow: constraints → brute force → optimize → verify'
                        ],
                        content: `
                            <h3>Competitive Programming — Foundations</h3>
                            <p>Competitive programming is algorithmics under a time-per-problem budget. The wins come from (1) fast, correct templates, (2) pattern recognition, (3) disciplined debugging. Your base course material (arrays, searching, binary search, sorting) is the foundation — this lesson adds speed and the standard toolkits.</p>

                            <h4>Fast I/O in C++</h4>
                            <pre><code>std::ios_base::sync_with_stdio(false);
std::cin.tie(nullptr);
using namespace std;

int main() {
    int n;
    cin >> n;                 // ~10⁸ ops/sec with sync_with_stdio(false)
    // Use '\n' not endl (endl flushes)
    cout << n << '\n';
}</code></pre>
                            <ul>
                                <li><code>sync_with_stdio(false)</code> + <code>cin.tie(nullptr)</code> is the single biggest I/O win in C++ (often 5–10×)</li>
                                <li><code>scanf/printf</code> remain faster still for extreme cases; <code>getline</code> for string parsing</li>
                                <li>Reserve vector capacity; avoid <code>push_back</code> inside hot loops (<code>vector::reserve</code>)</li>
                                <li>Prefer <code>O(1)</code> output assembly: build with <code>std::string</code> then print once</li>
                            </ul>

                            <h4>Contest template checklist</h4>
                            <ul>
                                <li><strong>Headers policy:</strong> many use <code>#include &lt;bits/stdc++.h&gt;</code> in GCC builds — note the academy's toolchain differs (libc++); standard includes keep you portable</li>
                                <li><strong>Types:</strong> <code>int64_t</code> for sums/products; <code>size_t</code> for indexing; never <code>int</code> for 10⁹·10⁹</li>
                                <li><strong>Overflow in sums:</strong> <code>1e9 + 7</code> arithmetic; always use <code>long long</code> intermediate</li>
                                <li><strong>Mod:</strong> <code>const int MOD = 1e9 + 7;</code> with <code>long long</code> intermediate in multiplication</li>
                                <li><strong>Random:</strong> <code>mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());</code></li>
                            </ul>

                            <h4>Core patterns (memorize these)</h4>
                            <table>
                                <thead><tr><th>Pattern</th><th>Signal</th><th>Complexity</th></tr></thead>
                                <tbody>
                                    <tr><td>Two pointers</td><td>sorted array, pair sums, partition</td><td>O(n)</td></tr>
                                    <tr><td>Sliding window</td><td>subarray of length k / at-most-k distinct</td><td>O(n)</td></tr>
                                    <tr><td>Prefix sum / difference array</td><td>range-sum queries, range updates</td><td>O(1) query / O(n) build</td></tr>
                                    <tr><td>Binary search on answer</td><td>minimize/maximize a monotone predicate</td><td>O(n log n)</td></tr>
                                    <tr><td>Coordinate compression</td><td>waarden ≤ 10¹⁸ but count small</td><td>O(n log n)</td></tr>
                                    <tr><td>BFS/DFS on grid</td><td>shortest path in unweighted grid</td><td>O(R·C)</td></tr>
                                    <tr><td>Greedy + exchange</td><td>interval scheduling, assigning</td><td>O(n log n)</td></tr>
                                </tbody>
                            </table>

                            <h4>Binary search on answer (template)</h4>
                            <p>When the question asks for min/max X such that a monotone <em>check(x)</em> holds:</p>
                            <pre><code>int lo = lo_bound, hi = hi_bound;
while (lo &lt; hi) {
    int mid = lo + (hi - lo) / 2;
    if (check(mid)) hi = mid; else lo = mid + 1;
}
// lo == hi is the minimal feasible answer</code></pre>
                            <p>Classic use: split array into k segments minimizing max segment sum; allocate capacity so all tasks fit with min max load; Kth smallest pair distance. Your Searching lesson (Binary Search on Answer) builds this muscle.</p>

                            <h4>Two pointers and sliding window</h4>
                            <p><strong>Two pointers:</strong> pair-sum in sorted array, in-place removal, partition-style in-place edits, merge step of merge sort. <strong>Sliding window:</strong> fixed (length-k max sum) or dynamic (longest subarray with at most K distinct integers — maintain freq map + left pointer; shrink when violated). Both run in O(n) because each pointer moves monotonically.</p>

                            <h4>Contest workflow</h4>
                            <ol>
                                <li>Read constraints first — n ≤ 10⁸ hints O(n log n) or O(n), not O(n²)</li>
                                <li>Derive brute force, then look for structure (sorted? monotone? subproblems?)</li>
                                <li>Estimate: if n·log n·constant ≳ 10⁸, optimize constant factor</li>
                                <li>Write small and assert-tested code; print debug info to stderr</li>
                                <li>Submit early; get partial credit via edge cases (empty, n=1, duplicates, negatives)</li>
                            </ol>

                            <h4>Honest note</h4>
                            <p>Your current document library contains no dedicated competitive-programming material — this lesson is authored in-house, anchored in your binary-search-on-answer lesson and the sorting/searching lectures in <code>ch-2.pdf</code>, <code>Chapter 2 ….pdf</code> and <code>sorting 74869.pdf</code>, plus the exam-style timed practice in <code>DSA MID TEST 2023-ANSWERSHEET.pdf</code> (which is usable for timing drills).</p>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Competitive-programming skeleton',
                                code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <string>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        vector<long long> a(n);
        for (auto& x : a) cin >> x;
        sort(a.begin(), a.end());
        cout << accumulate(a.begin(), a.end(), 0LL) << '\\n';
    }
}`
                            },
                            {
                                language: 'cpp',
                                title: 'Binary search on answer — split array into k parts minimizing max sum',
                                code: `bool canSplit(const vector<long long>& a, long long maxSum, int k) {
    int parts = 1;
    long long cur = 0;
    for (long long x : a) {
        if (x > maxSum) return false;
        if (cur + x <= maxSum) cur += x;
        else { ++parts; cur = x; }
    }
    return parts <= k;
}
long long minimizeMaxSum(const vector<long long>& a, int k) {
    long long lo = *max_element(a.begin(), a.end());
    long long hi = accumulate(a.begin(), a.end(), 0LL);
    while (lo < hi) {
        long long mid = lo + (hi - lo) / 2;
        if (canSplit(a, mid, k)) hi = mid; else lo = mid + 1;
    }
    return lo;
}`
                            },
                            {
                                language: 'cpp',
                                title: 'Sliding window — longest subarray with at most K distinct',
                                code: `int longestAtMostKDistinct(const vector<int>& a, int k) {
    unordered_map<int,int> freq;
    int left = 0, best = 0;
    for (int right = 0; right < (int)a.size(); ++right) {
        ++freq[a[right]];
        while ((int)freq.size() > k) {
            if (--freq[a[left]] == 0) freq.erase(a[left]);
            ++left;
        }
        best = max(best, right - left + 1);
    }
    return best;
}`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-complete',
                                question: 'Implement prefix sums and answer m range-sum queries in O(1) each: query(l, r) = a[l]+…+a[r].',
                                code: `struct RangeSum {
    std::vector<long long> prefix;
    RangeSum(const std::vector<int>& a) { /* TODO: build prefix, size n+1 */ }
    long long query(int l, int r) const { /* TODO: O(1) prefix difference */ }
};`
                            },
                            {
                                type: 'code-trace',
                                question: 'Trace the binary search on answer for nums = [1,2,3,4,5,6,7,8,9], k = 3 (split into 3 contiguous parts minimizing the max part sum). Show lo/hi evolution.',
                                code: `bool canSplit(const vector<long long>& a, long long maxSum, int k) {
    int parts = 1; long long cur = 0;
    for (long long x : a) {
        if (x > maxSum) return false;
        if (cur + x <= maxSum) cur += x;
        else { ++parts; cur = x; }
    }
    return parts <= k;
}`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'cp-01-q1',
                                type: 'mcq',
                                question: 'What is the standard first line to speed up cin/cout in competitive programming?',
                                options: ['cin.tie(&cout)', 'ios_base::sync_with_stdio(false); cin.tie(nullptr);', 'fflush(stdin)', 'setbuf(stdout, NULL)'],
                                correct: 1,
                                explanation: 'sync_with_stdio(false) decouples C and C++ streams; cin.tie(nullptr) stops flushing before every cin.'
                            },
                            {
                                id: 'cp-01-q2',
                                type: 'true-false',
                                question: 'endl prints a newline and flushes the buffer, which is slower than \'\\n\' in tight loops.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: "endl is '\n' + flush; the flush is expensive when done thousands of times."
                            },
                            {
                                id: 'cp-01-q3',
                                type: 'mcq',
                                question: 'Binary search on answer requires the predicate check(x) to be:',
                                options: ['Monotonic (true…true then false…false, or vice versa)', 'Polynomial', 'Deterministic', 'Independent of x'],
                                correct: 0,
                                explanation: 'Binary search correctness needs a monotone boundary between feasible and infeasible; then the boundary is found in log(range) steps.'
                            },
                            {
                                id: 'cp-01-q4',
                                type: 'true-false',
                                question: 'Two pointers runs in O(n) because each pointer only moves forward, so the total pointer advances are bounded by 2n.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: 'Left and right pointers are monotonic; combined increments sum to ≤ 2n regardless of inner-loop repetitions.'
                            },
                            {
                                id: 'cp-01-q5',
                                type: 'mcq',
                                question: 'The sum 10^18 + 10^18 fits into which type?',
                                options: ['int32_t', 'int64_t', 'uint16_t', 'long double only'],
                                correct: 1,
                                explanation: 'int64_t holds ≈ 9.22×10^18; int32_t maxes at ≈ 2.15×10^9.'
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
                        objectives: [
                            'Design a real feature from requirement to working code',
                            'Apply the Command pattern with stacks for undo/redo',
                            'Reason about data invariants (text, cursor, selection, clipboard)',
                            'Structure a capstone: milestones, testing, polish, review',
                            'Produce a small but complete, demo-able artifact'
                        ],
                        content: `
                            <h3>Capstone Project — Text Editor with Undo/Redo</h3>
                            <p>This project is the practical-projects capstone for the academy. Your AASTU syllabus includes a group project (15% weight); Preiss's book ends every chapter with programming projects of exactly this character. The deliverable is a <strong>working minimal text editor</strong> (console or light GUI) with real undo/redo — everything else is in service of that.</p>

                            <h4>Requirements (v1 scope)</h4>
                            <ul>
                                <li>Open/create/save/<strong>save-as</strong> plain-text files (UTF-8)</li>
                                <li>Render buffer line-oriented; navigate with arrow keys + Page Up/Down + Home/End</li>
                                <li>Insert, delete, select-all, copy, cut, paste — each as a <em>command</em></li>
                                <li><strong>Undo/redo</strong> across all editing commands (std::stack of command objects)</li>
                                <li>Search (find next/previous); replace next</li>
                                <li>Status bar: filename, dirty flag, cursor line:col</li>
                            </ul>
                            <p><strong>Non-goals:</strong> syntax highlighting, multiple tabs, plugins, scripting. v1 discipline is the point — finish something working and polish it.</p>

                            <h4>Architecture (the part that actually matters)</h4>
                            <pre><code>// Command — every edit is an object with undo()
class Command {
public:
    virtual void execute() = 0;
    virtual void undo() = 0;
    virtual ~Command() = default;
};

class InsertText : public Command {
    TextBuffer& buf; size_t pos; std::string text;
public:
    InsertText(TextBuffer& b, size_t p, std::string t)
        : buf(b), pos(p), text(std::move(t)) {}
    void execute() override { buf.insert(pos, text); }
    void undo()    override { buf.erase(pos, text.size()); }
};

// Editor keeps two stacks of Command
class Editor {
    std::stack&lt;std::unique_ptr&lt;Command&gt;&gt; undoStack, redoStack;
};</code></pre>
                            <ul>
                                <li><strong>Command objects own the minimum state</strong> to invert themselves — never a snapshot of the whole document</li>
                                <li>Typing runs collapse consecutive single-character inserts into one command (debounce burst ≤ 500 ms)</li>
                                <li>Cut/copy pastes are single replace-range commands, not N char-ops</li>
                                <li>Redo stack is cleared on every new command (standard editor semantics)</li>
                            </ul>

                            <h4>Milestones (6 stages, strictly ordered)</h4>
                            <ol>
                                <li><strong>M0 — Spec:</strong> one page of requirement text + 1 ASCII-art UI sketch. Get feedback before code.</li>
                                <li><strong>M1 — Buffer:</strong> line-oriented TextBuffer (vector of strings), insert/erase/cursor ops + unit tests</li>
                                <li><strong>M2 — Command:</strong> Command pattern + undo/redo stacks with unit tests for insert/delete/paste/select-all-then-delete</li>
                                <li><strong>M3 — Navigation:</strong> arrow keys, Page Up/Down, Home/End, word jump with Ctrl</li>
                                <li><strong>M4 — Search:</strong> find next/previous (case-insensitive flag), highlight current match</li>
                                <li><strong>M5 — Polish:</strong> dirty flag, confirm-on-quit-with-unsaved, status bar, keybindings, README + GIF</li>
                            </ol>
                            <p>Each milestone ends with a <em>demoable</em> artifact — no milestone is "90% of the work in M1".</p>

                            <h4>Design decisions worth writing down</h4>
                            <ul>
                                <li><strong>Buffer model:</strong> <code>vector&lt;string&gt;</code> lines fits v1 easily (vector of lines amortizes appends); a rope or gap buffer is the "real editor" answer — know why you chose vector&lt;string&gt;</li>
                                <li><strong>Undo representation:</strong> commands (stateless inversion) vs stored snapshots — commands scale better in memory and are the interview answer; mention the trade-off</li>
                                <li><strong>Selection model:</strong> anchor + active (head) cursor; undo for a selection-delete is "re-insert at anchor"</li>
                                <li><strong>Persistence:</strong> save by serializing lines joined with \n; atomic save = write to temp then rename</li>
                                <li><strong>Testing:</strong> table-driven tests for buffer ops and command inverse round-trips</li>
                            </ul>

                            <h4>Extension ideas after v1 (pick at most one)</h4>
                            <ul>
                                <li>Multi-level undo <em>groups</em> (atomic "replace all" as one undo)</li>
                                <li>Real search-and-replace with preview</li>
                                <li>Session persistence (restore open files)</li>
                                <li>Minimal regex search (std::regex is in the standard)</li>
                                <li>ROPE rope-ish buffer with performance benchmark vs vector&lt;string&gt;</li>
                            </ul>

                            <h4>Rubric (self-check)</h4>
                            <table>
                                <thead><tr><th>Criterion</th><th>Weight</th></tr></thead>
                                <tbody>
                                    <tr><td>Correct undo/redo on all editing commands</td><td>30%</td></tr>
                                    <tr><td>Buffer correctness + test coverage</td><td>20%</td></tr>
                                    <tr><td>UX: status bar, dirty flag, unsaved-quit confirm</td><td>15%</td></tr>
                                    <tr><td>Code structure: commands, separation of concerns</td><td>20%</td></tr>
                                    <tr><td>Documentation: README with run instructions + demo</td><td>15%</td></tr>
                                </tbody>
                            </table>

                            <h4>Why this project matters</h4>
                            <p>Data structures appear everywhere in real systems; this project forces you to combine stacks (undo/redo), sequences (buffer), iterators (rendering), and design (command pattern) into one artifact. It is also a portfolio-ready demonstration of ability — far better than another toy grader.</p>
                        `,
                        codeExamples: [
                            {
                                language: 'cpp',
                                title: 'Undo/redo with stacks (core pattern)',
                                code: `class Editor {
public:
    void apply(std::unique_ptr<Command> cmd) {
        cmd->execute();
        undoStack_.push(std::move(cmd));
        redoStack_ = {};  // clear redo
    }
    void undo() {
        if (undoStack_.empty()) return;
        auto cmd = std::move(undoStack_.top()); undoStack_.pop();
        cmd->undo();
        redoStack_.push(std::move(cmd));
    }
    void redo() {
        if (redoStack_.empty()) return;
        auto cmd = std::move(redoStack_.top()); redoStack_.pop();
        cmd->execute();
        undoStack_.push(std::move(cmd));
    }
private:
    std::stack<std::unique_ptr<Command>> undoStack_, redoStack_;
};`
                            },
                            {
                                language: 'cpp',
                                title: 'TextBuffer core (lines-based)',
                                code: `class TextBuffer {
public:
    void insert(size_t pos, const std::string& text) {
        if (pos <= lineEnd()) { /* split line at pos and splice */ }
        else { /* append across line boundaries */ }
    }
    void erase(size_t pos, size_t len) {
        // find (line, col) from pos; delete across line boundaries
    }
    const std::vector<std::string>& lines() const { return lines_; }
    bool empty() const { return lines_.empty() || (lines_.size() == 1 && lines_[0].empty()); }
private:
    static constexpr size_t lineEnd() { return static_cast<size_t>(-1); }
    std::vector<std::string> lines_ = {""};
};`
                            }
                        ],
                        exercises: [
                            {
                                type: 'code-trace',
                                question: 'Trace the undo/redo stacks for this sequence: type "abc", delete "b", paste "X", then Undo ×3. Show the undo/redo stack contents and buffer after every step.',
                                code: `Editor: apply(Insert("a"))  apply(Insert("b"))  apply(Insert("c"))
         apply(Delete(pos=1, len=1))
         apply(Insert("X", pos=1))
         undo()  undo()  undo()`
                            },
                            {
                                type: 'code-complete',
                                question: 'Implement ReplaceRange command (delete-then-insert in one command, for paste/replace operations).',
                                code: `class ReplaceRange : public Command {
    TextBuffer& buf; size_t pos, len; std::string text, removed;
public:
    ReplaceRange(TextBuffer& b, size_t p, size_t l, std::string t)
        : buf(b), pos(p), len(l), text(std::move(t)) {}
    void execute() override {
        // TODO: save removed = buf.slice(pos, len); buf.erase(pos, len); buf.insert(pos, text);
    }
    void undo() override {
        // TODO: buf.erase(pos, text.size()); buf.insert(pos, removed);
    }
};`
                            }
                        ],
                        quizQuestions: [
                            {
                                id: 'proj-01-q1',
                                type: 'true-false',
                                question: 'In the Command pattern, each command should store the minimal state needed to invert itself.',
                                options: ['True', 'False'],
                                correct: true,
                                explanation: 'Snapshot-based undo is simple but memory-heavy; command inversion scales and keeps memory proportional to edit complexity.'
                            },
                            {
                                id: 'proj-01-q2',
                                type: 'mcq',
                                question: 'Why is the redo stack cleared on every fresh user command?',
                                options: ['For performance', 'Because the new command invalidates the redo history branch', 'C++ stack semantics require it', 'To save memory'],
                                correct: 1,
                                explanation: 'Undo trees fork on new commands; keeping old redo paths would let redo resurrect edits that never happened.'
                            },
                            {
                                id: 'proj-01-q3',
                                type: 'mcq',
                                question: 'Typing "hello" is best represented as:',
                                options: ['5 single-char commands', 'One InsertText command for the whole burst', 'No command at all', 'A snapshot of the buffer'],
                                correct: 1,
                                explanation: 'Bursts within a short idle window coalesce into one undo unit — standard editor behavior (e.g., 500 ms coalescing).'
                            },
                            {
                                id: 'proj-01-q4',
                                type: 'true-false',
                                question: 'A double-linked list of lines is always superior to vector<string> for a text editor buffer.',
                                options: ['True', 'False'],
                                correct: false,
                                explanation: 'vector<string> amortizes appends and is cache-friendly; gap buffers/rope only win at very large sizes — know your trade-off, just pick one.'
                            }
                        ]
                    }

                ]
            }
        ]
    }
};


// Phase 1 ΓÇö worked solutions for exercises.
// Key: "<lessonId>:<exerciseIndex>". Consumed by CurriculumRenderer.renderExercise.
const EXERCISE_SOLUTIONS = {
    'cpp-02:0': `Only ONE Node exists at the end.
- After: auto a = make_shared<Node>(1);            -> 1 shared_ptr, 1 Node
- After: auto b = a;  auto c = a;                  -> refcount = 3 (a, b, c)
- a.reset();                                       -> refcount = 2 (b, c)
- b.reset();                                       -> refcount = 1 (c)
The Node is destroyed when the last owner (c) goes out of scope, i.e. at the end of the function.`,

    'll-01:0': `Node* find(Node* head, int val) {
    for (Node* cur = head; cur != nullptr; cur = cur->next) {
        if (cur->value == val) return cur;   // adjust member name if your Node uses 'val'
    }
    return nullptr;
}`,

    'll-01:1': `0 2
- push_back(1) -> 1
- push_back(2) -> 1 -> 2
- push_front(0) -> 0 -> 1 -> 2
- remove(1)     -> 0 -> 2
- for (int x : ll) prints "0 2 "`,

    'll-03:0': `Node* removeNthFromEnd(Node* head, int n) {
    Node dummy(0);
    dummy.next = head;
    Node* fast = &dummy;
    Node* slow = &dummy;
    for (int i = 0; i <= n; ++i) fast = fast->next;  // advance n+1 to keep a gap
    while (fast != nullptr) {
        fast = fast->next;
        slow = slow->next;
    }
    slow->next = slow->next->next;   // unlink the target
    return dummy.next;
}
// The dummy node makes removing the original head (n == length) work the same way.`,

    'll-03:1': `Phase 1 (meet):
- slow=1, fast=1 -> step -> slow=2, fast=3
- slow=3, fast=5 -> step -> slow=4, fast=4   (meeting point)
Phase 2 (find cycle start):
- slow=head(1), fast=4 -> step -> slow=2, fast=5
- slow=3, fast=3               -> cycle starts at node 3
Cycle nodes: 3 -> 4 -> 5 -> 3`,

    'sq-01:0': `void push(int x) {
    mainStack.push(x);
    if (minStack.empty() || x <= minStack.top()) minStack.push(x);
}
void pop() {
    if (!mainStack.empty() && minStack.top() == mainStack.top()) minStack.pop();
    mainStack.pop();
}
// top()/getMin() are O(1): each stack holds one element per pushed value.`,

    'sq-01:1': `Heights (index,h): (0,2) (1,1) (2,5) (3,6) (4,2) (5,3); stack is increasing.
- i=0 h=2: push 0                     stack [0]
- i=1 h=1: pop 0 -> h=2, w=1  area=2  stack [1]
- i=2 h=5: push 2                     stack [1,2]
- i=3 h=6: push 3                     stack [1,2,3]
- i=4 h=2: 2<6 pop 3 -> h=6, w=1 area=6
           2<5 pop 2 -> h=5, w=2 area=10   <- max so far
           2>=1 stop; push 4              stack [1,4]
- i=5 h=3: 3>=2 push 5                stack [1,4,5]
- end i=6: pop 5 -> h=3, w=1 area=3
           pop 4 -> h=2, w=4 area=8
           pop 1 -> h=1, w=6 area=6
Largest rectangle area = 10`,

    'pq-01:0': `void heapify(vector<int>& arr) {
    int n = static_cast<int>(arr.size());
    auto siftDown = [&](int root, int size) {
        int i = root;
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
            if (l < size && arr[l] < arr[smallest]) smallest = l;
            if (r < size && arr[r] < arr[smallest]) smallest = r;
            if (smallest == i) break;
            swap(arr[i], arr[smallest]);
            i = smallest;
        }
    };
    // Every node whose children are already heaps can be sifted down;
    // starting from the last parent gives O(n) total work.
    for (int i = n / 2 - 1; i >= 0; --i) siftDown(i, n);
}`,

    'rec-01:0': `double fastPow(double x, long long n) {
    if (n == 0) return 1.0;
    if (n < 0) return 1.0 / fastPow(x, -n);
    if (n % 2 != 0) return x * fastPow(x, n - 1);
    double half = fastPow(x, n / 2);
    return half * half;
}
// Each recursive step halves n: O(log n) time, O(log n) stack.`,

    'rec-01:1': `fib(4)
= fib(3) + fib(2)
  fib(3)
  = fib(2) + fib(1)
    fib(2) = fib(1) + fib(0)      (first computed: memo[2]=1)
      fib(1) -> 1                 (memo[1]=1)
      fib(0) -> 0                 (memo[0]=0)
    fib(1) hit                    (memo hit)
  = 1 + 1 = 2                     (memo[3]=2)
  fib(2) hit                      (memo hit)
= 2 + 1 = 3
With memoization: 5 distinct calls are computed (f0..f4) instead of 9.`,

    'bt-01:0': `void generateParen(int n, int open, int close, string& curr, vector<string>& result) {
    if ((int)curr.size() == 2 * n) {
        result.push_back(curr);
        return;
    }
    if (open < n) {
        curr.push_back('(');
        generateParen(n, open + 1, close, curr, result);
        curr.pop_back();
    }
    if (close < open) {
        curr.push_back(')');
        generateParen(n, open, close + 1, curr, result);
        curr.pop_back();
    }
}
// Invariant: never close more than we opened; stop at exactly n pairs.`,

    'bt-01:1': `First solution found is (row0,col1), (row1,col3), (row2,col0), (row3,col2):
. Q . .
. . . Q
Q . . .
. . Q .
Path (ascending columns per row):
- row0 = 0  -> row1 = 2 blocks row2 (diagonals), row1 = 3 keeps row2 alive until dead end; abandon row0 = 0
- row0 = 1  -> row1 = 0 blocked, row1 = 2 blocked (diagonal), row1 = 3 accepted
- row2 = 0  accepted (col0 row0 is col0? no: row0 col1)
- row3 = 2  accepted (not attacked)
Total backtracks along the way are small; the backtracking tree prunes whole subtrees on the first conflicting queen.`,

    'tree-01:0': `vector<int> postorderIter(TreeNode* root) {
    vector<int> out;
    if (!root) return out;
    stack<TreeNode*> s1, s2;
    s1.push(root);
    while (!s1.empty()) {
        TreeNode* cur = s1.top();
        s1.pop();
        s2.push(cur);                       // root is pushed onto s2 first,
        if (cur->left)  s1.push(cur->left); // so s2 ends up right-to-left postorder
        if (cur->right) s1.push(cur->right);
    }
    while (!s2.empty()) {
        out.push_back(s2.top()->val);
        s2.pop();
    }
    return out;
}
// Single-stack alternative: push (node, bool visited) and only emit when visited == true.`,

    'tree-01:1': `Tree: 1(root), left=2, right=3. Morris inorder:
- cur = 1; left exists; predecessor = rightmost of left subtree = 2;
  2->right == null, so set 2->right = 1 (thread). cur = 2.
- cur = 2; no left; visit 2 (print 2); cur = cur->right = 1 (thread).
- cur = 1; left exists; predecessor = 2; 2->right == 1 == cur,
  so remove thread (2->right = nullptr); visit 1 (print 1); cur = 3.
- cur = 3; no left; visit 3 (print 3); cur = nullptr -> done.
Output: 2 1 3`,

    'tree-02:0': `int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    TreeNode* cur = root;
    while (cur || !st.empty()) {
        while (cur) {
            st.push(cur);
            cur = cur->left;
        }
        cur = st.top();
        st.pop();
        if (--k == 0) return cur->val;   // inorder visits are ascending
        cur = cur->right;
    }
    return -1; // k out of range
}`,

    'hash-01:0': `size_t doubleHashProbe(size_t h1, size_t h2, int attempt, size_t tableSize) {
    return (h1 + static_cast<size_t>(attempt) * h2) % tableSize;
}
// h2 must be non-zero and coprime with tableSize (or tableSize - 1 when tableSize is prime-ish),
// e.g. tableSize prime and h2 = 1 + (key % (tableSize - 1)) guarantees full-table probing.`,

    'graph-01:0': `int shortestPathGrid(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> end) {
    int R = static_cast<int>(grid.size()), C = static_cast<int>(grid[0].size());
    if (grid[start.first][start.second] == 1 || grid[end.first][end.second] == 1) return -1;
    vector<vector<int>> dist(R, vector<int>(C, -1));
    queue<pair<int,int>> q;
    q.push(start);
    dist[start.first][start.second] = 0;
    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!q.empty()) {
        auto [r, c] = q.front();
        q.pop();
        if (r == end.first && c == end.second) return dist[r][c];
        for (const auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
            if (grid[nr][nc] == 1 || dist[nr][nc] != -1) continue;
            dist[nr][nc] = dist[r][c] + 1;
            q.push({nr, nc});
        }
    }
    return -1;
}`,

    'graph-02:0': `int astar(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> goal) {
    const int R = static_cast<int>(grid.size()), C = static_cast<int>(grid[0].size());
    auto manhattan = [&](int r, int c) {
        return abs(r - goal.first) + abs(c - goal.second);
    };
    vector<vector<int>> g(R, vector<int>(C, INT_MAX));
    priority_queue<pair<int,pair<int,int>>,
                   vector<pair<int,pair<int,int>>>,
                   greater<pair<int,pair<int,int>>>> open;
    g[start.first][start.second] = 0;
    open.push({manhattan(start.first, start.second), start});
    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!open.empty()) {
        auto [f, u] = open.top();
        open.pop();
        int r = u.first, c = u.second;
        if (r == goal.first && c == goal.second) return g[r][c];
        int gc = g[r][c];
        if (f != gc + manhattan(r, c)) continue;  // stale entry
        for (const auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
            if (grid[nr][nc] == 1) continue;
            int ng = gc + 1;
            if (ng < g[nr][nc]) {
                g[nr][nc] = ng;
                open.push({ng + manhattan(nr, nc), {nr, nc}});
            }
        }
    }
    return -1;
}`,

    'search-01:0': `int lowerBound(const vector<int>& arr, int target) {
    int lo = 0, hi = static_cast<int>(arr.size());
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid;                       // arr[mid] >= target
    }
    return lo;                               // first index with arr[idx] >= target (or arr.size())
}`,

    'search-01:1': `nums = [4,5,6,7,0,1,2], target = 0
- l=0, r=6, m=3 (m points at 7). nums[l]=4 <= nums[m]=7 -> left half [4,5,6,7] is sorted.
  target(0) < nums[l](4), so the target is NOT in the left half -> discard it: l = m + 1 = 4.
- l=4, r=6, m=5 (val 1). nums[l]=0 <= nums[m]=1 -> left half [0,1] is sorted.
  target(0) >= nums[l](0) && target(0) <= nums[m](1) -> search the left half: r = m = 5.
- l=4, r=5, m=4 (val 0). nums[m] == target -> return 4.
Answer: index 4.`,'sort-01:0': `void merge(std::vector<int>& arr, int l, int m, int r) {
    std::vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    std::vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    size_t i = 0, j = 0;
    int k = l;
    while (i < left.size() && j < right.size())
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}
// The leftover-copy loops handle any remainder once one side is exhausted.
// Use <= (not <) on the left side to preserve stability.`,

    'sort-01:1': `Lomuto partition trace on [7, 2, 1, 6, 8, 5, 3, 4] (pivot = 4, i.e. arr[7]):
- j=0: 7 > 4, skip; j=1: 2 <= 4 swap(arr[0],arr[1]) -> [2, 7, ...], i=1
- j=2: 1 <= 4 swap(arr[1],arr[2]) -> [2, 1, 7, ...], i=2
- j=3: 6 > 4, skip; j=4: 8 > 4, skip; j=5: 5 > 4, skip; j=6: 3 <= 4 swap(arr[2],arr[6]) -> [2, 1, 3, ...], i=3
- end: swap(arr[3], arr[7]) -> [2, 1, 3, 4, 8, 5, 7, 6]; return i = 3
Recursion continues on [2,1,3] and [8,5,7,6]; final sorted order is [1,2,3,4,5,6,7,8].`,
    'greedy-01:0': `int maxSchedule(std::vector<std::pair<int,int>> intervals) {
    std::sort(intervals.begin(), intervals.end(),
              [](const auto& a, const auto& b) { return a.second < b.second; });
    int count = 0, lastFinish = INT_MIN;
    for (const auto& [start, finish] : intervals) {
        if (start >= lastFinish) {
            ++count;
            lastFinish = finish;
        }
    }
    return count;
}
// Pair is (start, finish); finish-driven sort is what makes the sweep optimal.`,

    'greedy-01:1': `Merge trace for A=5  B=9  C=12  D=13  E=16  F=45:
- Step 1: merge two smallest (A=5, B=9)   -> node X = 14 (A depth 2nd tier)
- Step 2: heap now {12, 13, 14, 16, 45}; merge two smallest (C=12, D=13) -> node Y = 25
- Step 3: merge two smallest (X=14, E=16) -> node Z = 30
- Step 4: merge (Y=25, Z=30) -> node W = 55
- Step 5: merge (F=45, W=55) -> root = 100
A's final depth: A -> X -> Z -> W -> root, i.e. 4 (code 0001-ish depending on tie-breaks).
Weighted path length = 5*4 + 9*4 + 12*3 + 13*3 + 16*3 + 45*1 = 20 + 36 + 36 + 39 + 48 + 45 = 224.`,
    'dp-01:0': `int lcs(const std::string& a, const std::string& b) {
    int n = (int)a.size(), m = (int)b.size();
    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(m + 1, 0));
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            dp[i][j] = (a[i - 1] == b[j - 1]) ? dp[i - 1][j - 1] + 1
                                                : std::max(dp[i - 1][j], dp[i][j - 1]);
    return dp[n][m];
}
// dp[i][j] == LCS length of a[0..i) and b[0..j).
// Reconstruct the string by backtracking from dp[n][m].`,

    'dp-01:1': `fib(5) call trace with memoization:
- fib(5) [compute] -> fib(4) + fib(3)
- fib(4) [compute] -> fib(3) + fib(2)
- fib(3) [compute] -> fib(2) + fib(1)
- fib(2) [compute] -> fib(1) + fib(0)
- fib(1) [base] = 1                      memo[1]=1
- fib(0) [base] = 0                      memo[0]=0
- fib(2) done = 1                        memo[2]=1
- fib(3) [compute] -> fib(2) + fib(1)
- fib(2) memo hit = 1
- fib(1) memo hit = 1
- fib(3) done = 2                        memo[3]=2
- fib(4) -> fib(3) + fib(2)
- fib(3) memo hit = 2
- fib(2) memo hit = 1
- fib(4) done = 3                        memo[4]=3
- fib(5) -> fib(4) + fib(3)
- fib(4) memo hit = 3
- fib(3) memo hit = 2
- fib(5) done = 5
Distinct computed states: f0..f5 = 6. Naive recursion: fib(5) alone triggers 15 calls (2*fib(6)-1).`,
    'dc-01:0': `int quickSelect(std::vector<int>& a, int l, int r, int k) {
    if (l == r) return a[l];
    int pivot = a[r], p = l;
    for (int j = l; j < r; ++j)
        if (a[j] <= pivot) std::swap(a[p++], a[j]);
    std::swap(a[p], a[r]);
    if (k == p) return a[p];
    return (k < p) ? quickSelect(a, l, p - 1, k)
                   : quickSelect(a, p + 1, r, k);
}
// k is a 0-based index. Every call does O(r - l) work on one side only.`,

    'dc-01:1': `T(8) expansion by hand:
- T(1) = 1                          (base)
- T(2) = 2*T(1) + 2 = 4
- T(4) = 2*T(2) + 4 = 12
- T(8) = 2*T(4) + 8 = 32
Guess pattern: T(2^k) = (k + 2) * 2^k? Check T(2)=4 with k=1: (1+2)*2 = 6 no.
Direct: T(8) = 2*T(4)+8 = 2*(2*T(2)+4)+8 = 4*T(2)+16 = 4*(2*T(1)+2)+16 = 8*T(1)+24 = 8+24 = 32.
Master theorem: a=2, b=2, log_b(a)=1; f(n)=n^1 => case 2 => T(n) = Θ(n log n) = 8*3 = 24 units vs 32 measured with constants 1 — same order.`,
    'bit-01:0': `int popcountNoBuiltin(unsigned n) {
    int c = 0;
    while (n) {
        n &= n - 1;   // drop one set bit per iteration
        ++c;
    }
    return c;
}
int popcountBuiltin(unsigned n) {
    return __builtin_popcount(n);   // or std::popcount (C++20)
}
// Builtin version compiles to a single POPCNT on x86-64 with -mpopcnt.`,

    'bit-01:1': `items [A, B, C]; s as 0bABC (bit2=A bit1=B bit0=C index mapping here: i=0 is A and s&(1<<i)):
- s = 0b101 (5): bits 0 and 2 set  -> {A, C}
- s = 0b011 (3): bits 0 and 1 set  -> {A, B}
- s = 0b111 (7): bits 0, 1 and 2   -> {A, B, C}
(With i = index, A=0, B=1, C=2: s=0b101 means element 0 and element 2 are selected.)`,
    'adv-graph-01:0': `struct DSU {
    std::vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) { std::iota(parent.begin(), parent.end(), 0); }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);  // path compression
        return parent[x];
    }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rank[a] < rank[b]) std::swap(a, b);
        parent[b] = a;
        if (rank[a] == rank[b]) ++rank[a];
        return true;
    }
};
// find() with path compression + union by rank => amortized near-O(1) per op.`,

    'adv-graph-01:1': `Edmonds-Karp trace on S->A(3), S->B(2), A->B(1), A->T(2), B->T(3):
Initial residual caps: S->A 3, S->B 2, A->B 1, A->T 2, B->T 3.

Augmentation 1 (BFS): S -> A -> T, bottleneck = min(3, 2) = 2.
  Residual: S->A 1, A->S 2, A->T 0, T->A 2. Flow = 2.

Augmentation 2 (BFS): S -> B -> T, bottleneck = min(2, 3) = 2.
  Residual: S->B 0, B->S 2, B->T 1, T->B 2. Flow = 4.

Augmentation 3 (BFS): S -> A -> B -> T, bottleneck = min(1, 1, 1) = 1.
  Residual: S->A 0, A->B 0, B->T 0. Flow = 5.

No more s->t paths: done. Max flow = 5.
Reachable set from S in final residual graph = {S} (no outgoing capacity left),
so the min cut is S->A + S->B with capacity 3 + 2 = 5 = max flow.`,
    'cp-01:0': `struct RangeSum {
    std::vector<long long> prefix;
    RangeSum(const std::vector<int>& a) {
        prefix.assign(a.size() + 1, 0);
        for (size_t i = 0; i < a.size(); ++i) prefix[i + 1] = prefix[i] + a[i];
    }
    long long query(int l, int r) const {
        return prefix[r + 1] - prefix[l];
    }
};
// prefix[i] = sum of first i elements; query(l, r) = prefix[r+1] - prefix[l].
// O(n) build, O(1) per query.`,

    'cp-01:1': `Minimize the max part sum, split [1,2,3,4,5,6,7,8,9] into 3 contiguous parts:
Greedy build for a candidate maxSum: take as much as fits into the current part.

lo = 9 (max element), hi = 45 (sum of all)
- mid = 27: [1..6]=21, then 7+8+9 = 24 -> 2 parts -> feasible, hi = 27
- mid = 18: [1..5]=15, [6+7]=13, [8+9]=17 -> 3 parts -> feasible, hi = 18
- mid = 13: [1..4]=10, [5+6]=11, [7], [8], [9] -> 5 parts -> infeasible, lo = 14
- mid = 16: [1..5]=15, [6+7]=13, [8+9]=17 > 16 -> 4 parts -> infeasible, lo = 17
- mid = 17: [1..5]=15, [6+7]=13, [8+9]=17 <= 17 -> 3 parts -> feasible, hi = 17
- lo == hi == 17 -> answer 17 (max partition sum).`,
    'proj-01:0': `ReplaceRange final logic:
- execute():
  removed = buf.slice(pos, len)                 // e.g. "abc" for Replace at pos=5 len=3
  buf.erase(pos, len)                           // buffer now without the removed range
  buf.insert(pos, text)                         // e.g. insert "XYZ"
- undo():
  buf.erase(pos, text.size())                   // remove "XYZ"
  buf.insert(pos, removed)                      // restore "abc"
- Scenario trace for "abc", delete b, paste X at pos 1, Undo x3:
  after Insert a,b,c : buffer "abc"             undoStack: [a][b][c]                  redoStack: []
  Delete b           : buffer "ac"              undoStack: [a][b][c][Del(pos=1,'b')]   redoStack: []
  Insert X at 1      : buffer "aXc"             undoStack: [a][b][c][Del(pos=1,'b')][Insert('X' @1)]  redoStack: []
  Undo (Insert X)    : buffer "ac"              undoStack: [a][b][c][Del(pos=1,'b')]  redoStack: [Insert('X' @1)]
  Undo (Delete b)    : buffer "abc"             undoStack: [a][b][c]                  redoStack: [Del(pos=1,'b')]
  Undo (Insert c)    : buffer "ab"              undoStack: [a][b]                     redoStack: [Insert('c')]`,

    'proj-01:1': `ReplaceRange command behavior:
- execute() = save removed slice, erase it, insert new text.
- undo()    = erase the text just inserted, re-insert the removed slice at the same position.
- Net effect: a single command inverts a replace-range regardless of removed/inserted sizes,
  so paste and replace operations are atomic single-undo steps.`,
}
