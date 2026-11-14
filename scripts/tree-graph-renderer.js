/**
 * Tree & Graph Visualizer Renderer - Full-screen tree and graph visualizations
 * Provides BST operations, tree traversals, and graph BFS/DFS with animation
 */

const TreeGraphRenderer = {
    visualizer: null,
    currentMode: 'bst', // 'bst' or 'graph'
    currentOperation: 'insert', // for BST
    currentTraversal: 'inorder', // for BST traversals
    currentAlgorithm: 'bfs', // for graph
    
    bstOperations: [
        { id: 'insert', name: 'Insert', icon: '➕' },
        { id: 'delete', name: 'Delete', icon: '🗑️' },
        { id: 'search', name: 'Search', icon: '🔍' }
    ],
    
    bstTraversals: [
        { id: 'preorder', name: 'Preorder', desc: 'Root → Left → Right' },
        { id: 'inorder', name: 'Inorder', desc: 'Left → Root → Right (sorted)' },
        { id: 'postorder', name: 'Postorder', desc: 'Left → Right → Root' },
        { id: 'levelorder', name: 'Level-order', desc: 'Level by level (BFS)' }
    ],
    
    graphAlgorithms: [
        { id: 'bfs', name: 'BFS', icon: '📋', desc: 'Breadth-First Search (Queue)' },
        { id: 'dfs', name: 'DFS', icon: '📚', desc: 'Depth-First Search (Stack)' }
    ],
    
    render() {
        return `
            <header class="page-header tree-graph-header">
                <h2>🌳 Tree & Graph Visualizer</h2>
                <p>Interactive BST operations, tree traversals, and graph algorithms with step-by-step animation</p>
            </header>
            
            <div class="tree-graph-layout">
                <aside class="tree-graph-sidebar">
                    <!-- Mode Selection -->
                    <section class="sidebar-section">
                        <h3>🎯 Visualization Mode</h3>
                        <div class="mode-tabs">
                            <button class="mode-tab ${this.currentMode === 'bst' ? 'active' : ''}" data-mode="bst">
                                <span class="mode-icon">🌳</span>
                                <span>Binary Search Tree</span>
                            </button>
                            <button class="mode-tab ${this.currentMode === 'graph' ? 'active' : ''}" data-mode="graph">
                                <span class="mode-icon">🕸️</span>
                                <span>Graph</span>
                            </button>
                        </div>
                    </section>
                    
                    <!-- BST Mode Content -->
                    <div class="mode-content" id="bst-content" style="${this.currentMode === 'bst' ? '' : 'display:none'}">
                        <section class="sidebar-section">
                            <h3>⚙️ BST Operations</h3>
                            <div class="operation-tabs">
                                ${this.bstOperations.map(op => `
                                    <button class="operation-tab ${op.id === this.currentOperation ? 'active' : ''}" 
                                            data-operation="${op.id}"
                                            title="${op.name} a value in the BST">
                                        ${op.icon} ${op.name}
                                    </button>
                                `).join('')}
                            </div>
                            <div class="control-group">
                                <label for="bst-value">Value (1-99):</label>
                                <input type="number" id="bst-value" min="1" max="99" value="42" step="1">
                            </div>
                            <div class="control-group">
                                <button class="btn primary" id="bst-execute">Execute ${this.getOperationLabel(this.currentOperation)}</button>
                            </div>
                        </section>
                        
                        <section class="sidebar-section">
                            <h3>🔄 Tree Traversals</h3>
                            <div class="traversal-list">
                                ${this.bstTraversals.map(trav => `
                                    <button class="traversal-btn" data-traversal="${trav.id}" title="${trav.desc}">
                                        <span class="trav-name">${trav.name}</span>
                                        <span class="trav-desc">${trav.desc}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </section>
                        
                        <section class="sidebar-section">
                            <h3>🌲 Tree Controls</h3>
                            <div class="control-group">
                                <label for="bst-size">Tree Size: <span id="bst-size-value">15</span></label>
                                <input type="range" id="bst-size" min="5" max="25" value="15" step="1">
                            </div>
                            <div class="control-group">
                                <label for="bst-speed">Animation Speed: <span id="bst-speed-value">5</span></label>
                                <input type="range" id="bst-speed" min="1" max="10" value="5">
                            </div>
                            <div class="control-group">
                                <button class="btn" id="bst-generate">🔀 Generate Random BST</button>
                                <button class="btn" id="bst-clear">🗑️ Clear Tree</button>
                            </div>
                        </section>
                    </div>
                    
                    <!-- Graph Mode Content -->
                    <div class="mode-content" id="graph-content" style="${this.currentMode === 'graph' ? '' : 'display:none'}">
                        <section class="sidebar-section">
                            <h3>🔍 Graph Algorithms</h3>
                            <div class="algorithm-tabs">
                                ${this.graphAlgorithms.map(algo => `
                                    <button class="algorithm-tab ${algo.id === this.currentAlgorithm ? 'active' : ''}" 
                                            data-algorithm="${algo.id}"
                                            title="${algo.desc}">
                                        ${algo.icon} ${algo.name}
                                    </button>
                                `).join('')}
                            </div>
                            <div class="control-group">
                                <label for="graph-start">Start Node:</label>
                                <select id="graph-start"></select>
                            </div>
                            <div class="control-group">
                                <label for="graph-target">Target Node (optional):</label>
                                <select id="graph-target">
                                    <option value="">None (full traversal)</option>
                                </select>
                            </div>
                            <div class="control-group">
                                <button class="btn primary" id="graph-execute">Run ${this.currentAlgorithm.toUpperCase()}</button>
                            </div>
                        </section>
                        
                        <section class="sidebar-section">
                            <h3>🕸️ Graph Controls</h3>
                            <div class="control-group">
                                <label for="graph-nodes">Nodes: <span id="graph-nodes-value">8</span></label>
                                <input type="range" id="graph-nodes" min="4" max="15" value="8" step="1">
                            </div>
                            <div class="control-group">
                                <label for="graph-density">Edge Density: <span id="graph-density-value">30%</span></label>
                                <input type="range" id="graph-density" min="10" max="60" value="30" step="5">
                            </div>
                            <div class="control-group">
                                <label for="graph-speed">Animation Speed: <span id="graph-speed-value">5</span></label>
                                <input type="range" id="graph-speed" min="1" max="10" value="5">
                            </div>
                            <div class="control-group">
                                <button class="btn" id="graph-generate">🔀 Generate Random Graph</button>
                                <button class="btn" id="graph-clear">🗑️ Clear Graph</button>
                            </div>
                        </section>
                    </div>
                    
                    <!-- Common Stats Panel -->
                    <section class="sidebar-section">
                        <h3>📊 Statistics</h3>
                        <div class="stats-panel" id="stats-panel">
                            <div class="stat-row">
                                <span class="stat-label">Steps:</span>
                                <span class="stat-value" id="stat-steps">0</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Current Step:</span>
                                <span class="stat-value" id="stat-current-step">0</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Comparisons:</span>
                                <span class="stat-value" id="stat-comparisons">0</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Operations:</span>
                                <span class="stat-value" id="stat-operations">0</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Nodes:</span>
                                <span class="stat-value" id="stat-nodes">0</span>
                            </div>
                        </div>
                    </section>
                    
                    <!-- Algorithm Info -->
                    <section class="sidebar-section">
                        <h3>💡 Algorithm Info</h3>
                        <div class="algorithm-info" id="algorithm-info">
                            ${this.getAlgorithmInfo()}
                        </div>
                    </section>
                </aside>
                
                <main class="tree-graph-main">
                    <div class="visualizer-container">
                        <canvas id="tree-graph-canvas" class="tree-graph-canvas"></canvas>
                        
                        <div class="visualizer-controls-main">
                            <div class="control-group-inline">
                                <button class="btn control-btn" id="tg-btn-reset" title="Reset">↺ Reset</button>
                                <button class="btn control-btn" id="tg-btn-step-back" title="Step Back">⏮ Step Back</button>
                                <button class="btn control-btn primary" id="tg-btn-play" title="Play">▶ Play</button>
                                <button class="btn control-btn" id="tg-btn-pause" title="Pause" style="display:none;">⏸ Pause</button>
                                <button class="btn control-btn" id="tg-btn-step" title="Step Forward">⏭ Step</button>
                            </div>
                            <div class="control-group-inline">
                                <span class="step-indicator" id="tg-step-indicator">Step 0 / 0</span>
                            </div>
                        </div>
                        
                        <div class="step-description" id="tg-step-description">
                            Select a mode and generate a tree/graph to start visualizing
                        </div>
                    </div>
                    
                    <!-- Code Section -->
                    <section class="code-section">
                        <h3>💻 C++ Implementation</h3>
                        <div class="code-tabs" id="tg-code-tabs">
                            ${this.getCodeTabs()}
                        </div>
                        <pre><code id="tg-algorithm-code" class="language-cpp">${this.getAlgorithmCode()}</code></pre>
                    </section>
                </main>
            </div>
        `;
    },
    
    getOperationLabel(op) {
        const labels = { insert: 'Insert', delete: 'Delete', search: 'Search' };
        return labels[op] || 'Execute';
    },
    
    getCodeTabs() {
        if (this.currentMode === 'bst') {
            return `
                <button class="code-tab active" data-code-tab="bst-insert">BST Insert</button>
                <button class="code-tab" data-code-tab="bst-delete">BST Delete</button>
                <button class="code-tab" data-code-tab="bst-search">BST Search</button>
                <button class="code-tab" data-code-tab="bst-traversal">Tree Traversals</button>
            `;
        } else {
            return `
                <button class="code-tab active" data-code-tab="graph-bfs">BFS</button>
                <button class="code-tab" data-code-tab="graph-dfs">DFS</button>
            `;
        }
    },
    
    getAlgorithmCode() {
        const codes = {
            'bst-insert': `Node* insert(Node* root, int key) {
    if (!root) return new Node(key);
    
    if (key < root->key)
        root->left = insert(root->left, key);
    else if (key > root->key)
        root->right = insert(root->right, key);
    
    return root;
}

// Iterative version
Node* insertIterative(Node* root, int key) {
    Node* node = new Node(key);
    if (!root) return node;
    
    Node* curr = root;
    Node* parent = nullptr;
    
    while (curr) {
        parent = curr;
        if (key < curr->key)
            curr = curr->left;
        else if (key > curr->key)
            curr = curr->right;
        else
            return root; // duplicate
    }
    
    if (key < parent->key)
        parent->left = node;
    else
        parent->right = node;
    
    return root;
}`,
            'bst-delete': `Node* deleteNode(Node* root, int key) {
    if (!root) return nullptr;
    
    if (key < root->key)
        root->left = deleteNode(root->left, key);
    else if (key > root->key)
        root->right = deleteNode(root->right, key);
    else {
        // Node found - 3 cases
        if (!root->left) {
            Node* temp = root->right;
            delete root;
            return temp;
        }
        else if (!root->right) {
            Node* temp = root->left;
            delete root;
            return temp;
        }
        
        // Two children: get inorder successor
        Node* temp = minValueNode(root->right);
        root->key = temp->key;
        root->right = deleteNode(root->right, temp->key);
    }
    return root;
}

Node* minValueNode(Node* node) {
    while (node->left) node = node->left;
    return node;
}`,
            'bst-search': `bool search(Node* root, int key) {
    if (!root) return false;
    if (root->key == key) return true;
    if (key < root->key)
        return search(root->left, key);
    return search(root->right, key);
}

// Iterative version
bool searchIterative(Node* root, int key) {
    while (root) {
        if (root->key == key) return true;
        if (key < root->key)
            root = root->left;
        else
            root = root->right;
    }
    return false;
}`,
            'bst-traversal': `// Preorder: Root → Left → Right
void preorder(Node* root) {
    if (!root) return;
    cout << root->key << " ";
    preorder(root->left);
    preorder(root->right);
}

// Inorder: Left → Root → Right (sorted output)
void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->key << " ";
    inorder(root->right);
}

// Postorder: Left → Right → Root
void postorder(Node* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->key << " ";
}

// Level-order (BFS)
void levelorder(Node* root) {
    if (!root) return;
    queue<Node*> q;
    q.push(root);
    
    while (!q.empty()) {
        Node* curr = q.front(); q.pop();
        cout << curr->key << " ";
        if (curr->left) q.push(curr->left);
        if (curr->right) q.push(curr->right);
    }
}`,
            'graph-bfs': `void BFS(int start, vector<vector<int>>& adj, vector<bool>& visited) {
    queue<int> q;
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int u = q.front(); q.pop();
        cout << u << " "; // Visit node
        
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}

// Time: O(V + E), Space: O(V)
// Use cases: Shortest path (unweighted), connectivity, level order
`,
            'graph-dfs': `void DFS(int u, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;
    cout << u << " "; // Visit node
    
    for (int v : adj[u]) {
        if (!visited[v]) {
            DFS(v, adj, visited);
        }
    }
}

// Iterative version
void DFSIterative(int start, vector<vector<int>>& adj, vector<bool>& visited) {
    stack<int> st;
    st.push(start);
    
    while (!st.empty()) {
        int u = st.top(); st.pop();
        if (visited[u]) continue;
        visited[u] = true;
        cout << u << " ";
        
        for (int v : adj[u]) {
            if (!visited[v]) st.push(v);
        }
    }
}

// Time: O(V + E), Space: O(V)
// Use cases: Topological sort, cycle detection, path finding
`
        };
        
        const defaultTab = this.currentMode === 'bst' ? 'bst-insert' : 'graph-bfs';
        return codes[defaultTab] || '';
    },
    
    getAlgorithmInfo() {
        if (this.currentMode === 'bst') {
            const opInfo = {
                insert: {
                    title: 'BST Insert',
                    desc: 'Insert a new value while maintaining BST property: left < root < right. Average O(log n), worst O(n) for unbalanced tree.',
                    best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', space: 'O(h)'
                },
                delete: {
                    title: 'BST Delete',
                    desc: 'Remove a node handling 3 cases: leaf (remove), one child (replace), two children (replace with inorder successor).',
                    best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', space: 'O(h)'
                },
                search: {
                    title: 'BST Search',
                    desc: 'Find a value by comparing at each node and going left/right. Very efficient in balanced trees.',
                    best: 'O(1)', avg: 'O(log n)', worst: 'O(n)', space: 'O(h)'
                }
            };
            const info = opInfo[this.currentOperation] || opInfo.insert;
            return this.formatInfo(info);
        } else {
            const algoInfo = {
                bfs: {
                    title: 'Breadth-First Search (BFS)',
                    desc: 'Explores graph level by level using a queue. Finds shortest path in unweighted graphs.',
                    best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)'
                },
                dfs: {
                    title: 'Depth-First Search (DFS)',
                    desc: 'Explores as far as possible along each branch using a stack (or recursion). Good for topological sort, cycle detection.',
                    best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)'
                }
            };
            const info = algoInfo[this.currentAlgorithm] || algoInfo.bfs;
            return this.formatInfo(info);
        }
    },
    
    formatInfo(info) {
        return `
            <div class="algo-detail">
                <h4>${info.title}</h4>
                <p class="algo-desc">${info.desc}</p>
                <table class="complexity-table">
                    <tr><th>Case</th><th>Time</th></tr>
                    <tr><td>Best</td><td>${info.best}</td></tr>
                    <tr><td>Average</td><td>${info.avg}</td></tr>
                    <tr><td>Worst</td><td>${info.worst}</td></tr>
                </table>
                <div class="space-stable">
                    <span><strong>Space:</strong> ${info.space}</span>
                </div>
            </div>
        `;
    },
    
    init() {
        this.setupVisualizer();
        this.bindEvents();
    },
    
    setupVisualizer() {
        const canvas = document.getElementById('tree-graph-canvas');
        if (!canvas) return;
        
        if (this.currentMode === 'bst') {
            this.visualizer = new TreeVisualizer(canvas, { speed: 5 });
            this.visualizer.generateRandomBST(15);
        } else {
            this.visualizer = new GraphVisualizer(canvas, { speed: 5 });
            this.visualizer.generateRandomGraph(8, 0.3);
            this.updateGraphNodeSelects();
        }
        
        this.updateUI();
    },
    
    bindEvents() {
        // Mode tabs
        document.querySelectorAll('.mode-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.switchMode(mode);
            });
        });
        
        // BST operation tabs
        document.querySelectorAll('.operation-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const op = e.currentTarget.dataset.operation;
                this.switchOperation(op);
            });
        });
        
        // BST traversal buttons
        document.querySelectorAll('.traversal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trav = e.currentTarget.dataset.traversal;
                this.runTraversal(trav);
            });
        });
        
        // Graph algorithm tabs
        document.querySelectorAll('.algorithm-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const algo = e.currentTarget.dataset.algorithm;
                this.switchGraphAlgorithm(algo);
            });
        });
        
        // Code tabs
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.codeTab;
                this.switchCodeTab(tabId);
            });
        });
        
        // BST controls
        document.getElementById('bst-value')?.addEventListener('input', () => this.updateUI());
        document.getElementById('bst-execute')?.addEventListener('click', () => this.executeBSTOperation());
        document.getElementById('bst-generate')?.addEventListener('click', () => this.generateBST());
        document.getElementById('bst-clear')?.addEventListener('click', () => this.clearBST());
        
        // BST size/speed
        document.getElementById('bst-size')?.addEventListener('input', (e) => {
            document.getElementById('bst-size-value').textContent = e.target.value;
        });
        document.getElementById('bst-speed')?.addEventListener('input', (e) => {
            document.getElementById('bst-speed-value').textContent = e.target.value;
            if (this.visualizer) this.visualizer.setSpeed(parseInt(e.target.value));
        });
        
        // Graph controls
        document.getElementById('graph-start')?.addEventListener('change', () => this.updateUI());
        document.getElementById('graph-target')?.addEventListener('change', () => this.updateUI());
        document.getElementById('graph-execute')?.addEventListener('click', () => this.executeGraphAlgorithm());
        document.getElementById('graph-generate')?.addEventListener('click', () => this.generateGraph());
        document.getElementById('graph-clear')?.addEventListener('click', () => this.clearGraph());
        
        // Graph size/density/speed
        document.getElementById('graph-nodes')?.addEventListener('input', (e) => {
            document.getElementById('graph-nodes-value').textContent = e.target.value;
        });
        document.getElementById('graph-density')?.addEventListener('input', (e) => {
            document.getElementById('graph-density-value').textContent = e.target.value + '%';
        });
        document.getElementById('graph-speed')?.addEventListener('input', (e) => {
            document.getElementById('graph-speed-value').textContent = e.target.value;
            if (this.visualizer) this.visualizer.setSpeed(parseInt(e.target.value));
        });
        
        // Common controls
        document.getElementById('tg-btn-reset')?.addEventListener('click', () => {
            if (this.visualizer) { this.visualizer.reset(); this.updateUI(); }
        });
        document.getElementById('tg-btn-step-back')?.addEventListener('click', () => {
            if (this.visualizer) { this.visualizer.stepBack(); this.updateUI(); }
        });
        document.getElementById('tg-btn-play')?.addEventListener('click', () => {
            if (this.visualizer) { this.visualizer.play(); this.updatePlayPauseButtons(); }
        });
        document.getElementById('tg-btn-pause')?.addEventListener('click', () => {
            if (this.visualizer) { this.visualizer.pause(); this.updatePlayPauseButtons(); }
        });
        document.getElementById('tg-btn-step')?.addEventListener('click', () => {
            if (this.visualizer) { this.visualizer.step(); this.updateUI(); }
        });
    },
    
    switchMode(mode) {
        this.currentMode = mode;
        
        document.querySelectorAll('.mode-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        document.getElementById('bst-content').style.display = mode === 'bst' ? '' : 'none';
        document.getElementById('graph-content').style.display = mode === 'graph' ? '' : 'none';
        
        // Recreate visualizer
        const canvas = document.getElementById('tree-graph-canvas');
        if (mode === 'bst') {
            this.visualizer = new TreeVisualizer(canvas, { speed: 5 });
            this.visualizer.generateRandomBST(15);
        } else {
            this.visualizer = new GraphVisualizer(canvas, { speed: 5 });
            this.visualizer.generateRandomGraph(8, 0.3);
            this.updateGraphNodeSelects();
        }
        
        // Update code tabs
        document.getElementById('tg-code-tabs').innerHTML = this.getCodeTabs();
        document.getElementById('tg-algorithm-code').textContent = this.getAlgorithmCode();
        this.bindCodeTabEvents();
        
        // Update algorithm info
        document.getElementById('algorithm-info').innerHTML = this.getAlgorithmInfo();
        
        this.updateUI();
    },
    
    switchOperation(op) {
        this.currentOperation = op;
        
        document.querySelectorAll('.operation-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.operation === op);
        });
        
        document.getElementById('bst-execute').textContent = this.getOperationLabel(op);
        document.getElementById('algorithm-info').innerHTML = this.getAlgorithmInfo();
        
        // Update code tab
        const codeTabMap = { insert: 'bst-insert', delete: 'bst-delete', search: 'bst-search' };
        this.switchCodeTab(codeTabMap[op]);
    },
    
    switchGraphAlgorithm(algo) {
        this.currentAlgorithm = algo;
        
        document.querySelectorAll('.algorithm-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.algorithm === algo);
        });
        
        document.getElementById('graph-execute').textContent = `Run ${algo.toUpperCase()}`;
        document.getElementById('algorithm-info').innerHTML = this.getAlgorithmInfo();
        
        // Update code tab
        this.switchCodeTab(algo === 'bfs' ? 'graph-bfs' : 'graph-dfs');
    },
    
    switchCodeTab(tabId) {
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.codeTab === tabId);
        });
        
        const codes = {
            'bst-insert': `Node* insert(Node* root, int key) {
    if (!root) return new Node(key);
    
    if (key < root->key)
        root->left = insert(root->left, key);
    else if (key > root->key)
        root->right = insert(root->right, key);
    
    return root;
}

// Iterative version
Node* insertIterative(Node* root, int key) {
    Node* node = new Node(key);
    if (!root) return node;
    
    Node* curr = root;
    Node* parent = nullptr;
    
    while (curr) {
        parent = curr;
        if (key < curr->key)
            curr = curr->left;
        else if (key > curr->key)
            curr = curr->right;
        else
            return root; // duplicate
    }
    
    if (key < parent->key)
        parent->left = node;
    else
        parent->right = node;
    
    return root;
}`,
            'bst-delete': `Node* deleteNode(Node* root, int key) {
    if (!root) return nullptr;
    
    if (key < root->key)
        root->left = deleteNode(root->left, key);
    else if (key > root->key)
        root->right = deleteNode(root->right, key);
    else {
        // Node found - 3 cases
        if (!root->left) {
            Node* temp = root->right;
            delete root;
            return temp;
        }
        else if (!root->right) {
            Node* temp = root->left;
            delete root;
            return temp;
        }
        
        // Two children: get inorder successor
        Node* temp = minValueNode(root->right);
        root->key = temp->key;
        root->right = deleteNode(root->right, temp->key);
    }
    return root;
}

Node* minValueNode(Node* node) {
    while (node->left) node = node->left;
    return node;
}`,
            'bst-search': `bool search(Node* root, int key) {
    if (!root) return false;
    if (root->key == key) return true;
    if (key < root->key)
        return search(root->left, key);
    return search(root->right, key);
}

// Iterative version
bool searchIterative(Node* root, int key) {
    while (root) {
        if (root->key == key) return true;
        if (key < root->key)
            root = root->left;
        else
            root = root->right;
    }
    return false;
}`,
            'bst-traversal': `// Preorder: Root → Left → Right
void preorder(Node* root) {
    if (!root) return;
    cout << root->key << " ";
    preorder(root->left);
    preorder(root->right);
}

// Inorder: Left → Root → Right (sorted output)
void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->key << " ";
    inorder(root->right);
}

// Postorder: Left → Right → Root
void postorder(Node* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->key << " ";
}

// Level-order (BFS)
void levelorder(Node* root) {
    if (!root) return;
    queue<Node*> q;
    q.push(root);
    
    while (!q.empty()) {
        Node* curr = q.front(); q.pop();
        cout << curr->key << " ";
        if (curr->left) q.push(curr->left);
        if (curr->right) q.push(curr->right);
    }
}`,
            'graph-bfs': `void BFS(int start, vector<vector<int>>& adj, vector<bool>& visited) {
    queue<int> q;
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int u = q.front(); q.pop();
        cout << u << " "; // Visit node
        
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}

// Time: O(V + E), Space: O(V)
// Use cases: Shortest path (unweighted), connectivity, level order
`,
            'graph-dfs': `void DFS(int u, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;
    cout << u << " "; // Visit node
    
    for (int v : adj[u]) {
        if (!visited[v]) {
            DFS(v, adj, visited);
        }
    }
}

// Iterative version
void DFSIterative(int start, vector<vector<int>>& adj, vector<bool>& visited) {
    stack<int> st;
    st.push(start);
    
    while (!st.empty()) {
        int u = st.top(); st.pop();
        if (visited[u]) continue;
        visited[u] = true;
        cout << u << " ";
        
        for (int v : adj[u]) {
            if (!visited[v]) st.push(v);
        }
    }
}

// Time: O(V + E), Space: O(V)
// Use cases: Topological sort, cycle detection, path finding
`
        };
        
        document.getElementById('tg-algorithm-code').textContent = codes[tabId] || '';
        
        if (window.Prism) {
            Prism.highlightAll();
        }
    },
    
    bindCodeTabEvents() {
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.codeTab;
                this.switchCodeTab(tabId);
            });
        });
    },
    
    executeBSTOperation() {
        if (!this.visualizer) return;
        
        const value = parseInt(document.getElementById('bst-value').value);
        if (isNaN(value) || value < 1 || value > 99) {
            alert('Please enter a value between 1 and 99');
            return;
        }
        
        switch (this.currentOperation) {
            case 'insert':
                this.visualizer.insert(value);
                break;
            case 'delete':
                this.visualizer.delete(value);
                break;
            case 'search':
                this.visualizer.search(value);
                break;
        }
        
        this.updateUI();
    },
    
    runTraversal(type) {
        if (!this.visualizer) return;
        
        this.currentTraversal = type;
        this.visualizer.traverse(type);
        this.updateUI();
    },
    
    executeGraphAlgorithm() {
        if (!this.visualizer) return;
        
        const startValue = parseInt(document.getElementById('graph-start').value);
        const targetValue = document.getElementById('graph-target').value;
        const target = targetValue ? parseInt(targetValue) : null;
        
        if (isNaN(startValue)) {
            alert('Please select a start node');
            return;
        }
        
        if (this.currentAlgorithm === 'bfs') {
            this.visualizer.bfs(startValue, target);
        } else {
            this.visualizer.dfs(startValue, target);
        }
        
        this.updateUI();
    },
    
    generateBST() {
        if (!this.visualizer) return;
        const size = parseInt(document.getElementById('bst-size').value);
        this.visualizer.generateRandomBST(size);
        this.updateUI();
    },
    
    clearBST() {
        if (!this.visualizer) return;
        this.visualizer.root = null;
        this.visualizer.steps = [];
        this.visualizer.currentStep = 0;
        this.visualizer.recordStep('initial', [], 'Tree cleared');
        this.updateUI();
    },
    
    generateGraph() {
        if (!this.visualizer) return;
        const nodes = parseInt(document.getElementById('graph-nodes').value);
        const density = parseInt(document.getElementById('graph-density').value) / 100;
        this.visualizer.generateRandomGraph(nodes, density);
        this.updateGraphNodeSelects();
        this.updateUI();
    },
    
    clearGraph() {
        if (!this.visualizer) return;
        this.visualizer.nodes.clear();
        this.visualizer.steps = [];
        this.visualizer.currentStep = 0;
        this.visualizer.recordStep('initial', [], 'Graph cleared');
        this.updateGraphNodeSelects();
        this.updateUI();
    },
    
    updateGraphNodeSelects() {
        if (!this.visualizer) return;
        
        const values = Array.from(this.visualizer.nodes.keys()).sort((a, b) => a - b);
        const startSelect = document.getElementById('graph-start');
        const targetSelect = document.getElementById('graph-target');
        
        if (startSelect) {
            startSelect.innerHTML = values.map(v => `<option value="${v}">${v}</option>`).join('');
        }
        
        if (targetSelect) {
            targetSelect.innerHTML = `<option value="">None (full traversal)</option>` + 
                values.map(v => `<option value="${v}">${v}</option>`).join('');
        }
    },
    
    updatePlayPauseButtons() {
        const playBtn = document.getElementById('tg-btn-play');
        const pauseBtn = document.getElementById('tg-btn-pause');
        
        if (this.visualizer && this.visualizer.isPlaying) {
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-flex';
        } else {
            playBtn.style.display = 'inline-flex';
            pauseBtn.style.display = 'none';
        }
    },
    
    updateUI() {
        if (!this.visualizer) return;
        
        const stats = this.visualizer.getStats();
        
        document.getElementById('stat-steps').textContent = stats.steps;
        document.getElementById('stat-current-step').textContent = stats.currentStep + 1;
        document.getElementById('stat-comparisons').textContent = stats.comparisons;
        document.getElementById('stat-operations').textContent = stats.operations;
        document.getElementById('stat-nodes').textContent = stats.nodeCount || 0;
        
        document.getElementById('tg-step-indicator').textContent = 
            `Step ${stats.currentStep + 1} / ${stats.steps}`;
        
        this.updatePlayPauseButtons();
        
        // Update step description
        if (this.visualizer.steps.length > 0 && stats.currentStep < this.visualizer.steps.length) {
            const step = this.visualizer.steps[stats.currentStep];
            document.getElementById('tg-step-description').textContent = step.description;
        }
        
        if (window.Prism) {
            Prism.highlightAll();
        }
    }
};

// Auto-initialize when on tree-graph visualizer page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash.includes('tree-graph') || window.location.hash.includes('visualizers/tree')) {
        TreeGraphRenderer.init();
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TreeGraphRenderer;
}