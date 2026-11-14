// Tree and Graph Visualization Engine
// Supports: BST operations, tree traversals, graph BFS/DFS

class TreeVisualizer {
    constructor(options = {}) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.nodeRadius = options.nodeRadius || 20;
        this.edgeColor = options.edgeColor || '#555';
        this.nodeColor = options.nodeColor || '#3498db';
        this.highlightColor = options.highlightColor || '#e74c3c';
        this.animationSpeed = options.animationSpeed || 500; // ms per step
        
        this.isPlaying = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.nodeData = []; // {id, x, y, value, children}
        this.edgeData = []; // {from, to}
        this.highlightPath = []; // sequence of node ids
        this.autoPlayInterval = null;
    }
    
    loadTree(root, xSpacing = 150, ySpacing = 80) {
        this.nodeData = [];
        this.edgeData = [];
        this._buildTreeNodes(root, 0, 0, xSpacing, ySpacing);
        this.totalSteps = Math.max(this.nodeData.length * 2, 1);
        this.redraw();
    }
    
    _buildTreeNodes(node, x, y, xSpacing, ySpacing) {
        if (!node) return;
        
        this.nodeData.push({
            id: node.id || `node-${this.nodeData.length}`,
            x: x,
            y: y,
            value: node.value,
            children: node.left || node.children || []
        });
        
        if (node.left) {
            this.edgeData.push({ from: this.nodeData.length - 1, to: this.nodeData.length });
            const leftIdx = this.nodeData.length;
            const leftX = x - xSpacing - this.nodeRadius;
            const leftY = y + ySpacing;
            this._buildTreeNodes(node.left, leftX, leftY, xSpacing, ySpacing);
        }
        
        if (node.right) {
            this.edgeData.push({ from: this.nodeData.length - 1, to: this.nodeData.length });
            const rightIdx = this.nodeData.length;
            const rightX = x + xSpacing + this.nodeRadius;
            const rightY = y + ySpacing;
            this._buildTreeNodes(node.right, rightX, rightY, xSpacing, ySpacing);
        }
    }
    
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw edges
        this.ctx.strokeStyle = this.edgeColor;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        this.edgeData.forEach(edge => {
            const from = this.nodeData[edge.from];
            const to = this.nodeData[edge.to];
            this.ctx.moveTo(this._centerX(from), this._centerY(from));
            this.ctx.lineTo(this._centerX(to), this._centerY(to));
        });
        this.ctx.stroke();
        
        // Draw nodes
        this.nodeData.forEach((node, i) => {
            const x = this._centerX(node);
            const y = this._centerY(node);
            
            this.ctx.fillStyle = this._isHighlighted(i) ? this.highlightColor : this.nodeColor;
            this.ctx.strokeStyle = '#2c3e50';
            this.ctx.lineWidth = 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.nodeRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Draw value
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.value || '', x, y);
        });
    }
    
    _centerX(node) { return node.x + this.nodeRadius; }
    _centerY(node) { return node.y + this.nodeRadius; }
    
    _isHighlighted(idx) {
        return this.highlightPath && this.highlightPath.includes(idx);
    }
    
    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.currentStep = 0;
        this._autoPlay();
    }
    
    _autoPlay() {
        if (!this.isPlaying || this.currentStep >= this.totalSteps) {
            this.isPlaying = false;
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
            return;
        }
        
        this._nextStep();
        this.autoPlayInterval = setTimeout(() => this._autoPlay(), this.animationSpeed);
    }
    
    _nextStep() {
        // Advance highlight path or step through operations
        if (this.highlightPath && this.highlightPath.length > 0) {
            this.highlightPath.shift();
            this.redraw();
        }
        this.currentStep++;
    }
    
    pause() {
        this.isPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    reset() {
        this.pause();
        this.highlightPath = [];
        this.redraw();
    }
    
    highlightPath(indices) {
        this.highlightPath = [...indices];
        this.redraw();
    }
}

class GraphVisualizer {
    constructor(options = {}) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.nodeRadius = options.nodeRadius || 15;
        this.edgeColor = options.edgeColor || '#555';
        this.nodeColor = options.nodeColor || '#3498db';
        this.visitedColor = options.visitedColor || '#27ae60';
        this.pathColor = options.pathColor || '#e74c3c';
    }
    
    loadGraph(adjList, nodePositions = null) {
        this.adjList = adjList;
        this.nodeCount = adjList.length;
        
        if (nodePositions) {
            this.nodePositions = nodePositions;
        } else {
            // Layout using simple grid
            this.nodePositions = {};
            for (let i = 0; i < this.nodeCount; i++) {
                this.nodePositions[i] = {
                    x: 50 + (i % 5) * 100,
                    y: 50 + Math.floor(i / 5) * 80
                };
            }
        }
        
        this.totalSteps = this.nodeCount + 1; // BFS steps + reset
        this.redraw();
    }
    
    bfs(startNode = 0) {
        const visited = new Set();
        const queue = [startNode];
        const traversalOrder = [];
        
        visited.add(startNode);
        
        while (queue.length > 0) {
            const node = queue.shift();
            traversalOrder.push(node);
            
            this._highlightNode(node, true);
            this.redraw();
            this._delay(50);
            
            for (const neighbor of this.adjList[node] || []) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        
        this._highlightNode(startNode, false);
        return traversalOrder;
    }
    
    dfs(startNode = 0) {
        const visited = new Set();
        const traversalOrder = [];
        
        const _dfs = (node) => {
            if (visited.has(node)) return;
            visited.add(node);
            traversalOrder.push(node);
            
            this._highlightNode(node, true);
            this.redraw();
            this._delay(50);
            
            for (const neighbor of this.adjList[node] || []) {
                _dfs(neighbor);
            }
        };
        
        _dfs(startNode);
        this._highlightNode(startNode, false);
        return traversalOrder;
    }
    
    dijkstra(startNode = 0) {
        const n = this.adjList.length;
        const dist = new Array(n).fill(Infinity);
        const prev = new Array(n).fill(null);
        const visited = new Set();
        
        dist[startNode] = 0;
        
        for (let i = 0; i < n - 1; i++) {
            // Find minimum distance unvisited node
            let minDist = Infinity;
            let u = -1;
            for (let j = 0; j < n; j++) {
                if (!visited.has(j) && dist[j] < minDist) {
                    minDist = dist[j];
                    u = j;
                }
            }
            
            if (u === -1) break;
            visited.add(u);
            
            this._highlightNode(u, true);
            this.redraw();
            this._delay(50);
            
            for (const v of this.adjList[u] || []) {
                const weight = 1; // default weight
                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    prev[v] = u;
                }
            }
        }
        
        // Show shortest path
        this._showPath(prev, startNode, n - 1);
        return dist;
    }
    
    _highlightNode(nodeIdx, isVisiting) {
        const node = this.nodePositions ? this.nodePositions[nodeIdx] : null;
        if (!node) return;
        
        if (isVisiting) {
            this.ctx.fillStyle = this.pathColor;
        } else {
            this.ctx.fillStyle = this.nodeColor;
        }
    }
    
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    bfsSteps() {
        // Return step-by-step BFS data for animation
        const visited = new Set();
        const queue = [0];
        const steps = [[{ type: 'init' }]];
        visited.add(0);
        
        while (queue.length > 0) {
            const node = queue.shift();
            steps.push({ type: 'visit', node });
            
            for (const neighbor of this.adjList[node] || []) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                    steps.push({ type: 'add', node: neighbor });
                }
            }
        }
        
        return steps;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TreeVisualizer, GraphVisualizer };
}