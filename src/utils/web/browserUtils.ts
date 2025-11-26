/** Stack Class that doesn't push(x) to the stack if 
 * the head of the stack is a duplicate of x */

import { getPathNameAndSearchParams } from "../stringUtils";

class IdempotentPushStack<T> {
    private stackArr: T[];

    constructor(initStack: T[] = []) {
        this.stackArr = initStack;
    }

    /** Get the element at the stop of the stack without popping it */
    public peek(): T | undefined {
        const stackLen = this.stackArr.length;

        if (stackLen > 0) {
            return this.stackArr[stackLen - 1];
        }

        return undefined;
    }

    /** Add an element to the top of the stack */
    public push(x: T) {
        const headElement = this.peek();

        if (headElement && x === headElement) {
            return;
        }

        this.stackArr.push(x);
    }

    /** Remove the top head element, and return it */
    public pop(): T | undefined {
        return this.stackArr.pop();
    }

    /** Pops an element from the stack and peeks at the next head after the pop */
    public popAndPeekNextHead(): T | undefined {
        this.stackArr.pop();
        return this.peek();
    }

    public reset() {
        this.stackArr = [];
    }
}

class RouterStackItem {
    private pathName: string;
    private queryStack: IdempotentPushStack<string>;

    constructor(pathName: string, initQuery?: string) {
        this.pathName = pathName;
        this.queryStack = new IdempotentPushStack();

        if (initQuery) {
            this.queryStack.push(initQuery);
        }
    }

    public getPath() {
        const headQueryParam = this.queryStack.peek();

        if (headQueryParam) {
            return this.pathName + headQueryParam;
        }

        return this.pathName;
    }

    public popQuery(): string | undefined {
        return this.queryStack.pop();
    }

    public pushQuery(query: string) {
        this.queryStack.push(query);
    }

    public resetQueryStack() {
        this.queryStack.reset();
    }

    public peekQuery() : string | undefined {
        return this.queryStack.peek();
    }
 
}

export class RouterStack {
    private pathStack: IdempotentPushStack<RouterStackItem>;

    constructor() {
        this.pathStack = new IdempotentPushStack<RouterStackItem>();
    }

    /** Push a URI to the Router Stack, the uri could include a pathname and search params */
    public push(uri: string) {
        const [pathName, query] = getPathNameAndSearchParams(uri);

        if (!pathName) {
            return;
        }

        const currentPathNode = this.pathStack.peek();
        const currentUri = this.peek();

        if ((!currentUri || !currentPathNode)) {

            const newPathNode = new RouterStackItem(pathName, query);
            this.pathStack.push(newPathNode);
            return;
        }


        const [currentPathName,] = getPathNameAndSearchParams(currentUri);

        if (pathName === currentPathName) {
            if (query) {
                currentPathNode.pushQuery(query);
            }

            return;
        }

        const newPathNode = new RouterStackItem(pathName, query);
        this.pathStack.push(newPathNode);
    }

    public peek(): string | undefined {
        const head = this.pathStack.peek();

        if (head) {
            return head.getPath();
        }

        return undefined;
    }

    /** Softly Pops considering both the routes and query params */
    public softPop() {
        // How does Soft Pop Work?
        // Pop the query param stack, if the pop result is undefined
        // Also pop the path stack and maybe even
        const head = this.pathStack.peek();

        if (!head) {
            return;
        } 

        const headQuery = head.peekQuery();

        if (headQuery) {
            head.popQuery();
            return;
        }

        this.pathStack.pop();
    }

    /** Clears out the query param stack and then pops the next path stack */
    public hardPop() {
        this.pathStack.pop();
    }

}