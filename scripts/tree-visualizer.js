/**
 * Tree Visualizer for C++ DSA Academy
 * Implements BST operations (insert/delete/search) and tree traversals
 * with step-by-step animation and node highlighting
 */

class TreeVisualizer {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = {
            nodeRadius: options.nodeRadius || 25,
            levelHeight: options.levelHeight || 80,
            horizontalSpacing: options.horizontalSpacing || 60,
            colors: {
                default: '#3498db',
                visiting: '#e74c3c',
                visited: '#27ae60',
                path: '#f39c12',
                inserting: '#9b59b6',
                deleting: '#e67e22',
                found: '#2ecc71',
                background: '#f8f9fa',
                text: '#2c3e50',
                edge: '#7f8c8d'
            },
            ...options
        };
        
        this.root = null;
        this.steps = [];
        this.currentStep = 0;
        this.isPlaying = false;
        this.animationId = null;
        this.speed = this.options.speed || 5;
        this.operation = 'insert'; // insert, delete, search, traversal
        this.traversalType = 'inorder'; // preorder, inorder, postorder, levelorder
        this.comparisons = 0;
        this.operations = 0;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = Math.min(rect.width - 40, 900);
        this.canvas.height = 500;
        this.draw();
    }
    
    // ============================================================
    // BST DATA STRUCTURE
    // ============================================================
    
    createNode(value, x, y) {
        return {
            value,
            x,
            y,
            left: null,
            right: null,
            parent: null,
            highlighted: false,
            state: 'default' // default, visiting, visited, path, inserting, deleting, found
        };
    }
    
    generateRandomBST(size = 15) {
        const values = this.generateUniqueValues(size, 1, 99);
        this.root = null;
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.operations = 0;
        
        values.forEach((val, i) => {
            this.insertNode(val, true); // true = building initial tree
        });
        
        // Position nodes after building
        this.positionNodes();
        this.recordStep('initial', [], 'Initial BST constructed');
    }
    
    generateUniqueValues(count, min, max) {
        const values = new Set();
        while (values.size < count) {
            values.add(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return Array.from(values);
    }
    
    insertNode(value, isInitial = false) {
        if (!this.root) {
            this.root = this.createNode(value, 0, 0);
            if (!isInitial) {
                this.operations++;
                this.recordStep('insert', [this.root], `Insert ${value} as root`);
            }
            return this.root;
        }
        
        let current = this.root;
        const path = [];
        
        while (true) {
            this.comparisons++;
            path.push(current);
            current.state = 'visiting';
            this.recordStep('compare', [...path], `Compare ${value} with ${current.value}`);
            current.state = 'default';
            
            if (value < current.value) {
                if (!current.left) {
                    const newNode = this.createNode(value, 0, 0);
                    newNode.parent = current;
                    current.left = newNode;
                    this.operations++;
                    if (!isInitial) {
                        this.recordStep('insert', [newNode, current], `Insert ${value} as left child of ${current.value}`);
                    }
                    return newNode;
                }
                current = current.left;
            } else if (value > current.value) {
                if (!current.right) {
                    const newNode = this.createNode(value, 0, 0);
                    newNode.parent = current;
                    current.right = newNode;
                    this.operations++;
                    if (!isInitial) {
                        this.recordStep('insert', [newNode, current], `Insert ${value} as right child of ${current.value}`);
                    }
                    return newNode;
                }
                current = current.right;
            } else {
                // Duplicate - not inserted in standard BST
                if (!isInitial) {
                    this.recordStep('duplicate', [current], `Value ${value} already exists`);
                }
                return current;
            }
        }
    }
    
    searchNode(value) {
        let current = this.root;
        const path = [];
        
        while (current) {
            this.comparisons++;
            path.push(current);
            current.state = 'visiting';
            this.recordStep('compare', [...path], `Compare ${value} with ${current.value}`);
            
            if (value === current.value) {
                current.state = 'found';
                this.recordStep('found', [...path, current], `Found ${value}!`);
                return current;
            }
            
            current.state = 'path';
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        
        this.recordStep('not-found', path, `Value ${value} not found`);
        return null;
    }
    
    deleteNode(value) {
        // Standard BST deletion with three cases
        let current = this.root;
        let parent = null;
        
        // Find node to delete
        while (current && current.value !== value) {
            this.comparisons++;
            parent = current;
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        
        if (!current) {
            this.recordStep('not-found', [], `Value ${value} not found for deletion`);
            return false;
        }
        
        this.operations++;
        current.state = 'deleting';
        this.recordStep('delete-start', [current], `Deleting ${value}`);
        
        // Case 1: No children (leaf)
        if (!current.left && !current.right) {
            if (parent) {
                if (parent.left === current) parent.left = null;
                else parent.right = null;
            } else {
                this.root = null;
            }
            this.recordStep('delete-leaf', [], `Removed leaf node ${value}`);
        }
        // Case 2: One child
        else if (!current.left || !current.right) {
            const child = current.left || current.right;
            if (parent) {
                if (parent.left === current) parent.left = child;
                else parent.right = child;
            } else {
                this.root = child;
            }
            if (child) child.parent = parent;
            this.recordStep('delete-one-child', [child], `Replaced ${value} with child ${child.value}`);
        }
        // Case 3: Two children - find inorder successor
        else {
            let successor = current.right;
            let succParent = current;
            const succPath = [current];
            
            while (successor.left) {
                this.comparisons++;
                succParent = successor;
                successor = successor.left;
                succPath.push(successor);
                successor.state = 'visiting';
                this.recordStep('find-successor', [...succPath], `Finding inorder successor`);
                successor.state = 'default';
            }
            
            current.value = successor.value;
            this.recordStep('replace-with-successor', [current, successor], `Replace ${value} with successor ${successor.value}`);
            
            // Delete successor (has at most one child)
            if (succParent.left === successor) {
                succParent.left = successor.right;
                if (successor.right) successor.right.parent = succParent;
            } else {
                succParent.right = successor.right;
                if (successor.right) successor.right.parent = succParent;
            }
            this.recordStep('delete-successor', [], `Removed successor node`);
        }
        
        this.recordStep('delete-complete', [], `Deletion of ${value} complete`);
        return true;
    }
    
    // ============================================================
    // TREE TRAVERSALS
    // ============================================================
    
    preorderTraversal() {
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.operations = 0;
        this.recordStep('traversal-start', [], 'Preorder traversal: Root → Left → Right');
        this.preorder(this.root);
        this.recordStep('traversal-complete', [], 'Preorder traversal complete');
    }
    
    preorder(node) {
        if (!node) return;
        this.operations++;
        node.state = 'visiting';
        this.recordStep('visit', [node], `Visit ${node.value}`);
        node.state = 'visited';
        this.preorder(node.left);
        this.preorder(node.right);
    }
    
    inorderTraversal() {
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.operations = 0;
        this.recordStep('traversal-start', [], 'Inorder traversal: Left → Root → Right (sorted order)');
        this.inorder(this.root);
        this.recordStep('traversal-complete', [], 'Inorder traversal complete');
    }
    
    inorder(node) {
        if (!node) return;
        this.inorder(node.left);
        this.operations++;
        node.state = 'visiting';
        this.recordStep('visit', [node], `Visit ${node.value}`);
        node.state = 'visited';
        this.inorder(node.right);
    }
    
    postorderTraversal() {
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.operations = 0;
        this.recordStep('traversal-start', [], 'Postorder traversal: Left → Right → Root');
        this.postorder(this.root);
        this.recordStep('traversal-complete', [], 'Postorder traversal complete');
    }
    
    postorder(node) {
        if (!node) return;
        this.postorder(node.left);
        this.postorder(node.right);
        this.operations++;
        node.state = 'visiting';
        this.recordStep('visit', [node], `Visit ${node.value}`);
        node.state = 'visited';
    }
    
    levelorderTraversal() {
        this.steps = [];
        this.currentStep = 0;
        this.comparisons = 0;
        this.operations = 0;
        this.recordStep('traversal-start', [], 'Level-order traversal (BFS): Level by level');
        
        if (!this.root) return;
        
        const queue = [this.root];
        while (queue.length > 0) {
            const node = queue.shift();
            this.operations++;
            node.state = 'visiting';
            this.recordStep('visit', [node], `Visit ${node.value}`);
            node.state = 'visited';
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        this.recordStep('traversal-complete', [], 'Level-order traversal complete');
    }
    
    // ============================================================
    // NODE POSITIONING
    // ============================================================
    
    positionNodes() {
        if (!this.root) return;
        
        // Calculate tree width and positions using inorder traversal
        const nodesInOrder = [];
        this.collectInorder(this.root, nodesInOrder);
        
        const canvasWidth = this.canvas.width;
        const startX = this.options.nodeRadius + 20;
        const availableWidth = canvasWidth - 2 * this.options.nodeRadius - 40;
        const spacing = nodesInOrder.length > 1 ? availableWidth / (nodesInOrder.length - 1) : 0;
        
        nodesInOrder.forEach((node, i) => {
            node.x = startX + i * spacing;
        });
        
        // Set Y positions based on depth
        this.setDepthPositions(this.root, 0);
    }
    
    collectInorder(node, arr) {
        if (!node) return;
        this.collectInorder(node.left, arr);
        arr.push(node);
        this.collectInorder(node.right, arr);
    }
    
    setDepthPositions(node, depth) {
        if (!node) return;
        node.y = 60 + depth * this.options.levelHeight;
        this.setDepthPositions(node.left, depth + 1);
        this.setDepthPositions(node.right, depth + 1);
    }
    
    // ============================================================
    // STEP RECORDING
    // ============================================================
    
    recordStep(type, nodes, description) {
        // Clone tree state for this step
        const treeState = this.cloneTreeState();
        this.steps.push({
            type,
            tree: treeState,
            highlightedNodes: nodes.map(n => n ? n.value : null).filter(v => v !== null),
            description,
            comparisons: this.comparisons,
            operations: this.operations
        });
    }
    
    cloneTreeState() {
        if (!this.root) return null;
        return this.cloneNode(this.root);
    }
    
    cloneNode(node) {
        if (!node) return null;
        return {
            value: node.value,
            x: node.x,
            y: node.y,
            left: this.cloneNode(node.left),
            right: this.cloneNode(node.right),
            state: node.state
        };
    }
    
    applyStep(step) {
        this.root = this.restoreTree(step.tree);
        this.comparisons = step.comparisons;
        this.operations = step.operations;
    }
    
    restoreTree(treeNode) {
        if (!treeNode) return null;
        const node = this.createNode(treeNode.value, treeNode.x, treeNode.y);
        node.state = treeNode.state;
        node.left = this.restoreTree(treeNode.left);
        node.right = this.restoreTree(treeNode.right);
        if (node.left) node.left.parent = node;
        if (node.right) node.right.parent = node;
        return node;
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
    // OPERATIONS
    // ============================================================
    
    insert(value) {
        this.positionNodes();
        this.insertNode(value);
        this.positionNodes();
        this.recordStep('insert-complete', [], `Insert ${value} complete`);
    }
    
    search(value) {
        this.searchNode(value);
    }
    
    delete(value) {
        this.deleteNode(value);
        this.positionNodes();
    }
    
    traverse(type) {
        this.traversalType = type;
        switch (type) {
            case 'preorder': this.preorderTraversal(); break;
            case 'inorder': this.inorderTraversal(); break;
            case 'postorder': this.postorderTraversal(); break;
            case 'levelorder': this.levelorderTraversal(); break;
        }
    }
    
    // ============================================================
    // RENDERING
    // ============================================================
    
    draw() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        ctx.fillStyle = this.options.colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (!this.root) {
            ctx.fillStyle = this.options.colors.text;
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Generate a tree to start', canvas.width / 2, canvas.height / 2);
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
        this.drawEdges(this.root);
        
        // Draw nodes
        this.drawNodes(this.root);
        
        // Draw legend
        this.drawLegend();
    }
    
    drawEdges(node) {
        if (!node) return;
        
        const ctx = this.ctx;
        
        if (node.left) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y + this.options.nodeRadius);
            ctx.lineTo(node.left.x, node.left.y - this.options.nodeRadius);
            ctx.strokeStyle = this.options.colors.edge;
            ctx.lineWidth = 2;
            ctx.stroke();
            this.drawEdges(node.left);
        }
        
        if (node.right) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y + this.options.nodeRadius);
            ctx.lineTo(node.right.x, node.right.y - this.options.nodeRadius);
            ctx.strokeStyle = this.options.colors.edge;
            ctx.lineWidth = 2;
            ctx.stroke();
            this.drawEdges(node.right);
        }
    }
    
    drawNodes(node) {
        if (!node) return;
        
        const ctx = this.ctx;
        const r = this.options.nodeRadius;
        
        // Determine color based on state
        let color = this.options.colors.default;
        switch (node.state) {
            case 'visiting': color = this.options.colors.visiting; break;
            case 'visited': color = this.options.colors.visited; break;
            case 'path': color = this.options.colors.path; break;
            case 'inserting': color = this.options.colors.inserting; break;
            case 'deleting': color = this.options.colors.deleting; break;
            case 'found': color = this.options.colors.found; break;
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
        
        this.drawNodes(node.left);
        this.drawNodes(node.right);
    }
    
    drawLegend() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const legendY = canvas.height - 60;
        const items = [
            { color: this.options.colors.default, label: 'Default' },
            { color: this.options.colors.visiting, label: 'Visiting' },
            { color: this.options.colors.visited, label: 'Visited' },
            { color: this.options.colors.path, label: 'Path' },
            { color: this.options.colors.inserting, label: 'Inserting' },
            { color: this.options.colors.deleting, label: 'Deleting' },
            { color: this.options.colors.found, label: 'Found' }
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
            nodeCount: this.countNodes(this.root)
        };
    }
    
    countNodes(node) {
        if (!node) return 0;
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TreeVisualizer;
}