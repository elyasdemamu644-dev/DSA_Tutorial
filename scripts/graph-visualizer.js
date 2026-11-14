/**
 * Graph Visualizer for C++ DSA Academy
 * Implements BFS and DFS traversals with node/edge highlighting
 */

class GraphVisualizer {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = {
            nodeRadius: options.nodeRadius || 25,
            colors: {
                default: '#3498db',
                visiting: '#e74c3c',
                visited: '#27ae60',
                inQueue: '#f39c12',
                inStack: '#9b59b6',
                edge: '#7f8c8d',
                edgeActive: '#e74c3c',
                background: '#f8f9fa',
                text: '#2c3e50',
                start: '#2ecc71',
                target: '#e67e22'
            },
            ...options
        };
        
        this.nodes = new Map(); // value -> {value, x, y, edges: Set}
        this.steps = [];
        this.currentStep = 0;
        this.isPlaying = false;
        this.animationId = null;
        this.speed = this.options.speed || 5;
        this.algorithm = 'bfs'; // bfs, dfs
        this.startNode = null;
        this.targetNode = null;
        this.comparisons = 0;
        this.operations = 0;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = Math.min(rect.width - 40, 900);
        this.canvas.height = 500;
        this.positionNodes();
        this.draw();
    }
    
    // ============================================================
    // GRAPH DATA STRUCTURE
    // ============================================================
    
    generateRandomGraph(nodeCount = 8, edgeProbability = 0.3) {
        this.nodes.clear();
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.operations = 0;
        
        // Create nodes
        for (let i = 1; i <= nodeCount; i++) {
            this.nodes.set(i, {
                value: i,
                x: 0,
                y: 0,
                edges: new Set(),
                state: 'default'
            });
        }
        
        // Add random edges (undirected)
        const values = Array.from(this.nodes.keys());
        for (let i = 0; i < values.length; i++) {
            for (let j = i + 1; j < values.length; j++) {
                if (Math.random() < edgeProbability) {
                    this.addEdge(values[i], values[j]);
                }
            }
        }
        
        // Ensure graph is connected
        this.ensureConnected();
        
        this.positionNodes();
        this.recordStep('initial', [], 'Random graph generated');
    }
    
    addEdge(u, v) {
        const nodeU = this.nodes.get(u);
        const nodeV = this.nodes.get(v);
        if (nodeU && nodeV) {
            nodeU.edges.add(v);
            nodeV.edges.add(u);
        }
    }
    
    removeEdge(u, v) {
        const nodeU = this.nodes.get(u);
        const nodeV = this.nodes.get(v);
        if (nodeU && nodeV) {
            nodeU.edges.delete(v);
            nodeV.edges.delete(u);
        }
    }
    
    ensureConnected() {
        const values = Array.from(this.nodes.keys());
        if (values.length < 2) return;
        
        // Create a spanning tree to ensure connectivity
        const connected = new Set([values[0]]);
        const remaining = new Set(values.slice(1));
        
        while (remaining.size > 0) {
            const u = Array.from(connected)[Math.floor(Math.random() * connected.size)];
            const v = Array.from(remaining)[Math.floor(Math.random() * remaining.size)];
            this.addEdge(u, v);
            connected.add(v);
            remaining.delete(v);
        }
    }
    
    // Position nodes in a circle layout
    positionNodes() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 80;
        const nodeCount = this.nodes.size;
        
        if (nodeCount === 0) return;
        
        const angleStep = (2 * Math.PI) / nodeCount;
        let i = 0;
        
        for (const [value, node] of this.nodes) {
            const angle = i * angleStep - Math.PI / 2;
            node.x = centerX + radius * Math.cos(angle);
            node.y = centerY + radius * Math.sin(angle);
            i++;
        }
    }
    
    // ============================================================
    // GRAPH ALGORITHMS
    // ============================================================
    
    bfs(startValue, targetValue = null) {
        this.algorithm = 'bfs';
        this.startNode = startValue;
        this.targetNode = targetValue;
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.operations = 0;
        
        this.resetNodeStates();
        
        const startNode = this.nodes.get(startValue);
        if (!startNode) return;
        
        this.recordStep('bfs-start', [startValue], `BFS starting from node ${startValue}`);
        
        const queue = [startValue];
        const visited = new Set([startValue]);
        startNode.state = 'inQueue';
        
        this.recordStep('queue', [startValue], `Enqueue ${startValue}`);
        
        while (queue.length > 0) {
            const currentValue = queue.shift();
            const currentNode = this.nodes.get(currentValue);
            
            currentNode.state = 'visiting';
            this.operations++;
            this.recordStep('visit', [currentValue], `Visit node ${currentValue}`);
            
            if (targetValue !== null && currentValue === targetValue) {
                currentNode.state = 'target';
                this.recordStep('found', [currentValue], `Target ${targetValue} found!`);
                break;
            }
            
            currentNode.state = 'visited';
            
            // Visit neighbors
            const neighbors = Array.from(currentNode.edges).sort((a, b) => a - b);
            for (const neighborValue of neighbors) {
                this.comparisons++;
                const neighborNode = this.nodes.get(neighborValue);
                
                this.recordStep('check-neighbor', [currentValue, neighborValue], 
                    `Check neighbor ${neighborValue} of ${currentValue}`);
                
                if (!visited.has(neighborValue)) {
                    visited.add(neighborValue);
                    neighborNode.state = 'inQueue';
                    queue.push(neighborValue);
                    this.recordStep('enqueue', [neighborValue], `Enqueue ${neighborValue}`);
                }
            }
        }
        
        this.recordStep('bfs-complete', [], 'BFS traversal complete');
    }
    
    dfs(startValue, targetValue = null) {
        this.algorithm = 'dfs';
        this.startNode = startValue;
        this.targetNode = targetValue;
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.operations = 0;
        
        this.resetNodeStates();
        
        const startNode = this.nodes.get(startValue);
        if (!startNode) return;
        
        this.recordStep('dfs-start', [startValue], `DFS starting from node ${startValue}`);
        
        const stack = [startValue];
        const visited = new Set();
        startNode.state = 'inStack';
        
        this.recordStep('stack', [startValue], `Push ${startValue} to stack`);
        
        while (stack.length > 0) {
            const currentValue = stack.pop();
            const currentNode = this.nodes.get(currentValue);
            
            if (visited.has(currentValue)) continue;
            
            visited.add(currentValue);
            currentNode.state = 'visiting';
            this.operations++;
            this.recordStep('visit', [currentValue], `Visit node ${currentValue}`);
            
            if (targetValue !== null && currentValue === targetValue) {
                currentNode.state = 'target';
                this.recordStep('found', [currentValue], `Target ${targetValue} found!`);
                break;
            }
            
            currentNode.state = 'visited';
            
            // Visit neighbors (reverse order for correct DFS order with stack)
            const neighbors = Array.from(currentNode.edges).sort((a, b) => b - a);
            for (const neighborValue of neighbors) {
                this.comparisons++;
                const neighborNode = this.nodes.get(neighborValue);
                
                this.recordStep('check-neighbor', [currentValue, neighborValue],
                    `Check neighbor ${neighborValue} of ${currentValue}`);
                
                if (!visited.has(neighborValue)) {
                    neighborNode.state = 'inStack';
                    stack.push(neighborValue);
                    this.recordStep('push', [neighborValue], `Push ${neighborValue} to stack`);
                }
            }
        }
        
        this.recordStep('dfs-complete', [], 'DFS traversal complete');
    }
    
    resetNodeStates() {
        for (const node of this.nodes.values()) {
            node.state = 'default';
        }
    }
    
    // ============================================================
    // STEP RECORDING
    // ============================================================
    
    recordStep(type, highlightedNodes, description) {
        const graphState = this.cloneGraphState();
        this.steps.push({
            type,
            graph: graphState,
            highlightedNodes: [...highlightedNodes],
            description,
            comparisons: this.comparisons,
            operations: this.operations
        });
    }
    
    cloneGraphState() {
        const state = new Map();
        for (const [value, node] of this.nodes) {
            state.set(value, {
                value: node.value,
                x: node.x,
                y: node.y,
                edges: new Set(node.edges),
                state: node.state
            });
        }
        return state;
    }
    
    applyStep(step) {
        this.nodes = new Map();
        for (const [value, nodeState] of step.graph) {
            this.nodes.set(value, {
                value: nodeState.value,
                x: nodeState.x,
                y: nodeState.y,
                edges: new Set(nodeState.edges),
                state: nodeState.state
            });
        }
        this.comparisons = step.comparisons;
        this.operations = step.operations;
    }
    
    // ============================================================
    // ANIMATION CONTROLS
    // ============================================================
    
    play() {
        if (this.isPlaying) return;
        if (this.currentStep >= this.steps.length - 1) return;
        this.isPlaying = true;
        this.animate();
    }
    
    pause() {
        this.isPlaying = false;
        if (this.animationId) {
            clearTimeout(this.animationId);
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
        
        const delay = Math.max(100, 1200 - this.speed * 100);
        this.animationId = setTimeout(() => {
            this.currentStep++;
            this.applyStep(this.steps[this.currentStep]);
            this.draw();
            this.animate();
        }, delay);
    }
    
    reset() {
        this.pause();
        this.currentStep = 0;
        if (this.steps.length > 0) {
            this.applyStep(this.steps[0]);
        }
        this.draw();
    }
    
    setSpeed(speed) {
        this.speed = speed;
    }
    
    // ============================================================
    // RENDERING
    // ============================================================
    
    draw() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        ctx.fillStyle = this.options.colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (this.nodes.size === 0) {
            ctx.fillStyle = this.options.colors.text;
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Generate a graph to start', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        // Draw step info
        if (this.steps.length > 0 && this.currentStep < this.steps.length) {
            const step = this.steps[this.currentStep];
            ctx.fillStyle = this.options.colors.text;
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Step ${this.currentStep + 1} / ${this.steps.length}: ${step.description}`, 20, 25);
            
            ctx.font = '12px Arial';
            ctx.fillText(`Comparisons: ${this.comparisons} | Operations: ${this.operations}`, 20, 42);
            
            // Progress bar
            const progressWidth = canvas.width - 40;
            ctx.fillStyle = '#e1e4e8';
            ctx.fillRect(20, 50, progressWidth, 4);
            ctx.fillStyle = '#3498db';
            ctx.fillRect(20, 50, progressWidth * (this.currentStep / (this.steps.length - 1 || 1)), 4);
        }
        
        // Draw edges first
        this.drawEdges();
        
        // Draw nodes
        this.drawNodes();
        
        // Draw legend
        this.drawLegend();
    }
    
    drawEdges() {
        const ctx = this.ctx;
        const drawnEdges = new Set();
        
        for (const [value, node] of this.nodes) {
            for (const neighborValue of node.edges) {
                const edgeKey = [value, neighborValue].sort().join('-');
                if (drawnEdges.has(edgeKey)) continue;
                drawnEdges.add(edgeKey);
                
                const neighbor = this.nodes.get(neighborValue);
                if (!neighbor) continue;
                
                // Check if edge is active (between highlighted nodes)
                const isActive = this.isEdgeActive(value, neighborValue);
                
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(neighbor.x, neighbor.y);
                ctx.strokeStyle = isActive ? this.options.colors.edgeActive : this.options.colors.edge;
                ctx.lineWidth = isActive ? 3 : 2;
                ctx.stroke();
                
                // Draw arrow for directed feel (optional)
                if (isActive) {
                    this.drawArrow(ctx, node.x, node.y, neighbor.x, neighbor.y);
                }
            }
        }
    }
    
    isEdgeActive(u, v) {
        if (this.steps.length === 0 || this.currentStep >= this.steps.length) return false;
        const step = this.steps[this.currentStep];
        return step.highlightedNodes.includes(u) && step.highlightedNodes.includes(v);
    }
    
    drawArrow(ctx, fromX, fromY, toX, toY) {
        const headLen = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), 
                   toY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), 
                   toY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = this.options.colors.edgeActive;
        ctx.fill();
    }
    
    drawNodes() {
        const ctx = this.ctx;
        const r = this.options.nodeRadius;
        
        for (const node of this.nodes.values()) {
            let color = this.options.colors.default;
            switch (node.state) {
                case 'visiting': color = this.options.colors.visiting; break;
                case 'visited': color = this.options.colors.visited; break;
                case 'inQueue': color = this.options.colors.inQueue; break;
                case 'inStack': color = this.options.colors.inStack; break;
                case 'target': color = this.options.colors.target; break;
                case 'start': color = this.options.colors.start; break;
            }
            
            // Draw node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw value
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.value.toString(), node.x, node.y);
        }
    }
    
    drawLegend() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const legendY = canvas.height - 60;
        
        const items = this.algorithm === 'bfs' ? [
            { color: this.options.colors.default, label: 'Default' },
            { color: this.options.colors.visiting, label: 'Visiting' },
            { color: this.options.colors.visited, label: 'Visited' },
            { color: this.options.colors.inQueue, label: 'In Queue' },
            { color: this.options.colors.target, label: 'Target' }
        ] : [
            { color: this.options.colors.default, label: 'Default' },
            { color: this.options.colors.visiting, label: 'Visiting' },
            { color: this.options.colors.visited, label: 'Visited' },
            { color: this.options.colors.inStack, label: 'In Stack' },
            { color: this.options.colors.target, label: 'Target' }
        ];
        
        const itemWidth = 110;
        const startX = (canvas.width - items.length * itemWidth) / 2;
        
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        
        items.forEach((item, i) => {
            const x = startX + i * itemWidth;
            ctx.beginPath();
            ctx.arc(x + 10, legendY + 10, 10, 0, Math.PI * 2);
            ctx.fillStyle = item.color;
            ctx.fill();
            ctx.fillStyle = this.options.colors.text;
            ctx.fillText(item.label, x + 24, legendY + 14);
        });
    }
    
    getStats() {
        return {
            steps: this.steps.length,
            currentStep: this.currentStep,
            comparisons: this.comparisons,
            operations: this.operations,
            isPlaying: this.isPlaying,
            nodeCount: this.nodes.size,
            edgeCount: this.countEdges()
        };
    }
    
    countEdges() {
        let count = 0;
        for (const node of this.nodes.values()) {
            count += node.edges.size;
        }
        return count / 2; // Undirected graph
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GraphVisualizer;
}