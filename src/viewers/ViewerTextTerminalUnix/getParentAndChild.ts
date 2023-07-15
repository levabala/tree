
    function getParentAndChild(node1: TreeNode<T>, node2: TreeNode<T>) {
        let parent, child;
        if (node1.id === node2.parentId) {
            parent = node1;
            child = node2;
        }

        if (node2.id === node1.parentId) {
            parent = node2;
            child = node1;
        }

        if (parent && child) {
            return right({ parent, child });
        }

        return left('Nodes are not related');
    }
