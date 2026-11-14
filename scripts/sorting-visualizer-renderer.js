/**
 * Sorting Visualizer Renderer - Full-screen sorting algorithm visualization
 * Provides algorithm selection, array controls, and step-by-step animation
 */

const SortingVisualizerRenderer = {
    visualizer: null,
    currentAlgorithm: 'bubble',
    
    algorithms: [
        { id: 'bubble', name: 'Bubble Sort', complexity: 'O(n²)', description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.' },
        { id: 'selection', name: 'Selection Sort', complexity: 'O(n²)', description: 'Divides the input into a sorted and unsorted region, repeatedly selecting the minimum from unsorted and moving it to sorted.' },
        { id: 'insertion', name: 'Insertion Sort', complexity: 'O(n²)', description: 'Builds the final sorted array one item at a time by inserting each element into its correct position in the sorted portion.' },
        { id: 'merge', name: 'Merge Sort', complexity: 'O(n log n)', description: 'Divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and merges the sorted halves.' },
        { id: 'quick', name: 'Quick Sort', complexity: 'O(n log n) avg', description: 'Picks a pivot element and partitions the array around it, placing smaller elements before and larger after, then recursively sorts partitions.' },
        { id: 'heap', name: 'Heap Sort', complexity: 'O(n log n)', description: 'Builds a max heap from the data, then repeatedly extracts the maximum element and rebuilds the heap until sorted.' }
    ],
    
    render() {
        return `
            <header class="page-header sorting-header">
                <h2>🔄 Sorting Algorithm Visualizer</h2>
                <p>Interactive step-by-step visualization of sorting algorithms with comparison/swap highlighting</p>
            </header>
            
            <div class="sorting-visualizer-layout">
                <aside class="sorting-sidebar">
                    <section class="sidebar-section">
                        <h3>📋 Algorithm Selection</h3>
                        <div class="algorithm-list" id="algorithm-list">
                            ${this.algorithms.map(algo => `
                                <button class="algorithm-btn ${algo.id === this.currentAlgorithm ? 'active' : ''}" 
                                        data-algorithm="${algo.id}"
                                        title="${algo.description}">
                                    <div class="algo-info">
                                        <span class="algo-name">${algo.name}</span>
                                        <span class="algo-complexity">${algo.complexity}</span>
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                    </section>
                    
                    <section class="sidebar-section">
                        <h3>⚙️ Array Controls</h3>
                        <div class="control-group">
                            <label for="array-size">Array Size: <span id="array-size-value">30</span></label>
                            <input type="range" id="array-size" min="10" max="100" value="30" step="5">
                        </div>
                        <div class="control-group">
                            <label for="animation-speed">Animation Speed: <span id="speed-value">5</span></label>
                            <input type="range" id="animation-speed" min="1" max="10" value="5">
                        </div>
                        <div class="control-group">
                            <button class="btn primary" id="generate-array">🔀 Generate New Array</button>
                        </div>
                    </section>
                    
                    <section class="sidebar-section">
                        <h3>📊 Statistics</h3>
                        <div class="stats-panel" id="stats-panel">
                            <div class="stat-row">
                                <span class="stat-label">Comparisons:</span>
                                <span class="stat-value" id="stat-comparisons">0</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Swaps:</span>
                                <span class="stat-value" id="stat-swaps">0</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Steps:</span>
                                <span class="stat-value" id="stat-steps">0</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Current Step:</span>
                                <span class="stat-value" id="stat-current-step">0</span>
                            </div>
                        </div>
                    </section>
                    
                    <section class="sidebar-section">
                        <h3>💡 Algorithm Info</h3>
                        <div class="algorithm-info" id="algorithm-info">
                            ${this.getAlgorithmInfo(this.currentAlgorithm)}
                        </div>
                    </section>
                </aside>
                
                <main class="sorting-main">
                    <div class="visualizer-container">
                        <canvas id="sorting-canvas" class="sorting-canvas"></canvas>
                        
                        <div class="visualizer-controls-main">
                            <div class="control-group-inline">
                                <button class="btn control-btn" id="btn-reset" title="Reset">↺ Reset</button>
                                <button class="btn control-btn" id="btn-step-back" title="Step Back">⏮ Step Back</button>
                                <button class="btn control-btn primary" id="btn-play" title="Play">▶ Play</button>
                                <button class="btn control-btn" id="btn-pause" title="Pause" style="display:none;">⏸ Pause</button>
                                <button class="btn control-btn" id="btn-step" title="Step Forward">⏭ Step</button>
                            </div>
                            <div class="control-group-inline">
                                <span class="step-indicator" id="step-indicator">Step 0 / 0</span>
                            </div>
                        </div>
                        
                        <div class="step-description" id="step-description">
                            Click "Generate New Array" to start, then select an algorithm and press Play
                        </div>
                    </div>
                    
                    <section class="code-section">
                        <h3>💻 C++ Implementation</h3>
                        <div class="code-tabs" id="code-tabs">
                            ${this.algorithms.map(algo => `
                                <button class="code-tab ${algo.id === this.currentAlgorithm ? 'active' : ''}" data-code-tab="${algo.id}">${algo.name}</button>
                            `).join('')}
                        </div>
                        <pre><code id="algorithm-code" class="language-cpp">${this.getAlgorithmCode(this.currentAlgorithm)}</code></pre>
                    </section>
                </main>
            </div>
        `;
    },
    
    getAlgorithmInfo(algorithmId) {
        const algo = this.algorithms.find(a => a.id === algorithmId);
        if (!algo) return '';
        
        const details = {
            bubble: {
                best: 'O(n)',
                average: 'O(n²)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: 'Yes',
                description: 'Bubble sort is a simple comparison-based algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed, indicating the list is sorted.'
            },
            selection: {
                best: 'O(n²)',
                average: 'O(n²)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: 'No',
                description: 'Selection sort divides the array into a sorted and unsorted region. It repeatedly finds the minimum element from the unsorted region and moves it to the end of the sorted region. It performs O(n) swaps, making it useful when write operations are expensive.'
            },
            insertion: {
                best: 'O(n)',
                average: 'O(n²)',
                worst: 'O(n²)',
                space: 'O(1)',
                stable: 'Yes',
                description: 'Insertion sort builds the sorted array one element at a time. It takes each element from the unsorted portion and inserts it into its correct position in the sorted portion. Efficient for small or nearly sorted arrays.'
            },
            merge: {
                best: 'O(n log n)',
                average: 'O(n log n)',
                worst: 'O(n log n)',
                space: 'O(n)',
                stable: 'Yes',
                description: 'Merge sort uses divide-and-conquer: it recursively divides the array into halves until single elements remain, then merges them back in sorted order. Guarantees O(n log n) time but requires O(n) extra space.'
            },
            quick: {
                best: 'O(n log n)',
                average: 'O(n log n)',
                worst: 'O(n²)',
                space: 'O(log n)',
                stable: 'No',
                description: 'Quick sort picks a pivot and partitions the array around it. Elements smaller than pivot go left, larger go right. It then recursively sorts the partitions. Fast in practice but worst case is O(n²) with poor pivot choice.'
            },
            heap: {
                best: 'O(n log n)',
                average: 'O(n log n)',
                worst: 'O(n log n)',
                space: 'O(1)',
                stable: 'No',
                description: 'Heap sort builds a max heap from the array, then repeatedly extracts the maximum element (root) and moves it to the end. It maintains the heap property after each extraction. Guarantees O(n log n) with O(1) space.'
            }
        };
        
        const detail = details[algorithmId];
        if (!detail) return '';
        
        return `
            <div class="algo-detail">
                <h4>${algo.name}</h4>
                <p class="algo-desc">${detail.description}</p>
                <table class="complexity-table">
                    <tr><th>Case</th><th>Time Complexity</th></tr>
                    <tr><td>Best</td><td>${detail.best}</td></tr>
                    <tr><td>Average</td><td>${detail.average}</td></tr>
                    <tr><td>Worst</td><td>${detail.worst}</td></tr>
                </table>
                <div class="space-stable">
                    <span><strong>Space:</strong> ${detail.space}</span>
                    <span><strong>Stable:</strong> ${detail.stable}</span>
                </div>
            </div>
        `;
    },
    
    getAlgorithmCode(algorithmId) {
        const codes = {
            bubble: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // Early exit optimization
    }
}`,
            selection: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            swap(arr[i], arr[minIdx]);
        }
    }
}`,
            insertion: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
            merge: `void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> L(arr.begin() + left, arr.begin() + mid + 1);
    vector<int> R(arr.begin() + mid + 1, arr.begin() + right + 1);
    
    int i = 0, j = 0, k = left;
    while (i < L.size() && j < R.size()) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < L.size()) arr[k++] = L[i++];
    while (j < R.size()) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`,
            quick: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
            heap: `void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    
    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    
    // Extract elements from heap
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`
        };
        
        return codes[algorithmId] || '';
    },
    
    init() {
        this.setupVisualizer();
        this.bindEvents();
    },
    
    setupVisualizer() {
        const canvas = document.getElementById('sorting-canvas');
        if (!canvas) return;
        
        this.visualizer = new SortingVisualizer(canvas, {
            arraySize: 30,
            speed: 5
        });
        
        this.visualizer.generateArray(30);
        this.visualizer.setAlgorithm(this.currentAlgorithm);
        this.updateUI();
    },
    
    bindEvents() {
        // Algorithm selection
        document.querySelectorAll('.algorithm-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const algoId = e.currentTarget.dataset.algorithm;
                this.selectAlgorithm(algoId);
            });
        });
        
        // Code tabs
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const algoId = e.currentTarget.dataset.codeTab;
                this.switchCodeTab(algoId);
            });
        });
        
        // Array size
        const arraySizeInput = document.getElementById('array-size');
        if (arraySizeInput) {
            arraySizeInput.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                document.getElementById('array-size-value').textContent = size;
                if (this.visualizer) {
                    this.visualizer.setArraySize(size);
                    this.updateUI();
                }
            });
        }
        
        // Animation speed
        const speedInput = document.getElementById('animation-speed');
        if (speedInput) {
            speedInput.addEventListener('input', (e) => {
                const speed = parseInt(e.target.value);
                document.getElementById('speed-value').textContent = speed;
                if (this.visualizer) {
                    this.visualizer.setSpeed(speed);
                }
            });
        }
        
        // Generate new array
        document.getElementById('generate-array')?.addEventListener('click', () => {
            if (this.visualizer) {
                const size = parseInt(document.getElementById('array-size').value);
                this.visualizer.generateArray(size);
                this.visualizer.setAlgorithm(this.currentAlgorithm);
                this.updateUI();
            }
        });
        
        // Controls
        document.getElementById('btn-reset')?.addEventListener('click', () => {
            if (this.visualizer) {
                this.visualizer.reset();
                this.updateUI();
            }
        });
        
        document.getElementById('btn-step-back')?.addEventListener('click', () => {
            if (this.visualizer) {
                this.visualizer.stepBack();
                this.updateUI();
            }
        });
        
        document.getElementById('btn-play')?.addEventListener('click', () => {
            if (this.visualizer) {
                if (this.visualizer.steps.length === 0 || this.visualizer.currentStep >= this.visualizer.steps.length - 1) {
                    this.visualizer.generateSteps();
                }
                this.visualizer.play();
                this.updatePlayPauseButtons();
            }
        });
        
        document.getElementById('btn-pause')?.addEventListener('click', () => {
            if (this.visualizer) {
                this.visualizer.pause();
                this.updatePlayPauseButtons();
            }
        });
        
        document.getElementById('btn-step')?.addEventListener('click', () => {
            if (this.visualizer) {
                if (this.visualizer.steps.length === 0) {
                    this.visualizer.generateSteps();
                }
                this.visualizer.step();
                this.updateUI();
            }
        });
    },
    
    selectAlgorithm(algorithmId) {
        this.currentAlgorithm = algorithmId;
        
        // Update UI
        document.querySelectorAll('.algorithm-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.algorithm === algorithmId);
        });
        
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.codeTab === algorithmId);
        });
        
        // Update visualizer
        if (this.visualizer) {
            this.visualizer.setAlgorithm(algorithmId);
            this.visualizer.generateSteps();
        }
        
        // Update algorithm info
        document.getElementById('algorithm-info').innerHTML = this.getAlgorithmInfo(algorithmId);
        
        // Update code
        document.getElementById('algorithm-code').textContent = this.getAlgorithmCode(algorithmId);
        
        this.updateUI();
    },
    
    switchCodeTab(algorithmId) {
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.codeTab === algorithmId);
        });
        document.getElementById('algorithm-code').textContent = this.getAlgorithmCode(algorithmId);
    },
    
    updatePlayPauseButtons() {
        const playBtn = document.getElementById('btn-play');
        const pauseBtn = document.getElementById('btn-pause');
        
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
        
        document.getElementById('stat-comparisons').textContent = stats.comparisons;
        document.getElementById('stat-swaps').textContent = stats.swaps;
        document.getElementById('stat-steps').textContent = stats.steps;
        document.getElementById('stat-current-step').textContent = stats.currentStep + 1;
        
        document.getElementById('step-indicator').textContent = 
            `Step ${stats.currentStep + 1} / ${stats.steps}`;
        
        this.updatePlayPauseButtons();
        
        // Update step description
        if (this.visualizer.steps.length > 0 && stats.currentStep < this.visualizer.steps.length) {
            const step = this.visualizer.steps[stats.currentStep];
            document.getElementById('step-description').textContent = step.description;
        }
        
        // Trigger syntax highlighting if available
        if (window.Prism) {
            Prism.highlightAll();
        }
    }
};

// Auto-initialize when on sorting visualizer page
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the sorting visualizer page
    if (window.location.hash.includes('sorting')) {
        SortingVisualizerRenderer.init();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SortingVisualizerRenderer;
}