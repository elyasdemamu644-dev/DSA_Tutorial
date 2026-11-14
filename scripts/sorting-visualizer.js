/**
 * Sorting Algorithm Visualizer for C++ DSA Academy
 * Implements Bubble, Selection, Insertion, Merge, Quick, Heap sort
 * with step-by-step animation, array state display, and comparison/swap highlighting
 */

class SortingVisualizer {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = {
            arraySize: options.arraySize || 30,
            speed: options.speed || 5,
            barWidth: 0,
            barSpacing: 2,
            colors: {
                default: '#3498db',
                comparing: '#e74c3c',
                swapping: '#f39c12',
                sorted: '#27ae60',
                pivot: '#9b59b6',
                background: '#f8f9fa',
                text: '#2c3e50'
            },
            ...options
        };
        
        this.array = [];
        this.originalArray = [];
        this.steps = [];
        this.currentStep = 0;
        this.isPlaying = false;
        this.animationId = null;
        this.speed = this.options.speed;
        this.algorithm = 'bubble';
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        
        // Initialize canvas dimensions
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = Math.min(rect.width - 40, 800);
        this.canvas.height = 400;
        this.options.barWidth = (this.canvas.width / this.options.arraySize) - this.options.barSpacing;
        this.draw();
    }
    
    generateArray(size = this.options.arraySize) {
        this.array = [];
        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * 200) + 20);
        }
        this.originalArray = [...this.array];
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.recordStep('initial', [], [], 'Initial array');
    }
    
    setAlgorithm(algorithm) {
        this.algorithm = algorithm;
        this.reset();
    }
    
    setSpeed(speed) {
        this.speed = speed;
    }
    
    setArraySize(size) {
        this.options.arraySize = size;
        this.options.barWidth = (this.canvas.width / size) - this.options.barSpacing;
        this.generateArray(size);
    }
    
    reset() {
        this.array = [...this.originalArray];
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.recordStep('initial', [], [], 'Initial array');
        this.draw();
    }
    
    play() {
        if (this.isPlaying) return;
        if (this.currentStep >= this.steps.length - 1) {
            this.reset();
            this.generateSteps();
        }
        this.isPlaying = true;
        this.startTime = Date.now();
        this.animate();
    }
    
    pause() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    step() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.applyStep(this.steps[this.currentStep]);
            this.draw();
        }
    }
    
    stepBack() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.applyStep(this.steps[this.currentStep]);
            this.draw();
        }
    }
    
    animate() {
        if (!this.isPlaying || this.currentStep >= this.steps.length - 1) {
            this.isPlaying = false;
            return;
        }
        
        const delay = Math.max(50, 1100 - this.speed * 100);
        this.animationId = setTimeout(() => {
            this.currentStep++;
            this.applyStep(this.steps[this.currentStep]);
            this.draw();
            this.animate();
        }, delay);
    }
    
    generateSteps() {
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.swaps = 0;
        
        const arr = [...this.array];
        
        switch (this.algorithm) {
            case 'bubble':
                this.bubbleSort(arr);
                break;
            case 'selection':
                this.selectionSort(arr);
                break;
            case 'insertion':
                this.insertionSort(arr);
                break;
            case 'merge':
                this.mergeSort(arr, 0, arr.length - 1);
                break;
            case 'quick':
                this.quickSort(arr, 0, arr.length - 1);
                break;
            case 'heap':
                this.heapSort(arr);
                break;
        }
        
        // Mark all as sorted at the end
        this.recordStep('sorted', [], [], 'Sorting complete', [...arr]);
    }
    
    recordStep(type, comparingIndices, swappingIndices, description, arrayState = null) {
        this.steps.push({
            type,
            array: arrayState ? [...arrayState] : [...this.array],
            comparing: [...comparingIndices],
            swapping: [...swappingIndices],
            description,
            comparisons: this.comparisons,
            swaps: this.swaps
        });
    }
    
    applyStep(step) {
        this.array = [...step.array];
        this.comparisons = step.comparisons;
        this.swaps = step.swaps;
    }
    
    // ============================================================
    // SORTING ALGORITHMS
    // ============================================================
    
    bubbleSort(arr) {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                this.recordStep('compare', [j, j + 1], [], `Compare ${arr[j]} and ${arr[j + 1]}`);
                
                if (arr[j] > arr[j + 1]) {
                    this.swaps++;
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.recordStep('swap', [j, j + 1], [j, j + 1], `Swap ${arr[j + 1]} and ${arr[j]}`);
                }
            }
            // Mark last element as sorted
            this.recordStep('sorted', [], [], `Element at ${n - i - 1} is sorted`, [...arr]);
        }
        this.recordStep('sorted', [], [], 'First element is sorted', [...arr]);
    }
    
    selectionSort(arr) {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            this.recordStep('compare', [i], [], `Start pass ${i + 1}, current min at ${i}`);
            
            for (let j = i + 1; j < n; j++) {
                this.comparisons++;
                this.recordStep('compare', [minIdx, j], [], `Compare ${arr[minIdx]} (min) with ${arr[j]}`);
                
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                    this.recordStep('compare', [minIdx], [], `New minimum found at ${minIdx}: ${arr[minIdx]}`);
                }
            }
            
            if (minIdx !== i) {
                this.swaps++;
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                this.recordStep('swap', [i, minIdx], [i, minIdx], `Swap ${arr[minIdx]} and ${arr[i]}`);
            }
            this.recordStep('sorted', [], [], `Element at ${i} is sorted`, [...arr]);
        }
        this.recordStep('sorted', [], [], 'Last element is sorted', [...arr]);
    }
    
    insertionSort(arr) {
        const n = arr.length;
        this.recordStep('sorted', [0], [], 'First element considered sorted');
        
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            
            this.recordStep('compare', [i], [], `Insert ${key} into sorted portion`);
            
            while (j >= 0 && arr[j] > key) {
                this.comparisons++;
                this.recordStep('compare', [j, j + 1], [], `Compare ${arr[j]} with key ${key}`);
                
                this.swaps++;
                arr[j + 1] = arr[j];
                this.recordStep('shift', [j, j + 1], [j, j + 1], `Shift ${arr[j]} right`);
                j--;
            }
            
            this.comparisons++;
            if (j >= 0) {
                this.recordStep('compare', [j, i], [], `Compare ${arr[j]} with key ${key} - stop`);
            }
            
            arr[j + 1] = key;
            this.recordStep('insert', [j + 1], [j + 1], `Insert ${key} at position ${j + 1}`, [...arr]);
            
            // Mark sorted portion
            for (let k = 0; k <= i; k++) {
                this.recordStep('sorted', [], [], `Elements 0-${i} are sorted`, [...arr]);
            }
        }
    }
    
    mergeSort(arr, left, right) {
        if (left >= right) return;
        
        const mid = Math.floor((left + right) / 2);
        
        this.mergeSort(arr, left, mid);
        this.mergeSort(arr, mid + 1, right);
        this.merge(arr, left, mid, right);
    }
    
    merge(arr, left, mid, right) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        this.recordStep('merge-start', [], [], `Merge [${left}-${mid}] and [${mid+1}-${right}]`);
        
        while (i < leftArr.length && j < rightArr.length) {
            this.comparisons++;
            this.recordStep('compare', [left + i, mid + 1 + j], [], `Compare ${leftArr[i]} and ${rightArr[j]}`);
            
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                this.recordStep('merge-take', [k], [k], `Take ${leftArr[i]} from left`, [...arr]);
                i++;
            } else {
                arr[k] = rightArr[j];
                this.recordStep('merge-take', [k], [k], `Take ${rightArr[j]} from right`, [...arr]);
                j++;
            }
            k++;
        }
        
        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            this.recordStep('merge-take', [k], [k], `Take remaining ${leftArr[i]} from left`, [...arr]);
            i++;
            k++;
        }
        
        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            this.recordStep('merge-take', [k], [k], `Take remaining ${rightArr[j]} from right`, [...arr]);
            j++;
            k++;
        }
        
        this.recordStep('merge-complete', [], [], `Merged [${left}-${right}]`, [...arr]);
    }
    
    quickSort(arr, low, high) {
        if (low < high) {
            const pi = this.partition(arr, low, high);
            this.quickSort(arr, low, pi - 1);
            this.quickSort(arr, pi + 1, high);
        }
    }
    
    partition(arr, low, high) {
        const pivot = arr[high];
        this.recordStep('pivot', [high], [], `Select pivot: ${pivot} at index ${high}`);
        
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            this.comparisons++;
            this.recordStep('compare', [j, high], [], `Compare ${arr[j]} with pivot ${pivot}`);
            
            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    this.swaps++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    this.recordStep('swap', [i, j], [i, j], `Swap ${arr[j]} and ${arr[i]}`, [...arr]);
                }
            }
        }
        
        if (i + 1 !== high) {
            this.swaps++;
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            this.recordStep('pivot-place', [i + 1, high], [i + 1, high], `Place pivot ${pivot} at ${i + 1}`, [...arr]);
        } else {
            this.recordStep('pivot-place', [high], [], `Pivot ${pivot} already in place at ${high}`, [...arr]);
        }
        
        this.recordStep('partition-done', [], [], `Partition complete: left < ${pivot} < right`, [...arr]);
        
        return i + 1;
    }
    
    heapSort(arr) {
        const n = arr.length;
        
        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapify(arr, n, i);
        }
        
        this.recordStep('heap-built', [], [], 'Max heap built');
        
        // Extract elements one by one
        for (let i = n - 1; i > 0; i--) {
            this.swaps++;
            [arr[0], arr[i]] = [arr[i], arr[0]];
            this.recordStep('swap', [0, i], [0, i], `Move max ${arr[i]} to end`, [...arr]);
            
            this.recordStep('sorted', [], [], `Element at ${i} is sorted`, [...arr]);
            
            this.heapify(arr, i, 0);
        }
        
        this.recordStep('sorted', [], [], 'First element is sorted', [...arr]);
    }
    
    heapify(arr, n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        if (left < n) {
            this.comparisons++;
            this.recordStep('heapify-compare', [largest, left], [], `Compare ${arr[largest]} with left child ${arr[left]}`);
            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }
        
        if (right < n) {
            this.comparisons++;
            this.recordStep('heapify-compare', [largest, right], [], `Compare ${arr[largest]} with right child ${arr[right]}`);
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }
        
        if (largest !== i) {
            this.swaps++;
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            this.recordStep('heapify-swap', [i, largest], [i, largest], `Swap ${arr[largest]} and ${arr[i]}`, [...arr]);
            this.heapify(arr, n, largest);
        }
    }
    
    // ============================================================
    // RENDERING
    // ============================================================
    
    draw() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Clear canvas
        ctx.fillStyle = this.options.colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (this.array.length === 0) return;
        
        const maxVal = Math.max(...this.array);
        const barWidth = this.options.barWidth;
        const barSpacing = this.options.barSpacing;
        const bottomMargin = 60;
        const topMargin = 40;
        const availableHeight = canvas.height - bottomMargin - topMargin;
        
        // Draw step info
        if (this.steps.length > 0 && this.currentStep < this.steps.length) {
            const step = this.steps[this.currentStep];
            
            ctx.fillStyle = this.options.colors.text;
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Step ${this.currentStep + 1} / ${this.steps.length}: ${step.description}`, 20, 25);
            
            ctx.font = '12px Arial';
            ctx.fillText(`Comparisons: ${this.comparisons} | Swaps: ${this.swaps}`, 20, 42);
            
            // Progress bar
            const progressWidth = canvas.width - 40;
            const progressHeight = 4;
            ctx.fillStyle = '#e1e4e8';
            ctx.fillRect(20, 50, progressWidth, progressHeight);
            ctx.fillStyle = '#3498db';
            ctx.fillRect(20, 50, progressWidth * (this.currentStep / (this.steps.length - 1 || 1)), progressHeight);
        }
        
        // Draw array bars
        const startX = (canvas.width - (this.array.length * (barWidth + barSpacing) - barSpacing)) / 2;
        
        for (let i = 0; i < this.array.length; i++) {
            const value = this.array[i];
            const barHeight = (value / maxVal) * availableHeight;
            const x = startX + i * (barWidth + barSpacing);
            const y = canvas.height - bottomMargin - barHeight;
            
            // Determine bar color
            let color = this.options.colors.default;
            
            if (this.steps.length > 0 && this.currentStep < this.steps.length) {
                const step = this.steps[this.currentStep];
                
                if (step.swapping.includes(i)) {
                    color = this.options.colors.swapping;
                } else if (step.comparing.includes(i)) {
                    color = this.options.colors.comparing;
                } else if (step.type === 'sorted' || step.type === 'merge-complete' || step.type === 'partition-done') {
                    // Check if this index is in the sorted portion
                    if (this.isSortedIndex(i, step)) {
                        color = this.options.colors.sorted;
                    }
                } else if (step.type === 'pivot' || step.type === 'pivot-place') {
                    if (step.comparing.includes(i) || step.swapping.includes(i)) {
                        color = this.options.colors.pivot;
                    }
                }
            }
            
            // Draw bar
            ctx.fillStyle = color;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw value on top of bar
            if (barWidth > 20) {
                ctx.fillStyle = this.options.colors.text;
                ctx.font = '11px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
            }
            
            // Draw index below bar
            if (barWidth > 15) {
                ctx.fillStyle = this.options.colors.text;
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(i.toString(), x + barWidth / 2, canvas.height - bottomMargin + 15);
            }
        }
        
        // Draw legend
        this.drawLegend();
    }
    
    isSortedIndex(index, step) {
        // For simplicity, consider elements as sorted if they're part of a completed operation
        return step.array[index] !== undefined && step.type !== 'compare';
    }
    
    drawLegend() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const legendY = canvas.height - 35;
        const legendItems = [
            { color: this.options.colors.default, label: 'Default' },
            { color: this.options.colors.comparing, label: 'Comparing' },
            { color: this.options.colors.swapping, label: 'Swapping' },
            { color: this.options.colors.sorted, label: 'Sorted' },
            { color: this.options.colors.pivot, label: 'Pivot' }
        ];
        
        const itemWidth = 100;
        const startX = (canvas.width - legendItems.length * itemWidth) / 2;
        
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        
        legendItems.forEach((item, i) => {
            const x = startX + i * itemWidth;
            ctx.fillStyle = item.color;
            ctx.fillRect(x, legendY, 12, 12);
            ctx.fillStyle = this.options.colors.text;
            ctx.fillText(item.label, x + 16, legendY + 9);
        });
    }
    
    getStats() {
        return {
            algorithm: this.algorithm,
            arraySize: this.array.length,
            comparisons: this.comparisons,
            swaps: this.swaps,
            steps: this.steps.length,
            currentStep: this.currentStep,
            isPlaying: this.isPlaying
        };
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SortingVisualizer;
}